# Bootstrap, Initialisation & Component Registry — Method Details

> Part of the [PCore / PConnect API Reference skills](../README.md). Companion to [pcore-bootstrap-registry-routing.md](./pcore-bootstrap-registry-routing.md), which covers the top-level `PCore.get*()` accessors. This file catalogs the methods available on the objects those accessors return.
>
> **Audience note:** `Initialiser` and `BootstrapUtils` are almost entirely used by the portal shell / SDK bridge layer during application startup — a typical custom component does not call these directly. They're cataloged here for completeness (for example, if you're building a custom SDK bridge or embedding integration), but most component authors can skip this section entirely.

## ComponentsRegistry (via `PCore.getComponentsRegistry()`)

| Method                                                     | Signature                                           | Purpose                                                  |
| ---------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| `register(componentName, component)`                       | `(componentName: string, component: unknown): void` | Registers a component descriptor with the registry.      |
| `getComponent(componentName)`                              | `(componentName: string): unknown`                  | Returns a registered component descriptor by name.       |
| `registerLazyMap(componentName, component)`                | `(componentName: string, component: unknown): void` | Registers a component for lazy (deferred) loading.       |
| `getLazyComponent(componentName)`                          | `(componentName: string): unknown`                  | Returns a lazily-loaded component by name.               |
| `registerCustomComponentLazyMap(componentName, component)` | `(componentName: string, component: unknown): void` | Registers a custom component for lazy loading.           |
| `getCustomComponent(componentName)`                        | `(componentName: string): unknown`                  | Returns a lazily-loaded custom component by name.        |
| `mergeComponentsMap(componentsMap?)`                       | `(componentsMap?: unknown): void`                   | Merges a map of component descriptors into the registry. |
| `mergeOverrideMap(overrideMap?)`                           | `(overrideMap?: unknown): void`                     | Merges a map of component overrides into the registry.   |
| `getOverrideMap()`                                         | `(): unknown`                                       | Returns the current override map.                        |
| `getLazyMap()`                                             | `(): unknown`                                       | Returns the current lazy-component map.                  |

**Example:**

```typescript
const registry = PCore.getComponentsRegistry();
registry.register('MyCustomWidget', { component: MyCustomWidgetComponent });
```

---

## Initialiser (via `PCore.getInitialiser()`)

| Method                                                                                                                                             | Signature                                                                       | Purpose                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `init(configObj)`                                                                                                                                  | `(configObj: unknown): Promise<void>`                                           | Initializes the application with the given configuration.          |
| `start(config, callback?)`                                                                                                                         | `(config: unknown, callback?: () => void): Promise<boolean>`                    | Initiates bootstrapping and loads component libraries.             |
| `configureTheme(theme?)`                                                                                                                           | `(theme?: unknown): void`                                                       | Configures light/dark theme settings. Not in the 5.1.0 typedefs, so TypeScript may need a cast (e.g. `(PCore.getInitialiser() as any).configureTheme(...)`). |
| `getBootstrapConfig(restServerUrl, tokenInfo)`                                                                                                     | `(restServerUrl: string, tokenInfo: unknown): Promise<unknown>`                 | Fetches the bootstrap configuration from the server.               |
| `initCoreContainers(options?)`                                                                                                                     | `(options?: { containerType?: string }): unknown`                               | Initializes core containers and returns a `getPConnect` function.  |
| `initCoreConfig(config)`                                                                                                                           | `(config: unknown): Promise<void>`                                              | Initializes core configuration, routing, and history.              |
| `launchPortal(targetDom, portalName, containerTargetName?, preLoadComponents?, ccLibs?)`                                                           | `(...): Promise<unknown>`                                                       | Launches the portal shell into a DOM target.                       |
| `launchView(targetDom, viewMetadata, preLoadComponents, runtimeParams, portalTarget, styleSheetTarget, containerTargetName)`                      | `(...): void`                                                                   | Launches a specific view into a DOM target. All 7 arguments are required (`preLoadComponents` is typed `string[] \| undefined`, so pass `undefined` explicitly if unused). |
| `launchViewByName(targetDom, viewName, portalName, viewClass, additionalComponents, portalTarget, styleSheetTarget, containerTargetName, ccLibs?)` | `(...): Promise<void>`                                                          | Launches a view identified by name into a DOM target.              |
| `launchMashup(targetDom, usePegaMashupStyling?, ccLibs?)`                                                                                          | `(targetDom: string, usePegaMashupStyling?: boolean, ccLibs?: unknown[]): void` | Launches a mashup/embed into a DOM target.                         |
| `loadEnvironmentInfoFromDataPage(config)`                                                                                                          | `(config: unknown): Promise<void>`                                              | Loads environment information from the environment-info data page. |
| `loadDataPagesIntoEnvironmentInfo(dataPages)`                                                                                                      | `(dataPages: unknown[]): Promise<void>`                                         | Merges specified data page results into environment info.          |
| `loadEnvironmentInfo(config)`                                                                                                                      | `(config: unknown): Promise<void>`                                              | Loads theme, branding, and key-mapping info from configuration.    |
| `loadCustomComponentLibrariesIfEnabled(ccLibs)`                                                                                                    | `(ccLibs: unknown[]): Promise<void>`                                            | Conditionally loads custom component libraries if enabled.         |
| `loadCustomComponentLibraries(ccLibs)`                                                                                                             | `(ccLibs: unknown[]): Promise<void>`                                            | Loads all custom component libraries from the given list.          |
| `importSingleCustomComponent(ccLib)`                                                                                                               | `(ccLib: unknown): Promise<void>`                                               | Imports a single custom component.                                 |
| `importReactRoot()`                                                                                                                                | `(): Promise<unknown>`                                                          | Imports the React root component module.                           |
| `importDesignSystemComponentMap(appStaticContentServer, environmentId, alternateDesignSystemName)`                                                 | `(...): Promise<void>`                                                          | Dynamically loads an alternate design system's component map.      |
| `buildSemanticUrl(pathInfo, queryParams, noPortal, restServer, viewName)`                                                                          | `(...): string`                                                                 | Constructs a semantic URL from path and query information.         |
| `registerForDebugInfo(channel)`                                                                                                                    | `(channel: unknown): void`                                                      | Registers a debug-message handler and enables preview mode.        |
| `toggleTracerHeaders(channel)`                                                                                                                     | `(channel: unknown): void`                                                      | Toggles tracer headers on/off based on channel messages.           |

