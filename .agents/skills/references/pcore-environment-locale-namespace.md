# PCore: Environment, Locale & Namespace

> Part of the [PCore / PConnect API Reference skills](../README.md). See [pcore-environment-info-details.md](./pcore-environment-info-details.md) for the full method catalogs of `EnvironmentInfo`, `LocaleUtils`, and `AuthUtils`.

## `getEnvironmentInfo()`

**Purpose:** Returns the `EnvironmentInfo` API — locale, operator, and application information.

**Signature:**

```typescript
getEnvironmentInfo(): EnvironmentInfo
```

**Example:**

```typescript
const envInfo = PCore.getEnvironmentInfo();
const applicationName = envInfo.getApplicationName();
const locale = envInfo.getLocale();
```

---

## `switchLocale(locale)`

**Purpose:** Switches the application locale at runtime and hot-reloads locale bundles without a full page reload.

**Signature:**

```typescript
switchLocale(locale: string): Promise<void>
```

**Example:**

```typescript
await PCore.switchLocale('fr-FR');
```

---

## `getLocaleUtils(locale?)`

**Purpose:** Returns a `LocaleUtils` instance scoped to the given locale (or the current operator locale if omitted).

**Signature:**

```typescript
getLocaleUtils(locale?: string): LocaleUtils
```

**Example:**

```typescript
const localizedLabel = PCore.getLocaleUtils().getLocaleValue('pyLabel');
```

---

## `registerLocaleManager(customLocaleUtilApis)`

**Purpose:** Registers custom `LocaleUtils` implementations, overriding the default ones in place.

**Signature:**

```typescript
registerLocaleManager(customLocaleUtilApis: Partial<LocaleUtils>): void
```

**Example:**

```typescript
PCore.registerLocaleManager({
  getLocaleValue: (key) => myCustomTranslationLookup(key)
});
```

**Notes:** Only the keys present on `customLocaleUtilApis` are overridden — every other `LocaleUtils` method keeps its default implementation.

---

## `getQualifiedName(ruleName, namespace)`

**Purpose:** Returns the fully qualified rule name for the given namespace.

**Signature:**

```typescript
getQualifiedName(ruleName: string, namespace: string): string
```

**Example:**

```typescript
const qualifiedName = PCore.getQualifiedName('TestRule', 'MyNamespace'); // "MyNamespace__TestRule"
```

---

## `getDefaultQualifiedName(ruleName)`

**Purpose:** Returns the rule name qualified with the application's default namespace.

**Signature:**

```typescript
getDefaultQualifiedName(ruleName: string): string
```

**Example:**

```typescript
const dataPageName = PCore.getDefaultQualifiedName('D_Accounts');
```

---

## `getNameSpaceUtils()`

**Purpose:** Returns `NamespaceUtils`, which provides namespace-related helpers (`getQualifiedName`, `getDefaultQualifiedName`, and related utilities).

**Signature:**

```typescript
getNameSpaceUtils(): NamespaceUtils
```

**Example:**

```typescript
const dataPageName = PCore.getNameSpaceUtils().getDefaultQualifiedName('D_Accounts');
```

---

## `getNetworkUtils()`

**Purpose:** Returns the central controller for online/offline application state.

**Signature:**

```typescript
getNetworkUtils(): NetworkUtils
```

**Example:**

```typescript
const isOnline = PCore.getNetworkUtils().isOnline();

const unsubscribe = PCore.getNetworkUtils().onStatusChange((online) => {
  // react to connectivity changes
});
```

**Notes:** Prefer this over reading `navigator.onLine` directly or adding your own `online`/`offline` window listeners.

---

## `getAuthUtils()`

**Purpose:** Returns `AuthUtils`, used to manage authentication tokens for REST API calls.

**Signature:**

```typescript
getAuthUtils(): AuthUtils
```

**Example:**

```typescript
PCore.getAuthUtils().setTokens(tokenObject);
```
