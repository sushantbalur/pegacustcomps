---
title: Lists, Containers & Views Cookbook — Recipe Index
description: Multi-method recipes for repeating row edits, list view personalization, and container item lifecycle, indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Lists, Containers & Views

> Part of the [Lists, Containers & Views skill](../SKILL.md).

Every file in [`../../references/`](../../references/) documents one method at a time. Each file in this folder shows how to **chain multiple documented methods together** to complete one common real-world task. Every recipe only uses methods already cataloged in `references/` — follow the links in each recipe for full signatures. Nothing here invents a new API; every call is a direct composition of already-documented methods.

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement — what you're trying to accomplish, in plain language.
- A **Solution** — the minimal correct code, linking to the individual reference files for each method used.
- A **Discussion** — the ordering/cleanup/gotcha pitfall that makes this worth documenting as a recipe instead of assembling from scratch.
- **Related recipes** — links to recipes that share a pattern (lifecycle, cleanup, error handling, etc.), including recipes in sibling skills.

## Recipe Index

Search by symptom or keyword before assembling a sequence of calls from scratch — there is a good chance the ordering/cleanup pitfalls have already been worked out below.

| Recipe                                                                                           | Keywords                                                                            | Primary methods                      |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------ |
| [Repeating row edit](./repeating-row-edit.md)                                                    | table row, grid, embedded list, inline edit, field-level validation                 | `ListActions`, `ValidationApi`       |
| [Saved list view personalization](./view-personalization.md)                                     | saved view, personalization, sort filter preference, remember columns               | `PersonalizationUtils`               |
| [Container item lifecycle](./container-item-lifecycle.md)                                        | utility container, side panel, non-assignment view, multiple container, dirty check | `ContainerManager`, `ContainerUtils` |
| [Insert and delete list rows](./insert-delete-list-rows.md)                                      | add row, remove row, insert row, delete row, dynamic list, embedded list            | `ListActions`                        |
| [Reorder list rows](./reorder-list-rows.md)                                                      | reorder, drag and drop, move row, priority list, sequence                           | `ListActions`                        |
| [Switch container items with an unsaved-changes guard](./activate-and-switch-container-items.md) | tabs, switch tab, side panel, active item, unsaved changes guard                    | `ContainerManager`, `ContainerUtils` |

Use the individual reference files in [`../../references/`](../../references/) to look up a single method's exact signature. Use a recipe here when you need to know the **order** multiple methods should be called in to complete a task.

As more cookbooks are added, add one file per recipe (not more content to an existing recipe file) and a row here — see any existing recipe file for the expected frontmatter/structure.
