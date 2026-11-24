# PCore: Constants, Behavior Overrides & Misc Utilities

> Part of the [PCore / PConnect API Reference skills](../README.md). See [pcore-misc-details.md](./pcore-misc-details.md) for the full method catalogs of the objects these accessors return.

## `getConstants()`

**Purpose:** Returns the frozen (read-only) public constants object used throughout the application (for example, `CASE_INFO`, `PUB_SUB_EVENTS`, `MESSAGES`).

**Signature:**

```typescript
getConstants(): Readonly<Constants>
```

**Example:**

```typescript
const { CASE_INFO, MODAL } = PCore.getConstants();
```

**Notes:** The returned object is frozen — read from it, never mutate it.

---

## `getResolvedConstantValue(key)`

**Purpose:** Resolves the actual value for a logical constant key.

**Signature:**

```typescript
getResolvedConstantValue(key: string): unknown
```

**Example:**

```typescript
const resolvedPath = PCore.getResolvedConstantValue(PCore.getConstants().CASE_INFO.CASE_INFO_CONTENT);
```

**Notes:** Pass the constant's logical value (for example, `CASE_INFO.CASE_INFO_CONTENT`), not the constant's key name.

---

## `setBehaviorOverrides(overridesObj)`

**Purpose:** Replaces the entire behavior-overrides object used to toggle default runtime behaviors.

**Signature:**

```typescript
setBehaviorOverrides(overridesObj: { [key: string]: boolean }): void
```

**Example:**

```typescript
PCore.setBehaviorOverrides({ dynamicLoadComponents: false });
```

**Notes:** This **replaces** all existing overrides. To add/update a single flag without affecting others, use `setBehaviorOverride`.

---

## `setBehaviorOverride(overrideKey, overrideValue)`

**Purpose:** Adds or updates a single behavior-override flag without affecting other existing keys.

**Signature:**

```typescript
setBehaviorOverride(overrideKey: string, overrideValue: boolean): void
```

**Example:**

```typescript
PCore.setBehaviorOverride('dynamicSemanticUrl', true);
```

---

## `getBehaviorOverrides()`

**Purpose:** Returns the current object of all behavior overrides.

**Signature:**

```typescript
getBehaviorOverrides(): { [key: string]: boolean }
```

**Example:**

```typescript
const overrides = PCore.getBehaviorOverrides();
```

---

## `getBehaviorOverride(theOverride)`

**Purpose:** Returns the current value of a single behavior-override flag; `undefined` if it hasn't been set.

**Signature:**

```typescript
getBehaviorOverride(theOverride: string): boolean | undefined
```

**Example:**

```typescript
if (PCore.getBehaviorOverride('dynamicLoadComponents') === false) {
  // skip dynamic component loading
}
```

---

## `getAsynchronousUtils()`

**Purpose:** Utility APIs for asynchronous operations using Observable (RxJS) patterns.

**Signature:**

```typescript
getAsynchronousUtils(): AsynchronousUtils
```

**Example:**

```typescript
const debouncedSubject = PCore.getAsynchronousUtils().getDebouncedSubject(300);
debouncedSubject.subscribe((value) => {
  // react to the debounced value
});
```

---

## `getErrorHandler()`

**Purpose:** APIs to get/set the generic failure message shown when a component fails to render.

**Signature:**

```typescript
getErrorHandler(): ErrorHandler
```

**Example:**

```typescript
const genericErrorMessage = PCore.getErrorHandler().getGenericFailedMessage();
```

---

## `getFormUtils()`

**Purpose:** Form-related operations, such as reading changed fields for a given context.

**Signature:**

```typescript
getFormUtils(): FormUtils
```

**Example:**

```typescript
const changedFields = PCore.getFormUtils().getChanges(context);
```

---

## `getAutosaveUtils()`

**Purpose:** Autosave utility APIs: status subscription, context registration checks, and activity notification.

**Signature:**

```typescript
getAutosaveUtils(): AutosaveUtils
```

**Example:**

```typescript
const autosaveUtils = PCore.getAutosaveUtils();
const isAutosaveEnabled = autosaveUtils.isAutosaveEnabledForContext(context);
```

---

## `getMashupBridge()`

**Purpose:** Utility APIs for mashup (Web Embed) related operations.

**Signature:**

```typescript
getMashupBridge(): MashupBridge
```

**Example:**

```typescript
const mashupBridge = PCore.getMashupBridge();
```

---

## `getConfirmDialogService()`

**Purpose:** Manages the confirmation dialog shown when orchestration requires user confirmation (for example, navigating away from unsaved changes).

**Signature:**

```typescript
getConfirmDialogService(): ConfirmDialogService
```

**Example:**

```typescript
PCore.getConfirmDialogService().registerConfirmHandler((message) => {
  return showCustomConfirmDialog(message);
});
```

**Notes:** Register a custom handler so a Constellation UI dialog is used instead of the browser's native `window.confirm`.

---

## `getFieldUtils()`

**Purpose:** Utility APIs for field-related operations, such as formatting page references.

**Signature:**

```typescript
getFieldUtils(): FieldUtils
```

**Example:**

```typescript
const formattedRef = PCore.getFieldUtils().formatPageReference(pageReference);
```

---

## `getFieldDefaultUtils()`

**Purpose:** APIs for reading field-default configuration.

**Signature:**

```typescript
getFieldDefaultUtils(): FieldDefaultUtils
```

**Example:**

```typescript
const { allowImplicitRefresh } = PCore.getFieldDefaultUtils().fieldDefaults.DataReference || {};
```

---

## `getAnnotationUtils()`

**Purpose:** Utility APIs to detect and parse property annotations (for example, `@P` property references).

**Signature:**

```typescript
getAnnotationUtils(): AnnotationUtils
```

**Example:**

```typescript
if (PCore.getAnnotationUtils().isProperty(rawValue)) {
  const propertyName = PCore.getAnnotationUtils().getPropertyName(rawValue);
}
```

---

## `getAssetLoader()`

**Purpose:** Asset-loading utility APIs, including resolving static asset URLs and dynamically loading assets.

**Signature:**

```typescript
getAssetLoader(): AssetLoader
```

**Example:**

```typescript
PCore.getAssetLoader().getLoader('component-loader')([componentName]);
```

---

## `getNavigationUtils()`

**Purpose:** APIs for reading and writing per-component navigation state, URL params, and user settings.

**Signature:**

```typescript
getNavigationUtils(): NavigationUtils
```

**Example:**

```typescript
const savedState = PCore.getNavigationUtils().getComponentState(key, { managed: true });
```
