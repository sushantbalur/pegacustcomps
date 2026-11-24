# PConnect: Utilities, Suggestions & Component Creation

> Part of the [PCore / PConnect API Reference skills](../README.md). Methods documented here are called on a `PConnect` instance (`pConn`), obtained via the `getPConnect()` prop passed to every component.

## `getDataObject(contextName?)`

**Purpose:** Returns the data of the current (or a specified) context.

**Signature:**

```typescript
getDataObject(contextName?: string): Record<string, unknown>
```

**Example:**

```typescript
const { pyPortal } = pConn.getDataObject();
```

---

## `getImagePath(imageName)`

**Purpose:** Returns the resolved URL path for a given image name.

**Signature:**

```typescript
getImagePath(imageName: string): string
```

**Example:**

```typescript
const avatarUrl = pConn.getImagePath(imageKey);
```

---

## `getGoogleMapsAPIKey()`

**Purpose:** Returns the configured Google Maps API key, for use by map-rendering components.

**Signature:**

```typescript
getGoogleMapsAPIKey(): string
```

**Example:**

```typescript
const apiKey = pConn.getGoogleMapsAPIKey();
```

---

## `getServerURL()`

**Purpose:** Returns the server base URL — useful for resolving absolute paths for server-relative resources (for example, embedded images in rich text).

**Signature:**

```typescript
getServerURL(): string
```

**Example:**

```typescript
const absoluteUrl = `${pConn.getServerURL()}/${relativeImagePath}`;
```

---

## `reportError(errorMsg, errorObj, context?)`

**Purpose:** Reports an error so infrastructure-level error handling can pick it up.

**Signature:**

```typescript
reportError(errorMsg: string, errorObj: unknown, context?: string): void
```

**Example:**

```typescript
pConn.reportError('Failed to load related data', { cause: error });
```

---

## `clearErrorMessages(errorMsgConfig)`

**Purpose:** Clears error messages associated with a specific property or context.

**Signature:**

```typescript
clearErrorMessages(errorMsgConfig: { category?: string; context?: string; property: string; subType?: string }): void
```

**Example:**

```typescript
pConn.clearErrorMessages({ property: pConn.getPropertyName() });
```

---

## `skipRequiredValidation()`

**Purpose:** Returns whether required-field validation should be skipped for the current component (for example, when it is being rendered as part of a bulk action).

**Signature:**

```typescript
skipRequiredValidation(): boolean | undefined
```

**Example:**

```typescript
if (!pConn.skipRequiredValidation() && isFieldEmpty) {
  // enforce required validation
}
```

---

## `isBulkAction()`

**Purpose:** Returns whether the current component is being rendered in the context of a bulk action.

**Signature:**

```typescript
isBulkAction(): boolean | undefined
```

**Example:**

```typescript
if (pConn.isBulkAction()) {
  // adjust rendering/validation for bulk-processed rows
}
```

---

## `acceptSuggestion(target)`

**Purpose:** Accepts the value held in the Suggestions Context for a field.

**Signature:**

```typescript
acceptSuggestion(target: string): void
```

**Example:**

```typescript
pConn.acceptSuggestion('.Property1');
```

---

## `ignoreSuggestion(target?)`

**Purpose:** Discards the value held in the Suggestions Context for a field.

**Signature:**

```typescript
ignoreSuggestion(target?: string): void
```

**Example:**

```typescript
pConn.ignoreSuggestion();
```

---

## `createComponent(componentMeta, dataSource?, index?, additionalPropsToComp?)`

**Purpose:** Creates a new component instance from raw metadata, resolving its properties and context — used to render nested/child components from configuration.

**Signature:**

```typescript
createComponent(
  componentMeta: { type: string; config?: Record<string, unknown> },
  dataSource?: string,
  index?: number,
  additionalPropsToComp?: Record<string, unknown>
): unknown
```

**Example:**

```typescript
const childComponent = pConn.createComponent({
  type: 'TextInput',
  config: { label: 'Comment', value: `.Comments[${index}].Text` }
});
```

**Notes:** When `dataSource` is provided, `index` selects the row within that list's page reference.

---

## `setPageValue(sourcePage, target, isPerform)`

**Purpose:** Sets an embedded page object onto a target property.

**Signature:**

```typescript
setPageValue(sourcePage: Record<string, unknown>, target: string, isPerform: boolean): void
```

**Example:**

```typescript
pConn.setPageValue(selectedRecord, targetProperty, true);
```
