# Template Patterns

How production Constellation templates receive children, read configuration, force read-only, lay out columns, group fields and handle hidden children. States are in [state-matrix.md](./state-matrix.md); the code skeleton is in [component-patterns.md](./component-patterns.md); the `config.json` shapes are in [config-schema.md](./config-schema.md).

Use only PCore/PConnect methods documented in the [API catalog](./pcore-pconnect-apis.md). Where this file names a method the catalog does not document, it says so. Cosmos props and components come from a newer Cosmos than customers may have installed, so check the `.d.ts` in `node_modules/@pega/cosmos-react-core` and `@pega/cosmos-react-work` first.

## Children are regions

The `children` prop is **one element per region**, not one per field. Look at what the scaffold does before choosing a layout:

- **Editable layout:** render `children` straight into the Cosmos `Grid`. The platform has already resolved each region; this is what the FORM scaffold does.
- **Read-only layout:** go one level down. A region's fields are `region.props.getPConnect().getChildren()`, which returns `[{ getPConnect }]`. Render each with `getPConnect().getComponent()`, and read its label and settings with `getPConnect().resolveConfigProps(getPConnect().getConfigProps())`. The DETAILS and FORM scaffolds do this in `DetailsRender.tsx`.
- **Per-field layout** (column spans, per-field visibility, label/value pairs) always needs the second form, because the region element hides the fields.

Normalize the prop first: `const children = [props.children].flat(Infinity).filter(isValidElement)`.

Find a region by name, not by position: `region.props.getPConnect().getRawMetadata().name`. The generic region names are `A`, `B` and `C` (the PAGE, DETAILS and FORM-region scaffolds), with `Fields` for a single-region form. Fall back to the first child only if the named region is missing. Do not rename these in a copied scaffold; saved views depend on them.

Memoize the element you get from `getComponent()` (`useMemo(() => pConn.getComponent(), [])`). A new element every render remounts the child and loses its focus and state.

A node whose raw metadata `type` is `reference` is a view reference; its content is available through `getReferencedViewPConnect().getPConnect()`. Render a reference child directly, without wrapping it in a label/value pair. Test it with `getRawMetadata().type === 'reference'`, not with private fields.

Never mutate raw child metadata (`getRawMetadata()` objects). Clone it first; a mutation leaks across renders.

## Reading configuration

- Merge inherited props over your own: `const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };`. Inherited values win, because a parent view reference can override a child view's heading.
- Show the label when `showLabel` is true, or when it is unset and the view is editable. In display mode, show it unless `showLabel === false`. Return no heading when there is no label.
- Numbers and booleans arrive as strings. `NumCols` is a string select (`'1'`, `'2'`, `'3'`): use `parseInt(NumCols, 10) || 1`. Normalize `true | 'true'` for flags, and guard numeric settings with `Number()` plus `Number.isFinite`.
- `showLabel` defaults differ by template (a form defaults to false, a details view to true); set the default in `defaultConfig` so the property panel matches.
- Per-child settings are read with `getConfigProps()`: `visibility`, `displayMode`, and layout hints such as `isFormWidth`, `isContainerWidth` and `detailFVLItem`.
- Localize labels with `PCore.getLocaleUtils().getLocaleValue(label, undefined, localeReference)`; `pConn.getLocalizedValue` is deprecated.

## Forcing read-only

A DETAILS template must make its fields display-only, and the shipped scaffold does it on every region child:

```typescript
children.forEach((child) => {
  child.props.getPConnect().setInheritedProp('readOnly', true);
  child.props.getPConnect().setInheritedProp('displayMode', 'DISPLAY_ONLY');
});
```

Without this a custom DETAILS template shows editable inputs. It is called during render, so it must be idempotent (same values every render, none that depend on a loop variable). `setInheritedProp` takes an optional third argument in the platform source that carries the prop across nested view boundaries; check the installed typedefs before using it, because the catalog documents two arguments.

For a field you create from the template's own configuration (highlighted data), set `field.config.displayMode = 'DISPLAY_ONLY'` on a copy of the metadata before `getPConnect().createComponent(...)`, as the scaffold's `HighlightRender` does.

Branch on **both** `readOnly` and `displayMode === 'DISPLAY_ONLY'`. Do not lay out read-only values with the editable grid (see label alignment below).

## Columns and responsive layout

