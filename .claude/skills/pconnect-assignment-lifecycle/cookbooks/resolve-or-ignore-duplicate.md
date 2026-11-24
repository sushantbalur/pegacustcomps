---
title: Resolve or ignore a detected duplicate case
keywords: [duplicate case, duplicate detection, merge case, ignore duplicate]
primary_methods: [ActionsApi.resolveDuplicateCase, ActionsApi.ignoreDuplicateCase]
related: [relate-cases]
---

# Recipe: Resolve or ignore a detected duplicate case

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

During case creation, the application flags a possible duplicate and presents an assignment asking the user to either resolve it (treat the duplicate as handled) or ignore the warning and continue with the new case as-is.

## Solution

Uses [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
async function resolveDuplicate(containerItemID) {
  // Also finishes the assignment — do not call finishAssignment afterward.
  await pConn.getActionsApi().resolveDuplicateCase(containerItemID);
}

async function ignoreDuplicateAndContinue(containerItemID) {
  // Also finishes the assignment — do not call finishAssignment afterward.
  await pConn.getActionsApi().ignoreDuplicateCase(containerItemID);
}
```

If the user instead wants to keep both cases as distinct but linked records (rather than treating one as resolved), relate them explicitly instead of using either duplicate-decision method:

```typescript
const { addRelatedCases } = PCore.getRelatedCasesApi();
await addRelatedCases(caseID, [{ caseID: duplicateCaseID }], context);
```

## Discussion

**MUST NOT** call `finishAssignment` after `resolveDuplicateCase`/`ignoreDuplicateCase` — both already finish the assignment as part of recording the decision.

**MUST** pick one path per duplicate warning — resolving/ignoring a duplicate is a distinct decision from relating two cases together via [`RelatedCasesApi`](../../pconnect-case-collaboration/cookbooks/relate-cases.md); do not call both for the same pair of cases unless the business process genuinely calls for the case to be both linked and marked resolved.

## Related recipes

- [Relate two cases together and confirm the relationship](../../pconnect-case-collaboration/cookbooks/relate-cases.md)
