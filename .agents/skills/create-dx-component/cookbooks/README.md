---
title: Component Authoring Cookbook — Recipe Index
description: End-to-end recipes for building and customizing Constellation DX components (fields, widgets, templates), indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Component Authoring

> Part of the [create-dx-component skill](../SKILL.md).

Every file in [`../references/`](../references/) documents one topic at a time. Each file in this folder walks through **one complete component change** from scaffold to a passing build: which command to run, which files to edit, the code, the story and the tests. The code in each recipe was run in a generated project (`tsc`, Jest, schema validation, lint and bundle all passed).

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement in plain language.
- A **Solution** with numbered steps and the exact code.
- A **Discussion** with the rules and pitfalls behind the code.
- **Related recipes**.

## Recipe Index

| Recipe                                                                                   | Use it when                                                                                       | Primary methods                                                              |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Customize a field with limits, a counter and validation messages](./field-with-limits-and-validation.md) | Changing how a field edits or validates a value; adding configurable properties to a field       | `updateFieldValue`, `triggerFieldChange`, `getStateProps`                    |
| [Build a data-driven widget with loading, empty and error states](./build-a-data-widget.md) | Showing data from a data page in a panel or table; any component that loads data asynchronously  | `getDataApiUtils().getData`, `getContextName`, `getLocalizedText`            |
| [Show a property as a colored status badge](./status-badge-field.md) | A read-only value, pill or badge bound to a property; handling `DISPLAY_ONLY`; a configurable value-to-color map | `getStateProps`, Cosmos `Status` |

For recipes on the **runtime APIs** a component calls (submitting assignments, validation, subscriptions, collaboration), use the cookbooks of the `pconnect-*` skills linked from the [skills index](../../README.md).
