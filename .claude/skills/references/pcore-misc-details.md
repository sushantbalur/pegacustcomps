# Forms, Autosave, Mashup Bridge & Asset Loading — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-misc-utilities.md](./pcore-misc-utilities.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.
>
> `AssetLoader` is a curated subset — most of its methods are internal component-config-loading plumbing used by the framework's own bootstrap process.

## AsynchronousUtils (via `PCore.getAsynchronousUtils()`)

| Method                       | Signature                              | Purpose                                                                     |
| ---------------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| `getDebouncedSubject(delay)` | `(delay: number): Observable<unknown>` | Returns a new Observable that yields values after the given debounce delay. |

**Example:**

```typescript
const debouncedSubject = PCore.getAsynchronousUtils().getDebouncedSubject(200);
const subscription = debouncedSubject.subscribe((value) => {
  // react to the debounced value
});
```

---

## ErrorHandler (via `PCore.getErrorHandler()`)

| Method                             | Signature                 | Purpose                                                                     |
| ---------------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `getGenericFailedMessage()`        | `(): string`              | Returns the generic failure message shown when a component fails to render. |
| `setGenericFailedMessage(message)` | `(message: string): void` | Sets a custom generic failure message.                                      |

**Example:**

```typescript
PCore.getErrorHandler().setGenericFailedMessage('Something went wrong. Please try again.');
```

---

## FormUtils (via `PCore.getFormUtils()`)

| Method                                   | Signature                                                                                              | Purpose                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `getChanges(context)`                    | `(context: string): unknown`                                                                           | Returns the changed data for a given container's context.             |
| `getSubmitData(context, options?)`       | `(context: string, options?: { includeDisabledFields?: boolean; onlyChangedData?: boolean }): unknown` | Returns the submittable data for a context.                           |
| `isStateModified(context)`               | `(context: string \| null \| undefined): boolean`                                                      | Returns whether state has been modified for a context.                |
| `isFormValid(context, pageReference?)`   | `(context: string, pageReference?: string): boolean`                                                   | Checks whether a form is valid based on its fields' validation state. |
| `getEditableFields(context)`             | `(context: string): unknown[]`                                                                         | Returns the editable fields for a context.                            |
| `clearChangedProperties(context)`        | `(context: string): void`                                                                              | Clears the tracked changed-properties list for a context.             |
| `resetComplexObjectDirtyStatus(context)` | `(context: string): void`                                                                              | Resets the dirty-status flag for a complex object context.            |
| `setCustomValidator(type, validatorFn)`  | `(type: string, validatorFn: Function): void`                                                          | Registers a custom validator function by type.                        |

**Example:**

```typescript
const changedFields = PCore.getFormUtils().getChanges(context);
const isValid = PCore.getFormUtils().isFormValid(context);
```

---

## AutosaveUtils (via `PCore.getAutosaveUtils()`)

| Method                                        | Signature                                                            | Purpose                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `isAutosaveEnabledForContext(context)`        | `(context: string): boolean`                                         | Returns whether autosave is active for a context.                       |
| `subscribeAutosaveStatus(itemKey, callback)`  | `(itemKey: string, callback: (status: unknown) => void): () => void` | Subscribes to autosave status changes; returns an unsubscribe function. |
| `notifyChange(context, propReference, value)` | `(context: string, propReference: string, value: string): void`      | Notifies the autosave engine that the user is actively editing.         |

**Example:**

```typescript
const unsubscribe = PCore.getAutosaveUtils().subscribeAutosaveStatus(itemKey, (status) => {
  // react to autosave status changes
});
```

---

## MashupBridge (via `PCore.getMashupBridge()`)

`PCore.getMashupBridge()` returns the mashup-bridge module namespace, not the bridge instance directly — the methods are on its `mashup` property.

| Method                           | Signature                                                         | Purpose                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `mashup.init(initParams)`        | `(initParams: { resizing: string; parentOrigin?: string }): void` | Initializes the mashup bridge with resize configuration. Called once by the framework during bootstrap. |
| `mashup.send(actionInfo)`        | `(actionInfo: { action: string; message: unknown }): void`        | Sends a message to the parent host window.                                                              |
| `mashup.onMessage(messageEvent)` | `(messageEvent: MessageEvent): boolean`                           | Handles an inbound message from the parent window.                                                      |
| `mashup.getMessageHandler()`     | `(): (event: MessageEvent) => boolean`                            | Returns the bound message handler for event listener registration.                                      |

**Example:**

```typescript
const { mashup } = PCore.getMashupBridge();
window.addEventListener('message', mashup.getMessageHandler());
```

**Notes:** The framework already registers this listener internally on load — most component authors never need to call these directly.

---

## ConfirmDialogService (via `PCore.getConfirmDialogService()`)

| Method                             | Signature                                                 | Purpose                                                                                                |
| ---------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `registerConfirmHandler(handler?)` | `(handler?: (message: string) => Promise<boolean>): void` | Registers (or clears) the confirmation-dialog handler.                                                 |
| `confirm(message)`                 | `(message: string): Promise<boolean>`                     | Shows the confirmation dialog, falling back to the native browser confirm if no handler is registered. |

**Example:**

```typescript
PCore.getConfirmDialogService().registerConfirmHandler((message) => showCustomConfirmDialog(message));
```

