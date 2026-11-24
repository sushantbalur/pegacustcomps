# Analytics & GenAI — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-case-collaboration-genai.md](./pcore-case-collaboration-genai.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.

## AnalyticsUtils (via `PCore.getAnalyticsUtils()`)

| Method                                                                  | Signature                                                                                         | Purpose                                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `getInsightIDs()`                                                       | `(): Promise<unknown>`                                                                            | Retrieves all available insight IDs.                                 |
| `getInsightByID(insightID)`                                             | `(insightID: string): Promise<unknown>`                                                           | Retrieves metadata for a specific insight.                           |
| `getDataObjects()`                                                      | `(): Promise<unknown>`                                                                            | Retrieves the list of data objects corresponding to data/case types. |
| `getDataPageObjects(useCache?)`                                         | `(useCache?: boolean): Promise<unknown>`                                                          | Retrieves the list of data objects corresponding to data pages.      |
| `getDefaultColumns(payload)`                                            | `(payload: { reportName: string; className: string }): Promise<unknown>`                          | Retrieves the default columns configured for a report.               |
| `getFieldsForDataSource(dataViewName, skipStoreCheck, context)`         | `(dataViewName: string, skipStoreCheck: boolean, context: string): Promise<unknown>`              | Retrieves the fields configured for a data view.                     |
| `getPrimaryFieldsForDataSource(dataViewName?, dataViewClassName?)`      | `(dataViewName?: string, dataViewClassName?: string): Promise<unknown>`                           | Retrieves the primary fields for a data view.                        |
| `getDataViewMetadata(dataViewName, skipStoreCheck, associationFilter?)` | `(dataViewName: string, skipStoreCheck: boolean, associationFilter?: string[]): Promise<unknown>` | Retrieves and caches metadata for a data view.                       |
| `translateStrings(stringsToTranslate)`                                  | `(stringsToTranslate: string): Promise<unknown>`                                                  | Translates a list of strings.                                        |

**Example:**

```typescript
const insightIDs = await PCore.getAnalyticsUtils().getInsightIDs();
```

---

## GenAIAssistantUtils (via `PCore.getGenAIAssistantUtils()`)

| Method                                                                                  | Signature                                                                                                             | Purpose                                                       |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `createConversation(contextID, assistantID, context, cancelTokenSource?)` | `(contextID: string, assistantID: string, context: string, cancelTokenSource?: CancelTokenSource[]): Promise<ConversationResponse>` | Starts a conversation with a GenAI Assistant. Resolves to `{ data: { ID, response, suggestedPrompts, ... } }` — the conversation ID is `conversation.data.ID`. |
| `createConversationForAgent(contextID, agentID, context, cancelTokenSource?, config?)` | `(contextID: string, agentID: string, context: string, cancelTokenSource?: CancelTokenSource[], config?: CreateConversationConfig): Promise<ConversationResponse>` | Starts a conversation with an Agent. Resolves to the same `ConversationResponse` shape (`conversation.data.ID`). |
| `sendMessage(assistantID, conversationID, message, context, config?)` | `(assistantID: string, conversationID: string, message: string, context: string, config?: SendMessageConfig): Promise<AxiosResponse>` | Sends a message in an Assistant conversation. `SendMessageConfig` requires `enableStreaming: boolean`. |
| `sendMessageForAgent(agentID, conversationID, message, context, attachments?, config?)` | `(agentID: string, conversationID: string, message: string, context: string, attachments?: Attachment[], config?: SendMessageConfig): Promise<AxiosResponse>` | Sends a message in an Agent conversation. |
| `getConversations(assistantID, contextID, pageSize, pageIndex, context, cancelTokenSource?)` | `(assistantID: string, contextID: string, pageSize: number, pageIndex: number, context: string, cancelTokenSource?: CancelTokenSource[]): Promise<AxiosResponse>` | Retrieves a paginated list of Assistant conversations. |
| `getConversationsForAgent(agentID, contextID, pageSize, pageIndex, context, cancelTokenSource?)` | `(agentID: string, contextID: string, pageSize: number, pageIndex: number, context: string, cancelTokenSource?: CancelTokenSource[]): Promise<AxiosResponse>` | Retrieves a paginated list of Agent conversations. |
| `getMessages(assistantID, conversationID, context, cancelTokenSource?)` | `(assistantID: string, conversationID: string, context: string, cancelTokenSource?: CancelTokenSource[]): Promise<AxiosResponse>` | Retrieves messages from an Assistant conversation. Resolves to an Axios response (not an array) — the payload is on `.data`; its inner shape is not typed in the 5.1.0 typedefs (`any`). |
| `getMessagesForAgent(agentID, conversationID, context, cancelTokenSource?)` | `(agentID: string, conversationID: string, context: string, cancelTokenSource?: CancelTokenSource[]): Promise<AxiosResponse>` | Retrieves messages from an Agent conversation (Axios response; payload on `.data`, inner shape untyped). |
| `getAgent(agentID, context, contextID, cancelTokenSource?)` | `(agentID: string, context: string, contextID: string, cancelTokenSource?: CancelTokenSource[]): Promise<AxiosResponse>` | Retrieves details for a configured Agent. |
| `getCoach(assistantID, context, contextID, cancelTokenSource?)` | `(assistantID: string, context: string, contextID: string, cancelTokenSource?: CancelTokenSource[]): Promise<AxiosResponse>` | Retrieves details for a configured GenAI Coach (Assistant). |
| `likeAgentMessage(agentID, conversationID, messageID, context)` | `(agentID: string, conversationID: string, messageID: string, context: string): Promise<AxiosResponse>` | Likes a message in an Agent conversation. |
| `unLikeAgentMessage(agentID, conversationID, messageID, context, feedbackText?)` | `(agentID: string, conversationID: string, messageID: string, context: string, feedbackText?: string): Promise<AxiosResponse>` | Removes a like from a message, optionally with feedback text. |

**Example:**

```typescript
const { createConversation, sendMessage } = PCore.getGenAIAssistantUtils();
const conversation = await createConversation(contextID, assistantID, context);
await sendMessage(assistantID, conversation.data.ID, userMessage, context);
```
