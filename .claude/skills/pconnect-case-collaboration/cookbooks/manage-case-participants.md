---
title: List, look up, and update a case's participants
keywords: [participants list, stakeholder list, team panel, participant roles, edit participant]
primary_methods:
  [
    StakeholderUtils.getParticipants,
    StakeholderUtils.getParticipant,
    StakeholderUtils.getParticipantRoles,
    StakeholderUtils.updateParticipant
  ]
related: [participant-and-follower, look-up-user-details]
---

# Recipe: List, look up, and update a case's participants

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A "Team" panel needs to display every participant on a case, let the user drill into one participant's details, and save an edit to that participant — distinct from adding a brand-new participant.

## Solution

Uses `StakeholderUtils` (via `PCore.getStakeholderUtils()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { getParticipants, getParticipant, getParticipantRoles, updateParticipant } = PCore.getStakeholderUtils();

// Populate the panel's list.
const participants = await getParticipants(caseID, pConn);

// Fetch the roles configured for the case (for example, to offer role choices when adding a participant).
const availableRoles = await getParticipantRoles(caseID, pConn);

// Drill into one participant when the user selects a row.
const participant = await getParticipant(caseID, participantID, pConn);

// Save an edit to that participant. ParticipantData is { content: Record<string, string>; pageInstructions?: object[] },
// so the edited participant fields go inside `content`.
await updateParticipant(caseID, participantID, { content: { pyFirstName: 'Sam', pyLastName: 'Smith' } }, pConn);
```

## Discussion

**SHOULD** re-fetch with `getParticipants` after `updateParticipant` if the list view needs to reflect the change immediately — `updateParticipant` does not return the full refreshed list.

**MUST** call `getParticipantRoles` to populate role choices from configuration rather than hardcoding role IDs in the component — available roles are case-type-specific and can change without a component release.

## Related recipes

- [Add a participant to a case and make them a follower](./participant-and-follower.md)
- [Look up operator details for display](./look-up-user-details.md)
