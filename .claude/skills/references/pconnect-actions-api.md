# ActionsApi

> Part of the [PCore / PConnect API Reference skills](../README.md). Obtained via `pConn.getActionsApi()`.

## Case / Work Lifecycle

### `createWork(className, options?)`

**Purpose:** Creates a new case/work object of the given class and displays its first assignment.

**Signature:**

```typescript
createWork(className: string, options?: {
  flowType?: string; containerName?: string; openCaseViewAfterCreate?: boolean;
  startingFields?: Record<string, unknown>; channelName?: string;
}): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().createWork('MyOrg-MyApp-Work-Request', {
  containerName: 'primary',
  startingFields: { FirstName: 'Adam', LastName: 'Smith' }
});
```

**Notes:** `createCase()` below is a convenience wrapper over this method.

---

### `createCase(className, options?)`

**Purpose:** Convenience wrapper that delegates to `createWork()`.

**Signature:**

```typescript
createCase(className: string, options?: { flowType?: string; containerName?: string; startingFields?: Record<string, unknown> }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().createCase('MyOrg-MyApp-Work-Request', { containerName: 'primary' });
```

---

### `openWorkByHandle(workID, className, options?)`

**Purpose:** Opens an existing work/case object by its work handle and class.

**Signature:**

```typescript
openWorkByHandle(workID: string, className: string, options?: { targetContainer?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().openWorkByHandle(caseHandle, caseClassName);
```

---

### `openAssignment(assignmentID, className, options?)`

**Purpose:** Opens the given assignment in the specified target container.

**Signature:**

```typescript
openAssignment(assignmentID: string, className: string, options?: { containerName: string; context?: string; viewType?: string; isActionFromToDoList?: boolean; isChild?: boolean; renderInline?: boolean; pageName?: string; skipBrowserSemanticUrlUpdate?: boolean }): any
```

**Example:**

```typescript
await pConn.getActionsApi().openAssignment(assignmentID, className, { containerName: 'primary' });
```

---

### `finishAssignment(containerItemID, options?)`

**Purpose:** Submits (finishes) the assignment currently loaded in the given container item.

**Signature:**

```typescript
finishAssignment(containerItemID: string, options?: { outcomeID?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().finishAssignment(containerItemID);
```

---

### `getNextWork()`

**Purpose:** Opens the next urgent assignment for the current user.

**Signature:**

```typescript
getNextWork(): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().getNextWork();
```

---

### `openStage(stageID)`

**Purpose:** Opens the case stage identified by `stageID`.

**Signature:**

```typescript
openStage(stageID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().openStage(stageID);
```

---

### `approveCase(containerItemID)` / `rejectCase(containerItemID)`

**Purpose:** Sets the approval flag for a case's approval step, then finishes the assignment.

**Signature:**

```typescript
approveCase(containerItemID: string): Promise<unknown>
rejectCase(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().approveCase(containerItemID);
```

---

### `resolveDuplicateCase(containerItemID)` / `ignoreDuplicateCase(containerItemID)`

**Purpose:** Marks a detected duplicate case as resolved, or ignores it, then finishes the assignment.

**Signature:**

```typescript
resolveDuplicateCase(containerItemID: string): Promise<unknown>
ignoreDuplicateCase(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().resolveDuplicateCase(containerItemID);
```

---

### `cancelAssignment(containerItemID, skipPublishCancelEvent)`

**Purpose:** Cancels the assignment associated with the current case, releasing any locks.

**Signature:**

```typescript
cancelAssignment(containerItemID: string, skipPublishCancelEvent: boolean): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().cancelAssignment(containerItemID, false);
```

---

### `cancelLocalAction(containerItemID)`

**Purpose:** Cancels the currently open local action.

**Signature:**

```typescript
cancelLocalAction(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().cancelLocalAction(containerItemID);
```

---

### `cancelCreateStageAssignment(containerItemID)`

**Purpose:** Cancels an assignment that is still in the case's create stage.

**Signature:**

```typescript
cancelCreateStageAssignment(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().cancelCreateStageAssignment(containerItemID);
```

---

### `saveAssignment(containerItemID)`

**Purpose:** Saves (without closing) the currently opened assignment.

**Signature:**

```typescript
saveAssignment(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().saveAssignment(containerItemID);
```

---

### `saveAndClose(containerItemID)`

**Purpose:** Saves the current work object opened in a modal dialog and closes it.

**Signature:**

```typescript
saveAndClose(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().saveAndClose(containerItemID);
```

---

### `deleteCaseInCreateStage(containerItemID, ignoreCaseDeletion?)`

**Purpose:** Deletes a case that is currently in its create stage.

**Signature:**

