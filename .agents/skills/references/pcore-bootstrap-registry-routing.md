# PCore: Bootstrap, Registration & Routing

> Part of the [PCore / PConnect API Reference skills](../README.md). See [pcore-bootstrap-init-details.md](./pcore-bootstrap-init-details.md) for the full method catalogs of `ComponentsRegistry`, `Initialiser`, and `BootstrapUtils`.

## `getPCoreVersion()`

**Purpose:** Returns the version of the PCore/PConnect APIs for the current runtime.

**Signature:**

```typescript
getPCoreVersion(): string
```

**Example:**

```typescript
const pcoreVersion = PCore.getPCoreVersion(); // e.g. "26.1.0"
```

---

## `onPCoreReady(callback)`

**Purpose:** Registers a callback that fires once the application infrastructure has established the store and is ready to perform its initial render.

**Signature:**

```typescript
onPCoreReady(callback: (root: unknown, target: string | null) => void): void
```

**Example:**

```typescript
PCore.onPCoreReady((root, target) => {
  renderApplication(root, target);
});
```

**Notes:** `root.props` provides the top-level component's `getPConnect()`; `target` (or `root.domContainerID`) identifies where to mount the rendered tree.

---

## `onPCoreCleanup(callback)`

**Purpose:** Registers a callback that fires when the application is about to be dismounted (for example, a Web Embed scenario or an explicit logout).

**Signature:**

```typescript
onPCoreCleanup(callback: (config: {
  domContainerID: string | null;
  portalTarget: HTMLDivElement;
  styleSheetTarget: HTMLDivElement;
}) => void): void
```

**Example:**

```typescript
PCore.onPCoreCleanup(({ domContainerID, portalTarget }) => {
  const target = domContainerID ? document.getElementById(domContainerID) : portalTarget;
  if (target) {
    unmountApplication(target);
  }
});
```

**Notes:** Primarily relevant for Web Embed integrations, where the mounted application must be cleanly torn down.

---

## `getComponentsRegistry()`

**Purpose:** Returns the component registry, which exposes methods to register or override the components used to render the view tree.

**Signature:**

```typescript
getComponentsRegistry(): ComponentsRegistry
```

**Example:**

```typescript
const registry = PCore.getComponentsRegistry();
const componentDefinition = registry.getComponent('TextInput');
```

**Notes:** Useful when replacing a built-in component with a custom implementation, or registering an entirely new component type.

---

## `checkIfSemanticURL()`

**Purpose:** Checks whether the current browser URL is shaped like a semantic URL.

**Signature:**

```typescript
checkIfSemanticURL(): boolean
```

**Example:**

```typescript
if (!PCore.checkIfSemanticURL()) {
  // fall back to non-semantic navigation handling
}
```

---

## `isValidSemanticURL()`

**Purpose:** Checks whether the current browser URL is a semantic URL that also resolves to a registered route.

**Signature:**

```typescript
isValidSemanticURL(): boolean
```

**Example:**

```typescript
if (PCore.isValidSemanticURL()) {
  // safe to restore state from the current semantic URL
}
```

**Notes:** Distinct from `checkIfSemanticURL()`, which only checks the URL's shape without validating that it maps to a known route.

---

## `getViewResources()`

**Purpose:** Returns the `ViewResources` API, used to fetch or update view metadata.

**Signature:**

```typescript
getViewResources(): ViewResources
```

**Example:**

```typescript
const viewConfig = PCore.getViewResources().fetchViewResources(viewName, pConn, classID);
```

**Notes:** `fetchViewResources(viewName, pConn, classID)` resolves view metadata synchronously from the local rule store; `updateViewResources(response)` updates the rule store from a server response asynchronously.

---

## `configureForBrowserBookmark(payload)`

**Purpose:** Configures the browser's URL/bookmark state to reflect the current view or container.

**Signature:**

```typescript
configureForBrowserBookmark(payload: {
  context: string;
  containerName: string;
  ruleName?: string;
  className?: string;
  semanticURL?: string;
}): void
```

**Example:**

```typescript
PCore.configureForBrowserBookmark({
  context,
  containerName: 'primary',
  ruleName: viewName,
  className
});
```

---

## `registerComponentCreator(creator)`

**Purpose:** Registers the function responsible for turning a `PConnect` context into a rendered component instance — the bridge between core and a specific UI library (React, Angular, Web Components).

**Signature:**

```typescript
registerComponentCreator(creator: (pConn: PConnect, additionalProps?: object) => unknown): void
```

**Example:**

```typescript
PCore.registerComponentCreator((pConn, additionalProps = {}) => {
  const configProps = pConn.getConfigProps();
  return renderComponentForType(pConn.getComponentName(), { ...configProps, ...additionalProps });
});
```

**Notes:** Must be registered once during bridge setup, before any component tree is rendered.

---

## `getInitialiser()`

**Purpose:** Returns the `Initialiser`, used during bootstrap to set up routing, services, environment info, and to launch the initial view/portal.

**Signature:**

```typescript
getInitialiser(): Initialiser
```

**Example:**

```typescript
PCore.getInitialiser()
  .start(bootstrapConfig)
  .then(() => {
    // application is ready to render
  });
```

**Notes:** `start()` returns a `Promise` — chain subsequent bootstrap steps in `.then()`.

---

## `getBootstrapUtils()`

**Purpose:** Returns `BootstrapUtils`, a lower-level API surface for loading and rendering root components during application bootstrap.

**Signature:**

```typescript
getBootstrapUtils(): BootstrapUtils
```

**Example:**

```typescript
PCore.getBootstrapUtils()
  .loadRootComponent('app-root', rootContainer, [], rootElement, stylesElement, true)
  .then(() => {
    // root component is ready
  });
```

**Notes:** Prefer a higher-level bootstrap entry point (like `getInitialiser()`) when one meets your needs; use `getBootstrapUtils()` only for low-level bootstrap customization.
