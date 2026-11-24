# PConnect: Case & Data Info, Validation Checks, Sub-API Access Points

> Part of the [PCore / PConnect API Reference skills](../README.md). Methods documented here are called on a `PConnect` instance (`pConn`), obtained via the `getPConnect()` prop passed to every component.
>
> `getActionsApi()`, `getValidationApi()`, `getContainerManager()`, `getCaseInfo()`, `getDataInfo()`, and `getListActions()` are accessors only — see [pconnect-actions-api.md](./pconnect-actions-api.md), [pconnect-validation-api.md](./pconnect-validation-api.md), [pconnect-container-manager.md](./pconnect-container-manager.md), [pconnect-case-info-data-info-localization.md](./pconnect-case-info-data-info-localization.md), and [pconnect-list-actions.md](./pconnect-list-actions.md) for the full method catalogs of the objects they return.

## `getCaseInfo()`

**Purpose:** Returns a `CaseInfo` instance for the case bound to the current context — the entry point for case-level accessors (ID, class name, key, business ID, stages, and so on).

**Signature:**

```typescript
getCaseInfo(): CaseInfo
```

**Example:**

```typescript
const caseId = pConn.getCaseInfo().getBusinessID();
```

**Notes:** See [pconnect-case-info-data-info-localization.md](./pconnect-case-info-data-info-localization.md) for the full `CaseInfo` method catalog.

---

## `getDataInfo()`

**Purpose:** Returns a `DataInfo` instance for the data object bound to the current context.

**Signature:**

```typescript
getDataInfo(): DataInfo
```

**Example:**

```typescript
const contextKey = pConn.getDataInfo().getContextKey();
```

**Notes:** See [pconnect-case-info-data-info-localization.md](./pconnect-case-info-data-info-localization.md) for the full `DataInfo` method catalog.

---

## `getCaseSummary()`

**Purpose:** Returns a snapshot of case summary information (case ID, urgency, class, name, and related metadata). Per the typedefs the object has `caseID` (the case ID), `ID` (the **assignment** ID, for example `ASSIGN-WORKLIST ... !FLOW`), `caseClass`, `name`, `urgency`, `routedTo` and `isCaseWideAction()`.

**Signature:**

```typescript
getCaseSummary(): Record<string, unknown>
```

**Example:**

```typescript
const caseId = pConn.getCaseSummary().caseID; // `.ID` is the assignment ID, not the case ID
```

---

## `getReferencedUser(userId)`

**Purpose:** Looks up a referenced user (from the view's referenced-users data) by user identifier.

**Signature:**

```typescript
getReferencedUser(userId: string): { userId: string; UserName: string } | null
```

**Example:**

```typescript
const userName = pConn.getReferencedUser(userId)?.UserName;
```

---

## `getCaseStages()`

**Purpose:** Returns the case's stages, read directly from the current case's data in state.

**Signature:**

```typescript
getCaseStages(): unknown[]
```

**Example:**

```typescript
const stages = pConn.getCaseStages();
```

**Notes:** This is distinct from `CaseInfo.getCaseStages(caseID, contextName)` (a different method, on the sub-API returned by [`getCaseInfo()`](#getcaseinfo)), which fetches stage data asynchronously from the server — see [pconnect-case-info-data-info-localization.md](./pconnect-case-info-data-info-localization.md).

---

## `getStageID()`

**Purpose:** Returns the current stage ID, read directly from the current case's data in state.

**Signature:**

```typescript
getStageID(): string
```

**Example:**

```typescript
const stageID = pConn.getStageID();
```

---

## `isConditionExist()`

**Purpose:** Returns `true` if the component has an expression or a "when" condition configured.

**Signature:**

```typescript
isConditionExist(): boolean
```

**Example:**

```typescript
if (pConn.isConditionExist()) {
  // this component's visibility/value depends on a condition
}
```

---

## `isBoundToState()`

**Purpose:** Returns `true` if the component has any property reference bound to it.

**Signature:**

```typescript
isBoundToState(): boolean
```

**Example:**

```typescript
if (pConn.isBoundToState()) {
  // component reads/writes a state-bound property
}
```

---

## `getValidationApi()`

**Purpose:** Returns a `ValidationApi` instance used to validate the current field.

**Signature:**

```typescript
getValidationApi(): ValidationApi
```

**Example:**

```typescript
const result = pConn.getValidationApi().validate(inputValue);
```

**Notes:** See [pconnect-validation-api.md](./pconnect-validation-api.md) for the full method catalog.

---

## `getActionsApi()`

**Purpose:** Returns an `ActionsApi` instance used to dispatch case/work-level operations.

**Signature:**

```typescript
getActionsApi(): ActionsApi
```

**Example:**

```typescript
const actionsApi = pConn.getActionsApi();
```

**Notes:** See [pconnect-actions-api.md](./pconnect-actions-api.md) for the full `ActionsApi` method catalog.

---

## `getContainerManager()`

**Purpose:** Returns a `ContainerManager` instance used to manage the items within a container region.

**Signature:**

```typescript
getContainerManager(): ContainerManager
```

**Example:**

```typescript
const containerManager = pConn.getContainerManager();
```

**Notes:** See [pconnect-container-manager.md](./pconnect-container-manager.md) for the full method catalog.

---

## `getListActions()`

**Purpose:** Returns a `ListActions` instance with APIs for list-related operations (insert, delete, reorder, and selection) on components bound to page-list data.

**Signature:**

```typescript
getListActions(): ListActions
```

**Example:**

```typescript
const listActions = pConn.getListActions();
const selectedRows = await listActions.getSelectedRows(true);
```

**Notes:** See [pconnect-list-actions.md](./pconnect-list-actions.md) for the full `ListActions` method catalog.