- Build columns from `Grid` with `minmax(0, 1fr)` tracks. For fixed ratios: `narrowWide` is `minmax(0, 1fr) minmax(0, 2fr)` and `wideNarrow` is `minmax(0, 2fr) minmax(0, 1fr)`. Use those names for a layout property.
- **Wrap by container width, not viewport width.** A template can sit in a narrow side panel or a modal, so a viewport media query lies. Measure the template's own container with a `ResizeObserver` (create it in `useLayoutEffect` to avoid a first-paint flash, and `disconnect()` it in cleanup). Collapse to one column when the container is narrower than `minFieldWidth * columns + gaps` (production uses a 16rem minimum field width, and a 620px container for two columns in a tab). Compute `rem` in pixels inside the hook, not at module load.
- Cosmos also offers `useBreakpoint('md')` and responsive `Grid` props (`md={{ container: { cols } }}`). Prefer `Grid` over a hand-written media query.
- **Block children span the row.** Large controls (`TextArea`, `RichText`, `RadioButtons`, `Checkbox` groups, `Attachment`, `Address`, `Group`, embedded tables and references) get `item={{ colStart: '1', colEnd: cols + 1 }}`. A field config flag `isFormWidth` does the same. Tables (`isContainerWidth`) are lifted out of the column grid into their own block.
- A long value goes **stacked** (label above) instead of inline: a text area or rich text of about 60 characters or more, an image URL, a map. Otherwise inline.
- A theme setting that places helper text above the field forces a single column.
- Nested templates: an embedded view inside a form normally inherits the outer column count rather than starting its own grid. Add an `inheritParentLayout` boolean (and, as the scaffold does, a `templateOverrideMode` select with `USE_TEMPLATE` / `IGNORE_TEMPLATE`) if the template can be nested. Share the outer count through your own React context between your own templates.
- Do not set `100vh` or a page height. The shell owns scrolling.

### Label alignment in read-only lists

Put consecutive simple fields in **one** `FieldValueList` (or the Cosmos `Details` list) so labels share a column. Separate lists break the alignment. Start a new list at a non-simple child (a nested view, table, group or editable reference). `@pega/cosmos-react-work` exports `Details`, `DetailsList` and `DetailsContext`, which already handle container-width columns, heading depth, `narrowWide` / `wideNarrow` arrangement, an empty-column `EmptyState` and label-column alignment; check whether the installed version has them before hand-building. A Checkbox's label comes from `caption`, not `label`.

## Field groups and headings

- `FieldGroup` with a `name` renders a `fieldset` with a `legend`; without a name it is a plain `div`. The legend is not a heading unless you pass `headingTag`. It also supports `description`, `collapsed` with `onToggleCollapsed` (the button has `aria-expanded`), `status='error'` and `variant='form-group'`.
- `FieldGroupList` renders an ordered list of groups (a repeating section) with `id`, `headingTag`, `status`, `collapsed` and `onDelete` per item.
- Wrap in a `FieldGroup` only when there is a label to show. Show **instructions only when a heading is shown** (WCAG 2.4.6 and 3.3.2). The `{ "format": "INSTRUCTIONS" }` property yields an `instructions` prop that can be `'casestep'`, `'none'`, a string, or `{ htmlContent, messageType, dismissBanner }` (`Caution`, `Information` and `Good` map to `Banner` variants `warning`, `info` and `success`). An unprocessed `'@PARAGRAPH ...'` string should be hidden, not shown.
- Heading levels: the page template owns the `h1`; a top-level section is `h2`; nested content is `h3` and below. Keep them sequential by `Text variant` or `headingTag`.
- Collapsible row state: keep a `Map<rowId, boolean>` keyed by a stable id (the unique field value, else the index). Seed existing rows from the setting, start rows added later expanded, and no cleanup is needed on delete.

## Hidden, invisible and empty children

- A child with `visibility: false` renders `null`, but your wrapper cell stays and leaves an empty gap. Hide the whole cell, and hide the whole block when every cell is hidden.
- A view or group whose children are all hidden collapses, and its heading must disappear too. Write a local `hasVisibleChild` over `getChildren()` using `isVisible()` and `getConfigProps().visibility !== false`.
- A template that reads `isVisible()` in render may not re-render when a child's visibility flips, because the platform's connect layer is internal. If it matters, register a value with `registerAdditionalProps` (documented) so the template re-renders, and test the flip.
- Empty states: show `EmptyState` when every region has no children. If every child is an Insight, or a single Pulse, skip the surrounding `Card` so it is not double-wrapped.
- One broken child does not break its siblings as long as you render the elements the platform created; the platform wraps each in an error boundary. Do not add your own boundary around them, which would hide errors the platform surfaces.

