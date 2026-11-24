---
name: create-dx-component
description: 'General Pega DX component scaffolding — shared references, assets, and the router when the component type is UNCLEAR. Prefer the type-specific skills (`field`, `template`, `widget`, `presentation`) when the user names a type. Use THIS skill only when: the type is ambiguous, the user asks for general DX component guidance, or multiple types are being created together.'
argument-hint: 'Describe the component you want (e.g., "a date range picker field" or "a KPI widget showing case metrics")'
---

# Create DX Component Skill (Router / Shared Reference)

## Type-Specific Skills

If the user's request clearly matches one component type, use the focused skill instead of this one:

| User asks for… | Use skill |
| --- | --- |
| Input field, property-bound value, Text/Boolean/Date/Email/Phone/Currency/Picklist/Radiobuttons | [field](../field/SKILL.md) |
| Layout container, FORM/DETAILS/PAGE arrangement, `children` wrapper | [template](../template/SKILL.md) |
| Chart, KPI, table, dashboard tile, data-page-driven block, spin wheel, self-fetching UI | [widget](../widget/SKILL.md) |
| Replace how the whole case view is rendered (`CASEVIEW` / `WSSCASEVIEW`) | [presentation](../presentation/SKILL.md) |
| Plan a component from requirements, or port one from another design system or framework | [plan-dx-component](../plan-dx-component/SKILL.md) |
| Change, fix or extend a component that **already exists** | [update-dx-component](../update-dx-component/SKILL.md) |

A read-only badge, pill, icon or formatted value bound to a property is a `field` that handles `DISPLAY_ONLY`; one that shows its own data is a `widget`. For an unusual request (a custom control, a board, a layout with tabs, something that may not be a custom component at all), read [choosing-type-and-subtype.md](./references/choosing-type-and-subtype.md): it has the fit check and maps ideas onto the subtypes the CLI accepts.

## Procedure

The repo-wide rules (gallery reuse, contract approval and its layout, authoring properties, third-party consent, Cosmos first, no dead code) are in `AGENTS.md`, which is always loaded. They are not repeated here.

### Step 0: Check the Constellation UI Gallery

Follow [ui-gallery-reuse.md](./references/ui-gallery-reuse.md). On a match, use the gallery component's `config.json` as the starting proposal for Step 1.

### Step 1: Agree the contract

If the user supplied requirements, links, images or a named design system, read them first ([intake.md](../plan-dx-component/references/intake.md)); for a large or unclear input, plan first with [plan-dx-component](../plan-dx-component/SKILL.md). The draft covers:

- **Type and subtype**: any subtype the CLI accepts ([cli-workflow.md](./references/cli-workflow.md)); for a Field, the one matching the stored value type. Say why.
- **Name, label, description, library and version** (normally `1.0.0`; confirm rather than assume)
- **Behavior, data and runtime contract**: what it renders, data pages, actions, editable and read-only expectations
- **Authoring properties** with formats and defaults
- **States to cover**, from [state-matrix.md](./references/state-matrix.md); each gets a story and a test assertion
- **Third-party libraries**, each with its purpose and whether it is installed

Do not scaffold or touch `config.json` until the user approves.

### Step 2: Scaffold via CLI (non-interactive)

If no library exists yet, run `npm run createLib -- <Library> 1.0.0 Y Current`. Then scaffold, **passing every argument**:

`npm run create -- <type> <subtype> <Name> "<Label>" <version> <Library> "<description>" <Organization>`. For example, `npm run create -- Field Text-Email ContactEmail "Contact email" 1.0.0 Lib "Email field" Acme` creates `src/components/Acme_Lib_ContactEmail`.

The scaffold creates `index.tsx`, `config.json`, `styles.ts`, `mock.ts`, `demo.stories.tsx`, `demo.test.tsx` (and `localizations.json` when the scaffold shows its own text), plus `PConnProps.d.ts` and `create-nonce.ts` once in `src/components/shared/`. **It is a working sample, not an empty skeleton**: replace everything that does not serve the request, including the story, mock, test and localization strings. Delete a generated shared helper your component does not use. If anything goes wrong, see [cli-workflow.md](./references/cli-workflow.md).

### Step 3: Implement

Read the essentials file for the type and implement every scaffolded file from it: [field-essentials.md](./references/field-essentials.md), [widget-essentials.md](./references/widget-essentials.md), [template-essentials.md](./references/template-essentials.md) or [presentation-essentials.md](./references/presentation-essentials.md). Each one ends with a table of when to open a deeper reference; open those only when the situation applies.

