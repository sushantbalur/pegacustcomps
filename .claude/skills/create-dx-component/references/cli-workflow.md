# Custom Component Project Workflow (CLI, Build, Test)

> Part of the [create-dx-component skill](../SKILL.md). PCore/PConnect signatures are in the [API catalog](./pcore-pconnect-apis.md).

This file explains how a custom component project is laid out and which commands an AI assistant can run **without interactive prompts** to scaffold, check and build components. Every command form below was run against a generated project.

## Project layout

```text
<project>/
  tasks.config.json            # CLI configuration (library, version, server settings)
  src/components/
    shared/                    # PConnProps.d.ts, create-nonce.ts (shared by library components)
    <Org>_<Library>_<Name>/    # one folder per component
      config.json              # design-time definition: properties, defaults
      index.tsx                # the React component
      styles.ts                # styled-components wrapper
      mock.ts                  # sample props/state props for stories and tests
      demo.stories.tsx         # Storybook story (supplies a mocked getPConnect)
      demo.test.tsx            # Jest test built on the story
  src/globals.d.ts             # declares the global `PCore` type
  setupTests.ts, jest.config.cjs, tsconfig.json, eslint.config.mjs
```

Some component types add helper files (for example `DetailsRender.tsx`, `utils.ts`, `localizations.json`).

## Library mode: create a library first

New projects run in **library mode**. Until a library exists, almost every command fails with a message to run `createLib`. Create one once per project:

```bash
npm run createLib -- <LibraryName> <version> Y Current
# example
npm run createLib -- Lib 1.0.0 Y Current
```

Arguments: library name (alphanumeric, starts with a letter), semver version, `Y`/`N` for a permanent build (library mode always treats it as permanent), and `Current` or `Original` (only relevant when archives already exist).

## One-command check

`node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` runs the whole loop below for one component and prints a PASS/FAIL/WARN/NOT RUN table. The schema check, `tsc`, ESLint and Jest run in parallel; `tsc` covers only this component, `src/components/shared/` and the global declarations, and is incremental. The build starts only when the schema and ESLint checks pass, because it repeats both and would fail anyway.

While fixing failures, rerun it with `--no-build` (or the single command for the failing row). Run it once without `--no-build` for the final table.

## Non-interactive commands

The `npm run` scripts forward everything after `--` to the CLI. Without arguments each command prompts interactively, which an AI assistant cannot answer, so **always pass the arguments**.

| Goal                      | Command                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Create a library          | `npm run createLib -- <Library> <version> Y Current`                                                          |
| Scaffold a component      | `npm run create -- <type> <subtype> <Name> "<Label>" <version> <Library> "<description>" <Organization>`      |
| Validate `config.json`    | `npm run validate-schema -- <Org>_<Library>_<Name>`                                                           |
| Lint, validate and bundle | `npm run buildComponent -- <Org>_<Library>_<Name> N N` (the last two are source map `Y/N` and dev build `Y/N`) |
| Build every component     | `npm run buildAllComponents`                                                                                  |
| List components           | `npm run list` (safe). `npm run listLib` prompts and crashes when run without a terminal                       |
| Aliases                   | `npm run validate` is `buildComponent` and `npm run validateAll` is `buildAllComponents`; they take the same arguments |

Scaffold example:

```bash
npm run create -- Field Text-Email ContactEmail "Contact email" 1.0.0 Lib "Email field" Acme
# creates src/components/Acme_Lib_ContactEmail
```

Valid `<type>` and `<subtype>` values:

