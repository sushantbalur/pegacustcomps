---
name: pconnect-lists-and-views
description: 'Reference catalog and cookbook for PCore/PConnect APIs governing lists, containers, and view state — ListActions, ContainerManager, ContainerUtils, and PersonalizationUtils — with recipes for editing a repeating row with validation, personalizing and restoring a saved list view, managing non-assignment container item lifecycle, inserting/deleting list rows, reordering list rows, and switching between container items with an unsaved-changes guard. Use when you need the exact signature for these APIs, or the correct order to call them to edit list rows or manage container items.'
user-invocable: true
argument-hint: 'Use when editing a repeating row/table, saving or restoring a personalized list view, or adding/closing items in a non-assignment container — for the exact ListActions/ContainerManager/ContainerUtils/PersonalizationUtils signature, or the correct call order.'
metadata:
  verified-against: 'latest 26.x'
---

# Lists, Containers & Views — PCore/PConnect Skill

This skill covers the PCore/PConnect APIs and recipes for **lists, containers, and view state**: repeating row edits, saved list view personalization, and non-assignment container item lifecycle. It is one of the PCore/PConnect API skills — see the [skills index](../README.md) for the full method catalog, architecture primer, and the other five skills.

## When to Use This Skill

Load this skill when:

- You need the exact parameters, return type, or purpose of a `ListActions`, `ContainerManager`, `ContainerUtils`, or `PersonalizationUtils` method.
- You're validating and updating a field within a repeating row/table (not a top-level form).
- You're letting users save/restore a personalized sort, filter, or column configuration for a list.
- You're adding a non-assignment view to a multi-item container (for example, a side panel) without losing items already open.

If your task is about submitting an assignment inside a modal container, see [pconnect-assignment-lifecycle](../pconnect-assignment-lifecycle/SKILL.md) instead — that skill covers the single-assignment modal submit flow.

New to PCore/PConnect? Start with [Architecture at a Glance](../references/architecture-overview.md).

## Key Reference Files

| File                                                                                                   | Class(es)                               | Obtained via                      |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------- | --------------------------------- |
| [../references/pconnect-list-actions.md](../references/pconnect-list-actions.md)                       | `ListActions`                           | `pConn.getListActions()`          |
| [../references/pconnect-container-manager.md](../references/pconnect-container-manager.md)             | `ContainerManager`                      | `pConn.getContainerManager()`     |
| [../references/pcore-case-collaboration-details.md](../references/pcore-case-collaboration-details.md) | `ContainerUtils`                        | `PCore.getContainerUtils()`       |
| [../references/pcore-case-collaboration-genai.md](../references/pcore-case-collaboration-genai.md)     | `PersonalizationUtils` (accessor-level) | `PCore.getPersonalizationUtils()` |

See the [full reference index](../README.md) for every other PCore/PConnect method not directly related to this skill's topic.

## Cookbooks

Multi-method, ordering/cleanup recipes for this skill's topic live in [cookbooks/README.md](./cookbooks/README.md): editing a repeating row with validation, saved list view personalization, non-assignment container item lifecycle, inserting/deleting list rows, reordering list rows, and switching between container items with an unsaved-changes guard.

Use the reference files above for a single method's signature. Use the cookbook index when you need the **order** multiple methods should be called in to complete a task.

For testing components that call these APIs, security considerations, performance (batching row operations, virtualizing long lists), or troubleshooting a personalization/container issue that isn't behaving as documented, see [Cross-Cutting Best Practices](../best-practices/README.md).
