---
title: Persist a custom widget's UI state across navigation
keywords: [persist UI state, remember selected tab, navigation cache, component cache, survive remount]
primary_methods:
  [NavigationUtils.getComponentState, NavigationUtils.setComponentState, NavigationUtils.getComponentCache]
related: [autosave-tracking]
---

# Recipe: Persist a custom widget's UI state across navigation

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A custom component (for example, a tab strip or collapsible panel) needs to remember which sub-view the user had open, surviving a full unmount when the user navigates away and back — plain React state resets on remount.

## Solution

Uses `NavigationUtils` (via `PCore.getNavigationUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
const stateKey = `my-widget-${pConn.getContextName()}`;

const [selectedTab, setSelectedTab] = useState(
  () => PCore.getNavigationUtils().getComponentState(stateKey) ?? 'overview'
);

useEffect(() => {
  PCore.getNavigationUtils().setComponentState(stateKey, selectedTab);
}, [selectedTab]);
```

## Discussion

**MUST** scope `stateKey` to the component's own context (`pConn.getContextName()`) rather than a hardcoded literal. **NEVER** use a shared key across multiple instances of the same widget — it collides across instances open in different containers, so one instance's tab selection silently overwrites another's.

`setComponentState` (persisted navigation state) and `setComponentCache` (in-memory cache) are not the same durability tier — reach for `setComponentCache` for cheap, short-lived memoization that's fine to lose, and reserve `setComponentState` for values that genuinely need to survive a full unmount/remount.

## Related recipes

- [Track autosave status while editing a form](./autosave-tracking.md)
