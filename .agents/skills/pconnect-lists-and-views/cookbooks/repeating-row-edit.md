---
title: Edit a repeating row with validation, then save
keywords: [table row, grid, embedded list, inline edit, field-level validation]
primary_methods: [ValidationApi.validate, ListActions.updateProperty]
related: [bulk-action-submit, full-form-validation]
---

# Recipe: Edit a repeating row with validation, then save

> Part of the [Lists, Containers & Views cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A field within a repeating row (table/grid) needs to be validated before the row's underlying data is updated.

## Solution

Uses [`ListActions`](../../references/pconnect-list-actions.md) and [`ValidationApi`](../../references/pconnect-validation-api.md).

```typescript
const result = pConn.getValidationApi().validate(newExperienceValue, '.Experience');

if (result.status) {
  pConn.getListActions().updateProperty('.Experience', newExperienceValue);
} else {
  // result.message contains the validation error to display on the row.
}
```

## Discussion

`validate()` (unlike `validateEmail()`) writes the error directly into application state, so the field itself will show `result.message` without extra wiring.

The 5.1.0 typedefs type `updateProperty`'s `value` as `GenericObject | undefined` (`Record<string, unknown>`), so a primitive value needs a cast to compile — for example `newExperienceValue as unknown as Record<string, unknown>`.

## Related recipes

- [Bulk-submit selected rows from a list](../../pconnect-assignment-lifecycle/cookbooks/bulk-action-submit.md)
- [Validate an entire form before allowing submit](../../pconnect-forms-and-fields/cookbooks/full-form-validation.md)
