---
name: pconnect-forms-and-fields
description: "Reference catalog and cookbook for PCore/PConnect APIs governing form and field behavior — FormUtils, CascadeManager, AutosaveUtils, NavigationUtils component state, and ValidationApi — with recipes for full-form validation before submit, cascading/dependent fields, autosave status tracking, persisting a custom widget's UI state across navigation, collecting changed/submittable data for a manual save, discarding changes and resetting a form, and registering a custom cross-field validator. Use when you need the exact signature for these APIs, or the correct order to call them to validate, cascade, or persist form/field state."
user-invocable: true
argument-hint: "Use when validating a whole form, wiring cascading/dependent fields, tracking autosave status, or persisting a custom widget's UI state across navigation — for the exact FormUtils/CascadeManager/AutosaveUtils/NavigationUtils signature, or the correct call order."
metadata:
  verified-against: 'latest 26.x'
---

# Forms & Field Behavior — PCore/PConnect Skill

This skill covers the PCore/PConnect APIs and recipes for **form and field behavior**: whole-form validation, cascading/dependent fields, autosave tracking, and persisting custom widget UI state. It is one of the PCore/PConnect API skills — see the [skills index](../README.md) for the full method catalog, architecture primer, and the other five skills.

## When to Use This Skill

Load this skill when:

- You need the exact parameters, return type, or purpose of a `FormUtils`, `CascadeManager`, `AutosaveUtils`, or `NavigationUtils` (component state) method.
- You're disabling/enabling a Submit button based on whole-form validity and dirty state, rather than a single field.
- You're wiring one field's change to reset or reload a dependent field, or tracking/notifying autosave status.
- You're persisting a custom component's UI state (for example, a selected tab) across navigation/unmount.

If your task is actually about submitting or deleting the assignment/case itself, see [pconnect-assignment-lifecycle](../pconnect-assignment-lifecycle/SKILL.md) instead.

New to PCore/PConnect? Start with [Architecture at a Glance](../references/architecture-overview.md).

## Key Reference Files

| File                                                                                 | Class(es)                                       | Obtained via                |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- | --------------------------- |
| [../references/pcore-misc-details.md](../references/pcore-misc-details.md)           | `FormUtils`, `AutosaveUtils`, `NavigationUtils` | `PCore.get*()`              |
| [../references/pcore-rest-data-details.md](../references/pcore-rest-data-details.md) | `CascadeManager`                                | `PCore.getCascadeManager()` |
| [../references/pconnect-validation-api.md](../references/pconnect-validation-api.md) | `ValidationApi`                                 | `pConn.getValidationApi()`  |
| [../references/pconnect-actions-api.md](../references/pconnect-actions-api.md)       | `ActionsApi`                                    | `pConn.getActionsApi()`     |

See the [full reference index](../README.md) for every other PCore/PConnect method not directly related to this skill's topic.

## Cookbooks

Multi-method, ordering/cleanup recipes for this skill's topic live in [cookbooks/README.md](./cookbooks/README.md): full-form validation before submit, cascading/dependent fields, autosave status tracking, persisting a custom widget's UI state, collecting changed/submittable data for a manual save action, discarding changes and resetting a form, and registering a custom field validator.

Use the reference files above for a single method's signature. Use the cookbook index when you need the **order** multiple methods should be called in to complete a task.

For testing components that call these APIs, security considerations, performance (debouncing cascades/autosave), error-handling strategy for a failed validation/autosave call, accessibly announcing validation/autosave status, or troubleshooting a call that isn't behaving as documented, see [Cross-Cutting Best Practices](../best-practices/README.md).
