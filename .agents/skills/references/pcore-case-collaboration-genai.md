# PCore: Case Utilities, Collaboration & GenAI

> Part of the [PCore / PConnect API Reference skills](../README.md). See [pcore-case-collaboration-details.md](./pcore-case-collaboration-details.md) and [pcore-analytics-genai-details.md](./pcore-analytics-genai-details.md) for the full method catalogs of the objects these accessors return.

## `getContainerUtils()`

**Purpose:** Container management APIs — inspecting container state (`getContainers`, `getContainerData`, `isContainerInitialized`, and related helpers).

**Signature:**

```typescript
getContainerUtils(): ContainerUtils
```

**Example:**

```typescript
const isInitialized = PCore.getContainerUtils().isContainerInitialized(context, containerName);
```

---

## `getAttachmentUtils()`

**Purpose:** Utility APIs to manage a case's attachments (`uploadAttachment`, `downloadAttachment`, `linkAttachmentsToCase`, `getCaseAttachments`, and others).

**Signature:**

```typescript
getAttachmentUtils(): AttachmentUtils
```

**Example:**

```typescript
const { uploadAttachment } = PCore.getAttachmentUtils();
await uploadAttachment(file, onUploadProgress, errorHandler, context, caseID);
```

**Notes:** Most `AttachmentUtils` methods return a `Promise`.

---

## `getFeedUtils()`

**Purpose:** APIs to manage a case's feed/pulse (`postMessage`, `getFeeds`, `editMessage`, `likeMessage`, `deleteMessage`, and others).

**Signature:**

```typescript
getFeedUtils(): FeedUtils
```

**Example:**

```typescript
await PCore.getFeedUtils().postMessage(context, 'Reviewed and approved.', pConn);
```

---

## `getTagUtils()`

**Purpose:** APIs to manage a case's tags (`getTaggedCases`, `getTags`, `postTags`, `removeTag`, `getTagsLandingPageURL`).

**Signature:**

```typescript
getTagUtils(): TagUtils
```

**Example:**

```typescript
const { getTags, postTags } = PCore.getTagUtils();
const tags = await getTags(caseID, pConn);
```

---

## `getStakeholderUtils()`

**Purpose:** APIs to manage a case's participants (`getParticipants`, `getRoleView`, `getParticipantRoles`, `getParticipant`, `createParticipant`, `updateParticipant`, `deleteParticipant`).

**Signature:**

```typescript
getStakeholderUtils(): StakeholderUtils
```

**Example:**

```typescript
const participant = await PCore.getStakeholderUtils().getParticipant(caseID, participantID, pConn);
```

---

## `getUserApi()`

**Purpose:** APIs to retrieve user/operator data.

**Signature:**

```typescript
getUserApi(): UserApi
```

**Example:**

```typescript
// The typedefs type the result as a bare `object`; at runtime it is an Axios-style response, so cast to read `.data`.
const { data } = (await PCore.getUserApi().getOperatorDetails(operatorID)) as { data: Record<string, unknown> };
```

---

## `getCaseFollowerApi()`

**Purpose:** APIs to manage a case's followers (`addCaseFollower`, `deleteCaseFollower`, `getCaseFollowers`).

**Signature:**

```typescript
getCaseFollowerApi(): CaseFollowerApi
```

**Example:**

```typescript
const { addCaseFollower, getCaseFollowers } = PCore.getCaseFollowerApi();
await addCaseFollower(caseID, [userID], context);
```

---

## `getCaseUtils()`

**Purpose:** Case-related utility checks (`isCaseActive`, `isExternalCaseType`, `isObjectCaseType`, and related helpers).

**Signature:**

```typescript
getCaseUtils(): CaseUtils
```

**Example:**

```typescript
const isObjectType = PCore.getCaseUtils().isObjectCaseType(caseClassName);
```

---

## `getRelatedCasesApi()`

**Purpose:** APIs to manage a case's related cases (`addRelatedCases`, `removeRelatedCase`, `getRelatedCases`).

**Signature:**

```typescript
getRelatedCasesApi(): RelatedCasesApi
```

**Example:**

```typescript
const { getRelatedCases } = PCore.getRelatedCasesApi();
const relatedCases = await getRelatedCases(caseID, context);
```

---

## `getGenAIAssistantUtils()`

**Purpose:** APIs for the GenAI Assistant conversational experience (`createConversation`, `sendMessage`, `getConversations`, `getMessages`, `getCoach`, `getAgent`, and related agent-scoped variants).

**Signature:**

```typescript
getGenAIAssistantUtils(): GenAIAssistantUtils
```

**Example:**

```typescript
const { createConversation, sendMessage } = PCore.getGenAIAssistantUtils();
const conversation = await createConversation(contextID, assistantID, context);
await sendMessage(assistantID, conversation.data.ID, userMessage, context);
```

**Notes:** Message/conversation APIs return `Promise`s. `createConversation` resolves to `{ data: { ID, response, ... } }`, so the conversation ID is `conversation.data.ID`; `getMessages`/`sendMessage` resolve to an Axios response (payload on `.data`). `sendMessage` accepts an optional trailing `config` (`{ enableStreaming: boolean; ... }`).

---

## `getGenAIUtils()`

**Purpose:** APIs for GenAI text operations, such as rewriting text.

**Signature:**

```typescript
getGenAIUtils(): GenAIUtils
```

**Example:**

```typescript
if (PCore.getEnvironmentInfo().isGenAIEnabled()) {
  const result = await PCore.getGenAIUtils().rewriteText({
    originalText,
    rewriteAction: 'Improve'
  });
  if (result.success) {
    // use result.rewrittenText
  }
}
```

**Notes:** Check `PCore.getEnvironmentInfo().isGenAIEnabled()` first; `rewriteText()` resolves a discriminated union — handle the `success: false` case.

---

## `getAnalyticsUtils()`

**Purpose:** Analytics/insight APIs (`getInsightIDs`, `getInsightByID`, `createInsight`, `exportToExcel`, `exportToCSV`, and others). All methods return a `Promise`.

**Signature:**

```typescript
getAnalyticsUtils(): AnalyticsUtils
```

**Example:**

```typescript
const insightIDs = await PCore.getAnalyticsUtils().getInsightIDs();
```

---

## `getPersonalizationUtils(listID)`

**Purpose:** APIs to manage saved personalization instances (view/filter/sort configurations) for a list component.

**Signature:**

```typescript
getPersonalizationUtils(listID: string): {
  createPersonalization: (personalizationID: string, personalizedState: CreatePersonalizationInfo) => Promise<AxiosResponse<string>>;
  updatePersonalization: (personalizationID: string, personalizedState: CreatePersonalizationInfo) => Promise<AxiosResponse<string>>;
  deletePersonalization: (personalizationID: string) => Promise<AxiosResponse<string>>;
  fetchPersonalizations: () => Promise<PersonalizationStore | AxiosResponse<PersonalizationStore>>;
}
```

**Example:**

```typescript
const personalizationUtils = PCore.getPersonalizationUtils(listComponentID);
const savedViews = await personalizationUtils.fetchPersonalizations();
```

**Notes:** `listID` should be limited to 32 characters. If `listID` is falsy, the returned methods are safe no-op stubs rather than throwing.
