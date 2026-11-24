# Case Collaboration — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-case-collaboration-genai.md](./pcore-case-collaboration-genai.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.
>
> Curated subset — `ContainerUtils` and `CaseUtils` have many additional low-level/internal methods used by the framework's own container bookkeeping; only the methods a component author would plausibly call directly are listed here.

## ContainerUtils (via `PCore.getContainerUtils()`)

| Method                                          | Signature                                                                             | Purpose                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `getContainerData(target)`                      | `(target: string): unknown`                                                           | Returns the container's data for a target.                     |
| `getContainerItemData(target, containerItem)`   | `(target: string, containerItem: string): unknown`                                    | Returns data for a specific container item.                    |
| `isContainerItemExists(target, key, callback?)` | `(target: string \| null, key: string, callback?: Function): boolean`                  | Checks whether a container item with a given key exists.       |
| `getContainerItemName(target, key, callback?)`  | `(target: string \| null, key: string \| undefined, callback?: Function): string \| null` | Returns the container item name for a given key.               |
| `isContainerInitialized(context, name)`         | `(context: string, name: string): boolean`                                            | Checks whether a container has been initialized.               |
| `getContainerType(context, name)`               | `(context: string, name: string): string \| null`                                     | Returns the container type (`single` or `multiple`).           |
| `getActiveContainerItemName(target)`            | `(target: string): string \| null`                                                    | Returns the currently active container item's name.            |
| `getDataContextName(containerItemName)`         | `(containerItemName: string): string \| null`                                         | Returns the data context name for a container item.            |
| `getChildContainers(containerItemName)`         | `(containerItemName: string): string[]`                                               | Returns the child containers of a parent container item.       |
| `hasContainerItems(target)`                     | `(target: string): boolean`                                                           | Checks whether a container has any items.                      |
| `getContainerLimit(target)`                     | `(target: string): number`                                                            | Returns the maximum number of items allowed in a container.    |
| `isContainerLimitReached(target)`               | `(target: string): boolean`                                                           | Checks whether the container's item limit has been reached.    |
| `isContainerDirty(containerItemID)`             | `(containerItemID: string): boolean`                                                  | Checks whether a container item's content has unsaved changes. |
| `closeContainerItem(containerItemID, options?)` | `(containerItemID: string, options?: { skipDirtyCheck?: boolean }): Promise<unknown>` | Closes a container item, optionally skipping the dirty check.  |
| `getTransientItems(containerItemsID)`           | `(containerItemsID: string \| string[]): unknown[]`                                   | Returns the transient items present under a container.         |

**Example:**

```typescript
const isInitialized = PCore.getContainerUtils().isContainerInitialized(context, containerName);
```

---

## AttachmentUtils (via `PCore.getAttachmentUtils()`)

| Method                                                                                 | Signature                                                                                                                         | Purpose                                                                                                                          |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `uploadAttachment(file, onUploadProgress, errorHandler, context, caseID?, attachmentCategory?)` | `(file: Blob & Attachment, onUploadProgress: AxiosRequestConfig['onUploadProgress'], errorHandler: Function, context: string, caseID?: string, attachmentCategory?: string): Promise<object>` | Uploads a file to the server. |
| `linkAttachmentsToCase(caseID, attachments, attachmentType, context)`                  | `(...): Promise<unknown>`                                                                                                         | Links uploaded files (or URL links) to a case.                                                                                   |
| `getCaseAttachments(caseID, context, includeThumbnail?)`                               | `(caseID: string, context: string, includeThumbnail?: boolean): Promise<unknown>`                                                 | Retrieves the attachments linked to a case.                                                                                      |
| `getAttachmentCategories(caseID, type, context)`                                       | `(caseID: string, type: string, context: string): Promise<unknown>`                                                               | Retrieves the configured attachment categories for a case.                                                                       |
| `downloadAttachment(attachmentID, context, responseEncoding, storageType?, encoding?)` | `(...): Promise<unknown>`                                                                                                         | Downloads the binary content of an attachment.                                                                                   |
| `streamDownloadAttachment(attachmentID, fileName, context)`                            | `(attachmentID: string, fileName: string, context: string): Promise<void>`                                                        | Streams a large attachment to disk via the File System Access API; no-ops if unsupported, cancelled, or the feature flag is off. |
| `getAttachmentURL(attachmentID)` | `(attachmentID: string): string \| undefined` | Returns the absolute URL of an attachment. |
| `editAttachment(attachmentID, metadata, context)`                                      | `(attachmentID: string, metadata: { name?: string; description?: string; category?: string }, context: string): Promise<unknown>` | Edits an attachment's name/category.                                                                                             |
| `deleteAttachment(attachmentID, context)`                                              | `(attachmentID: string, context: string): Promise<unknown>`                                                                       | Deletes an attachment from a case.                                                                                               |
| `cancelRequest(fileID)`                                                                | `(fileID: string): void`                                                                                                          | Cancels an ongoing upload request.                                                                                               |

