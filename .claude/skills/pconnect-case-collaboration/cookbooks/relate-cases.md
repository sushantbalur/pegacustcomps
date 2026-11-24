---
title: Relate two cases together and confirm the relationship
keywords: [related case, link cases, case relationship]
primary_methods: [RelatedCasesApi.addRelatedCases, RelatedCasesApi.getRelatedCases]
related: [participant-and-follower]
---

# Recipe: Relate two cases together and confirm the relationship

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

Two existing cases need to be linked as related cases, and the UI needs to refresh to show the new relationship.

## Solution

Uses `RelatedCasesApi` (via `PCore.getRelatedCasesApi()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { addRelatedCases, getRelatedCases } = PCore.getRelatedCasesApi();

await addRelatedCases(caseID, [{ caseID: relatedCaseID }], context);

// Re-fetch to confirm the relationship was recorded and to refresh any related-cases widget.
const relatedCases = await getRelatedCases(caseID, context);
```

## Discussion

**MUST** re-fetch with `getRelatedCases` if a widget needs to reflect the new relationship immediately — `addRelatedCases` does NOT return the updated list itself.

## Related recipes

- [Add a participant to a case and make them a follower](./participant-and-follower.md)
