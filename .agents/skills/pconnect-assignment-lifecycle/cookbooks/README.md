---
title: Assignment & Submission Lifecycle Cookbook — Recipe Index
description: Multi-method recipes for opening, validating, submitting, and deleting assignments/cases, indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Assignment & Submission Lifecycle

> Part of the [Assignment & Submission Lifecycle skill](../SKILL.md).

Every file in [`../../references/`](../../references/) documents one method at a time. Each file in this folder shows how to **chain multiple documented methods together** to complete one common real-world task. Every recipe only uses methods already cataloged in `references/` — follow the links in each recipe for full signatures. Nothing here invents a new API; every call is a direct composition of already-documented methods.

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement — what you're trying to accomplish, in plain language.
- A **Solution** — the minimal correct code, linking to the individual reference files for each method used.
- A **Discussion** — the ordering/cleanup/gotcha pitfall that makes this worth documenting as a recipe instead of assembling from scratch.
- **Related recipes** — links to recipes that share a pattern (lifecycle, cleanup, error handling, etc.), including recipes in sibling skills.

## Recipe Index

Search by symptom or keyword before assembling a sequence of calls from scratch — there is a good chance the ordering/cleanup pitfalls have already been worked out below.

| Recipe                                                                               | Keywords                                                                      | Primary methods                                   |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| [Modal assignment submit](./modal-assignment-submit.md)                              | modal, dialog, submit, close, validate before submit, containerItemID         | `ContainerManager`, `ActionsApi`, `ValidationApi` |
| [Multi-step wizard](./multi-step-wizard.md)                                          | stepper, process flow, next/previous, save between steps, finish on last step | `ActionsApi`                                      |
| [Bulk action submit](./bulk-action-submit.md)                                        | select all, checkbox, mass update, multiple cases                             | `ListActions`, `ActionsApi`                       |
| [Graceful submit failure handling](./graceful-submit-failure.md)                     | error handling, failed submit, generic error message, rollback                | `ErrorHandler`, `FormUtils`, `ActionsApi`         |
| [Custom confirm before a destructive action](./confirm-before-destructive-action.md) | confirm dialog, are you sure, destructive action, custom modal                | `ConfirmDialogService`                            |
| [Safe case deletion](./safe-case-deletion.md)                                        | delete case, cancel case, remove work object, create stage                    | `ActionsApi`                                      |
| [Attachment upload](./attachment-upload.md)                                          | file upload, attach, progress, cancel, category                               | `AttachmentUtils`                                 |
| [Create a case and jump to a target stage](./create-and-stage-new-case.md)           | create case, new case wizard, skip stage, jump to stage                       | `ActionsApi`                                      |
| [Approve or reject a case](./approval-workflow-decision.md)                          | approval, reject, approve case, sign-off, decision step                       | `ActionsApi`, `ConfirmDialogService`              |
| [Resolve or ignore a duplicate case](./resolve-or-ignore-duplicate.md)               | duplicate case, duplicate detection, merge case, ignore duplicate             | `ActionsApi`, `RelatedCasesApi`                   |

Use the individual reference files in [`../../references/`](../../references/) to look up a single method's exact signature. Use a recipe here when you need to know the **order** multiple methods should be called in to complete a task.

As more cookbooks are added, add one file per recipe (not more content to an existing recipe file) and a row here — see any existing recipe file for the expected frontmatter/structure.