**Example:**

```typescript
PCore.getInitialiser()
  .start(bootstrapConfig)
  .then(() => {
    // application is ready
  });
```

---

## BootstrapUtils (via `PCore.getBootstrapUtils()`)

| Method                                                                                                                            | Signature                                                            | Purpose                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `loadRootComponent(domContainerID, componentMetaData, additionalComponents?, portalTarget?, styleSheetTarget?, removeContainer?)` | `(...): Promise<void>`                                               | Renders the root container and loads the component tree.           |
| `renderApp(translatedDXAPIResponse, domContainerID)`                                                                              | `(translatedDXAPIResponse: unknown, domContainerID: string): void`   | Renders the application from a DX API response.                    |
| `updateStoreWithUiRoot(dxAPIResponse, containerName, isPortal)`                                                                   | `(...): Promise<void>`                                               | Updates application state with a UI root response.                 |
| `loadComponent(componentConfig, domContainerID, additionalComponents)`                                                            | `(...): Promise<void>`                                               | Loads and renders a single component.                              |
| `loadView(dxAPIResponse, domContainerID, additionalComponents?)`                                                                  | `(...): Promise<void>`                                               | Loads view metadata and renders the application.                   |
| `loadViewByName(viewName, portalName, viewClass, containerName)`                                                                  | `(...): void`                                                        | Loads a view by name into a container.                             |
| `loadPortalView(portalName, containerName)`                                                                                       | `(portalName: string, containerName: string): void`                  | Loads the portal shell and renders it.                             |
| `loadMashup(targetDom, usePegaMashupStyling?)`                                                                                    | `(targetDom: string, usePegaMashupStyling?: boolean): Promise<void>` | Loads a Constellation mashup into a DOM target.                    |
| `bootstrapWithAuthHeader(config, target, preLoadComponents?, portalTarget?, styleSheetTarget?)`                                   | `(...): Promise<void>`                                               | Runs a full bootstrap sequence with an authorization header.       |
| `getBootstrapConfig(restServerUrl, tokenInfo)`                                                                                    | `(restServerUrl: string, tokenInfo: unknown): Promise<unknown>`      | Fetches the bootstrap configuration via a direct fetch call.       |
| `getBootstrapConfigViaSB(restServerUrl, additionalHeaders, themeID)`                                                              | `(...): Promise<unknown>`                                            | Fetches bootstrap configuration via the service broker.            |
| `getBootstrapConfigExtended(restServerUrl, authorizationHeader, additionalHeaders, themeID, customCookies, locale)`               | `(...): Promise<unknown>`                                            | Fetches bootstrap configuration with theme/locale parameters.      |
| `getLPConfig(restServerUrl, authorizationHeader, additionalHeaders, customCookies)`                                               | `(...): Promise<unknown>`                                            | Fetches Launchpad environment configuration.                       |
| `applyEnvironmentInfoResponse(config)`                                                                                            | `(config: unknown): Promise<unknown>`                                | Parses and applies an environment-info server response.            |
| `initAppShell(appRoutingTable, actionsTargetModel, servicesObj)`                                                                  | `(...): void`                                                        | Initializes routing, actions, and services for the app shell.      |
| `initRoutingTable(appRoutingTable, servicesObj)`                                                                                  | `(appRoutingTable: unknown, servicesObj: unknown): void`             | Initializes routing and services only.                             |
| `initStore()`                                                                                                                     | `(): void`                                                           | Initializes the application state store.                           |
| `enableAppRouting(enableRouting)`                                                                                                 | `(enableRouting: boolean): void`                                     | Enables or disables application routing.                           |
| `setAppAlias(appAlias)`                                                                                                           | `(appAlias: string): void`                                           | Sets the application alias used for asset loading.                 |
| `setStaticServerUrl(staticUrl, appStaticUrl, b2sJWT)`                                                                             | `(staticUrl: string, appStaticUrl: string, b2sJWT: string): void`    | Configures the static asset server URLs.                           |
| `setFetchDefaultHeaders(headersObj)`                                                                                              | `(headersObj: unknown): void`                                        | Sets default HTTP headers applied to all requests.                 |
| `setFetchAuthInfo(authInfo)`                                                                                                      | `(authInfo: unknown): void`                                          | Sets authentication information used by outgoing requests.         |
| `setFieldsDefaultConfigs(config)`                                                                                                 | `(config: unknown): void`                                            | Sets default field configurations.                                 |
| `setGoogleMapsAPIKey(googleMapsAPIKey)`                                                                                           | `(googleMapsAPIKey: string): void`                                   | Configures the Google Maps API key.                                |
| `getHomeRestApi(portalName)`                                                                                                      | `(portalName: string): string`                                       | Returns the REST path to a portal's home endpoint.                 |
| `getViewRestApi(viewID, viewClass)`                                                                                               | `(viewID: string, viewClass: string): string`                        | Returns the REST path to a view endpoint.                          |
| `getCaseApi()`                                                                                                                    | `(): unknown`                                                        | Returns the case API module.                                       |
| `getMashupApi()`                                                                                                                  | `(): unknown`                                                        | Returns the mashup API module.                                     |
| `getContextUtils()`                                                                                                               | `(): unknown`                                                        | Returns the context utilities module.                              |
| `getRoutingManager()`                                                                                                             | `(): unknown`                                                        | Returns the routing manager module.                                |
| `getComponentsRegistry()`                                                                                                         | `(): ComponentsRegistry`                                             | Returns the components registry instance.                          |
| `getStateManager()`                                                                                                               | `(): unknown`                                                        | Returns the state manager module.                                  |
| `createC11nEnv(meta)`                                                                                                             | `(meta: unknown): PConnect`                                          | Creates a `PConnect` (`C11nEnv`) object from metadata.             |
| `configureForBrowserBookmark(payload)`                                                                                            | `(payload: unknown): void`                                           | Publishes browser bookmark configuration.                          |
| `checkIfSemanticURL()`                                                                                                            | `(): boolean`                                                        | Checks whether the current URL is a semantic URL.                  |
| `onPCoreReady(callback)`                                                                                                          | `(callback: Function): void`                                         | Registers a callback for when the render infrastructure is ready.  |
| `onPCoreCleanup(callback)`                                                                                                        | `(callback: Function): void`                                         | Registers a callback for when the application should be unmounted. |

**Example:**

```typescript
PCore.getBootstrapUtils()
  .loadRootComponent('app-root', rootContainer, [], rootElement, stylesElement, true)
  .then(() => {
    // root component is ready
  });
```

**Notes:** Several `BootstrapUtils` methods overlap with dedicated top-level `PCore.*` accessors (for example, `PCore.onPCoreReady()`, `PCore.configureForBrowserBookmark()`) — prefer the top-level `PCore.*` accessor when one exists, and reach for `getBootstrapUtils()` only for lower-level bootstrap customization not otherwise exposed.
