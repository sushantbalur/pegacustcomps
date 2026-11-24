---
title: Register a custom validator for business-rule field validation
keywords: [custom validator, business rule validation, cross-field validation, register validator]
primary_methods: [FormUtils.setCustomValidator, ValidationApi.validate]
related: [full-form-validation]
---

# Recipe: Register a custom validator for business-rule field validation

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A field needs validation logic beyond what's configured on the field itself — for example, a business rule that compares two fields' values — and that logic should run through the same validation pipeline as built-in validators rather than being wired up ad hoc in the component.

## Solution

Uses `FormUtils` and `ValidationApi` (`FormUtils` via `PCore.getFormUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md); `ValidationApi` via `pConn.getValidationApi()`, see [pconnect-validation-api.md](../../references/pconnect-validation-api.md)).

```typescript
// Register once, near app bootstrap — not per component instance.
PCore.getFormUtils().setCustomValidator('endDateAfterStartDate', (value, context) => {
  const startDate = PCore.getStoreValue('.StartDate', 'caseInfo.content', context);
  return value > startDate ? undefined : 'End date must be after the start date';
});
```

```typescript
// At the field, run validation the same way as any other field.
const result = pConn.getValidationApi().validate(endDateValue, 'EndDate');
if (!result.status) {
  // result.message reflects whichever validator (built-in or custom) failed
}
```

## Discussion

**MUST** register a given validator `type` name once — registering the same type name a second time (for example, from another component that also calls `setCustomValidator` with the same string) silently replaces the first registration, the same last-write-wins hazard as `ConfirmDialogService.registerConfirmHandler`.

**SHOULD** keep custom validator functions pure and side-effect-free — they can run on every keystroke depending on the field's validation trigger, so anything beyond a synchronous check (a network call, for example) belongs in `validateEmail`-style pre-submit validation instead, not a custom validator.

## Related recipes

- [Validate an entire form before allowing submit](./full-form-validation.md)
