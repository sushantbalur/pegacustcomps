---
title: Store and restore an operator's persistent preferences
keywords: [user settings, operator preferences, persist settings, remember preference, default view]
primary_methods: [NavigationUtils.getUserSettings, NavigationUtils.setUserSettings]
related: [persist-widget-ui-state]
---

# Recipe: Store and restore an operator's persistent preferences

> Part of the [Navigation, Locale & GenAI cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component needs to remember an operator's choice (a default view, a theme, a column layout) so it's restored the next time that operator logs in — not just across navigation within the current session, which [`NavigationUtils.getComponentState`](../../pconnect-forms-and-fields/cookbooks/persist-widget-ui-state.md) already covers.

## Solution

Uses `NavigationUtils` (via `PCore.getNavigationUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
const SETTINGS_PATH = 'myWidget.defaultView';

const savedView = PCore.getNavigationUtils().getUserSettings(SETTINGS_PATH) ?? 'list';

async function onDefaultViewChange(newView) {
  // setUserSettings persists to the operator's own profile — the value is a string, so
  // serialize non-string values before storing them.
  await PCore.getNavigationUtils().setUserSettings(SETTINGS_PATH, newView);
}
```

## Discussion

**MUST** choose `getUserSettings`/`setUserSettings` (persisted to the operator's profile, survives across logins/devices) over `getComponentState`/`setComponentState` (persisted only within the current navigation session) or `getComponentCache`/`setComponentCache` (in-memory only) based on how long the value genuinely needs to live — see [Persist a custom widget's UI state across navigation](../../pconnect-forms-and-fields/cookbooks/persist-widget-ui-state.md) for the session-scoped alternative.

**MUST** serialize non-string values (`JSON.stringify`) before calling `setUserSettings`, and parse them back out after `getUserSettings` — the API only accepts/returns a string value at this layer.

## Related recipes

- [Persist a custom widget's UI state across navigation](../../pconnect-forms-and-fields/cookbooks/persist-widget-ui-state.md)
