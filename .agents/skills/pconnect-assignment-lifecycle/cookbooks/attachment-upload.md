---
title: Upload a file, attach it to a case, and handle a failed upload
keywords: [file upload, attach, progress, cancel, category]
primary_methods:
  [AttachmentUtils.uploadAttachment, AttachmentUtils.linkAttachmentsToCase, AttachmentUtils.cancelRequest]
related: [graceful-submit-failure]
---

# Recipe: Upload a file, attach it to a case, and handle a failed upload

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A file must be uploaded and linked to a case, with the upload and link steps failing independently and needing different recovery.

## Solution

Uses `PCore.getAttachmentUtils()` (see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { uploadAttachment, linkAttachmentsToCase, cancelRequest } = PCore.getAttachmentUtils();

let uploadedFile;
try {
  uploadedFile = await uploadAttachment(file, onUploadProgress, onUploadError, context);
} catch {
  // The upload itself failed (network error, size/type rejection) — do not attempt to link.
  return;
}

try {
  await linkAttachmentsToCase(caseID, [uploadedFile], 'File', context);
} catch {
  // The file uploaded but failed to link — offer a retry for linking only, don't re-upload.
}
```

## Discussion

**MUST** call `cancelRequest(fileID)` if the user navigates away or cancels mid-upload, to stop the in-flight request rather than letting it complete and silently discarding the result.

## Related recipes

- [Handle a failed submit gracefully](./graceful-submit-failure.md)
