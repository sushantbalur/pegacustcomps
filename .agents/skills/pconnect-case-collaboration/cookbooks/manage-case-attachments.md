---
title: List, edit, and delete a case's existing attachments
keywords: [attachment list, attachment panel, edit attachment, delete attachment, attachment categories]
primary_methods:
  [
    AttachmentUtils.getCaseAttachments,
    AttachmentUtils.getAttachmentCategories,
    AttachmentUtils.editAttachment,
    AttachmentUtils.deleteAttachment
  ]
related: [post-and-manage-feed]
---

# Recipe: List, edit, and delete a case's existing attachments

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

An attachments panel needs to show every file already linked to a case, let the user recategorize or rename one, and remove one — this is a separate concern from the initial upload-and-link flow.

## Solution

Uses `AttachmentUtils` (via `PCore.getAttachmentUtils()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { getCaseAttachments, getAttachmentCategories, editAttachment, deleteAttachment } = PCore.getAttachmentUtils();

// Populate the panel's list, including thumbnails for image attachments.
const attachments = await getCaseAttachments(caseID, context, true);

// Populate a "category" dropdown before showing the edit form.
const categories = await getAttachmentCategories(caseID, 'File', context);

// Rename/recategorize an existing attachment.
await editAttachment(attachmentID, { name: 'Signed contract.pdf', category: 'Legal' }, context);

// Remove an attachment (confirm first — see the destructive-action confirmation recipe).
await deleteAttachment(attachmentID, context);
```

## Discussion

**SHOULD** gate `deleteAttachment` behind a confirmation prompt — see [Show a custom confirmation dialog before a destructive action](../../pconnect-assignment-lifecycle/cookbooks/confirm-before-destructive-action.md) — since it is irreversible from the component's perspective.

**MUST** re-fetch with `getCaseAttachments` (or update local state directly) after `editAttachment`/`deleteAttachment` — neither returns the full refreshed attachment list.

## Related recipes

- [Upload a file, attach it to a case, and handle a failed upload](../../pconnect-assignment-lifecycle/cookbooks/attachment-upload.md)
- [Show a custom confirmation dialog before a destructive action](../../pconnect-assignment-lifecycle/cookbooks/confirm-before-destructive-action.md)
