# State & Context Tree — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-store-context-state.md](./pcore-store-context-state.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.

## StateUtils (via `PCore.getStateUtils()`)

| Method                                       | Signature                                                                                                                                                                                        | Purpose                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `getSharedState(key)`                        | `(key: string): unknown`                                                                                                                                                                         | Reads a property value from shared application state.            |
| `setSharedState(key, value)`                 | `(key: string, value: unknown): void`                                                                                                                                                            | Writes a property value to shared application state.             |
| `updateState(context, key, value, options?)` | `(context: string, key: string, value: unknown, options?: { pageReference?: string; isArrayDeepMerge?: boolean; skipDirtyValidation?: boolean; removePropertyFromChangedList?: boolean }): void` | Updates a property value for a given context with merge options. |
| `getSuggestionsContext(context)`             | `(context: string): unknown`                                                                                                                                                                     | Returns the Suggestions Context entry point for a given context. |
| `triggerRefresh(context, pageReference)`     | `(context: string, pageReference: string): void`                                                                                                                                                 | Triggers a refresh of the assignment in the specified context.   |

**Example:**

```typescript
const stateUtils = PCore.getStateUtils();
stateUtils.updateState(context, 'caseInfo.ID', caseID, { skipDirtyValidation: true });
```

---

## ContextTreeManager (via `PCore.getContextTreeManager()`)

| Method                                                                  | Signature                                               | Purpose                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `onViewMutate(context, pageName, viewName, callback)`                   | `(...): void`                                           | Registers a callback for view-hierarchy mutations.            |
| `onPageListMutate(context, pageName, viewName, pageListName, callback)` | `(...): void`                                           | Registers a callback for page-list hierarchy mutations.       |
| `isFieldExists(context, propertyReference)`                             | `(context: string, propertyReference: string): boolean` | Checks whether a field is tracked in the context tree.        |
| `getFieldsList(context)`                                                | `(context: string): Map<string, unknown>`               | Returns all editable/calculated fields tracked for a context. |
| `getFieldReferencePreviousValue(context, propertyReference)`            | `(context: string, propertyReference: string): unknown` | Returns the previously stored value of a tracked field.       |

**Example:**

```typescript
const trackedFields = PCore.getContextTreeManager().getFieldsList(contextName);
```

**Notes:** This class primarily supports the framework's own refresh/validation tracking; most mutation methods (`mutateField`, `removeFieldNode`, and so on) are invoked internally as part of the component render lifecycle rather than called directly by component code.