## Tabs

Use Cosmos `Tabs` and `TabPanel`. They already provide `role=tablist`, `aria-orientation`, `role=tab` with `aria-selected` and `aria-controls`, a roving `tabIndex`, Arrow-key navigation, `role=tabpanel` with `aria-labelledby`, and `inert` on inactive panels. Do not reimplement them.

- `tabs` entries are `{ id, name, count?, errors?, disabled?, href? }`. Ids become DOM ids; keep them unique and stable (`${viewName}-${name}-${index}`, or a unique field value for row tabs).
- Active tab: keep the current tab if it is still visible, otherwise fall back to the first visible one. Re-run this when visibility or the data changes, so deleting the active tab never leaves a dangling id.
- Vertical tabs only at `md` and up: `useBreakpoint('md') ? type : 'horizontal'`.
- Create content lazily for display tabs, and mount all tabs for editable forms (validation needs every field).
- Persist the active tab with `PCore.getNavigationUtils().setComponentState(key, state)` and read it with `getComponentState`; derive the key from the case and view names. Remove it with `removeComponentState` when it is no longer needed.
- Style with `[aria-orientation='vertical']` and `[role]` selectors. Do not deep-import Cosmos internals (`StyledTab`, `lib/components/...`); they are not public API.

## PAGE templates

Delegate to the public Cosmos page templates: `OneColumnPage`, `TwoColumnPage`, `ThreeColumnPage`, `WideNarrowPage`, `NarrowWidePage`, `TabbedPage` and `DynamicLayoutPage`. Their common props are `title`, `icon`, `actions`, `banners`, `path`, `header`, `utilities` and the region slots `a`, `b`, `c`. Pass region elements straight into the slots.

- Offer the layout as a `SELECT` (`one-column`, `two-column`, `narrow-wide`, `wide-narrow`) and show the region B picker only for layouts that use it (`"visibility": "$this.layout == 'two-column'"`).
- Cosmos owns scrolling, the `md` breakpoint, sticky regions and heading focus. Do not set `document.title` (the platform sets it) and do not move focus to the heading yourself.
- Add no `<main>` or other landmark; the shell owns them.

## Passing context to children

- `setInheritedProp(name, value)` on the template or a child (documented), and `setInheritedConfig` (documented).
- `registerAdditionalProps({ key: '@P caseInfo.lastUpdateTime' })` pushes a store value in as a prop (documented).
- Your own React context between your own components, and `DetailsContext` from `@pega/cosmos-react-work` if you use `Details`.
- Scope pub/sub events to an instance id so two forms on a page do not react to each other (see [widget-patterns.md](./widget-patterns.md)).
- When a local and an inherited prop collide, the inherited one wins.

## Memoization

- `useMemo` the heavy trees (the content element, the tab array, highlighted data) with the real inputs as dependencies. Memoize context values you provide.
- Call hooks **before** any early return. A read-only early return placed above a hook breaks the call order.
- Key children by `getRawMetadata().config.value` or `.name`, with the index as a last resort. Do not use a random id (`createUID()` or `crypto.randomUUID()`) as a key; it remounts every render.

## List and table templates

Pega's list templates sit on internal libraries and cannot be reproduced by a customer, so there is little to copy. The transferable parts: identify rows by a unique field (or index), and use that id for keys, collapse state, tab ids and deletion (re-find the row by id, because indexes shift); keep the latest values in refs for stable callbacks; subscribe with a per-instance id and always unsubscribe; and when the last row is deleted while focus was inside the table, move focus to the Add button.

## Traps

1. `getComponent()` in render without `useMemo` remounts the child.
2. Indexing `children[i]` instead of finding a region by name.
3. A section heading shown over an all-hidden view.
4. Mutating raw child metadata.
5. A `display:none` cell breaking `:last-child` margin logic; with `Grid` gap, hide the item rather than relying on margins.
6. `displayMode` also arrives on embedded data views; handle `mode === 'editable'` together with `displayMode`.
7. Reading `NumCols` as a number when it is a string.
8. Cosmos deep imports from `lib/components/...`.
9. Setting the document title or focusing the heading in a PAGE template.
10. Calling `setInheritedProp` with a changing value in a loop during render.
11. Reading `oneRem` in pixels at module load, and forgetting to disconnect a `ResizeObserver`.
