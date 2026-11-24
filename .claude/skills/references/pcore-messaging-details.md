# Messages, Pub/Sub, Events & Messaging Service — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-rest-data-messaging.md](./pcore-rest-data-messaging.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.

## SemanticUrlUtils (via `PCore.getSemanticUrlUtils()`)

| Method                                                       | Signature                                                                        | Purpose                                                        |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `getResolvedSemanticURL(routeKey, payload, params, locale?)` | `(routeKey: string, payload: unknown, params: unknown, locale?: string): string` | Builds a resolved semantic URL for a given route.              |
| `getActions()`                                               | `(): Record<string, string>`                                                     | Returns the constant names for supported semantic-URL actions. |

**Example:**

```typescript
const url = PCore.getSemanticUrlUtils().getResolvedSemanticURL(routeKey, payload, params);
```

---

## MessageManager (via `PCore.getMessageManager()`)

| Method                                                      | Signature                                                                                        | Purpose                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `addMessages(config)`                                       | `(config: { messages: unknown[]; category: string; context?: string; property?: string }): void` | Adds one or more messages to a context or property.             |
| `getMessages(config)`                                       | `(config: { context: string \| null }): unknown[]`                                               | Retrieves messages (property, HTTP, or page) for a context.     |
| `clearMessages(config)`                                     | `(config: { category?: string; context?: string; property?: string }): void`                     | Clears messages matching the given criteria.                    |
| `clearContextMessages(config)`                              | `(config: { context: string }): void`                                                            | Clears all messages for a given context.                        |
| `clearContextMessagesInActiveWorkArea(context)`             | `(context: string): void`                                                                        | Clears all messages in the active work-area container.          |
| `getValidationErrorMessages(context, localizationService?)` | `(context: string, localizationService?: unknown): unknown[]`                                    | Returns all validation error messages for a context, localized. |
| `isCustomPageErrorExist(context)`                           | `(context: string): boolean`                                                                     | Checks whether a custom page error exists for a context.        |

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

## PubSubUtils (via `PCore.getPubSubUtils()`)

| Method                                                               | Signature                                                       | Purpose                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `subscribe(eventType, handler, name?, subscribeOnce?, contextName?)` | `(...): void`                                                   | Subscribes a handler to an event type.                             |
| `subscribeOnce(eventType, handler, name)`                            | `(eventType: string, handler: Function, name: string): void`    | Subscribes a handler that fires only once, then auto-unsubscribes. |
| `publish(eventType, payload?)`                                       | `(eventType: string, payload?: unknown): void`                  | Publishes an event, invoking all subscribed handlers.              |
| `unsubscribe(eventType, name, contextName?)`                         | `(eventType: string, name: string, contextName?: string): void` | Unsubscribes a named handler from an event type.                   |
| `cleanContextSubscribers(contextName)`                               | `(contextName: string): void`                                   | Removes all subscriptions registered under a context.              |

**Example:**

```typescript
const { subscribe, unsubscribe } = PCore.getPubSubUtils();
subscribe(PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE, onStageCreated, 'my-subscriber');
// later
unsubscribe(PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE, 'my-subscriber');
```

---

## Events (via `PCore.getEvents()`)

| Method                         | Signature                    | Purpose                                                         |
| ------------------------------ | ---------------------------- | --------------------------------------------------------------- |
| `getCaseEvent()`               | `(): Record<string, string>` | Returns case-related event name constants (for pub/sub topics). |
| `getDataEvent()`               | `(): Record<string, string>` | Returns data-object-related event name constants.               |
| `getBulkProcessEvent()`        | `(): Record<string, string>` | Returns the bulk-action-submitted event constant.               |
| `getLocalActionProcessEvent()` | `(): Record<string, string>` | Returns the local-action-submitted event constant.              |

**Example:**

```typescript
const caseCreated = PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE;
```

---

## MessagingServiceManager (via `PCore.getMessagingServiceManager()`)

| Method                                                 | Signature                                                   | Purpose                                                                                              |
| ------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `subscribe(filter, messageHandler, contextName?, id?)` | `(filter: { matcher: string; criteria: Record<string, string> }, messageHandler: Function, contextName?: string, id?: string): string` | Subscribes to WebSocket messaging service updates matching a filter (for example `{ matcher: 'CASE', criteria: { caseId } }` for case updates); returns a subscription ID. |
| `unsubscribe(id, notRemove?)`                          | `(id: string, notRemove?: boolean): void`                   | Removes a messaging-service subscription.                                                            |
| `dispatchLocalMessage(payload)`                        | `(payload: unknown): void`                                  | Dispatches a locally-constructed message through the subscriber pipeline (used for offline support). |
| `getUserPresence()`                                    | `(): { getUserState: (userIdentifier: string) => unknown }` | Returns the user-presence manager, used to read a user's online/away state.                          |
| `getCaseSubscription(caseId)`                          | `(caseId: string): AtomicSubscription`                      | Gets or creates a subscription for case-specific server push updates. The returned object has `subscribe(criteria, callback): string` and `unsubscribe(subscriptionId): void`. |

**Example:**

```typescript
const userState = PCore.getMessagingServiceManager().getUserPresence().getUserState(userIdentifier);
```
