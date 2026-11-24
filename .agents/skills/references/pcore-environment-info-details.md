# EnvironmentInfo, LocaleUtils & AuthUtils — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-environment-locale-namespace.md](./pcore-environment-locale-namespace.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.
>
> This is a curated subset — methods that are purely internal bootstrap/theme-branding plumbing are intentionally omitted.

## EnvironmentInfo (via `PCore.getEnvironmentInfo()`)

| Method                      | Signature                                                          | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `getLocale()`               | `(): string \| undefined`                                          | Returns the current operator locale.                                      |
| `getTimeZone()`             | `(): string \| undefined`                                          | Returns the application's configured time zone.                           |
| `getOperatorIdentifier()`   | `(): string \| undefined`                                          | Returns the current operator's identifier.                                |
| `getOperatorName()`         | `(): string \| undefined`                                          | Returns the current operator's user name.                                 |
| `getApplicationName()`      | `(): string \| undefined`                                          | Returns the application name.                                             |
| `getApplicationLabel()`     | `(): string \| undefined`                                          | Returns the localized application label.                                  |
| `getApplicationID()`        | `(): string \| undefined`                                          | Returns the application ID.                                               |
| `getAccessGroup()`          | `(): string \| undefined`                                          | Returns the operator's access group.                                      |
| `getPortalName()`           | `(): string \| undefined`                                          | Returns the current portal name.                                          |
| `getRenderingMode()`        | `(): string \| undefined`                                          | Returns the rendering mode (`FULL_PORTAL`, `EMBED`, `HYBRID`, `PREVIEW`). |
| `getFeatureMap()`           | `(): Record<string, unknown>`                                      | Returns the configured application feature-flag overrides.                |
| `isWSSPortal()`             | `(): boolean`                                                      | Checks whether the current portal is a WSS (self-service) type.           |
| `isInfinityRuntime()`       | `(): boolean`                                                      | Returns whether the runtime is Pega Infinity (as opposed to Launchpad).   |
| `isGenAIEnabled()`          | `(): boolean`                                                      | Returns whether the GenAI feature is enabled for the application.         |
| `isPegaMobile()`            | `(): boolean`                                                      | Checks whether the app is running inside the Pega Mobile shell.           |
| `getMaxAttachmentSize()`    | `(): number \| undefined`                                          | Returns the system-configured attachment size limit, in MB.               |
| `getTheme(options?)`        | `(options?: { type: 'light' \| 'dark' }): unknown`                 | Returns theme overrides for light or dark mode.                           |
| `setTheme(theme, options?)` | `(theme: unknown, options?: { type: 'light' \| 'dark' }): unknown` | Updates theme overrides for light or dark mode.                           |
| `getBaseLocale()`           | `(): string`                                                       | Returns the base locale string (defaults to `'en-US'`).                   |
| `getKeyMapping(keyValue)`   | `(keyValue: string): string \| null`                               | Returns the Launchpad-namespaced identifier for a given key.              |
| `getRuntime()`              | `(): 'Browser' \| 'Native'`                                        | Returns the runtime environment type.                                     |
| `getCaseTypeList()`         | `(): unknown[]`                                                    | Returns the list of case types available in the application.              |

**Example:**

```typescript
const envInfo = PCore.getEnvironmentInfo();
const applicationName = envInfo.getApplicationName();
const isEmbedMode = envInfo.getRenderingMode() === 'EMBED';
```

---

## LocaleUtils (via `PCore.getLocaleUtils()`)

| Method                                                                   | Signature                                                                                          | Purpose                                                                                |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `getLocaleValue(localeKey, localePath?, localeRuleKey?, componentName?)` | `(localeKey: string, localePath?: string, localeRuleKey?: string, componentName?: string): string` | Returns the localized value for a key, falling back to the raw key if not found.       |
| `getPortalLocaleReference(portal)`                                       | `(portal: string \| null): string`                                                                 | Returns the locale reference string for a portal (for example, `PORTAL!WEBPORTAL`).    |
| `getCaseLocaleReference(caseClass)`                                      | `(caseClass: string): string \| null`                                                              | Returns the locale reference string for a case type (for example, `CASE!MY-APP-WORK`). |
| `setLocaleForRule(localeJson, localeRuleKey)`                            | `(localeJson: unknown, localeRuleKey: string): void`                                               | Sets the locale bundle for a specific rule key.                                        |
| `getLocaleForRule(localeRuleKey)`                                        | `(localeRuleKey: string): unknown`                                                                 | Returns the locale bundle fields for a rule key.                                       |
| `resetLocaleStore()`                                                     | `(): void`                                                                                         | Resets the in-memory localization store.                                               |
| `loadLocaleResources(locales)`                                           | `(locales: string[]): Promise<void>`                                                               | Loads locale bundles and localization assets for the given locales.                    |
| `setTimezone(timezone)`                                                  | `(timezone: string): void`                                                                         | Sets the active time zone.                                                             |
| `getTimeZoneInUse()`                                                     | `(): string`                                                                                       | Returns the configured time zone, falling back to the browser's time zone.             |

**Example:**

```typescript
const localizedLabel = PCore.getLocaleUtils().getLocaleValue('pyLabel');
const caseLocaleRef = PCore.getLocaleUtils().getCaseLocaleReference('MyOrg-MyApp-Work-Request');
```

---

## AuthUtils (via `PCore.getAuthUtils()`)

| Method                          | Signature                                                         | Purpose                                                          |
| ------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| `setTokens(tokenInfo)`          | `(tokenInfo: TokenInfo): void`                                    | Adds an access token to outgoing REST request headers. `TokenInfo` is defined below the example. |
| `getAuthInstance(config)`       | `(config: unknown): unknown`                                      | Returns an OAuth 2.0 auth instance for the given configuration.  |
| `revokeTokens()`                | `(): Promise<void>`                                               | Revokes the current access and refresh tokens.                   |
| `setAuthorizationHeader(value)` | `(value: string): void`                                           | Sets the `Authorization` header value used on outgoing requests. |

**Example:**

```typescript
PCore.getAuthUtils().setTokens({ token_type: 'Bearer', access_token: token, expires_in: expiresIn, eA: eA });
// ...on logout
await PCore.getAuthUtils().revokeTokens();
```

**`TokenInfo`** (from the typedefs' `service_broker/types.d.ts`):

```typescript
type TokenInfo = {
  expires_in: number;
  eA: number; // required; its meaning is not documented in the typedefs
  session_index?: string;
  token_type?: string;
  refresh_token?: string;
} & ({ csrf: string; access_token?: undefined } | { csrf?: undefined; access_token: string });
```

Exactly one of `csrf` or `access_token` is supplied.
