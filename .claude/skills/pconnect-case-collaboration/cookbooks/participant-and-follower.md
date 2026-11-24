---
title: Add a participant to a case and make them a follower
keywords: [stakeholder, participant, role, follower, notify a user]
primary_methods: [StakeholderUtils.createParticipant, CaseFollowerApi.addCaseFollower]
related: [relate-cases]
---

# Recipe: Add a participant to a case and make them a follower

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A user needs to be added to a case in a specific role, and separately opted in to update notifications.

## Solution

Uses `StakeholderUtils` and `CaseFollowerApi` (both via `PCore.get*()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { createParticipant } = PCore.getStakeholderUtils();
const { addCaseFollower } = PCore.getCaseFollowerApi();

// participantData is { content: Record<string, string>; pageInstructions?: object[] },
// for example { content: { pyFirstName: 'Sam', pyLastName: 'Smith', pyEmail1: 'sam.smith@example.com' } }.
// createParticipant resolves to void — it does not return the new participant.
await createParticipant(caseID, roleID, participantData, pConn);

// Following is a separate concept from being a participant — add both if the user should get updates.
// addCaseFollower takes an array of user IDs.
await addCaseFollower(caseID, [userID], context);
```

## Discussion

**MUST** call both APIs if the user needs both roles — creating a participant does NOT automatically make them a follower. They are independent concepts.

## Related recipes

- [Relate two cases together and confirm the relationship](./relate-cases.md)
