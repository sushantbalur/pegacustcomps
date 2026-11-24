---
title: Forms & Field Behavior Cookbook — Recipe Index
description: Multi-method recipes for form/field validation, cascading fields, autosave, and persisted UI state, indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Forms & Field Behavior

> Part of the [Forms & Field Behavior skill](../SKILL.md).

Every file in [`../../references/`](../../references/) documents one method at a time. Each file in this folder shows how to **chain multiple documented methods together** to complete one common real-world task. Every recipe only uses methods already cataloged in `references/` — follow the links in each recipe for full signatures. Nothing here invents a new API; every call is a direct composition of already-documented methods.

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement — what you're trying to accomplish, in plain language.
- A **Solution** — the minimal correct code, linking to the individual reference files for each method used.
- A **Discussion** — the ordering/cleanup/gotcha pitfall that makes this worth documenting as a recipe instead of assembling from scratch.
- **Related recipes** — links to recipes that share a pattern (lifecycle, cleanup, error handling, etc.), including recipes in sibling skills.

## Recipe Index

Search by symptom or keyword before assembling a sequence of calls from scratch — there is a good chance the ordering/cleanup pitfalls have already been worked out below.

| Recipe                                                                              | Keywords                                                                    | Primary methods              |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------- |
| [Full-form validation before submit](./full-form-validation.md)                     | validate all fields, disable submit button, dirty check, unsaved changes    | `FormUtils`, `ActionsApi`    |
| [Cascading dependent fields](./cascading-dependent-fields.md)                       | dependent dropdown, country/state, cascade, dynamic field reset             | `CascadeManager`             |
| [Autosave status tracking](./autosave-tracking.md)                                  | autosave, draft, in-progress edits, save indicator                          | `AutosaveUtils`              |
| [Persist widget UI state](./persist-widget-ui-state.md)                             | persist UI state, remember selected tab, navigation cache, survive remount  | `NavigationUtils`            |
| [Collect form changes for a manual save](./collect-form-changes-for-manual-save.md) | manual save, save draft, changed fields, submit payload, custom save button | `FormUtils`                  |
| [Discard changes and reset a form](./discard-changes-and-reset-form.md)             | discard changes, reset form, clear validation errors, cancel edit, revert   | `FormUtils`                  |
| [Register a custom field validator](./custom-field-validators.md)                   | custom validator, business rule validation, cross-field validation          | `FormUtils`, `ValidationApi` |

Use the individual reference files in [`../../references/`](../../references/) to look up a single method's exact signature. Use a recipe here when you need to know the **order** multiple methods should be called in to complete a task.

As more cookbooks are added, add one file per recipe (not more content to an existing recipe file) and a row here — see any existing recipe file for the expected frontmatter/structure.
