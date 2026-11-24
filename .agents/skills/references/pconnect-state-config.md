# PConnect: State & Configuration Management, Data Access

> Part of the [PCore / PConnect API Reference skills](../README.md). Methods documented here are called on a `PConnect` instance (`pConn`), obtained via the `getPConnect()` prop passed to every component.

## `getStateProps()`

**Purpose:** Returns the reactive properties bound to state for the current component — the properties that trigger a re-render when they change.

**Signature:**

```typescript
getStateProps(): Record<string, unknown>
```

**Example:**

```typescript
const pConn = getPConnect();
const currentValue = pConn.getStateProps().value;
```

---

## `getConfigProps(destinationObject?)`

**Purpose:** Returns the fully resolved configuration props for the component — annotations such as `@P` (property references) and `@L` (localized text) are resolved to their live values.

**Signature:**

```typescript
getConfigProps(destinationObject?: Record<string, unknown>): Record<string, unknown>
```

**Example:**

```typescript
const MyComponent = ({ getPConnect }) => {
  const pConn = getPConnect();
  const { label, value } = pConn.getConfigProps();
  return null;
};
```

**Notes:** This is the primary way a component reads its resolved configuration — prefer it over reading raw, unresolved metadata.

---

## `populateAdditionalProps(configData)`

**Purpose:** Populates component-specific properties that aren't part of the raw configuration — for example, page/case/HTTP messages, validation messages, and stage info — directly onto the given config object.

**Signature:**

```typescript
populateAdditionalProps(configData: Record<string, unknown>): void
```

**Example:**

```typescript
const configData = pConn.getConfigProps();
pConn.populateAdditionalProps(configData);
// configData now also has any applicable validatemessage/pageMessages/httpMessages/stages props
```

---

## `getRawMetadata()`

**Purpose:** Returns the component's complete, unresolved metadata (`type`, `config`, `children`).

**Signature:**

```typescript
getRawMetadata(): { type: string; config?: Record<string, unknown>; children?: unknown[] }
```

**Example:**

```typescript
const rawMetadata = pConn.getRawMetadata();
```

**Notes:** Prefer `getConfigProps()` for most use cases; use `getRawMetadata()` only when you specifically need the unresolved shape (for example, to inspect `children`).

---

## `resolveConfigProps(configProps, destinationObject?)`

**Purpose:** Resolves a given props object (for example, one containing `@P` property references) against the component's context.

**Signature:**

```typescript
resolveConfigProps(configProps: Record<string, unknown>, destinationObject?: Record<string, unknown>): Record<string, unknown>
```

**Example:**

```typescript
const resolvedParams = pConn.resolveConfigProps(rawParameters);
```

---

## `registerAdditionalProps(additionalMeta?)`

**Purpose:** Resolves and registers an additional props object so it is merged into subsequent `getConfigProps()` calls.

**Signature:**

```typescript
registerAdditionalProps(additionalMeta?: Record<string, unknown>): Record<string, unknown>
```

**Example:**

```typescript
useEffect(() => {
  pConn.registerAdditionalProps({ readOnly: true });
});
```

---

## `deRegisterAdditionalProps(deRegisterKeys?)`

**Purpose:** Removes previously registered additional prop keys so they no longer appear in `getConfigProps()` output.

**Signature:**

```typescript
deRegisterAdditionalProps(deRegisterKeys?: string[]): boolean
```

**Example:**

```typescript
pConn.registerAdditionalProps({ label: 'Custom label' });
// ...later, once the override is no longer needed
pConn.deRegisterAdditionalProps(['label']);
```

---

## `getInheritedProps()`

**Purpose:** Returns props inherited from a parent view reference's configuration — used to cascade values (for example, a label override) down into a reused view.

**Signature:**

```typescript
getInheritedProps(): Record<string, unknown>
```

**Example:**

```typescript
const parentProps = getPConnect().getInheritedProps();
const label = parentProps.label ?? defaultLabel;
```

---

## `setInheritedProp(propName, value)`

**Purpose:** Sets a single inherited prop that propagates to the component and all of its children.

**Signature:**

```typescript
setInheritedProp(propName: string, value: unknown): void
```

**Example:**

```typescript
pConn.setInheritedProp('displayMode', 'DISPLAY_ONLY');
```

---

## `setInheritedConfig(rawConfig)`

**Purpose:** Merges select configuration fields (for example, `readOnly`, `displayMode`, `hideLabel`) into the component's inherited configuration.

**Signature:**

```typescript
setInheritedConfig(rawConfig: Record<string, unknown>): void
```

**Example:**

```typescript
childPConn.setInheritedConfig({ readOnly: true, displayMode: null });
```

---

## `getValue(prop, pageReference?)`

**Purpose:** Resolves and returns a property's current value from the application state, relative to the component's (or a given) page reference.

**Signature:**

```typescript
getValue(prop: string, pageReference?: string): unknown
```

**Example:**

```typescript
const firstName = pConn.getValue('.FirstName');
```

**Notes:** This is one of the most commonly used PConnect APIs — nearly every field-reading component uses it.

---

## `setValue(prop, value, initialValue?, isImplicit?, options?)`

**Purpose:** Writes a value to a property in the application state.

**Signature:**

```typescript
setValue(
  prop: string,
  value: { [key: string]: any } | undefined,
  initialValue?: string,
  isImplicit?: boolean,
  options?: { isArrayDeepMerge?: boolean }
): void
```

**Example:**

```typescript
pConn.setValue('.FirstName', 'Jane' as unknown as { [key: string]: any });
```

**Notes:** The 5.1.0 typedefs type `value` as `{ [key: string]: any } | undefined`, even though the typedef's own example passes a string; a primitive therefore needs a cast to compile (as in the example above). For field-editing components, prefer `pConn.getActionsApi().updateFieldValue()` or `triggerFieldChange()`, which also handle message clearing and validation — see [pconnect-actions-api.md](./pconnect-actions-api.md).

---

## `replaceState(prop, value, options?)`

**Purpose:** Fully replaces (rather than merges) the state value at a given property or page path.

**Signature:**

```typescript
replaceState(prop: string, value: unknown, options?: { skipDirtyValidation?: boolean }): void
```

**Example:**

```typescript
pConn.replaceState('.Address', { Country: 'US', State: 'MA' });
```

---

## `updateState(dataObject)`

**Purpose:** Deep-merges a data object into the store at the component's root page reference.

**Signature:**

```typescript
updateState(dataObject: Record<string, unknown>): void
```

**Example:**

```typescript
const response = await fetchRelatedData();
pConn.updateState({ relatedRecords: response.data });
```

---

## `resolveDatasourceReference(datasourceRef)`

**Purpose:** Resolves a data-page-backed reference (for example, `D_MyDataPage`) against the current context's cached list summaries.

**Signature:**

```typescript
resolveDatasourceReference(datasourceRef: string): unknown
```

**Example:**

```typescript
const resolvedReference = pConn.resolveDatasourceReference('D_MyDataPage');
```

---

## `getCurrentClassID()`

**Purpose:** Returns the class ID (Pega class name) for the component's current context.

**Signature:**

```typescript
getCurrentClassID(): string
```

**Example:**

```typescript
const classID = pConn.getCurrentClassID();
```
