---
title: Let end users save and restore a personalized list view
keywords: [saved view, personalization, sort filter preference, remember columns, list view]
primary_methods:
  [
    PCore.getPersonalizationUtils,
    PersonalizationUtils.fetchPersonalizations,
    PersonalizationUtils.createPersonalization,
    PersonalizationUtils.updatePersonalization
  ]
related: [repeating-row-edit]
---

# Recipe: Let end users save and restore a personalized list view

> Part of the [Lists, Containers & Views cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A list/table component wants to let users save their current sort/filter/column configuration and reapply it later, without inventing a custom storage mechanism.

## Solution

Uses `PCore.getPersonalizationUtils(listID)` (see [pcore-case-collaboration-genai.md](../../references/pcore-case-collaboration-genai.md)).

```typescript
const personalizationUtils = PCore.getPersonalizationUtils(listComponentID);

// Resolves to a PersonalizationStore — { allPersonalizations, defaultPersonalization } — or an AxiosResponse wrapping one.
// allPersonalizations is either RawPersonalization[] (each with name, personalizationID, personalizationState)
// or a Personalizations map keyed by personalization key.
const savedViews = await personalizationUtils.fetchPersonalizations();

// Types below are from the typedefs' rules/types.d.ts.
async function saveCurrentView(
  personalizationID: string,
  name: string,
  personalizationState: PersonalizationState,
  alreadySaved: boolean // decide this from `savedViews`
) {
  const info: CreatePersonalizationInfo = { name, personalizationState, markAsDefault: false };
  if (alreadySaved) {
    await personalizationUtils.updatePersonalization(personalizationID, info);
  } else {
    await personalizationUtils.createPersonalization(personalizationID, info);
  }
}
```

`createPersonalization` and `updatePersonalization` both take `(personalizationID: string, personalizedState: CreatePersonalizationInfo)`, where `CreatePersonalizationInfo` is `{ name: string; personalizationState: PersonalizationState; markAsDefault: boolean; markAsAppDefault?: boolean }`. The typedefs do not say how a new `personalizationID` is chosen.

## Discussion

**MUST** keep `listComponentID` stable and unique per list instance (limited to 32 characters). **NEVER** reuse the same ID for two different list components on the same view — their saved personalizations will silently overwrite each other.

A falsy `listComponentID` doesn't throw — `getPersonalizationUtils` returns safe no-op stubs instead, so a "Save view" button can appear to work while doing nothing. **ALWAYS** confirm `listComponentID` resolved to a real value before wiring one up.

## Related recipes

- [Repeating row edit](./repeating-row-edit.md)