**Example:**

```typescript
const { uploadAttachment } = PCore.getAttachmentUtils();
await uploadAttachment(file, onProgress, onError, context);
```

**Notes:** Most methods return a `Promise`.

---

## FeedUtils (via `PCore.getFeedUtils()`)

| Method                                                                                | Signature                                                                                   | Purpose                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `getFeeds(context, feedID, feedClass, filters, cancelTokenSource, pConn, isLoadMore)` | `(...): Promise<unknown>`                                                                   | Retrieves feed/pulse entries for a context.              |
| `postMessage(context, message, pConn, attachmentIDs?, isReply?, recipients?)`         | `(...): Promise<unknown>`                                                                   | Posts a message to a case's feed.                        |
| `postCustomMessage(postTypeClassID, payload, pConn)`                                  | `(postTypeClassID: string, payload: unknown, pConn: PConnect): Promise<unknown>`            | Posts a custom message type.                             |
| `editMessage(params)`                                                                 | `(params: { messageID: string; message: string; pConn: PConnect }): Promise<unknown>`       | Edits an existing feed message.                          |
| `likeMessage(params)`                                                                 | `(params: { context: string; likedBy: boolean; messageID: string; pConn: PConnect }): void` | Likes or unlikes a message.                              |
| `deleteMessage(messageID, isReply, replyID, pConn)`                                   | `(messageID: string, isReply: boolean, replyID: string, pConn: PConnect): void`             | Deletes a feed message.                                  |
| `getLikedUsers(messageID, pConn)`                                                     | `(messageID: string, pConn: PConnect): Promise<unknown>`                                    | Retrieves the users who liked a message.                 |
| `getMentionSuggestions(props, pConn)`                                                 | `(props: { searchFor: string; mentionsType: string }, pConn: PConnect): Promise<unknown>`   | Retrieves mention suggestions while composing a message. |
| `getMentionTypes(pConn)`                                                              | `(pConn: PConnect): Promise<unknown>`                                                       | Retrieves the available mention types.                   |
| `getPostTypeView(postTypeClassID, pConnectObj)`                                       | `(postTypeClassID: string, pConnectObj: PConnect): Promise<object>`                         | Retrieves the view associated with a custom post type.   |
| `getTagSuggestions(props, pConn)`                                                     | `(props: { searchFor: string }, pConn: PConnect): Promise<string[]>`                        | Retrieves tag suggestions while composing a message.     |

**Example:**

```typescript
await PCore.getFeedUtils().postMessage(context, 'Reviewed and approved.', pConn);
```

---

## TagUtils (via `PCore.getTagUtils()`)

| Method                            | Signature                                                              | Purpose                                     |
| --------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| `getTags(caseID, pConnectObj)` | `(caseID: string, pConnectObj: PConnect): Promise<object>` | Retrieves a case's tags (the typedefs type the result only as `object`). |
| `postTags(caseID, tags, pConnectObj)` | `(caseID: string, tags: { Name: string }[], pConnectObj: PConnect): Promise<object>` | Adds tags to a case. Each tag is `{ Name: string }`. |
| `removeTag(caseID, tagID, pConnectObj)` | `(caseID: string, tagID: string, pConnectObj: PConnect): Promise<void \| AxiosResponse>` | Removes a tag from a case. |
| `getTaggedCases(caseID, pConnectObj)` | `(caseID: string, pConnectObj: PConnect): Promise<object>` | Retrieves cases sharing a tag. |
| `getTagsLandingPageURL(pConnectObj)` | `(pConnectObj: PConnect): Promise<void \| object>` | Retrieves the URL of the tags landing page. |

**Example:**

```typescript
const { getTags, postTags } = PCore.getTagUtils();
const tags = await getTags(caseID, pConn);
```

---

## StakeholderUtils (via `PCore.getStakeholderUtils()`)

