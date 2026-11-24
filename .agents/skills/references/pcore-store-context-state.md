# PCore: Store, Context & State

> Part of the [PCore / PConnect API Reference skills](../README.md). See [pcore-store-context-details.md](./pcore-store-context-details.md) for the full method catalogs of `StateUtils` and `ContextTreeManager`.

## `getStore()`

**Purpose:** Returns the Redux store instance backing the entire application state.

**Signature:**

```typescript
getStore(): Store
```

**Example:**

```typescript
useEffect(() => {
  const store = PCore.getStore();
  return store.subscribe(() => {
    // react to any store change
  });
}, []);
```

**Notes:** The returned object is a standard Redux store (`getState()`, `dispatch()`, `subscribe()`). Prefer `pConn.getValue()`/`PCore.getStoreValue()` for reading specific values rather than reading raw state directly.

---

## `getStoreValue(propReference, pageReference, context)`

**Purpose:** Returns the value of a property from the store, without needing a `PConnect` instance.

**Signature:**

```typescript
getStoreValue(propReference: string, pageReference: string, context: string): unknown
```

**Example:**

```typescript
const firstName = PCore.getStoreValue('.FirstName', 'caseInfo.content', 'app/primary_1');
```

**Notes:** `propReference` is the property path (e.g. `.FirstName`), `pageReference` is the page path (e.g. `caseInfo.content`), and `context` scopes the lookup to a specific container/view context.

---

## `getStateUtils()`

**Purpose:** Returns `StateUtils`, a set of utilities for reading and updating shared application state.

**Signature:**

```typescript
getStateUtils(): StateUtils
```

**Example:**

```typescript
const stateUtils = PCore.getStateUtils();
stateUtils.updateState(context, 'caseInfo.ID', caseID, { skipDirtyValidation: true });
```

---

## `createPConnect(config)`

**Purpose:** Creates a `PConnect` object from a component configuration — useful for rendering a component dynamically outside the normal `getPConnect()` prop chain (for example, a cell renderer inside a custom table).

**Signature:**

```typescript
createPConnect(config: {
  meta: { type: string; config?: Record<string, unknown> };
  options?: { context?: string; pageReference?: string; referenceList?: string };
}): { getPConnect: () => PConnect }
```

**Example:**

```typescript
const cellComponent = PCore.createPConnect({
  meta: { type: 'TextInput', config: { label: 'Name', value: '.FirstName' } },
  options: { context: 'app/primary_1', pageReference: 'caseInfo.content' }
});
const pConn = cellComponent.getPConnect();
```

**Notes:** `meta.type` is required; `options.context`/`options.pageReference` are only needed when the component must render under a context different from its parent's.

---

## `getContextTreeManager()`

**Purpose:** Returns the `ContextTreeManager`, which tracks view/field dependencies confined to a view and its children (used to support refresh and validation behavior).

**Signature:**

```typescript
getContextTreeManager(): ContextTreeManager
```

**Example:**

```typescript
const viewNode = PCore.getContextTreeManager().getViewNode(contextName, pageReference, viewName);
```

---

## `isDeepEqual(oldValue, newValue)`

**Purpose:** Determines whether two objects are equal via a deep comparison.

**Signature:**

```typescript
isDeepEqual(oldValue: object, newValue: object): boolean
```

**Example:**

```typescript
if (!PCore.isDeepEqual(previousMetadata, updatedMetadata)) {
  // only re-dispatch when the metadata actually changed
}
```
