---
title: Look up operator details to display in a participant or feed card
keywords: [operator lookup, user profile, glimpse, avatar, display name]
primary_methods: [UserApi.getOperatorDetails]
related: [manage-case-participants]
---

# Recipe: Look up operator details to display in a participant or feed card

> Part of the [Case Collaboration & Relationships cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A participant card, feed entry, or follower row only has a raw operator/user ID and needs to render a display name, role, and other profile details.

## Solution

Uses `UserApi` (via `PCore.getUserApi()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const { getOperatorDetails } = PCore.getUserApi();

// The typedefs type the result as a bare `object`; at runtime it is an Axios-style response, so cast to read `.data`.
const { data } = (await getOperatorDetails(operatorID)) as { data: Record<string, unknown> };
// data typically includes display name and other glimpse/profile fields — render defensively,
// since the exact shape depends on what the operator's profile has configured.
```

If `isBusinessID` is true for the caller's identifier type, pass it explicitly:

```typescript
const { data } = (await getOperatorDetails(businessID, true)) as { data: Record<string, unknown> };
```

## Discussion

**SHOULD** cache the result per operator ID within a single view render (for example, a list of 30 feed entries from the same 3 authors) rather than calling `getOperatorDetails` once per row — the same operator's details do not change between rows in the same render pass.

**MUST NOT** assume every field is present on `data` — profile completeness varies per operator; render a sensible fallback (for example, the raw ID) if a display name is missing.

## Related recipes

- [List, look up, and update a case's participants](./manage-case-participants.md)
