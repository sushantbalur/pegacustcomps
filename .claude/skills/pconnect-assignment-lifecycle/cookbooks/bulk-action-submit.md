---
title: Bulk-submit selected rows from a list
keywords: [select all, checkbox, mass update, multiple cases, modal]
primary_methods: [ListActions.getSelectedRows, ActionsApi.openBulkAction, ListActions.clearSelectedRows]
related: [repeating-row-edit]
---

# Recipe: Bulk-submit selected rows from a list

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A user has selected several rows in a list and needs to submit a bulk action against exactly those rows, then clear the selection.

## Solution

Uses [`ListActions`](../../references/pconnect-list-actions.md) and [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
// The typedefs type the result as a bare `object`; with `withPayload` false it is the array of selected row keys.
const selectedKeys = (await pConn.getListActions().getSelectedRows(false)) as string[];
// getCaseSummary() is typed `any`; its documented keys are caseID, ID (assignment ID), caseClass, name, urgency, routedTo.
// Confirm which keys your runtime returns for the bulk context before relying on these names.
const { ID: bulkContextID, caseTypeID: bulkContextType } = pConn.getCaseSummary();

await pConn.getActionsApi().openBulkAction(actionID, {
  selectedList: selectedKeys,
  containerName: 'modal',
  bulkContextID,
  bulkContextType,
  callbacks: {
    submit: async () => {
      await pConn.getListActions().clearSelectedRows();
    }
  }
});
```

## Discussion

`getSelectedRows(false)` resolves to a `string[]` of selected row keys, not row objects — pass it straight through as `selectedList`.

**NEVER** call `submitBulkAction` directly with the selected keys — `openBulkAction` opens the bulk-action modal and registers `submitBulkAction`/`submitBulkActionAsync` on its own submit button internally, and `submitBulkAction` only accepts a single `containerItemID` string established by the opened bulk-action context.

**MUST** clear the selection inside the `submit` callback, which only fires once the platform confirms the bulk action was submitted.

## Related recipes

- [Edit a repeating row with validation, then save](../../pconnect-lists-and-views/cookbooks/repeating-row-edit.md)
