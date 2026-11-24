#!/usr/bin/env node
// Runs every check a finished DX component needs and prints an evidence table.
//   node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name> [--no-build]
// Each check ends as PASS, FAIL, WARN or NOT RUN. Paste the table into the final report; never claim a check that
// the table does not show as PASS. Exit code 1 means at least one FAIL.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// The 17 formats the CLI scaffolds use. Other formats pass validate-schema (it only checks that format is a string)
// but are not proven to work for custom components.
export const SCAFFOLD_FORMATS = new Set([
  'GROUP',
  'TEXT',
  'SELECT',
  'NUMBER',
  'BOOLEAN',
  'VISIBILITY',
  'REQUIRED',
  'DISABLED',
  'READONLY',
  'VALUEINPUT',
  'LABEL',
  'CONTENTPICKER',
  'CASCADE',
  'PROPERTY',
  'INLINE',
  'DATASOURCE',
  'INSTRUCTIONS',
]);

// Formats whose value the platform consumes itself, so the component code does not need to read the property.
const PLATFORM_HANDLED = new Set(['VISIBILITY', 'REQUIRED', 'DISABLED', 'READONLY', 'CONTENTPICKER', 'INSTRUCTIONS', 'LABEL', 'INLINE']);

const SECRET_PATTERNS = [
  [/client[_-]?secret\s*[:=]\s*['"][^'"]+['"]/i, 'client secret'],
  [/(password|passwd)\s*[:=]\s*['"][^'"]+['"]/i, 'password'],
  [/bearer\s+[a-z0-9._-]{16,}/i, 'bearer token'],
  [/(api[_-]?key|access[_-]?token)\s*[:=]\s*['"][^'"]{8,}['"]/i, 'API key or token'],
  [/https?:\/\/[^\s'"]*\.(pegalabs|pega)\.[a-z.]+\/prweb/i, 'environment URL'],
];

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/** Collect every property that carries a name, descending into groups and cascade sources. */
export const collectProperties = (properties = []) =>
  properties.flatMap((property) => {
    const own = property.name ? [property] : [];
    return [
      ...own,
      ...collectProperties(property.properties),
      ...(property.source && !Array.isArray(property.source) ? collectProperties([property.source]) : []),
    ];
  });

/** Names declared in config.json that the component code never mentions. */
export const unconsumedProperties = (config, code) =>
  collectProperties(config.properties)
    .filter((property) => !PLATFORM_HANDLED.has(property.format))
    .map((property) => property.name)
    .filter((name) => !new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(code));

/** Top-level authoring properties a story should expose as controls; DATASOURCE sub-fields are not props. */
export const controllableProperties = (properties = []) =>
  properties.flatMap((property) => {
    if (property.format === 'GROUP') return controllableProperties(property.properties);
    return property.name && !PLATFORM_HANDLED.has(property.format) ? [property.name] : [];
  });

/** Direct keys of the meta's argTypes object; nested settings, strings and comments are ignored. */
const argTypesKeys = (source) => {
  const code = stripComments(source);
  const start = code.search(/\bargTypes\s*:\s*\{/);
  if (start < 0) return new Set();
  const keys = new Set();
  let depth = 0;
  let expectKey = false;
  let index = code.indexOf('{', start);
  while (index < code.length) {
    const char = code[index];
    if (char === "'" || char === '"' || char === '`') {
      let end = index + 1;
      while (end < code.length && code[end] !== char) end += code[end] === '\\' ? 2 : 1;
      if (depth === 1 && expectKey && char !== '`' && /^\s*:/.test(code.slice(end + 1))) keys.add(code.slice(index + 1, end));
      expectKey = false;
      index = end + 1;
    } else if (/[A-Za-z_$]/.test(char)) {
      const word = /^[\w$]+/.exec(code.slice(index))[0];
      if (depth === 1 && expectKey && /^\s*:/.test(code.slice(index + word.length))) keys.add(word);
      expectKey = false;
      index += word.length;
    } else {
      if (char === '{' || char === '[' || char === '(') {
        depth += 1;
        expectKey = depth === 1 && char === '{';
      } else if (char === '}' || char === ']' || char === ')') {
        depth -= 1;
        if (depth === 0) break;
      } else if (char === ',') expectKey = depth === 1;
      else if (!/\s/.test(char)) expectKey = false;
      index += 1;
    }
  }
  return keys;
};

/** Authoring properties with no entry in the story meta's argTypes. */
export const missingStoryControls = (config, storySource) => {
  const keys = argTypesKeys(storySource);
  return controllableProperties(config.properties).filter((name) => !keys.has(name));
};

export const unprovenFormats = (config) => {
  const formats = new Set();
  const walk = (properties = []) =>
    properties.forEach((property) => {
      if (property.format) formats.add(property.format);
      walk(property.properties);
      if (property.source && !Array.isArray(property.source)) walk([property.source]);
    });
  walk(config.properties);
  return [...formats].filter((format) => !SCAFFOLD_FORMATS.has(format)).sort();
};

export const findSecrets = (code) => SECRET_PATTERNS.filter(([pattern]) => pattern.test(stripComments(code))).map(([, label]) => label);

export const countTests = (testSource) => (testSource.match(/\b(it|test)(\.each)?\s*\(/g) || []).length;
export const countStories = (storySource) => (storySource.match(/export\s+const\s+\w+/g) || []).length;

// The commands are independent, so they run in parallel; spawnSync would serialize them.
const run = (command, args, { timeout = 600000, ...options } = {}) =>
  new Promise((resolve) => {
    let output = '';
    let settled = false;
    let timer;
    const finish = (status, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ status, output, error });
    };
    const isWindows = process.platform === 'win32';
    const child = spawn(command, args, { shell: false, detached: !isWindows, ...options });
    const killTree = () => {
      try {
        if (isWindows) spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
        else process.kill(-child.pid, 'SIGKILL');
      } catch {
        child.kill('SIGKILL');
      }
    };
    timer = setTimeout(() => {
      output += `\nTimed out after ${timeout / 1000}s`;
      killTree();
      child.stdout?.destroy();
      child.stderr?.destroy();
      finish(null);
    }, timeout);
    child.stdout?.on('data', (chunk) => (output += chunk));
    child.stderr?.on('data', (chunk) => (output += chunk));
    child.on('error', (error) => finish(null, error));
    child.on('close', (status) => finish(status));
  });

// Type-check only this component, the shared folder and the global declarations instead of the whole project
// (the project tsconfig also covers built output and every other component). Incremental, so re-runs are fast.
const scopedTsconfig = (key, cwd) => {
  try {
    const cacheDir = path.join(cwd, 'node_modules', '.cache', 'dxcb-check');
    fs.mkdirSync(cacheDir, { recursive: true });
    const fromCache = (target) => path.relative(cacheDir, path.join(cwd, target)).split(path.sep).join('/');
    const file = path.join(cacheDir, `tsconfig.${key}.json`);
    const tsconfig = {
      extends: fromCache('tsconfig.json'),
      include: ['src/*.d.ts', 'setupTests.ts', 'setupFiles.ts', `src/components/${key}/**/*`, 'src/components/shared/**/*'].map(fromCache),
      compilerOptions: { noEmit: true, incremental: true, tsBuildInfoFile: `./${key}.tsbuildinfo` },
    };
    fs.writeFileSync(file, `${JSON.stringify(tsconfig, null, 2)}\n`);
    return file;
  } catch {
    return undefined;
  }
};

const tail = (text, lines = 6) => text.trim().split('\n').slice(-lines).join('\n');

const check = (name, status, detail = '') => ({ name, status, detail });

export const runChecks = async (key, { build = true, cwd = process.cwd(), env = process.env } = {}) => {
  const results = [];
  const folder = path.join(cwd, 'src', 'components', key);
  if (!fs.existsSync(folder)) return [check('component folder', 'FAIL', `src/components/${key} does not exist`)];
  results.push(check('component folder', 'PASS', `src/components/${key}`));

  const tsconfig = fs.existsSync(path.join(cwd, 'tsconfig.json')) ? scopedTsconfig(key, cwd) : undefined;
  const pending = {
    schema: run('npm', ['run', 'validate-schema', '--', key], { cwd, env }),
    tsc: run('npx', tsconfig ? ['tsc', '-p', tsconfig] : ['tsc', '--noEmit'], { cwd, env }),
    lint: run('npx', ['eslint', `src/components/${key}`], { cwd, env }),
    jest: run('npx', ['jest', `src/components/${key}`, '--coverage=false'], { cwd, env }),
  };

  const read = (file) => (fs.existsSync(path.join(folder, file)) ? fs.readFileSync(path.join(folder, file), 'utf8') : '');
  const sourceFiles = fs
    .readdirSync(folder)
    .filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) && !/^demo\./.test(file) && file !== 'mock.ts' && !file.endsWith('.d.ts') && !/\.(test|stories)\./.test(file),
    );
  const code = sourceFiles.map(read).join('\n');

  const schema = await pending.schema;
  const schemaPassed = schema.status === 0 && /valid/i.test(schema.output);
  results.push(check('config.json schema', schemaPassed ? 'PASS' : 'FAIL', tail(schema.output, 3)));

  let config = {};
  try {
    config = JSON.parse(read('config.json'));
  } catch (error) {
    results.push(check('config.json parses', 'FAIL', String(error.message)));
  }

  const formats = unprovenFormats(config);
  results.push(
    check(
      'formats are scaffold-proven',
      formats.length ? 'WARN' : 'PASS',
      formats.length ? `not proven for custom components: ${formats.join(', ')}` : 'all formats are used by the CLI scaffolds',
    ),
  );

  const missing = unconsumedProperties(config, code);
  results.push(
    check(
      'config properties are consumed',
      missing.length ? 'FAIL' : 'PASS',
      missing.length ? `never referenced in the component: ${missing.join(', ')}` : 'every authoring property is read by the code',
    ),
  );

  const lint = await pending.lint;
  const lintPassed = lint.status === 0;

  // `npm run validate` checks the schema and lints before it bundles and stops at the first failure, so it cannot
  // pass while either of those fails. Start it as soon as both pass, alongside tsc and Jest.
  let built;
  if (build && schemaPassed && lintPassed) built = run('npm', ['run', 'validate', '--', key, 'N', 'N'], { cwd, env, timeout: 900000 });

  const tsc = await pending.tsc;
  const tscErrors = tsc.output
    .split('\n')
    .filter((line) => line.includes(`src/components/${key}/`) && line.includes('error TS') && !line.includes('demo.stories'));
  // Errors with no file (a broken tsconfig, nothing to compile) would otherwise pass unnoticed.
  const tscGlobalErrors = tsc.output.split('\n').filter((line) => /^error TS\d+/.test(line));
  const tscProblems = [...tscErrors, ...tscGlobalErrors, ...(tsc.error ? [String(tsc.error.message)] : [])];
  results.push(check('tsc (component files)', tscProblems.length ? 'FAIL' : 'PASS', tscProblems.slice(0, 5).join('\n')));

  results.push(check('eslint', lintPassed ? 'PASS' : 'FAIL', lintPassed ? '' : tail(lint.output, 8)));

  const jest = await pending.jest;
  const summary = jest.output.match(/Tests:\s+(.*)/);
  results.push(check('jest', jest.status === 0 ? 'PASS' : 'FAIL', summary ? summary[1] : tail(jest.output, 5)));

  const tests = countTests(read('demo.test.tsx'));
  results.push(
    check('tests beyond the scaffold', tests > 1 ? 'PASS' : 'WARN', `${tests} test(s) in demo.test.tsx; cover each state in state-matrix.md`),
  );

  const stories = countStories(read('demo.stories.tsx'));
  results.push(
    check('stories per state', stories > 1 ? 'PASS' : 'WARN', `${stories} story export(s) in demo.stories.tsx; one story per applicable state`),
  );

  const noControls = missingStoryControls(config, read('demo.stories.tsx'));
  results.push(
    check(
      'story controls',
      noControls.length ? 'WARN' : 'PASS',
      noControls.length ? `no argTypes entry in demo.stories.tsx for: ${noControls.join(', ')}` : 'every authoring property has a story control',
    ),
  );

  const inlineStyle = /style=\{\{/.test(code);
  const dangerous = /dangerouslySetInnerHTML/.test(code);
  results.push(check('no inline styles', inlineStyle ? 'FAIL' : 'PASS', inlineStyle ? 'style={{ ... }} found; use Cosmos props or styles.ts' : ''));
  results.push(check('no dangerouslySetInnerHTML', dangerous ? 'FAIL' : 'PASS', dangerous ? 'raw HTML injection found' : ''));

  const secrets = findSecrets(`${code}\n${read('config.json')}\n${read('mock.ts')}`);
  results.push(check('no secrets or environment URLs', secrets.length ? 'FAIL' : 'PASS', secrets.length ? `found: ${secrets.join(', ')}` : ''));

  if (built) {
    const result = await built;
    const failed = result.status !== 0 || /FAILED|Error while|TypeError/.test(result.output);
    results.push(check('build (lint, schema, bundle)', failed ? 'FAIL' : 'PASS', failed ? tail(result.output, 6) : ''));
  } else if (build) {
    results.push(check('build (lint, schema, bundle)', 'NOT RUN', 'skipped because the schema or ESLint check failed; fix those first'));
  } else {
    results.push(check('build (lint, schema, bundle)', 'NOT RUN', 'skipped with --no-build'));
  }
  return results;
};

export const formatReport = (key, results) => {
  const count = (status) => results.filter((result) => result.status === status).length;
  const lines = [`Check report for ${key}`, '', '| Check | Result | Detail |', '| --- | --- | --- |'];
  results.forEach(({ name, status, detail }) =>
    lines.push(`| ${name} | ${status} | ${detail.split('\n').join(' ').slice(0, 200).replace(/\|/g, '\\|')} |`),
  );
  lines.push('', `RESULT: ${count('PASS')} passed, ${count('FAIL')} failed, ${count('WARN')} warnings, ${count('NOT RUN')} not run`);
  if (count('FAIL')) lines.push('Do not report this component as done until every FAIL is fixed or explained to the user.');
  return lines.join('\n');
};

const main = async () => {
  const args = process.argv.slice(2);
  const key = args.find((arg) => !arg.startsWith('--'));
  if (!key || !/^[A-Za-z0-9]+_[A-Za-z0-9]+_[A-Za-z0-9]+$/.test(key)) {
    console.error('Usage: node check-component.mjs <Org>_<Library>_<Name> [--no-build]');
    process.exit(2);
  }
  const results = await runChecks(key, { build: !args.includes('--no-build') });
  console.log(formatReport(key, results));
  process.exit(results.some((result) => result.status === 'FAIL') ? 1 : 0);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