Before writing a `PCore` or `pConn` call, search the catalog for the method name as described in [pcore-pconnect-apis.md](./references/pcore-pconnect-apis.md), and follow the matching `pconnect-*` skill for call order and pitfalls.

### Step 4: Run the check loop

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` from the project root. It runs the schema check, `tsc`, ESLint, Jest, the config-to-props sync check, the story and test coverage warnings, the inline-style, raw-HTML and secret scans, and the build. While fixing failures, add `--no-build`; run it once without the flag at the end.

Fix every FAIL before reporting the work as done, and **paste the final table into your report**. Do not weaken a check to make it pass. A `NOT RUN` row is not a pass: say so and give the reason.

### Step 5: Independent review (new components)

For a new Field, Widget or Template, run the [review-component](../review-component/SKILL.md) skill before reporting it done, ideally in a fresh sub-agent that sees the brief but not your summary. Fix every Blocker and Major it reports, rerun the check script, and include the verdict in the final report. Skip this step for a small edit to an existing component.

### Step 6: Review in Storybook (user)

`npm run startStorybook` starts a long-running dev server. Leave it to the user unless they ask.

## Verify the Cosmos API before you use it

Cosmos prop names are often not what they sound like, and several plausible component names do not exist. Before importing a component or passing a prop you have not used in this repo before, read `node_modules/@pega/cosmos-react-core/lib/components/<Name>/<Name>.d.ts` and confirm the export in `node_modules/@pega/cosmos-react-core/lib/index.d.ts`. Do not rely on training knowledge of the Cosmos API. Known traps are under Verified Gotchas in [cosmos-components.md](./references/cosmos-components.md); add any new one you find.

## References and Cookbooks (open when needed)

| File | What it gives you |
| --- | --- |
| [field-essentials.md](./references/field-essentials.md), [widget-essentials.md](./references/widget-essentials.md), [template-essentials.md](./references/template-essentials.md), [presentation-essentials.md](./references/presentation-essentials.md) | The must-follow rules for each type, file by file. Read the one for your type first |
| [ui-gallery-reuse.md](./references/ui-gallery-reuse.md) | Checking the Constellation UI Gallery and adapting a match |
| [cli-workflow.md](./references/cli-workflow.md) | Project layout, non-interactive CLI commands, naming rules, the check loop, troubleshooting |
| [props-contract.md](./references/props-contract.md) | The props each type receives; reading and writing values; display modes |
| [component-patterns.md](./references/component-patterns.md) | Code skeletons for each component type |
| [config-schema.md](./references/config-schema.md) | `config.json` structure, formats, `defaultConfig` bindings, what `validate-schema` checks |
| [storybook-pattern.md](./references/storybook-pattern.md), [test-pattern.md](./references/test-pattern.md) | Story, mock and Jest conventions |
| [template-patterns.md](./references/template-patterns.md) | Template regions and children, forcing read-only, responsive columns, field groups, tabs, PAGE |
| [widget-patterns.md](./references/widget-patterns.md) | Widget fetch lifecycle, cancellation, duplicate-click guards, subscriptions, mutations, confirm-before-delete |
| [field-subtypes-extra.md](./references/field-subtypes-extra.md) | Text-Input, Text-Paragraph, Icon-Button-URL, DateTime, TimeOfDay, Picklist-Autocomplete |
| [field-behavior.md](./references/field-behavior.md) | Field commit protocol, null/zero/empty, message precedence, dates and time zones, numbers, pickers |
| [localization.md](./references/localization.md) | `localizations.json`, getLocalizedText, placeholders, plurals, formatting |
| [accessibility.md](./references/accessibility.md) | What Cosmos covers and what the author owns; focus, headings, announcements; verification |
| [choosing-type-and-subtype.md](./references/choosing-type-and-subtype.md) | The fit check and how to pick a type and subtype for an unusual request |
| [state-matrix.md](./references/state-matrix.md) | The states to cover per component type |
| [cosmos-components.md](./references/cosmos-components.md) | Which Cosmos component to use, and verified gotchas |
| [pcore-pconnect-apis.md](./references/pcore-pconnect-apis.md) | How to look up a PCore/PConnect method |
| [cookbooks/](./cookbooks/README.md) | End-to-end recipes: a field with limits and validation; a data widget with loading, empty and error states |
