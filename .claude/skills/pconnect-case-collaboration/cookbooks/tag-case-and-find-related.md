---
title: Tag a case and browse other cases sharing that tag
keywords: [tag, label, categorize case, find similar cases, tags landing page]
primary_methods: [TagUtils.postTags, TagUtils.getTags, TagUtils.getTaggedCases, TagUtils.removeTag]
related: [relate-cases, participant-and-follower]
---

# Recipe: Tag a case and browse other cases sharing that tag

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A user wants to apply an informal, ad-hoc label to a case (for example "Escalated") and later browse other cases that share tags with it — without creating a formal case relationship.

## Solution

Uses `TagUtils` (via `PCore.getTagUtils()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { getTags, postTags, getTaggedCases, removeTag } = PCore.getTagUtils();

await postTags(caseID, [{ Name: 'Escalated' }], pConn);

// Re-fetch to get the newly-created tag's own ID — postTags does not return it.
const tags = await getTags(caseID, pConn);

const relatedByTag = await getTaggedCases(caseID, pConn);

async function onRemoveTag(tagID: string) {
  await removeTag(caseID, tagID, pConn);
}
```

## Discussion

**MUST** call `getTags` again after `postTags` if you need to reference the tag you just added (for example, to render an immediate "remove" button next to it) — `removeTag` needs the tag's own ID, not its name, and `postTags` does NOT return the created tag's ID.

Tags are a distinct, lighter-weight concept from a formal case relationship: use this recipe for informal cross-cutting labels a user assigns themselves, and use [Relate two cases](./relate-cases.md) when the relationship is a structured, first-class link between two specific cases.

## Related recipes

- [Relate two cases](./relate-cases.md)
- [Add a participant and follower](./participant-and-follower.md)
