---
name: pconnect-assignment-lifecycle
description: 'Reference catalog and cookbook for PCore/PConnect APIs governing assignment and case submission lifecycle — ActionsApi, ContainerManager, ValidationApi, AttachmentUtils, ErrorHandler, and ConfirmDialogService — with recipes for opening an assignment in a modal, multi-step wizard navigation, bulk action submit, safe case deletion, custom destructive-action confirmation, attachment upload, graceful submit-failure handling, creating a case and jumping to a stage, approving/rejecting a case, and resolving/ignoring a duplicate case. Use when you need the exact signature for these APIs, or the correct order to call them to open, validate, submit, or delete an assignment/case.'
user-invocable: true
argument-hint: 'Use when opening, validating, submitting, or deleting an assignment/case, confirming a destructive action, or uploading an attachment — for the exact ActionsApi/ContainerManager/ValidationApi signature, or the correct call order.'
metadata:
  verified-against: 'latest 26.x'
---

# Assignment & Submission Lifecycle — PCore/PConnect Skill

This skill covers the PCore/PConnect APIs and recipes for the **assignment and case submission lifecycle**: opening an assignment, validating it, submitting it, deleting a case, confirming a destructive action, and handling attachments. It is one of the PCore/PConnect API skills — see the [skills index](../README.md) for the full method catalog, architecture primer, and the other five skills.

## When to Use This Skill

Load this skill when:

- You need the exact parameters, return type, or purpose of an `ActionsApi`, `ContainerManager`, `ValidationApi`, `AttachmentUtils`, `ErrorHandler`, or `ConfirmDialogService` method.
- You're opening an assignment in a modal/container, submitting it, or deleting a case, and need the correct call order.
- You're building a custom confirmation dialog before a destructive action, or handling a failed submit without losing user edits.

If your task is about form/field validation state, cascading fields, or autosave rather than the submit/delete lifecycle itself, see [pconnect-forms-and-fields](../pconnect-forms-and-fields/SKILL.md) instead.

New to PCore/PConnect? Start with [Architecture at a Glance](../references/architecture-overview.md).

## Key Reference Files

| File                                                                                                   | Class(es)                                           | Obtained via                  |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ----------------------------- |
| [../references/pconnect-actions-api.md](../references/pconnect-actions-api.md)                         | `ActionsApi`                                        | `pConn.getActionsApi()`       |
| [../references/pconnect-container-manager.md](../references/pconnect-container-manager.md)             | `ContainerManager`                                  | `pConn.getContainerManager()` |
| [../references/pconnect-validation-api.md](../references/pconnect-validation-api.md)                   | `ValidationApi`                                     | `pConn.getValidationApi()`    |
| [../references/pcore-case-collaboration-details.md](../references/pcore-case-collaboration-details.md) | `AttachmentUtils`                                   | `PCore.getAttachmentUtils()`  |
| [../references/pcore-misc-details.md](../references/pcore-misc-details.md)                             | `ErrorHandler`, `FormUtils`, `ConfirmDialogService` | `PCore.get*()`                |

See the [full reference index](../README.md) for every other PCore/PConnect method not directly related to this skill's topic.

## Cookbooks

Multi-method, ordering/cleanup recipes for this skill's topic live in [cookbooks/README.md](./cookbooks/README.md): modal assignment submit, multi-step wizard navigation, bulk action submit, safe case deletion, custom destructive-action confirmation, attachment upload, graceful submit-failure handling, creating a case and jumping to a target stage, approving or rejecting a case, and resolving or ignoring a duplicate case.

Use the reference files above for a single method's signature. Use the cookbook index when you need the **order** multiple methods should be called in to complete a task.

For testing components that call these APIs, security considerations (attachment uploads, destructive-action confirmation), idempotent/resilient retry and cancellation handling for submits, accessible loading/error states during a submit, or troubleshooting a call that isn't behaving as documented, see [Cross-Cutting Best Practices](../best-practices/README.md).
