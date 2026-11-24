# ContainerManager

> Part of the [PCore / PConnect API Reference skills](../README.md). Obtained via `pConn.getContainerManager()`.

## `initializeContainers(containerInfo)`

**Purpose:** Initializes a container (single or multiple type) within a complex component.

**Signature:**

```typescript
initializeContainers(containerInfo: { type?: 'single' | 'multiple'; name?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getContainerManager().initializeContainers({ type: 'single', name: containerName });
```

---

## `addContainerItem(containerInfo)`

**Purpose:** Adds an item to a container.

**Signature:**

```typescript
addContainerItem(containerInfo: {
  context?: string;
  semanticURL?: string;
  containerItemID?: string | null;
  target?: string;
  caseViewMode?: string;
  data?: { coreHeaders?: unknown; classID?: string };
}): Promise<unknown>
```

**Example:**

```typescript
await pConn.getContainerManager().addContainerItem({ context, semanticURL: '' });
```

---

## `updateContainerItem(containerInfo)`

**Purpose:** Updates the data of an existing item within a container.

**Signature:**

```typescript
updateContainerItem(containerInfo: { context: string; key?: string; target?: string; data?: Record<string, unknown> }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getContainerManager().updateContainerItem({ context: containerItemID, data: { caseInfo } });
```

---

## `activateContainerItem(containerInfo)`

**Purpose:** Activates a specific item within a container (for example, bringing a modal/tab item to the foreground).

**Signature:**

```typescript
activateContainerItem(containerInfo: { containerItemID: string; context?: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getContainerManager().activateContainerItem({ containerItemID });
```

---

## `removeContainerItem(containerInfo)`

**Purpose:** Removes an item from a container.

**Signature:**

```typescript
removeContainerItem(containerInfo: { containerItemID: string; skipReleaseLockRequest?: boolean }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getContainerManager().removeContainerItem({ containerItemID });
```

---

## `resetContainers(containerInfo)`

**Purpose:** Resets a container (or containers) back to its initial state.

**Signature:**

```typescript
resetContainers(containerInfo: { name: string; context: string }): Promise<unknown>
```

**Example:**

```typescript
await pConn.getContainerManager().resetContainers({ name: 'preview', context: 'app' });
```

---

## `addTransientItem(containerInfo)`

**Purpose:** Adds a transient item to a container — used to hold values (for example, search filters or inline-edit staging data) that should not be submitted with the case's regular content.

**Signature:**

```typescript
addTransientItem(containerInfo: { id: string; sourceContainerItemId?: string }): string
```

**Example:**

```typescript
const transientId = pConn.getContainerManager().addTransientItem({
  id: 'InlineEdit',
  sourceContainerItemId: pConn.getContextName()
});
```

**Notes:** Returns the newly created transient item's ID synchronously (not a `Promise`).

---

## `updateTransientData(transientObject)`

**Purpose:** Updates the data held by a transient item.

**Signature:**

```typescript
updateTransientData(transientObject: { transientItemID: string; data: Record<string, unknown> }): void
```

**Example:**

```typescript
pConn.getContainerManager().updateTransientData({ transientItemID, data: { comment } });
```

---

## `removeTransientItem(transientItemInfo)`

**Purpose:** Removes a transient item.

**Signature:**

```typescript
removeTransientItem(transientItemInfo: { transientItemID: string }): void
```

**Example:**

```typescript
pConn.getContainerManager().removeTransientItem({ transientItemID });
```

---

## `hasContainerItems()`

**Purpose:** Checks whether the container has any items.

**Signature:**

```typescript
hasContainerItems(): boolean
```

**Example:**

```typescript
if (pConn.getContainerManager().hasContainerItems()) {
  // container has at least one item
}
```

---

## `isContainerInitialized()`

**Purpose:** Checks whether the container has been initialized.

**Signature:**

```typescript
isContainerInitialized(): boolean
```

**Example:**

```typescript
if (!pConn.getContainerManager().isContainerInitialized()) {
  pConn.getContainerManager().initializeContainers({ type: 'single', name: containerName });
}
```
