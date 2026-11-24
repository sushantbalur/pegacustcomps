# REST Client, Data APIs & Cascade — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-rest-data-messaging.md](./pcore-rest-data-messaging.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.
>
> Curated subset — internal query-building helpers used only by `fetchData()`'s own pipeline are omitted.

## RestClient (via `PCore.getRestClient()`)

| Method                                                 | Signature                                                                                      | Purpose                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `invokeRestApi(routeKey, payload, context?, options?)` | `(routeKey: string, payload: unknown, context?: string, options?: unknown): Promise<unknown>`  | Invokes a Pega REST API by route key.                             |
| `invokeCustomRestApi(endpointUrl, config, context)`    | `(endpointUrl: string, config: unknown, context: string): Promise<unknown>`                    | Invokes a custom REST API by absolute or relative URL.            |
| `getCancelTokenSource()`                               | `(): { token: AbortSignal; cancel: () => void }`                                               | Returns a cancel token source to cancel an in-flight request.     |
| `isRequestCanceled(err)`                               | `(err: unknown): boolean`                                                                      | Checks whether a caught error was caused by request cancellation. |
| `getHeaderProcessor()`                                 | `(): { registerHeader: Function; unRegisterHeader: Function; getRegisteredHeaders: Function }` | Manages custom headers applied to outgoing requests.              |
| `getCaseApi()`                                         | `(): unknown`                                                                                  | Returns lower-level case-related REST operations.                 |

**Example:**

```typescript
const { invokeRestApi, getCancelTokenSource, isRequestCanceled } = PCore.getRestClient();
const cancelTokenSource = getCancelTokenSource();

invokeRestApi('D_MyDataPage', { cancelTokenSource }).catch((error) => {
  if (isRequestCanceled(error)) {
    // ignore — request was canceled
  }
});
```

---

## DataApi (via `PCore.getDataApi()`)

| Method                                          | Signature                                                                          | Purpose                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `DataApi.init(config, context?)`                | `(config: unknown, context?: string): Promise<DataApi>`                            | Static factory — creates and caches a `DataApi` instance for a data source. |
| `DataApi.clearContextedCache(context)`          | `(context: string): void`                                                          | Static — clears cached `DataApi` instances for a context.                   |
| `fetchData(searchText?, isPaginated?, config?)` | `(searchText?: string, isPaginated?: boolean, config?: unknown): Promise<unknown>` | Fetches data with optional pagination and caching.                          |
| `getData(searchText, config?)`                  | `(searchText: string, config?: unknown): Promise<unknown>`                         | Fetches data matching search text (queryable or non-queryable).             |
| `registerForBufferedCall(params)`               | `(params: { waitTime?: number; maxSize?: number }): this`                          | Configures batched/debounced fetches for typeahead-style fields.            |
| `isValidDatasource()`                           | `(): boolean`                                                                      | Returns whether a valid data source is configured.                          |

**Example:**

```typescript
PCore.getDataApi()
  .init(dataConfig, contextName)
  .then((dataApiInstance) => {
    dataApiInstance.registerForBufferedCall({ waitTime: 50 });
    return dataApiInstance.fetchData(searchTerm);
  });
```

**Notes:** For most list/data-page lookups, prefer the simpler `PCore.getDataApiUtils()` or `PCore.getDataPageUtils()` — reach for a live `DataApi` instance only when you need buffered/typeahead behavior.

---

## DataApiUtils (via `PCore.getDataApiUtils()`)

| Method                                                                             | Signature                                                                                                             | Purpose                                                                          |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `getData(dataViewName, payload?, context?, options?)`                              | `(dataViewName: string, payload?: unknown, context?: string, options?: unknown): Promise<unknown>`                    | Fetches list data from a data view with columns, filters, and paging.            |
| `getListDataView(dataViewName, payload?, context?, options?)`                      | same shape as `getData`                                                                                               | Alias for `getData`.                                                             |
| `getListCount(dataViewName, payload?, context?)`                                   | `(dataViewName: string, payload?: unknown, context?: string): Promise<unknown>`                                       | Returns the count of records matching a query.                                   |
| `getDataObjectView(dataViewName, viewName, params, context, options?)`             | `(dataViewName: string, viewName: string, params: unknown, context: string, options?: unknown): Promise<unknown>`     | Retrieves a structured view object initialized with data view parameters.        |
| `getDataViewMetadata(dataViewName, context, associationFilter?, propertyFilter?)` | `(dataViewName: string, context: string \| undefined, associationFilter?: string[] \| null, propertyFilter?: string[]): Promise<unknown>` | Retrieves metadata (fields, `isQueryable`) for a data view.                      |
| `moveListRecords(payload, context)`                                                | `(payload: unknown, context: string): Promise<{ pyStatus: string }>`                                                  | Moves/reorders records within a list.                                            |
| `getCaseEditMetadata(caseID, context)`                                             | `(caseID: string, context: string): Promise<unknown>`                                                                 | _Deprecated._ Fetches case edit metadata.                                        |
| `getCaseEditLock(caseID, context)`                                                 | `(caseID: string, context: string): Promise<unknown>`                                                                 | _Deprecated._ Acquires an exclusive edit lock on a case.                         |
| `updateCaseEditFieldsData(caseID, changeSet, eTag, context)`                       | `(caseID: string, changeSet: unknown, eTag: string, context: string): Promise<unknown>`                               | _Deprecated._ Updates case field data (requires an eTag from `getCaseEditLock`). |

**Example:**

```typescript
const { data } = await PCore.getDataApiUtils().getData('D_MyDataPage', { paging: { pageSize: 20 } }, context);
```

