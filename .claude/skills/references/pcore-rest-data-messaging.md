# PCore: REST, Data & Messaging

> Part of the [PCore / PConnect API Reference skills](../README.md). See [pcore-rest-data-details.md](./pcore-rest-data-details.md) and [pcore-messaging-details.md](./pcore-messaging-details.md) for the full method catalogs of the objects these accessors return.

## `getRestClient()`

**Purpose:** Entry point to the REST client, exposing `invokeRestApi`, `getCancelTokenSource`, and `isRequestCanceled`.

**Signature:**

```typescript
getRestClient(): RestClient
```

**Example:**

```typescript
const { invokeRestApi, getCancelTokenSource, isRequestCanceled } = PCore.getRestClient();

const cancelTokenSource = getCancelTokenSource();
invokeRestApi('D_MyDataPage', { cancelTokenSource })
  .then((response) => {
    // handle response
  })
  .catch((error) => {
    if (isRequestCanceled(error)) {
      // request was canceled — ignore
    }
  });
```

---

## `getDataApi()`

**Purpose:** Creates a live `DataApi` instance for a datasource — used by components that need buffered/typeahead fetches (for example, an autocomplete field backed by a data page).

**Signature:**

```typescript
getDataApi(): DataApi
```

**Example:**

```typescript
PCore.getDataApi()
  .init(dataConfig, contextName)
  .then((dataApiInstance) => {
    dataApiInstance.registerForBufferedCall({ waitTime: 50 });
    dataApiInstance.fetchData(searchTerm).then((response) => {
      // handle response
    });
  });
```

**Notes:** `init()` returns a `Promise` that resolves to a `DataApi` instance scoped to the given context. Call `clearContextedCache(contextName)` when tearing down.

---

## `getDataApiUtils()`

**Purpose:** Utility APIs to retrieve information from a data view without managing a live `DataApi` instance.

**Signature:**

```typescript
getDataApiUtils(): DataApiUtils
```

**Example:**

```typescript
PCore.getDataApiUtils()
  .getDataViewMetadata(dataPageID, context, null, fieldIDs)
  .then(({ data }) => {
    // use resolved field metadata
  });
```

---

## `getDataPageUtils()`

**Purpose:** Utility methods to retrieve data page data (page-type or list-type), with optional cache control.

**Signature:**

```typescript
getDataPageUtils(): DataPageUtils
```

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

## `getDataTypeUtils()`

**Purpose:** Utility methods to retrieve information about a data type, such as its lookup data page or class keys.

**Signature:**

```typescript
getDataTypeUtils(): DataTypeUtils
```

**Example:**

```typescript
const lookupDataPage = PCore.getDataTypeUtils().getLookUpDataPage(classID);
```

---

## `getCascadeManager()`

**Purpose:** Registers a callback to run when a set of properties change — used to build cascading/dependent fields (for example, a country field that resets a state field).

**Signature:**

```typescript
getCascadeManager(): CascadeManager
```

**Example:**

```typescript
useEffect(() => {
  PCore.getCascadeManager().registerFields(contextID, '', dependentProps, onDependentPropsChange, subscriberId);

  return () => {
    PCore.getCascadeManager().unRegisterFields(contextID, '', dependentProps, subscriberId);
  };
}, []);
```

**Notes:** Always pair `registerFields` with a matching `unRegisterFields` on cleanup to avoid stale callbacks.

---

## `getMashupApi()`

**Purpose:** Provides APIs to work with cases and pages across a mashup/embedding boundary.

**Signature:**

```typescript
getMashupApi(): MashupApi
```

**Example:**

```typescript
PCore.getMashupApi().openCase(caseHandle);
```

---

## `getSemanticUrlUtils()`

**Purpose:** Utilities to build and resolve semantic URLs, including the constant names used for supported semantic-URL actions.

**Signature:**

```typescript
getSemanticUrlUtils(): SemanticUrlUtils
```

**Example:**

```typescript
const { ACTION_OPENWORKBYHANDLE, ACTION_SHOWDATA } = PCore.getSemanticUrlUtils().getActions();
```

---

## `getMessageManager()`

**Purpose:** Adds, reads, and clears case/validation messages stored in the application state.

**Signature:**

```typescript
getMessageManager(): MessageManager
```

**Example:**

```typescript
const { addMessages, clearMessages } = PCore.getMessageManager();

addMessages({
  messages: [{ type: 'error', message: 'Something went wrong' }],
  category: 'PAGE',
  context
});

clearMessages({ category: 'PAGE', context });
```

---

## `getPubSubUtils()`

**Purpose:** Entry point to the application-wide publish/subscribe event bus.

**Signature:**

```typescript
getPubSubUtils(): PubSubUtils
```

**Example:**

```typescript
const { subscribe, unsubscribe, publish } = PCore.getPubSubUtils();
const stageCreatedEvent = PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE;

subscribe(stageCreatedEvent, onStageCreated, 'stageCreatedHandler');
// later
unsubscribe(stageCreatedEvent, 'stageCreatedHandler');
```

---

## `getEvents()`

**Purpose:** Returns the catalog of case-related event names, intended for use as topics with `getPubSubUtils()`.

**Signature:**

```typescript
getEvents(): Events
```

**Example:**

```typescript
const caseCreated = PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE;
PCore.getPubSubUtils().subscribe(caseCreated, onStageCreated);
```

---

## `getMessagingServiceManager()`

**Purpose:** Provides WebSocket-based messaging service APIs, including subscribing to case/interaction notifications and reading user presence.

**Signature:**

```typescript
getMessagingServiceManager(): MessagingServiceManager
```

**Example:**

```typescript
const userState = PCore.getMessagingServiceManager().getUserPresence().getUserState(userIdentifier);
```

---

## `getActionsSequencer()`

**Purpose:** Returns the `ActionsSequencer`, which serializes case actions dispatched through `ActionsApi` to prevent race conditions. Most components don't need to interact with it directly since `ActionsApi` uses it internally.

**Signature:**

```typescript
getActionsSequencer(): ActionsSequencer
```

**Example:**

```typescript
const sequencer = PCore.getActionsSequencer();
```

---

## `getExpressionEngine()`

**Purpose:** Evaluates an authored expression string against a given data context.

**Signature:**

```typescript
getExpressionEngine(): ExpressionEngine
```

**Example:**

```typescript
// CreateC11nEnv is `{ getPConnect: () => PConnect }`; BootstrapUtils.createC11nEnv(meta) returns one.
const options = { pConnect: PCore.getBootstrapUtils().createC11nEnv(meta) };
const result = PCore.getExpressionEngine().evaluate(expressionString, rowData, options);
```

**Notes:** In the 5.1.0 typedefs `evaluate(expression: string, data: object, options: { pConnect: CreateC11nEnv }): boolean` takes all three arguments and returns a `boolean` (it evaluates a filter expression such as `.HomeNumber != '123'` against `data`). `options` is typed as required, although the typedef's own comment calls it optional.
