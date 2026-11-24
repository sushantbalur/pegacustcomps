---
title: Build a shareable deep link to a specific case or assignment
keywords: [deep link, semantic URL, shareable link, permalink, bookmark, query param]
primary_methods: [SemanticUrlUtils.getResolvedSemanticURL, SemanticUrlUtils.getActions, NavigationUtils.getURLParam]
related: [multi-step-wizard]
---

# Recipe: Build a shareable deep link to a specific case or assignment

> Part of the [Navigation, Locale & GenAI cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A custom component needs to generate a URL a user can copy, bookmark, or share that reopens the exact case/assignment view, and later read that same identifying parameter back out when the app loads from that URL.

## Solution

Uses `SemanticUrlUtils` and `NavigationUtils` (both via `PCore.get*()`, see [pcore-messaging-details.md](../../references/pcore-messaging-details.md) and [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
const { getResolvedSemanticURL, getActions } = PCore.getSemanticUrlUtils();

const shareableUrl = getResolvedSemanticURL(
  getActions().ACTION_OPENWORKBYHANDLE,
  { caseClassName: pConn.getCaseInfo().getClassName() },
  { workID: pConn.getCaseInfo().getID() }
);

// On load, read the identifier back out of the current URL.
const workIDFromUrl = PCore.getNavigationUtils().getURLParam('workID', true);
```

## Discussion

**MUST** source the `routeKey` from `getActions()` rather than hardcoding a string literal. **NEVER** hardcode it — an arbitrary string produces a URL that Constellation's own router won't recognize on reload, so the "deep link" silently fails to reopen the right view when a user later pastes it into a browser. **MUST** use `getActions().ACTION_OPENWORKBYHANDLE` for a case/assignment deep link — `getActions()` does not expose an `OPEN_ASSIGNMENT` key; the supported keys are `ACTION_OPENWORKBYHANDLE`, `ACTION_SHOWDATA`, `ACTION_SHOWVIEW`, `ACTION_GETOBJECT`, `ACTION_SHOWINSIGHT`, and `ACTION_SHOWDASHBOARD`.

## Related recipes

- [Multi-step wizard navigation with per-step save and final submit](../../pconnect-assignment-lifecycle/cookbooks/multi-step-wizard.md)