---

## DataPageUtils (via `PCore.getDataPageUtils()`)

| Method                                                                                               | Signature                                           | Purpose                                                                       |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| `getDataAsync(dataPageName, context, parameters?, paging?, query?, options?)`                         | `(...): Promise<unknown>`                           | Fetches list-type data page results with caching, query, and pagination.      |
| `getPageDataAsync(dataPageName, context?, parameters?, options?)`                                    | `(...): Promise<unknown>`                           | Fetches page-type (single-object) data page results.                          |
| `subscribeToDataPageUpdates(subscriptionId, callback, dataPageName, parameters?)`                    | `(...): boolean`                                    | Subscribes to server push notifications when a data page updates.             |
| `unsubscribeToDataPageUpdates(subscriptionId, dataPageName, parameters?)`                            | `(...): boolean`                                    | Unsubscribes from data page update notifications.                             |
| `subscribeToUpdate(dataPageName, dependentFields, context, pageReference, callback, subscriptionId)` | `(...): void`                                       | Subscribes to cascading updates when dependent fields change.                 |
| `unsubscribe(dataPageName, dependentFields, context, pageReference, subscriptionId)`                 | `(...): void`                                       | Unsubscribes from cascading field-change notifications.                       |
| `markDataInstanceDirty(dataPageName, parameters)`                                                    | `(dataPageName: string, parameters: unknown): void` | Marks a cached data page instance as stale, forcing a refresh on next fetch.  |
| `isDataPage(propertyRef?)`                                                                           | `(propertyRef?: string): boolean`                   | Returns whether a property reference is a data page (`D_`/`Declare_` prefix). |
| `updateDataPageStore(sharedDataPages?)`                                                              | `(sharedDataPages?: unknown): void`                 | Merges server-pushed shared data page updates into application state.         |

**Example:**

```typescript
const response = await PCore.getDataPageUtils().getPageDataAsync(
  'D_MyDataPage',
  context,
  { AccountID: accountId },
  { invalidateCache: true }
);
```

---

## DataTypeUtils (via `PCore.getDataTypeUtils()`)

| Method                             | Signature                           | Purpose                                                             |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `getSavableDataPage(dataClass)`    | `(dataClass: string): string`       | Returns the default save data page for a data class.                |
| `getLookUpDataPage(dataClass)`     | `(dataClass: string): string`       | Returns the default record-lookup data page for a data class.       |
| `getLookUpDataPageInfo(dataClass)` | `(dataClass: string): unknown`      | Returns metadata for the lookup data page (key mapping, and so on). |
| `getDataPageKeys(dataPageName)`    | `(dataPageName: string): unknown[]` | Returns the key definitions for a data page.                        |

**Example:**

```typescript
const lookupDataPage = PCore.getDataTypeUtils().getLookUpDataPage(classID);
```

---

## CascadeManager (via `PCore.getCascadeManager()`)

| Method                                                                                        | Signature     | Purpose                                                                |
| --------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `registerFields(context, pageReference, fields, callback, subscriberId)`                      | `(...): void` | Registers fields so a callback runs when their values change.          |
| `unRegisterFields(context, pageReference, fields, subscriberId)`                              | `(...): void` | Unregisters previously registered fields.                              |
| `registerListField(context, pageReference, listField, callback, subscriberId)`                | `(...): void` | Registers a page-list field and its parameter dependencies.            |
| `unRegisterListField(context, pageReference, listField, subscriberId)`                        | `(...): void` | Unregisters a page-list field registration.                            |
| `registerResetDependencies(context, pageReference, target, dependentProps, fieldType, mode?)` | `(...): void` | Registers a target field to be reset when dependent properties change. |
| `deregisterResetDependencies(context, pageReference, target, dependentProps, fieldType)`      | `(...): void` | Deregisters a reset-dependency registration.                           |

**Example:**

```typescript
useEffect(() => {
  PCore.getCascadeManager().registerFields(contextID, '', dependentProps, onDependentPropsChange, subscriberId);
  return () => {
    PCore.getCascadeManager().unRegisterFields(contextID, '', dependentProps, subscriberId);
  };
}, []);
```

---

## MashupApi (via `PCore.getMashupApi()`)

| Method                                                    | Signature                                                                                            | Purpose                                                          |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `openCase(caseId, targetContext?, options?)`              | `(caseId: string, targetContext?: string, options?: unknown): Promise<unknown>`                      | Loads and displays a case by ID in a target container.           |
| `createCase(className, targetContext?, options?)`         | `(className: string, targetContext?: string, options?: unknown): Promise<unknown>`                   | Creates and displays a new case in a target container.           |
| `getNextWork(targetContext?, options?)`                   | `(targetContext?: string, options?: unknown): Promise<unknown>`                                      | Retrieves and displays the user's highest-priority assignment.   |
| `openAssignment(assignmentId, targetContext?, options?)`  | `(assignmentId: string, targetContext?: string, options?: unknown): Promise<unknown>`                | Loads and displays an assignment by ID.                          |
| `openPage(pageName, className, targetContext?, options?)` | `(pageName: string, className: string, targetContext?: string, options?: unknown): Promise<unknown>` | Opens a page view (not a case/assignment) in a target container. |
| `getCurrentContextAPI(pageReference, targetContext?)`     | `(pageReference: string, targetContext?: string): PConnect`                                          | Returns a `PConnect` object for a given page reference/context.  |

**Example:**

```typescript
await PCore.getMashupApi().openCase(caseHandle);
```