| Method                                                                     | Signature                                                                    | Purpose                                                     |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `getParticipants(caseID, pConnectObj)` | `(caseID: string, pConnectObj: PConnect): Promise<Participant[] \| void>` | Retrieves a case's participants. |
| `getParticipant(caseID, participantID, pConnectObj)` | `(caseID: string, participantID: string, pConnectObj: PConnect): Promise<Participant \| void>` | Retrieves a single participant by ID. |
| `getParticipantRoles(caseID, pConnectObj)` | `(caseID: string, pConnectObj: PConnect): Promise<ParticipantRole[] \| void>` | Retrieves the available participant roles for a case. |
| `createParticipant(caseID, participantRoleID, participantData, pConnectObj, transientContext?)` | `(caseID: string, participantRoleID: string, participantData: ParticipantData, pConnectObj: PConnect, transientContext?: string): Promise<void>` | Creates a new participant. Resolves to `void` (it does not return the created participant). |
| `updateParticipant(caseID, participantID, participantData, pConnectObj, transientContext?)` | `(caseID: string, participantID: string, participantData: ParticipantData, pConnectObj: PConnect, transientContext?: string): Promise<void>` | Updates an existing participant's details. |
| `deleteParticipant(caseID, participantID, pConnectObj)` | `(caseID: string, participantID: string, pConnectObj: PConnect): Promise<void>` | Removes a participant from a case. |
| `getRoleView(caseID, participantRoleID, pConnectObj)` | `(caseID: string, participantRoleID: string, pConnectObj: PConnect): Promise<DxAPIResponseObject>` | Retrieves the view for editing a specific participant role. |

**Example:**

```typescript
const participant = await PCore.getStakeholderUtils().getParticipant(caseID, participantID, pConn);
```

**Notes:** `ParticipantData` is `{ content: Record<string, string>; pageInstructions?: object[] }` — the participant fields go inside `content` (for example `{ content: { pyFirstName: 'Sam', pyLastName: 'Smith' } }`). `getParticipant` resolves to `Participant | void`; a `Participant` is `{ data: { content: { pyParticipants: { ID, classID, links, ... }[] } } }`.

---

## UserApi (via `PCore.getUserApi()`)

| Method                                      | Signature                                                    | Purpose                                    |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `getOperatorDetails(userID, isBusinessID?)` | `(userID: string, isBusinessID?: boolean): Promise<object>` | Retrieves glimpse/profile data for a user. |

**Example:**

```typescript
// The typedefs type the result as a bare `object`; at runtime it is an Axios-style response, so cast to read `.data`.
const { data } = (await PCore.getUserApi().getOperatorDetails(operatorID)) as { data: Record<string, unknown> };
```

---

## CaseFollowerApi (via `PCore.getCaseFollowerApi()`)

| Method                                            | Signature                                                                 | Purpose                               |
| ------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------- |
| `addCaseFollower(caseID, userID, context)` | `(caseID: string, userID: string[], context: string): Promise<object>` | Adds one or more followers (user IDs) to a case. |
| `deleteCaseFollower(caseID, followerID, context)` | `(caseID: string, followerID: string, context: string): Promise<AxiosResponse>` | Removes a follower from a case. |
| `getCaseFollowers(caseID, context)` | `(caseID: string, context: string): Promise<Follower[]>` | Retrieves the followers of a case (`Follower = { name: string; ID: string; email: string }`). |

**Example:**

```typescript
const { addCaseFollower, getCaseFollowers } = PCore.getCaseFollowerApi();
await addCaseFollower(caseID, [operatorID], context);
```

---

## CaseUtils (via `PCore.getCaseUtils()`)

| Method                             | Signature                                   | Purpose                                                           |
| ---------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| `isCaseActive(key, target)`        | `(key: string, target: string): boolean`    | Checks whether a case is active or inactive.                      |
| `isExternalCaseType(className)`    | `(className: string): boolean`              | Checks whether a class name corresponds to an external case type. |
| `isObjectCaseType(className)`      | `(className: string \| undefined): boolean` | Checks whether a class is a data-object case type.                |
| `isExternalObject(className)`      | `(className: string): boolean`              | Checks whether a class is an external object.                     |
| `isRemoteCase(caseClassName)`      | `(caseClassName: string): boolean`          | Checks whether a case class is a remote (coexistence) case.       |
| `shouldUseUnifiedHandling()`       | `(): boolean`                               | Returns whether unified case/object handling is active.           |
| `getCaseMessages(containerItemID)` | `(containerItemID: string): unknown[]`      | Returns the confirmation/case messages for a container item.      |

**Example:**

```typescript
const isObjectType = PCore.getCaseUtils().isObjectCaseType(caseClassName);
```

---

## RelatedCasesApi (via `PCore.getRelatedCasesApi()`)

| Method                                              | Signature                                                                      | Purpose                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| `getRelatedCases(caseID, context)` | `(caseID: string, context: string): Promise<object>` | Retrieves a case's related cases. |
| `addRelatedCases(caseID, relatedCases, context)` | `(caseID: string, relatedCases: object[], context: string): Promise<object>` | Relates one or more cases to a case. |
| `removeRelatedCase(caseID, relatedCaseID, context)` | `(caseID: string, relatedCaseID: string, context: string): Promise<AxiosResponse>` | Removes a related-case relationship. |

**Example:**

```typescript
const { getRelatedCases } = PCore.getRelatedCasesApi();
const relatedCases = await getRelatedCases(caseID, context);
```