| Type           | Subtypes                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Field`        | `Text`, `Text-Input`, `Text-Paragraph`, `Text-Email`, `Text-Phone`, `Text-URL`, `Icon-Button-URL`, `Integer`, `Decimal`, `Decimal-Currency`, `Decimal-Percentage`, `Boolean`, `Date`, `DateTime`, `TimeOfDay`, `Picklist`, `Picklist-Autocomplete`, `Picklist-RadioButtons` |
| `Template`     | `DETAILS`, `DETAILS-region`, `FORM`, `FORM-region`, `PAGE`                                                                                                                    |
| `Widget`       | `CASE`, `PAGE`                                                                                                                                                                |
| `Presentation` | `CASEVIEW`, `WSSCASEVIEW`                                                                                                                                                     |

Use these values exactly, including casing (for example `TimeOfDay`, not `TimeofDay`). With arguments supplied, `create` does not validate the subtype up front: an unknown subtype either fails with a missing-template error or generates a `config.json` that then fails `validate-schema` with `data/subtype must be equal to one of the allowed values`. The authoritative list is `COMPONENT_SCHEMA` in the installed `@pega/custom-dx-components` package.

## Naming rules

- The component key is `<Organization>_<Library>_<Name>`: exactly three alphanumeric segments separated by underscores. `config.json` `name` and `componentKey` must match this pattern (`validate-schema` enforces it).
- `<Name>`, `<Library>` and `<Organization>` must be alphanumeric, start with a letter and contain no spaces.
- The component's React function name is the PascalCase form of the key (for example `Acme_Lib_ContactEmail` becomes `AcmeLibContactEmail`).
- Keep names short. The CLI rejects names that exceed the length limit for the server.

## Check loop (run after every change)

Run from the project root, in this order, and fix failures before moving on:

```bash
npx tsc --noEmit 2>&1 | grep -v "demo.stories.tsx"   # types in your own files
npm test                                              # Jest (coverage thresholds apply)
npm run lint                                          # ESLint
npm run validate-schema -- <Org>_<Library>_<Name>     # config.json against the schema
npm run buildComponent -- <Org>_<Library>_<Name> N N  # lint + validate + bundle
```

Notes:

- `npm run lint` lints `src/` and the project config; the `.claude/` skill assets are ignored.
- `npm test` and the build create `coverage/` and `dist/` in the project root. Both are git-ignored in projects made by `init`.
- Freshly scaffolded Widget, Template and Presentation `demo.stories.tsx` files can produce `tsc` errors such as `Property 'PCore' does not exist on type 'Window'`. Stories are excluded from lint and the bundle, so filter them out as shown. Do not edit those scaffolded stories only to silence the error. Any error in `index.tsx`, `config.json` or your own files is real and must be fixed.
- `npm test` runs every `demo.test.tsx`. To run one, use `npx jest <path>` (add `--coverage=false` to skip the coverage thresholds).
- `buildComponent` runs schema validation, then lint, then the bundle. A lint failure stops the build before bundling.
- Storybook (`npm run startStorybook`) is a long-running dev server. Do not start it from an automated check loop unless the user asks.

## Commands that need the user

Do not run these unless the user explicitly asks, because they need credentials, a Pega server, or change or delete data:

- `authenticate`, `publish`, `publishAll`, `publishLibVersion`, `exportRC`: use the server settings and credentials in `tasks.config.json`.
- `delete`, `deleteAll`, `deleteLib`, `deletePublishedLib`, `deleteLibVersion`, `restoreLibVersion`: destructive.
- `rename`, `move`, `switchLib`, `createLibVersion`, `importLibVersion`: change the project structure or library state.

Never write secrets (client secrets, passwords, tokens) into `tasks.config.json` or source files, and never commit the `keys/` directory contents or `.npmrc` credentials.

## Troubleshooting

| Symptom                                                                          | Likely cause and fix                                                                                           |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| "All commands will NOT work until a library is created"                          | No library yet. Run `npm run createLib -- <Library> <version> Y Current`.                                      |
| A command hangs or prints a prompt                                               | Arguments were omitted. Re-run with every positional argument.                                                 |
| `Cannot find package '@eslint-react/eslint-plugin'` or other missing packages    | Dependencies are not installed. Run `npm install` in the project, then retry.                                  |
| Jest fails with `ReferenceError: Highlight is not defined`                       | `setupTests.ts` is missing the `Highlight` stub that `@pega/cosmos-react-core` needs under jsdom. Add the stub. |
| `Invalid: data/properties/N must have required property ...` from `validate-schema` | Property N (zero-based) in `config.json` lacks `name`, `label` or `format`.                                  |
| `Invalid: data/subtype must be equal to one of the allowed values`                | The subtype has the wrong value or casing. Use a value from the table above.                                   |
| `Property 'PCore' does not exist on type 'Window'` in `demo.stories.tsx`         | Known noise in scaffolded stories; not part of the bundle.                                                     |
