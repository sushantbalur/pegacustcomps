---
title: Post, edit, and delete messages on a case's feed
keywords: [feed, pulse, comment, post message, discussion, reply]
primary_methods: [FeedUtils.getFeeds, FeedUtils.postMessage, FeedUtils.editMessage, FeedUtils.deleteMessage]
related: [manage-case-attachments]
---

# Recipe: Post, edit, and delete messages on a case's feed

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A discussion/feed panel needs to load a case's existing feed entries, let the user post a new message (and reply to an existing one), and let the message's own author edit or delete it afterward.

## Solution

Uses `FeedUtils` (via `PCore.getFeedUtils()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { getFeeds, postMessage, editMessage, deleteMessage } = PCore.getFeedUtils();

// Initial load.
const feed = await getFeeds(context, feedID, feedClass, filters, cancelTokenSource, pConn);

// Post a new top-level message.
await postMessage(context, 'Reviewed and approved.', pConn);

// Reply to an existing message.
await postMessage(context, 'Confirming this is resolved.', pConn, undefined, true, undefined);

// Author-only edit.
await editMessage({ messageID, message: 'Reviewed and approved — see attached notes.', pConn });

// Author-only delete (void return — re-fetch or optimistically remove from local state).
deleteMessage(messageID, false, undefined, pConn);
```

To load more/older entries in a paginated feed, call `getFeeds` again with `isLoadMore: true` rather than re-requesting from the beginning.

## Discussion

**MUST NOT** assume `deleteMessage` returns the updated feed — it returns `void`. Either re-call `getFeeds` or remove the message from local state directly after a successful call.

**SHOULD** pass a `cancelTokenSource` to `getFeeds` so an in-flight feed request can be canceled if the user navigates away before it resolves (see [Cancel Requests That Are No Longer Needed](../../best-practices/performance-and-efficiency.md#cancel-requests-that-are-no-longer-needed)).

## Related recipes

- [Upload a file, attach it to a case, and handle a failed upload](../../pconnect-assignment-lifecycle/cookbooks/attachment-upload.md)
- [List, look up, and update a case's participants](./manage-case-participants.md)
