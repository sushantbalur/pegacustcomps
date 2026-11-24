# PConnect: Page/View Reference, Context & Container, Component Information

> Part of the [PCore / PConnect API Reference skills](../README.md). Methods documented here are called on a `PConnect` instance (`pConn`), obtained via the `getPConnect()` prop passed to every component.

## `getPageReference()`

**Purpose:** Returns the state path where the current component's data is stored.

**Signature:**

```typescript
getPageReference(): string
```

**Example:**

```typescript
const pageReference = pConn.getPageReference();
```

**Notes:** Combine with `getContextName()` to fully resolve a value's location in application state.

---

## `getPropertyName()`

**Purpose:** Returns the property key configured on the component.

**Signature:**

```typescript
getPropertyName(): string
```

**Example:**

```typescript
const propertyName = pConn.getPropertyName();
```

---

## `getFullReference()`

**Purpose:** Combines the page reference and property name into a single fully-qualified property path.

**Signature:**

```typescript
getFullReference(): string
```

**Example:**

```typescript
const fullReference = pConn.getFullReference();
```

---

## `getCurrentView()`

**Purpose:** Returns the name of the view under which the current component was rendered.

**Signature:**

```typescript
getCurrentView(): string | undefined
```

**Example:**

```typescript
const isDashboardView = pConn.getCurrentView() === 'MyDashboardView';
```

---

## `getReferenceList()`

**Purpose:** Returns the reference list (bound page-list property) currently associated with the component.

**Signature:**

```typescript
getReferenceList(): string
```

**Example:**

```typescript
const referenceList = pConn.getReferenceList();
```

---

## `setReferenceList(ref)`

**Purpose:** Explicitly sets the reference list path used by the component.

**Signature:**

```typescript
setReferenceList(ref: string): void
```

**Example:**

```typescript
pConn.setReferenceList('.SelectedItems');
```

---

## `getReferencedView()`

**Purpose:** Returns the metadata of the view referenced by a component of type `reference`.

**Signature:**

```typescript
getReferencedView(): { type: string; config?: Record<string, unknown> } | undefined
```

**Example:**

```typescript
const viewMetadata = pConn.getReferencedView();
```

**Notes:** Only meaningful for components of type `reference`; returns `undefined` otherwise.

---

## `getReferencedViewPConnect(passOptions?)`

**Purpose:** Returns a wrapper (with `.getPConnect()`) for the view referenced by a `reference`-type component.

**Signature:**

```typescript
getReferencedViewPConnect(passOptions?: boolean): { getPConnect: () => PConnect }
```

**Example:**

```typescript
const referencedPConn = pConn.getReferencedViewPConnect().getPConnect();
```

**Notes:** Pass `passOptions = true` to propagate the reference's own options onto the referenced view's `PConnect`.

---

## `getContextName()`

**Purpose:** Returns the qualified context name under which the component is rendered (for example, `app/primary_1`).

**Signature:**

```typescript
getContextName(): string
```

**Example:**

```typescript
const contextName = pConn.getContextName();
```

---

## `getContainerName()`

**Purpose:** Returns the container name associated with the component (for example, `primary`).

**Signature:**

```typescript
getContainerName(): string
```

**Example:**

```typescript
const containerName = pConn.getContainerName();
```

---

## `getTarget()`

**Purpose:** Returns the fully qualified target container name (for example, `app/primary`).

**Signature:**

```typescript
getTarget(): string | undefined
```

**Example:**

```typescript
const target = pConn.getTarget();
```

---

## `isVisible()`

**Purpose:** Resolves the component's configured visibility (an expression or "when" condition).

**Signature:**

```typescript
isVisible(): boolean
```

**Example:**

```typescript
if (pConn.isVisible()) {
  renderField();
}
```

---

## `isReadOnly()`

**Purpose:** Returns whether the component's `readOnly` configuration is set.

**Signature:**

```typescript
isReadOnly(): boolean
```

**Example:**