```typescript
deleteCaseInCreateStage(containerItemID: string, ignoreCaseDeletion?: boolean): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().deleteCaseInCreateStage(containerItemID);
```

---

### `deleteWork(workId, caseTypeID, options?)`

**Purpose:** Deletes a work object, showing a confirmation dialog unless `skipDeleteConfirmation` is set.

**Signature:**

```typescript
deleteWork(workId: string, caseTypeID: string, options?: { skipDeleteConfirmation?: boolean }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().deleteWork(workId, caseTypeID);
```

---

### `navigateToStep(stepID, containerItemID)`

**Purpose:** Navigates to a specific step (or `"previous"`) within a container's flow.

**Signature:**

```typescript
navigateToStep(stepID: string, containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().navigateToStep('previous', containerItemID);
```

---

## Local & Process Actions

### `openLocalAction(actionID, options)`

**Purpose:** Opens a local action configured as Case-wide, Stage-wide, Assignment-level, or Express scope.

**Signature:**

```typescript
openLocalAction(actionID: string, options: { type: 'Assignment' | 'Case' | 'Stage' | 'Express'; containerName?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().openLocalAction('EditDetails', { type: 'Case' });
```

---

### `openProcessAction(actionID, options)`

**Purpose:** Opens a configured process action (Case-wide or Stage-wide).

**Signature:**

```typescript
openProcessAction(actionID: string, options: { type: 'Case' | 'Stage' }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().openProcessAction('VendorAddition_Flow', { type: 'Case' });
```

---

## Bulk Actions

### `submitBulkAction(containerItemID)` / `submitBulkActionAsync(containerItemID)`

**Purpose:** Submits a bulk action synchronously or asynchronously for the given container item.

**Signature:**

```typescript
submitBulkAction(containerItemID: string): Promise<unknown>
submitBulkActionAsync(containerItemID: string): Promise<unknown>
```

**Notes:** Only a single `containerItemID` string is accepted — passing anything else (including an array) rejects with a `TypeError` at runtime.

**Example:**

```typescript
await pConn.getActionsApi().submitBulkAction(containerItemID);
```

---

### `openBulkAction(actionID, options)`

**Purpose:** Opens the UI for a bulk action against a selected list of cases.

**Signature:**

```typescript
openBulkAction(actionID: string, options: { selectedList?: string[]; runningMode?: 'sync' | 'async' }): Promise<unknown>
```

**Example:**

```typescript
pConn.getActionsApi().openBulkAction(actionID, { selectedList: selectedCaseKeys });
```

---

### `cancelBulkAction(containerItemID)`

**Purpose:** Cancels a bulk action by removing its transient container item.

**Signature:**

```typescript
cancelBulkAction(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().cancelBulkAction(containerItemID);
```

---

## Data Object Operations

### `showDataObjectCreateView(className, viewName?)`

**Purpose:** Displays the create view for a data object of the given class.

**Signature:**

```typescript
showDataObjectCreateView(className: string, viewName?: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().showDataObjectCreateView(className);
```

---

### `cancelDataObject(containerItemID)`

**Purpose:** Cancels creation of a data object.

**Signature:**

```typescript
cancelDataObject(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().cancelDataObject(containerItemID);
```

---

### `createDataObject(containerItemID)`

**Purpose:** Creates a data object whose create view is loaded in the specified container item.

**Signature:**

```typescript
createDataObject(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().createDataObject(containerItemID);
```

---

### `deleteDataObject(className, keys)`

**Purpose:** Deletes a data object of the given class, identified by its primary key values.

**Signature:**

```typescript
deleteDataObject(className: string, keys: Record<string, unknown>): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().deleteDataObject(className, { pyGUID: recordId });
```

---

### `getDataObjectView(className, keyProperties, options?)`

**Purpose:** Displays the edit view of a data object to be updated.

**Signature:**

```typescript
getDataObjectView(className: string, keyProperties: Record<string, unknown>, options?: { viewName?: string; readOnly?: boolean }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().getDataObjectView(className, { pyGUID: recordId });
```

---

### `updateDataObject(containerItemID, keys)`

**Purpose:** Updates a data object whose edit view is loaded in the specified container item.

**Signature:**

```typescript
updateDataObject(containerItemID: string, keys: Record<string, unknown>): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().updateDataObject(containerItemID, { pyGUID: recordId });
```

---

### `openDataObjectAction(className, keyProperties, actionID, actionName)`

**Purpose:** Displays the flow-action view for updating a data object via a configured action.

**Signature:**

```typescript
openDataObjectAction(className: string, keyProperties: Record<string, unknown>, actionID: string, actionName: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().openDataObjectAction(className, { pyGUID: recordId }, actionID, actionName);
```