---

## FieldUtils (via `PCore.getFieldUtils()`)

| Method                               | Signature                         | Purpose                                                                                                                                                                   |
| ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formatPageReference(referenceList)` | `(referenceList: string): string` | Converts an array-notation page reference (for example `.Questionsets[0].Questions`) into the Pega-specific format (`.Questionsets(1).Questions`) expected by the DX API. |

**Example:**

```typescript
const formattedRef = PCore.getFieldUtils().formatPageReference('.Questionsets[0].Questions');
// returns '.Questionsets(1).Questions'
```

---

## FieldDefaultUtils (via `PCore.getFieldDefaultUtils()`)

| Member                              | Signature                                           | Purpose                                                                                                                               |
| ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fieldDefaults`                     | `{ [fieldType: string]: unknown }`                  | Public property holding the current field-default configuration, keyed by component type. Read directly rather than through a getter. |
| `getDefaultsforType(type)`          | `(type: string): unknown`                           | Returns the default formats/styles configured for a component type (equivalent to `fieldDefaults[type]`).                             |
| `setFieldDefault(type, key, value)` | `(type: string, key: string, value: unknown): void` | Sets a single field-default value for a component type.                                                                               |
| `updateFieldDefaults(configs)`      | `(configs: unknown): void`                          | Merges new field-default configurations.                                                                                              |

**Example:**

```typescript
const { allowImplicitRefresh } = PCore.getFieldDefaultUtils().fieldDefaults.DataReference || {};
```

---

## AnnotationUtils (via `PCore.getAnnotationUtils()`)

| Method                   | Signature                  | Purpose                                                                                                         |
| ------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getPropertyName(value)` | `(value: string): string`  | Returns the literal property name from an annotated property (for example, `'@P .pyName'` returns `'.pyName'`). |
| `isProperty(value)`      | `(value: string): boolean` | Returns whether the given value is an annotated property.                                                       |

**Example:**

```typescript
if (PCore.getAnnotationUtils().isProperty(rawValue)) {
  const propertyName = PCore.getAnnotationUtils().getPropertyName(rawValue);
}
```

---

## AssetLoader (via `PCore.getAssetLoader()`)

| Method                                       | Signature                                                    | Purpose                                                                 |
| -------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `getStaticServerUrl()`                       | `(): string \| null`                                         | Returns the static-content server URL for Pega assets.                  |
| `getConstellationServiceUrl()`               | `(): string \| null`                                         | Returns the Constellation service URL.                                  |
| `getAppAlias()`                              | `(): string`                                                 | Returns the application alias used for asset loading.                   |
| `getSvcComponentsConfig(criteria, options?)` | `(criteria: unknown[], options?: unknown): Promise<unknown>` | Fetches a component's configuration matching the given search criteria. |
| `getSvcImage(key)`                           | `(key: string): Promise<Blob \| undefined>`                  | Fetches an image asset by key.                                          |
| `getSvcImageUrl(key)`                        | `(key: string): Promise<string \| Blob \| null>`             | Fetches an image asset as a blob URL.                                   |
| `getSvcLocale(locale, key)`                  | `(locale: string, key: string): Promise<Response>`           | Fetches a localization bundle for a given locale.                       |
| `register(name, loaderFn)`                   | `(name: string, loaderFn: Function): void`                   | Registers a custom asset-loader function.                               |
| `getLoader(name?)`                           | `(name?: string): Function`                                  | Returns a registered loader (or the default loader).                    |
| `loadAssets(assets, options)`                | `(assets: unknown[], options: unknown): Promise<unknown[]>`  | Loads a set of asset dependencies and injects them into the document.   |

**Example:**

```typescript
const serviceUrl = PCore.getAssetLoader().getConstellationServiceUrl();
```

---

## NavigationUtils (via `PCore.getNavigationUtils()`)

| Method                                    | Signature                                                | Purpose                                               |
| ----------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| `getComponentState(key, options?)`        | `(key: string, options?: unknown): unknown`              | Reads a component's persisted navigation state.       |
| `setComponentState(key, state, options?)` | `(key: string, state: unknown, options?: unknown): void` | Writes a component's navigation state.                |
| `removeComponentState(key, options?)`     | `(key: string, options?: unknown): void`                 | Removes a component's persisted navigation state.     |
| `getUserSettings(path)`                   | `(path: string): unknown`                                | Reads a value from the operator's user settings.      |
| `setUserSettings(path, value)`            | `(path: string, value: string): Promise<void>`           | Updates a value in the operator's user settings.      |
| `getComponentCache(key)`                  | `(key: string): unknown`                                 | Reads a value from the in-memory component cache.     |
| `setComponentCache(key, value, options?)` | `(key: string, value: unknown, options?: unknown): void` | Writes a value to the in-memory component cache.      |
| `resetComponentCache(key)`                | `(key: string): boolean`                                 | Removes a key from the in-memory component cache.     |
| `getURLParam(key, decode)`                | `(key: string, decode: boolean): string \| null`         | Reads a query parameter from the current URL.         |
| `setURLParam(key, value, encode?)`        | `(key: string, value: string, encode?: boolean): void`   | Sets or updates a query parameter in the current URL. |

**Example:**

```typescript
const savedState = PCore.getNavigationUtils().getComponentState(key, { managed: true });
```