```typescript
const readOnly = pConn.isReadOnly();
```

---

## `isReadOnlyField()`

**Purpose:** Checks whether the current field is read-only based on the referenced field's metadata (rather than the component's own `readOnly` config).

**Signature:**

```typescript
isReadOnlyField(): boolean
```

**Example:**

```typescript
const readOnlyField = pConn.isReadOnlyField();
```

**Notes:** Distinct from `isReadOnly()` — this reflects the underlying field's metadata (for example, an internal or class-key field), not just the component's own configuration.

---

## `isEditable()`

**Purpose:** Checks whether the component is editable, based on the presence of a bound value/selection and the absence of read-only/disabled conditions.

**Signature:**

```typescript
isEditable(): boolean
```

**Example:**

```typescript
const editable = pConn.isEditable();
```

---

## `getComponentName()`

**Purpose:** Returns the component's type name (for example, `TextInput`).

**Signature:**

```typescript
getComponentName(): string | undefined
```

**Example:**

```typescript
const componentType = pConn.getComponentName();
```

---

## `getRelativePath()`

**Purpose:** Returns the JSON path of the component relative to the root of its containing view metadata.

**Signature:**

```typescript
getRelativePath(): string
```

**Example:**

```typescript
const relativePath = pConn.getRelativePath();
```

---

## `hasChildren()`

**Purpose:** Checks whether the component has children configured in its metadata.

**Signature:**

```typescript
hasChildren(): boolean
```

**Example:**

```typescript
if (pConn.hasChildren()) {
  renderChildComponents();
}
```

---

## `isInsideList()`

**Purpose:** Checks whether the current component is rendered inside a repeating list/table row.

**Signature:**

```typescript
isInsideList(): boolean
```

**Example:**

```typescript
if (pConn.isInsideList()) {
  // adjust rendering for a row inside a repeating structure
}
```

---

## `getChildren()`

**Purpose:** Returns the list of child component wrappers for the current component.

**Signature:**

```typescript
getChildren(): { getPConnect: () => PConnect }[]
```

**Example:**

```typescript
const firstChildPConn = pConn.getChildren()[0]?.getPConnect();
```

---

## `getActions()`

**Purpose:** Returns the actions object (event-type to handler map) bound to the current component, typically spread onto its props.

**Signature:**

```typescript
getActions(): Record<string, (...args: unknown[]) => void>
```

**Example:**

```typescript
const actions = pConn.getActions();
```

---

## `setAction(eventType, handler)`

**Purpose:** Associates a handler function with an event type for the current component.

**Signature:**

```typescript
setAction(eventType: string, handler: (...args: unknown[]) => void): void
```

**Example:**

```typescript
pConn.setAction('click', () => {
  // handle click
});
```

---

## `getLocaleRuleName()`

**Purpose:** Returns the locale reference rule name used to localize this component's field values.

**Signature:**

```typescript
getLocaleRuleName(): string | undefined
```

**Example:**

```typescript
const localeRuleName = pConn.getLocaleRuleName();
```

---

## `getLocalizedValue(rawString, localePath?, localeRuleKey?)`

**Purpose:** Returns the localized value for a raw string.

**Signature:**

```typescript
getLocalizedValue(rawString: string, localePath?: string, localeRuleKey?: string): string
```

**Example:**

```typescript
const label = pConn.getLocalizedValue('Submit');
```

**Notes:** Deprecated in favor of `getLocalizationService(localeRuleKey, localePath).getLocalizedText(rawString)` — see below.

---

## `getLocalizationService(localeReference?)`

**Purpose:** Returns a `LocalizationService` instance used to resolve localized text.

**Signature:**

```typescript
getLocalizationService(localeReference?: string): LocalizationService
```

**Example:**

```typescript
const label = pConn.getLocalizationService().getLocalizedText('Submit');
```

**Notes:** See [pconnect-case-info-data-info-localization.md](./pconnect-case-info-data-info-localization.md) for the full `LocalizationService` method catalog.