---

### `submitDataObjectAction(containerItemID, keyProperties, actionID, options?)`

**Purpose:** Submits a data object's flow action (created via `openDataObjectAction`).

**Signature:**

```typescript
submitDataObjectAction(containerItemID: string, keyProperties: Record<string, unknown>, actionID: string, options?: Record<string, unknown>): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().submitDataObjectAction(containerItemID, { pyGUID: recordId }, actionID);
```

---

### `getDataObjectActions(dataViewID, dataViewParameters)`

**Purpose:** Fetches the available actions for a data object with the given data view.

**Signature:**

```typescript
getDataObjectActions(dataViewID: string, dataViewParameters: Record<string, unknown>): Promise<unknown>
```

**Example:**

```typescript
const actions = await pConn.getActionsApi().getDataObjectActions(dataViewID, params);
```

---

### `deleteDataRecord(className, keys)`

**Purpose:** Deletes a data record of the given class, showing a confirmation dialog before deletion.

**Signature:**

```typescript
deleteDataRecord(className: string, keys: Record<string, unknown>): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().deleteDataRecord(className, { pyGUID: recordId });
```

---

## Field / Value Operations

### `triggerFieldChange(propName, value, skipValidation?, options?)`

**Purpose:** Validates a field and dispatches a field-change event so listeners react to it.

**Signature:**

```typescript
triggerFieldChange(propName: string, value: unknown, skipValidation?: boolean, options?: { skipDirtyValidation?: boolean }): void
```

**Example:**

```typescript
pConn.getActionsApi().triggerFieldChange('.FirstName', inputValue);
```

---

### `updateFieldValue(propName, value, options?)`

**Purpose:** Writes a value directly to application state without firing field-level change events, and clears any existing error messages for that property.

**Signature:**

```typescript
updateFieldValue(propName: string, value: unknown, options?: { isArrayDeepMerge?: boolean }): void
```

**Example:**

```typescript
pConn.getActionsApi().updateFieldValue('.FilterValue', '');
```

---

### `changeHandler(pConn, event)` / `eventHandler(pConn, event)`

**Purpose:** Runs a change/event handler for a given component context through the framework's action-dispatch mechanism — the low-level path behind `onChange`/other DOM event bindings generated from component configuration.

**Signature:**

```typescript
changeHandler(pConn: PConnect, event: Event): void
eventHandler(pConn: PConnect, event: Event): void
```

**Example:**

```typescript
const onInputChange = (event: Event) => {
  pConn.getActionsApi().changeHandler(pConn, event);
};
```

---

## Embedded Data

### `openEmbeddedDataModal(viewName, component, targetProperty, index, action, heading, editType, interestPageActionID, readOnly?, containerName?)`

**Purpose:** Displays the view to add or update a record in an Embedded Data type property, in a modal.

**Signature:**

```typescript
openEmbeddedDataModal(
  viewName: string, component: PConnect, targetProperty: string, index: number | string,
  action: string, heading: string, editType: string, interestPageActionID: string,
  readOnly?: boolean, containerName?: string
): Promise<object>
```

**Example:**

```typescript
pConn
  .getActionsApi()
  .openEmbeddedDataModal('EditEmployee', pConn, '.Employees', rowIndex, 'EDIT', 'Edit Employee', 'ACTION', interestPageActionID);
```

---

### `getEmbeddedDataView(viewName, component, targetProperty, index, action, editType?, interestPageActionID?, readOnly?, containerName?)`

**Purpose:** Fetches the resolved view metadata and data payload for an embedded-data row, for inline rendering (without opening a modal).

**Signature:**

```typescript
getEmbeddedDataView(
  viewName: string, component: PConnect, targetProperty: string, index: number | string,
  action: string, editType?: string, interestPageActionID?: string,
  readOnly?: boolean, containerName?: string
): Promise<{ rootView: unknown; data: unknown; uiResources: unknown; containerContext: unknown }>
```

**Example:**

```typescript
const { rootView, data } = await pConn
  .getActionsApi()
  .getEmbeddedDataView('ViewEmployee', pConn, '.Employees', rowIndex, 'VIEW');
```

---

### `submitEmbeddedDataModal(containerItemID)`

**Purpose:** Submits the view and adds/updates a record in an Embedded Data type property.

**Signature:**

```typescript
submitEmbeddedDataModal(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().submitEmbeddedDataModal(containerItemID);
```

---

### `refreshEmbeddedDataWithAction(caseID, assignmentID, actionID, interestPage, interestPageActionID, localAction, isMultiRecordData, editType, options?)`

**Purpose:** Refreshes an embedded-data row after a flow action completes.

