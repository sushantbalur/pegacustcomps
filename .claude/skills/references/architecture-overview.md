---
title: PCore / PConnect Architecture at a Glance
description: Shared architecture primer for all PCore/PConnect skills — PCore vs PConnect, and the sub-APIs reachable through PConnect.
---

# PCore / PConnect Architecture at a Glance

> Referenced by every skill in the [skills index](../README.md).

Pega Constellation exposes two global entry points to component code:

- **`PCore`** — A global singleton available anywhere in the app (`window.PCore`). Use it for capabilities that don't require a specific component's context: environment/locale info, REST calls, data pages, pub/sub, constants, and other application-wide utilities. Never construct or import it — it's provided by the runtime.
- **`PConnect`** — An object representing a _specific component's context_ in the rendered view tree, obtained via `getPConnect()` (passed to every component as a prop) or by creating one dynamically with `PCore.createPConnect(config).getPConnect()`. Use it to read/write the current field's value, dispatch case actions, iterate a component's children, or resolve view-relative configuration. In examples throughout these skills, a `PConnect` instance is referred to as `pConn`.

```typescript
// PCore: no component context needed
const locale = PCore.getEnvironmentInfo().getLocale();

// PConnect: needs the current component's context
const MyComponent = ({ getPConnect }) => {
  const pConn = getPConnect();
  const value = pConn.getValue('.FirstName');
  return null;
};
```

## PCore vs PConnect — Quick Decision Guide

| Need                                                               | Use        |
| ------------------------------------------------------------------ | ---------- |
| Read environment, locale, time zone                                | `PCore`    |
| Make a REST call to a Pega API                                     | `PCore`    |
| Subscribe to an application-wide event                             | `PCore`    |
| Read or invalidate a data page                                     | `PCore`    |
| Read a field value within the current component                    | `PConnect` |
| Dispatch a field change / submit an assignment                     | `PConnect` |
| Iterate children of a container component                          | `PConnect` |
| Resolve config annotations against the current component's context | `PConnect` |

## Sub-APIs Reached Through PConnect

Several `pConn.*` methods return a further "sub-API" object with its own methods, rather than a plain value:

| Accessor                         | Returns               | Used for                                                                     |
| -------------------------------- | --------------------- | ---------------------------------------------------------------------------- |
| `pConn.getActionsApi()`          | `ActionsApi`          | Case/work lifecycle, navigation, data object CRUD, field updates             |
| `pConn.getValidationApi()`       | `ValidationApi`       | Field-level validation                                                       |
| `pConn.getContainerManager()`    | `ContainerManager`    | Managing items within a container region                                     |
| `pConn.getCaseInfo()`            | `CaseInfo`            | Case-level metadata (ID, class, stages, assignments)                         |
| `pConn.getDataInfo()`            | `DataInfo`            | Data-object-level context metadata                                           |
| `pConn.getLocalizationService()` | `LocalizationService` | Resolving localized text                                                     |
| `pConn.getListActions()`         | `ListActions`         | Insert/update/delete/reorder/select operations on page-list (repeating) data |
