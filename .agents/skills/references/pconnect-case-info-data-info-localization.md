# CaseInfo, DataInfo & LocalizationService

> Part of the [PCore / PConnect API Reference skills](../README.md). `CaseInfo` is obtained via `pConn.getCaseInfo()`, `DataInfo` via `pConn.getDataInfo()`, and `LocalizationService` via `pConn.getLocalizationService()`.

## CaseInfo

### `getCaseStages(caseID, contextName, options?)`

**Purpose:** Fetches (asynchronously, from the server) the case stages for a specified case.

**Signature:**

```typescript
getCaseStages(caseID: string, contextName: string, options?: { caseTypeID?: string }): Promise<unknown>
```

**Example:**

```typescript
const stages = await pConn.getCaseInfo().getCaseStages(caseID, pConn.getContextName());
```

**Notes:** Distinct from the synchronous `pConn.getCaseStages()` on the `PConnect` object itself, which reads stages directly from state without a network call — see [pconnect-case-validation-utilities.md](./pconnect-case-validation-utilities.md#getcasestages).

---

### `getCaseActions(caseID, contextName, options?)`

**Purpose:** Fetches (asynchronously, from the server) the available case actions/processes for a specified case.

**Signature:**

```typescript
getCaseActions(caseID: string, contextName: string, options?: { caseTypeID?: string }): Promise<unknown>
```

**Example:**

```typescript
const actions = await pConn.getCaseInfo().getCaseActions(caseID, pConn.getContextName());
```

---

### `getCaseTypeName()`

**Purpose:** Returns the case type's name.

**Signature:**

```typescript
getCaseTypeName(): string | undefined
```

**Example:**

```typescript
const caseType = pConn.getCaseInfo().getCaseTypeName();
```

---

### `getName()`

**Purpose:** Returns the case's name/label.

**Signature:**

```typescript
getName(): string
```

**Example:**

```typescript
const caseName = pConn.getCaseInfo().getName();
```

---

### `getClassName()`

**Purpose:** Returns the case's class name.

**Signature:**

```typescript
getClassName(): string
```

**Example:**

```typescript
const classID = pConn.getCaseInfo().getClassName();
```

---

### `getAvailableProcesses()`

**Purpose:** Returns the case's available processes.

**Signature:**

```typescript
getAvailableProcesses(): unknown[]
```

**Example:**

```typescript
const processes = pConn.getCaseInfo().getAvailableProcesses();
```

---

### `getKey()`

**Purpose:** Returns the case's full key, including class.

**Signature:**

```typescript
getKey(): string
```

**Example:**

```typescript
const caseKey = pConn.getCaseInfo().getKey();
```

---

### `getObjectKey()`

**Purpose:** Returns the encoded object identifier for a data-object context.

**Signature:**

```typescript
getObjectKey(): string
```

**Example:**

```typescript
const objectKey = pConn.getCaseInfo().getObjectKey();
```

---

### `getID()`

**Purpose:** Returns the short case ID.

**Signature:**

```typescript
getID(): string | undefined
```

**Example:**

```typescript
const caseId = pConn.getCaseInfo().getID();
```

---

### `getAssignmentID()`

**Purpose:** Returns the ID of the current assignment.

**Signature:**

```typescript
getAssignmentID(): string
```

**Example:**

```typescript
const assignmentId = pConn.getCaseInfo().getAssignmentID();
```

---

### `getActions()`

**Purpose:** Returns the case's action buttons (main and secondary).

**Signature:**

```typescript
getActions(): ActionButtons

// ActionButtons = { main?: SecondaryButton[]; secondary?: SecondaryButton[] } | undefined
// SecondaryButton = { actionID: string; jsAction: string; name: string; isErrorButton?: boolean; buttonType?: string }
```

**Example:**

```typescript
const { main = [], secondary = [] } = pConn.getCaseInfo().getActions() ?? {};
```

---

### `getActiveFlowActionID()`

**Purpose:** Returns the ID of the flow action currently being rendered.

**Signature:**

```typescript
getActiveFlowActionID(): string
```

**Example:**

```typescript
const flowActionID = pConn.getCaseInfo().getActiveFlowActionID();
```

---

### `getParentCaseInfo()`

**Purpose:** Returns parent case info when the current assignment belongs to a child case.

**Signature:**

```typescript
getParentCaseInfo(): unknown
```

**Example:**

```typescript
const parentCaseInfo = pConn.getCaseInfo()?.getParentCaseInfo();
```

---

### `isPerform()`

**Purpose:** Returns `true` if the view is in perform (edit) mode.

**Signature:**

```typescript
isPerform(): boolean
```

**Example:**

```typescript
const isPerform = pConn.getCaseInfo().isPerform();
```

---

### `isReview()`

**Purpose:** Returns `true` if the view is in review mode.

**Signature:**

```typescript
isReview(): boolean
```

**Example:**

```typescript
const isReview = pConn.getCaseInfo().isReview();
```

---

### `isReviewAfterCreateStage()`

**Purpose:** Returns `true` if the case is in review mode and its last completed stage was create-type.

**Signature:**

```typescript
isReviewAfterCreateStage(): boolean
```

**Example:**

```typescript
const isReviewAfterCreate = pConn.getCaseInfo().isReviewAfterCreateStage();
```

---

### `getCurrentAssignmentViewName()`

**Purpose:** Returns the name of the current assignment's view.

**Signature:**

```typescript
getCurrentAssignmentViewName(): string | null
```

**Example:**

```typescript
const viewName = pConn.getCaseInfo().getCurrentAssignmentViewName();
```

---

### `getCurrentAssignmentViewClassName()`

**Purpose:** Returns the class name of the current assignment's view.

**Signature:**

```typescript
getCurrentAssignmentViewClassName(): string | null
```

**Example:**

```typescript
const viewClass = pConn.getCaseInfo().getCurrentAssignmentViewClassName();
```

---

### `getBusinessID()`

**Purpose:** Returns the case's business ID (distinct from the internal key).

**Signature:**

```typescript
getBusinessID(): string
```

**Example:**

```typescript
const businessID = pConn.getCaseInfo().getBusinessID();
```

---

### `getAssignments()`

**Purpose:** Returns the case's assignments.

**Signature:**

```typescript
getAssignments(): unknown
```

**Example:**

```typescript
const assignments = pConn.getCaseInfo().getAssignments();
```

---

### `getChildAssignments()`

**Purpose:** Returns child cases' assignments.

**Signature:**

```typescript
getChildAssignments(): unknown
```

**Example:**

```typescript
const childAssignments = pConn.getCaseInfo().getChildAssignments();
```

---

### `isCaseWideLocalAction()`

**Purpose:** Checks whether the current action is a case-wide local action.

**Signature:**

```typescript
isCaseWideLocalAction(): boolean
```

**Example:**

```typescript
if (pConn.getCaseInfo().isCaseWideLocalAction()) {
  // adjust rendering for a case-wide local action
}
```

---

### `getAllAssignments()`

**Purpose:** Returns all assignments — the case's own assignments plus any child-case assignments combined.

**Signature:**

```typescript
getAllAssignments(): unknown[]
```

**Example:**

```typescript
const allAssignments = pConn.getCaseInfo().getAllAssignments();
```

---

### `getActiveCaseActionName()`

**Purpose:** Returns the name of the currently active case action.

**Signature:**

```typescript
getActiveCaseActionName(): string
```

**Example:**

```typescript
const activeActionName = pConn.getCaseInfo().getActiveCaseActionName();
```

---

### `getFirstCaseActionName()`

**Purpose:** Returns the name of the first configured case action.

**Signature:**

```typescript
getFirstCaseActionName(): string
```

**Example:**

```typescript
const firstActionName = pConn.getCaseInfo().getFirstCaseActionName();
```

---

### `hasAssignments()`

**Purpose:** Checks whether the case has any assignments.

**Signature:**

```typescript
hasAssignments(): boolean
```

**Example:**

```typescript
if (pConn.getCaseInfo().hasAssignments()) {
  // render assignment-dependent UI
}
```

---

### `hasMessages()`

**Purpose:** Checks whether the case has any messages.

**Signature:**

```typescript
hasMessages(): boolean
```

**Example:**

```typescript
if (pConn.getCaseInfo().hasMessages()) {
  // render a messages banner
}
```

---

### `hasGetNextWorkLinks()`

**Purpose:** Checks whether "get next work" links are available for the case.

**Signature:**

```typescript
hasGetNextWorkLinks(): boolean
```

**Example:**

```typescript
if (pConn.getCaseInfo().hasGetNextWorkLinks()) {
  // show a "Get Next Work" action
}
```

---

## DataInfo

### `getContextKey()`

**Purpose:** Returns the context key for the data object bound to the current component (the data-object equivalent of `CaseInfo.getID()`).

**Signature:**

```typescript
getContextKey(): string | undefined
```

**Example:**

```typescript
const contextKey = pConn.getDataInfo().getContextKey();
```

---

## LocalizationService

Obtained via `pConn.getLocalizationService(localeReference?)` — see [pconnect-reference-context-component.md](./pconnect-reference-context-component.md#getlocalizationservicelocalereference).

### `getLocalizedText(input, args?)`

**Purpose:** Retrieves the localized value for a given key/text and substitutes any token arguments.

**Signature:**

```typescript
getLocalizedText(input: string, args?: string[]): string
```

**Example:**

```typescript
const label = pConn.getLocalizationService().getLocalizedText('Submit');
```

**Notes:** This is the recommended replacement for the deprecated `pConn.getLocalizedValue()`.

---

### `getLocalizedMessage(input, args?)`

**Purpose:** Retrieves a localized message string from message locale fields (rather than general field-label text).

**Signature:**

```typescript
getLocalizedMessage(input: string, args?: string[]): string
```

**Example:**

```typescript
const message = pConn.getLocalizationService().getLocalizedMessage('pyMessageKey');
```

---

### `getLocalizedDataPage(input, dataPageName, fieldName, args?)`

**Purpose:** Retrieves localized text for a given data page name and field name (for example, option labels sourced from a data page).

**Signature:**

```typescript
getLocalizedDataPage(input: string, dataPageName: string, fieldName: string, args?: string[]): string
```

**Example:**

```typescript
const optionLabel = pConn.getLocalizationService().getLocalizedDataPage(optionText, 'D_MyOptions', 'DisplayName');
```

---

### `setLookupList(lookupList)`

**Purpose:** Sets a custom lookup list used to determine the locale-resolution order for this `LocalizationService` instance.

**Signature:**

```typescript
setLookupList(lookupList: string[]): void
```

**Example:**

```typescript
pConn.getLocalizationService().setLookupList(['CASE!MY-CASE-TYPE', 'WORK-']);
```
