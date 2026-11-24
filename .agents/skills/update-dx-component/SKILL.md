---
name: update-dx-component
description: 'Change an EXISTING Pega DX component safely: add or change a behavior, add or remove an authoring property, fix a bug, restyle, change a stored-value format, or plan a rename, move, version bump or upgrade. Use when: the user asks to modify, extend, fix, refactor, rename or retire a component that already exists under src/components. For a brand-new component use the type skills instead.'
argument-hint: 'Name the component and the change (for example "Acme_Lib_Quantity: add a step property")'
---

# Update an Existing DX Component

A component that has been published may already be configured in views that people use. A change that looks small in code can break those views or the data they saved, so this skill is about understanding what exists, classifying the risk, and keeping every artifact in step.

## Procedure

### 1. Understand what exists

- Read the whole folder `src/components/<Org>_<Library>_<Name>/`: `config.json`, `index.tsx` and helpers, `styles.ts`, `mock.ts`, `demo.stories.tsx`, `demo.test.tsx`, `localizations.json` if present.
- Write down the current contract in a few lines: the type and subtype, the authoring properties and their defaults, the value or data it handles, the states it covers. If a brief or the original request is available, compare it with the code and note any difference.
- Run `node .claude/skills/validate-component/scripts/check-component.mjs <key> --no-build` first. This is the baseline. Failures that were already there are not yours to hide or to fix unasked; report them.

### 2. Classify the change

Use the lists in the "Safe and risky changes" section of [config-schema.md](../create-dx-component/references/config-schema.md).

| Class | Examples | What to do |
| --- | --- | --- |
| Safe | A bug fix with no contract change; styling; an optional property with a backward-compatible default; a new state; better tests | Make it, keeping all artifacts in sync |
| Behavior change | Different validation, a different commit moment, new display rules | Tell the user what existing users will see change, then make it |
| Risky | Renaming or removing a property, region or option key; changing the type or shape of a stored value; changing a default so existing components behave differently; changing a picker from scalars to objects; hiding a property that was editable | Stop. Describe the effect on views and data already saved and propose a compatible alternative (add the new shape, keep the old one). Proceed only when the user chooses |
| Different component | A different type or subtype; a different stored value type | The subtype cannot change in place. Propose a new component and retiring the old one |
| Structural | Rename, move, copy, delete, switch library or version | These are the user's commands. See [maintenance.md](./references/maintenance.md); do not run them unasked |

When in doubt, treat the change as risky and ask once.

### 3. Plan before editing

State, in one message, what will change in each artifact, the class from step 2, how absent and legacy values behave (what a view saved before the change will do), and what the user must do afterwards (publish, retest). Wait for approval for anything above Safe.

### 4. Make the change

- Change `config.json`, `index.tsx`, `styles.ts`, `mock.ts`, the stories and the tests **together**. Every property in `config.json` must still be read by the code, with a safe default for an absent value.
- Keep the diff small. Do not refactor unrelated code, rename scaffold-owned names, or upgrade dependencies as a side effect.
- Follow the same rules as for a new component: Cosmos first, no inline styles, no new third-party library without consent, only documented PCore and PConnect methods. Read the references that match the type: [field-behavior.md](../create-dx-component/references/field-behavior.md), [widget-patterns.md](../create-dx-component/references/widget-patterns.md) or [template-patterns.md](../create-dx-component/references/template-patterns.md).
- Do not delete or weaken an existing test to make a change pass. If an intentional change makes a test wrong, update it and say why.

### 5. Prove it

- Add tests for the new behavior, and one test for the legacy case (an absent or old value renders as before).
- Run `node .claude/skills/validate-component/scripts/check-component.mjs <key>` and paste the table into the report, as for a new component.
- For anything above Safe, run the [review-component](../review-component/SKILL.md) skill.

### 6. Report

Say what changed in each file, the class of the change, who or what is affected (views already using the component, saved data), and what you could not verify. Remind the user that the change reaches Pega only after they publish (a user-run step) and that it should be retested in App Studio.

## Version numbers

The `version` in `config.json` is a label for this component. Whether to bump it, and whether to create a new library version, is the user's decision: ask, and explain that a published library version is what Pega loads. Do not run `createLibVersion`, `publish` or any other server or structural command unasked.
