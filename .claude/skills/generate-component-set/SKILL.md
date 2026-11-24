---
name: generate-component-set
description: 'Batch-generate MANY Pega DX components in one session: every Field subtype (or a named subset), every Template subtype, a set of Widgets or Presentation components, or a full library across all four types. Use when the user asks for "all", "every", "a set of" or "a whole library of" components. For ONE component use the type skill (`field`, `template`, `widget`, `presentation`) or `create-dx-component` instead.'
argument-hint: 'Which types or subtypes to generate (e.g. "all fields", "Date and Currency", "full library with two widgets")'
---

# Generate a Set of Components

Generate several components in a single session. The shared context is loaded **once** and then reused for every component, so a batch costs far less than repeating the single-component flow.

The catalogue is [component-manifest.json](./component-manifest.json): every type, every subtype, each subtype's `cliSubtype`, its skill path, and whether the type's catalogue is `fixed` or `user-supplied`. Work from that file, never from a list remembered from elsewhere.

## Step 0 — Resolve inputs

Read the user's message and extract:

- **Types in scope**: Field, Template, Widget, Presentation (default for "full library": all four).
- **Field and Template subtypes**: every entry of `types.Field.subtypes` / `types.Template.subtypes`, or only the ones the user named.
- **Widgets and Presentation components**: their `catalogue` is `user-supplied`, so the user must name each one. A Widget needs a scope (`CASE` or `PAGE`) and a data source; a Presentation component needs a subtype (`CASEVIEW` or `WSSCASEVIEW`).
- **Naming**: the PascalCase suffix per component. Default is the subtype name (`<Org>_<Library>_Text`, …). Apply any prefix or suffix convention the user gives, consistently.

Stop and ask if Widget or Presentation is in scope and the user named none. Never invent widgets.

Fetch the [Constellation UI Gallery](https://github.com/pegasystems/constellation-ui-gallery/tree/master/src/components) catalogue once, per [ui-gallery-reuse.md](../create-dx-component/references/ui-gallery-reuse.md), and mark each planned component as **reuse `Pega_Extensions_<Name>`** or **build from scratch**. Step 3 reuses this catalogue rather than fetching it again.

The output path is fixed at `src/components/<Org>_<Library>_<Name>/`; do not ask for it. Echo the resolved plan as a numbered list before starting, and wait for confirmation if it has more than 10 components.

## Step 1 — Load the shared context once

Read these once and keep them active for the whole session. Do not re-read them per component.

1. The type skill for each type in scope: [field](../field/SKILL.md), [template](../template/SKILL.md), [widget](../widget/SKILL.md), [presentation](../presentation/SKILL.md).
2. [component-patterns.md](../create-dx-component/references/component-patterns.md)
3. [config-schema.md](../create-dx-component/references/config-schema.md)
4. [cosmos-components.md](../create-dx-component/references/cosmos-components.md)
5. [pcore-pconnect-apis.md](../create-dx-component/references/pcore-pconnect-apis.md) (an index into the `pconnect-*` skills; open those on demand)
6. [storybook-pattern.md](../create-dx-component/references/storybook-pattern.md)
7. [test-pattern.md](../create-dx-component/references/test-pattern.md)
8. One existing component in `src/components/`, end to end, to match this project's conventions.

## Step 2 — Overwrite check, once

Check `src/components/` for every target folder across every type. Report all collisions in one message and ask **Overwrite all / Skip existing / Cancel**, then wait for the answer. Do it once here, not per type.

## Step 3 — Generate by type, in this order

Fields first, then Templates (which arrange them), then Widgets, then Presentation. For each component, in manifest order:

1. **Read the subtype skill (mandatory)** at the manifest's `skill` path. The type skill gives the skeleton; the subtype skill gives the exact Cosmos control, value coercion, formatting and edge cases. Generating from the parent alone produces generic components that miss subtype behavior.
2. **Scaffold non-interactively**, passing every argument. A bare `npm run create` prompts and hangs an agent. If no library exists yet, run `npm run createLib -- <Library> 1.0.0 Y Current` first.

   ```bash
   npm run create -- <type> <cliSubtype> <Name> "<Label>" <version> <Library> "<description>" <Organization>
   ```

   `<cliSubtype>` is the manifest entry's `cliSubtype` (for example `Decimal-Currency`, not `Currency`). The organization comes from `package.json`, the library from `createLib` or `tasks.config.json`. See [cli-workflow.md](../create-dx-component/references/cli-workflow.md). If the CLI cannot be driven, create the folder by hand and copy the shared files from [assets](../create-dx-component/assets/) into `src/components/shared/`.

   If Step 0 marked the component for reuse, adapt the gallery component per [ui-gallery-reuse.md](../create-dx-component/references/ui-gallery-reuse.md) instead of implementing from scratch in the next step.

3. **Implement** `index.tsx`, `config.json`, `styles.ts`, `mock.ts`, `demo.stories.tsx` and `demo.test.tsx`, following the type rules below and the Cosmos-first and dead-code rules in `AGENTS.md`.
4. **Report one line**: "`<Org>_<Library>_<Name>` ✓ — <what it uses>".

### Rules by type

| Type         | Read first                                                                                                     | Rules                                                                                                                                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Field        | the subtype skill (`text`, `date`, `currency`, …)                                                              | `handleEvent` on change and blur, `getValidationApi().validate` on blur, a `DISPLAY_ONLY` mode, string-boolean normalization for `readOnly` / `required` / `disabled`, `status` from `validatemessage`. The Cosmos control owns label, required, disabled and read-only rendering. |
| Template     | the subtype skill (`form`, `details`, `page`, …)                                                               | Layout from Cosmos `Flex`, `Grid`, `Card`; never a hand-rolled styled `div`. Render children through PConnect and guard an empty or undefined `children`.                                                                                                         |
| Widget       | `case` or `page-widget` by scope (CLI subtype `CASE` or `PAGE`)                                                | Render loading (`Progress`), error (`Banner`), empty (`EmptyState`) and populated states. Wrap in `Card`. Fetch in `useEffect`, never in render, and do not set state after unmount. `mock.ts` supplies a realistic fixture so the story renders without a server.   |
| Presentation | the prop types: `CaseView.types.d.ts` in `@pega/cosmos-react-work` (`@pega/cosmos-react-wss` for `WSSCASEVIEW`) | Pure render from props: no `getPConnect`, no `PCore`, no fetching, no event wiring. Handle optional props (`subheading`, `banners`, `utilities`, …) explicitly. `config.json` has no properties by default.                                                        |

All types: export with `withConfiguration()` and keep the `create-nonce` import the scaffold provides (`../shared/create-nonce` for Field, Template and Widget).

## Step 4 — Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` for each generated component and keep every table for the final report, then `npm run validateAll`, `npm run test` and `npm run lint`. Fix every build, lint, spelling and coverage failure before reporting. Use [validate-component](../validate-component/SKILL.md) for failure triage.

## Step 5 — Final report

A table of every component: name, type, subtype or scope, and the main Cosmos component used. Then list anything the user asked for that was skipped, and why.
