---
name: validate-component
description: 'Build, validate, test, lint, and publish workflow for Pega DX components in this repo. Use for running npm run validate, diagnosing build or Storybook failures, fixing Jest coverage gaps, resolving lint and spelling errors, and publishing a component or library version.'
argument-hint: 'validate, test, lint, storybook, fix, or publish'
---

# Validate Component Workflow

Use this skill when the task is about the build and release loop for an existing component, rather than authoring a new one. For authoring, use the `create-*-component` skills.

## One-command check (use this first)

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` from the project root. It runs the schema check, `tsc` (scoped to this component and incremental), ESLint and Jest in parallel, checks that every `config.json` property is actually read by the code, warns about formats the CLI scaffolds do not use, flags inline styles, raw HTML injection and secrets, warns when there is only one story or one test, and runs the build once the schema and ESLint checks pass. It prints a table of PASS, FAIL, WARN and NOT RUN, and exits 1 if anything failed. While fixing failures, add `--no-build` to skip the slow bundle; run it once without the flag for the final table.

Paste the table into your final report. Report a check as passing only when the table says PASS; a `NOT RUN` or `FAIL` row must be stated as such, with the reason. Use the individual commands below to iterate on a failure, then rerun the script for the final table. Do not weaken a check to turn a row green.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run validate -- <Org>_<Library>_<Name> N N` | Validate the schema, lint and bundle one component (`custom-dx-components buildComponent <key> <sourceMap> <devBuild>`). **Without arguments it prompts interactively and hangs an agent** |
| `npm run validate-schema -- <Org>_<Library>_<Name>` | Check only `config.json` against the schema |
| `npm run validateAll` | Build all components (no prompts) |
| `npx tsc --noEmit 2>&1 \| grep -v demo.stories.tsx` | Type-check your own files; scaffolded stories report known `window.PCore` noise |
| `npx jest <folder> --coverage=false` | Run one component's tests without the coverage gate |
| `npm run test` | Run Jest with coverage |
| `npm run coverage` | Run Jest and emit an HTML coverage report |
| `npm run lint` | Run ESLint |
| `npm run _lint:types` | Type-check with `tsc --noEmit` |
| `npm run _lint:format` | Prettier check |
| `npm run _lint:spelling` | cspell check |
| `npm run _lint:styles` | Stylelint check |
| `npm run startStorybook` | Storybook dev server on port 6040 |
| `npm run publish` | Publish to the configured Pega server |
| `npm run authenticate` | Refresh server credentials before publishing |

## Coverage Thresholds

From `jest.config.cjs`, the global gate is statements 79, branches 74, functions 81, lines 80. A component that drops the global number below these fails the run even when its own tests pass.

## Procedure

1. Identify the component folder under `src/components/<Org>_<Library>_<Name>/`; the folder name is the component key.
2. Run `npm run validate -- <Org>_<Library>_<Name> N N` first (or `npm run validate-schema -- <Org>_<Library>_<Name>` for the schema alone). It surfaces schema and build errors faster than the test suite. The full check loop is in [../create-dx-component/references/cli-workflow.md](../create-dx-component/references/cli-workflow.md).
3. If `config.json` fails, check it against the schema reference in [../create-dx-component/references/config-schema.md](../create-dx-component/references/config-schema.md). Property `format` values must come from the supported list.
4. Run `npm run test`. If coverage fails, add cases for the untested branches rather than lowering the threshold.
5. Run `npm run lint` and `npm run _lint:types`. Fix unused imports, unused state, and unused interface fields, since dead code is a policy violation in this repo.
6. Run `npm run startStorybook` for a visual check when the change affects rendering.
7. Publishing is out of scope for this skill — use [../publish-library/SKILL.md](../publish-library/SKILL.md).

## After the build is green

If the component builds but misbehaves in App Studio or a real view (not offered in the picker, wrong property panel, blank render, differs from Storybook), use [runtime-troubleshooting.md](./references/runtime-troubleshooting.md). It is a diagnostic ladder that asks the user for evidence at each step.

## Common Failures

- **Missing `create-nonce` import** — styled-components fail CSP in the Pega host. Every component that uses `styled-components` must side-effect import `../shared/create-nonce`.
- **Missing `withConfiguration()`** — the component will not register with Constellation.
- **`PCore is not defined` in tests** — the Storybook file must assign `window.PCore` before the story renders.
- **Story not composing** — `demo.test.tsx` uses `composeStories`, so the export name in `demo.stories.tsx` must match the destructured name.
- **Type errors on `PConnProps`** — confirm the component folder has its own `PConnProps.d.ts` copied from the shared asset.
- **cspell failures** — add genuine domain terms to `cspell.json` rather than renaming identifiers.
- **`Highlight is not defined` / `X.animate is not a function` from inside `node_modules`** — jsdom is missing a browser API that Cosmos calls at module scope. Add the stub to [../../../setupTests.ts](../../../setupTests.ts); do not work around it in the component.
- **`messages.flatMap is not a function`** — `Banner` `messages` takes an array, not a string.
- **A Cosmos prop appears to do nothing** — it is probably not a real prop. Read `node_modules/@pega/cosmos-react-core/lib/components/<Name>/<Name>.d.ts`; `EmptyState` uses `message` not `title`, and `Tag` uses `children` not `label`.
- **`Cannot read properties of undefined (reading 'palette')` in `styles.ts`** — Cosmos ships a nested `styled-components`, so its theme never reaches your `styles.ts`. Call `useTheme()` in `index.tsx` and pass the values as props.
- **`npm run validate` prompts for input, or says "Please create/import a library"** — pass the component key and `N N` (`npm run validate -- <Org>_<Library>_<Name> N N`); if a library is missing, run `npm run createLib -- <Library> 1.0.0 Y Current` first (see [../publish-library/SKILL.md](../publish-library/SKILL.md)).
- **Coverage prints `0%`** — expected. `collectCoverageFrom` in [../../../jest.config.cjs](../../../jest.config.cjs) is scoped to the CLI's own source, so component code is never instrumented. Do not chase the number; still cover every branch you wrote.

## Output Format

When responding, prefer this order:

1. What was run and the result.
2. The specific failure, quoted from the output.
3. The root cause.
4. The fix applied, or the exact fix to apply.
5. The follow-up command to confirm the fix.
