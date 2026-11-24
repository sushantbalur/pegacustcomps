# ListActions

> Part of the [PCore / PConnect API Reference skills](../README.md). Obtained via `pConn.getListActions()`. Used by components that render and edit page-list (repeating) data — tables, lists, and embedded-data grids.

## `insert(payload, index, pageRef?, options?)`

**Purpose:** Inserts a new row into the referenced list at the given index.

**Signature:**

```typescript
insert(
  payload: object,
  index: number,
  pageRef?: string,
  options?: { skipStateUpdate?: boolean; insertIfEmpty?: boolean; skipDirtyValidation?: boolean }
): void
```

**Example:**

```typescript
pConn.getListActions().insert({ Name: 'New Employee' }, 0);
```

---

## `update(payload, index, options?)`

**Purpose:** Updates an existing row at the given index in the referenced list.

**Signature:**

```typescript
update(payload: object, index: number, options?: { pageRef?: string; skipStateUpdate?: boolean }): void
```

**Example:**

```typescript
pConn.getListActions().update({ Name: 'John', Experience: 2 }, 0);
```

---

## `updateProperty(propertyName, value, options?)`

**Purpose:** Updates a single field within a row of the referenced list (rather than the whole row).

**Signature:**

```typescript
updateProperty(
  propertyName: string | undefined,
  value: GenericObject | undefined,
  options?: { skipStateUpdate?: boolean; isArrayDeepMerge?: boolean; skipDirtyValidation?: boolean }
): void
```

**Example:**

```typescript
pConn.getListActions().updateProperty('.Name', 'John Doe' as unknown as GenericObject);
```

**Notes:** `GenericObject` is `Record<string, unknown>`. The 5.1.0 typedefs type `value` as `GenericObject | undefined`, even though the typedef's own example passes a string; a primitive therefore needs a cast to compile (as in the example above).

---

## `deleteEntry(index, pageRef?, options?)`

**Purpose:** Deletes the row at the given index in the referenced list.

**Signature:**

```typescript
deleteEntry(index: number, pageRef?: string, options?: { skipStateUpdate?: boolean }): void
```

**Example:**

```typescript
pConn.getListActions().deleteEntry(0);
```

---

## `reorder(fromIndex, toIndex)`

**Purpose:** Moves a row from one position to another within the referenced list.

**Signature:**

```typescript
reorder(fromIndex: number, toIndex: number): void
```

**Example:**

```typescript
pConn.getListActions().reorder(1, 0);
```

---

## `setSelectedRows(rows, options?)`

**Purpose:** Marks a set of rows as selected/deselected in application state.

**Signature:**

```typescript
setSelectedRows(rows: Record<string, unknown>[], options?: { skipPageInstructions: boolean }): Promise<void>
```

**Example:**

```typescript
await pConn.getListActions().setSelectedRows([{ $key: rowKey, $selected: true, Name: 'Alice' }]);
```

---

## `getSelectedRows(withPayload?)`

**Purpose:** Returns the currently selected rows in the referenced list.

**Signature:**

```typescript
getSelectedRows(withPayload?: boolean): Promise<string[] | object[]>
```

**Example:**

```typescript
const selectedRows = await pConn.getListActions().getSelectedRows(true);
```

**Notes:** When `withPayload` is `false` (the default), resolves to a `string[]` of the selected rows' unique keys; when `true`, resolves to an `object[]` of the full row data.

---

## `clearSelectedRows()`

**Purpose:** Deselects all currently selected rows.

**Signature:**

```typescript
clearSelectedRows(): Promise<void>
```

**Example:**

```typescript
await pConn.getListActions().clearSelectedRows();
```

---

## `setVisibility(isVisible)`

**Purpose:** Informs the framework whether the referenced editable list is currently mounted on screen, which controls whether page instructions are generated for it.

**Signature:**

```typescript
setVisibility(isVisible: boolean): void
```

**Example:**

```typescript
pConn.getListActions().setVisibility(true);
```

---

## `initDefaultPageInstructions(property, propertyNames, uniqueField?)`

**Purpose:** Registers update instructions for a list's existing (already-populated) rows, for fields that need to be included in the submit payload.

**Signature:**

```typescript
initDefaultPageInstructions(property: string, propertyNames: string[], uniqueField?: string): void
```

**Example:**

```typescript
pConn.getListActions().initDefaultPageInstructions('.Employees', ['pyGUID', 'pyName'], '.EmbedListUUID__');
```

---

## `deleteAll(property, options?)`

**Purpose:** Deletes every row from the referenced list.

**Signature:**

```typescript
deleteAll(property: string, options?: { skipStateUpdate?: boolean }): void
```

**Example:**

```typescript
pConn.getListActions().deleteAll('.ShippingAddress');
```

---

## `replacePage(property, payload, options?)`

**Purpose:** Replaces the data of an embedded page property, resetting its associated fields.

**Signature:**

```typescript
replacePage(property: string, payload: object, options?: { skipStateUpdate?: boolean }): void
```

**Example:**

```typescript
pConn.getListActions().replacePage('.ShippingAddress', { pyCountry: 'US' });
```

**Notes:** Commonly used for an address field when the country changes and dependent fields (state/province) must reset.

---

## `deletePage(property, options?)`

**Purpose:** Deletes an embedded page property.

**Signature:**

```typescript
deletePage(property: string, options?: { skipStateUpdate?: boolean }): void
```

**Example:**

```typescript
pConn.getListActions().deletePage('.ShippingAddress');
```