**Signature:**

```typescript
refreshEmbeddedDataWithAction(
  caseID: string, assignmentID: string, actionID: string, interestPage: string,
  interestPageActionID: string, localAction: boolean, isMultiRecordData: boolean,
  editType: string, options?: Record<string, unknown>
): Promise<unknown>
```

**Example:**

```typescript
await pConn
  .getActionsApi()
  .refreshEmbeddedDataWithAction(
    caseID,
    assignmentID,
    actionID,
    interestPage,
    interestPageActionID,
    false,
    false,
    'ACTION'
  );
```

---

## Navigation & Display

### `showPage(pageName, className, options?)`

**Purpose:** Displays a page (view + class) — for example, a portal home page or data portal page.

**Signature:**

```typescript
showPage(pageName: string, className: string, options?: { containerName?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().showPage('pyHome', 'Data-Portal');
```

---

### `showCasePreview(pzInsKey, configObj?)`

**Purpose:** Displays a preview of a case item inside the preview panel.

**Signature:**

```typescript
showCasePreview(pzInsKey: string, configObj?: Record<string, unknown>): void
```

**Example:**

```typescript
pConn.getActionsApi().showCasePreview(caseHandle);
```

---

### `showDataPreview(dataContext, dataContextParameters, options?)`

**Purpose:** Displays a preview of a data item inside the preview panel.

**Signature:**

```typescript
showDataPreview(dataContext: string, dataContextParameters: Record<string, unknown>, options?: Record<string, unknown>): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().showDataPreview('D_MyDataPage', { AccountID: accountId });
```

---

### `showData(pageName, dataContext, dataContextParameters, options?)`

**Purpose:** Displays the data of a page-type data page in a given target view.

**Signature:**

```typescript
showData(pageName: string, dataContext: string, dataContextParameters: Record<string, unknown>, options?: { containerName?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().showData('pyDetails', 'D_MyDataPage', { AccountID: accountId });
```

---

### `loadView(caseId, viewName, config?)`

**Purpose:** Loads a view populated with server data based on the context of a given case.

**Signature:**

```typescript
loadView(caseId: string, viewName: string, config: { containerName?: string; container?: string; context?: string; updateData?: boolean; readOnly?: boolean; actionName?: string }): Promise<object>
```

**Example:**

```typescript
await pConn.getActionsApi().loadView(caseId, 'pyReview', { readOnly: true });
```

---

## Refresh

### `refreshCaseView(caseID, viewID, pageReference, options?)`

**Purpose:** Refreshes case-view data for a given view.

**Signature:**

```typescript
refreshCaseView(caseID: string, viewID: string, pageReference: string, options?: ActionAPIOptions): Promise<RefreshCaseView>
```

**Example:**

```typescript
await pConn.getActionsApi().refreshCaseView(pConn.getCaseInfo().getKey(), 'pyCaseSummary', '');
```

**Notes:** One of the most commonly used `ActionsApi` methods for post-action UI refresh (assignments, embedded data, related cases, and so on). `pageReference` is typed as a required `string` in the typedefs (do not pass `null`); the typedefs do not document its meaning, so the example passes an empty string.

---

## Miscellaneous

### `getDescendants(caseID, context?)`

**Purpose:** Merges a case's descendant case data into application state for the given context.

**Signature:**

```typescript
getDescendants(caseID: string, context?: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().getDescendants(caseID, pConn.getContextName());
```

---

### `getRecents(maxResultsToFetch)`

**Purpose:** Fetches the operator's recently accessed items.

**Signature:**

```typescript
getRecents(maxResultsToFetch: number): Promise<unknown>
```

**Example:**

```typescript
const recents = await pConn.getActionsApi().getRecents(15);
```

---

### `invoke(url, opts?)`

**Purpose:** Invokes an arbitrary REST API through the service broker's fetch wrapper, scoped to the current context.

**Signature:**

```typescript
invoke(url: string, opts?: { method?: string; body?: Record<string, unknown> }): Promise<unknown>
```

**Example:**

```typescript
const response = await pConn.getActionsApi().invoke('/prweb/api/v1/data/D_MyDataPage');
```

**Notes:** Prefer `PCore.getRestClient().invokeRestApi()` for most REST needs — use `invoke()` only when you need a raw fetch scoped to the current `PConnect` context.

---

### `fillFormWithAI(containerItemID)`

**Purpose:** Fills the current assignment form with AI-generated sample data based on field name/type.

**Signature:**

```typescript
fillFormWithAI(containerItemID: string): Promise<unknown>
```

**Example:**

```typescript
await pConn.getActionsApi().fillFormWithAI(containerItemID);
```
