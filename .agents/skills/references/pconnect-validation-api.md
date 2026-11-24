# ValidationApi

> Part of the [PCore / PConnect API Reference skills](../README.md). Obtained via `pConn.getValidationApi()`.

## `validate(value, propertyName?)`

**Purpose:** Validates a field's value against the validators configured on that field, and updates the field's validation message in application state.

**Signature:**

```typescript
validate(value: string, propertyName?: string): { status: boolean; message?: string }
```

**Example:**

```typescript
const result = pConn.getValidationApi().validate(inputValue);
if (!result.status) {
  // result.message contains the validation error
}
```

---

## `validateEmail(value, options?)`

**Purpose:** Validates an email address (RFC 5322 by default, or RFC 822 if requested) without automatically displaying errors on the field — the result is returned directly to the caller.

**Signature:**

```typescript
validateEmail(value: string, options?: { useRFC822Validation?: boolean }): { status: 'success' } | { status: 'failure'; message: string }
```

**Example:**

```typescript
const result = pConn.getValidationApi().validateEmail(emailValue);
if (result.status === 'failure') {
  // show result.message next to the email field
}
```

**Notes:** Unlike `validate()`, this does not write anything to application state — it's a pure validation utility for custom error handling.
