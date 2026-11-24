# Template essentials

Read this instead of the deep references for a typical template. Open a deep reference only for the cases listed at the end.

## Before you code

- States to cover (mark one not applicable with a reason): all regions populated, optional region empty, required region empty, one child unavailable, long child content, narrow width, wide width, all children of a region hidden, read-only parent, nested template, missing or string config (`NumCols`). Add "active tab hidden or removed" for tabs.
- Each covered state gets a `mock.ts` fixture, a story and at least one test assertion.
- Start from the scaffolded files; the scaffold is a working sample, replace demo content that does not serve the request. Delete scaffold helpers you do not use.

## index.tsx

- `interface Props extends PConnFieldProps` with `children: any[]` and optional props named exactly like the `config.json` properties (`NumCols`, `showLabel`, ...). Export `withConfiguration(AcmeLibMyTemplate)`; keep `import '../shared/create-nonce';`. `PCore` is a global; do not import it.
- `children` is one element per region, not per field. Normalize with `[props.children].flat(Infinity).filter(isValidElement)` and guard an empty value.
- Find a region by `region.props.getPConnect().getRawMetadata().name` (`A`, `B`, `C`, `Fields`), not by index; if `find` returns `undefined`, fall back to `children[0]`. Never rename scaffold regions.
- Editable layout: render `children` straight into a Cosmos `Grid`. Read-only or per-field layout: go one level down with `region.props.getPConnect().getChildren()`, render each with `getPConnect().getComponent()` in `useMemo`, and read labels with `resolveConfigProps(getConfigProps())`.
- Merge inherited props over your own: `{ label, showLabel, ...getPConnect().getInheritedProps() }`; inherited wins.
- Show the label when `showLabel` is true, or unset and editable; in display mode unless `showLabel === false`. No label, no heading.
- `NumCols` is a string: `parseInt(NumCols, 10) || 1`; `Grid` `gap` is a Cosmos spacing unit (for example `2`), not pixels. Normalize flags with `true | 'true'`; guard numbers with `Number.isFinite`.
- Branch on both `readOnly` and `displayMode === 'DISPLAY_ONLY'` (and `mode === 'editable'` on embedded data views). A DETAILS or read-only template forces each region child during render, with the same values every time:

```typescript
child.props.getPConnect().setInheritedProp('readOnly', true);
child.props.getPConnect().setInheritedProp('displayMode', 'DISPLAY_ONLY');
```

- Columns: `Grid` with `container={{ cols: 'repeat(N, minmax(0, 1fr))', gap }}`; column count and gap come from `config.json`, never hard-coded pixels. Block children (text areas, groups, tables) span the row. Wrap by container width, not viewport; prefer `Grid` responsive props or `useBreakpoint`.
- Do not wrap children in extra `div`s, set `100vh`, or add landmarks. Reading order matches visual order.
- Hidden children: hide the whole cell; when all children of a region or view are hidden, its heading disappears too. Show `EmptyState` when every region is empty.
- Render the elements the platform created; do not add your own error boundary around them.
- Use `FieldGroup` (with `name`) only when there is a label; show instructions only with a heading. Headings stay sequential: section `h2`, nested `h3`.
- Tabs: Cosmos `Tabs` and `TabPanel`; do not reimplement them. Keep tab ids unique and stable; fall back to the first visible tab.
- No secrets, tokens or per-environment URLs anywhere in the component folder (`check-component.mjs` fails).
- Never mutate `getRawMetadata()` objects; clone first. Call hooks before any early return. Key children by `getRawMetadata().config.value` or `.name`, never a random id.
- Localize labels with `PCore.getLocaleUtils().getLocaleValue(label, undefined, localeReference)`; `getLocalizedValue` is deprecated.
- Cosmos-first, without deep imports from `lib/components/...`; check any new Cosmos prop in its `.d.ts` in `node_modules`. Look up every `PCore` and `pConn` call in [pcore-pconnect-apis.md](./pcore-pconnect-apis.md); use only documented methods.
- No inline `style={{ ... }}`, `dangerouslySetInnerHTML`, `console`, nested ternaries, `++` or dead code.

## config.json

- Start from the scaffolded file, never from memory. Keep `type: "Template"`, the scaffolded `subtype`, the region `CONTENTPICKER` entries and `{ "format": "INSTRUCTIONS" }`.
- Region and layout names are PascalCase or a single letter (`NumCols`, `Fields`, `A`); renaming one breaks saved views.
- `NumCols` is a `SELECT` with keys `'1'`, `'2'`, `'3'` and a `defaultValue`. Set the `showLabel` default in `defaultConfig`.
- Add only properties the user confirmed; `index.tsx` reads every named one, or `check-component.mjs` fails (`CONTENTPICKER`, `INSTRUCTIONS`, `VISIBILITY` and similar are platform-handled).
- `validate-schema` rejects missing required keys, a wrong subtype, a property lacking `name`, `label` or `format`, and duplicates. It does not check `format`: use only scaffold formats. `SELECT` needs `source: [{ key, value }]`; `GROUP` has no `name`. Labels are sentence case without `@L`.

## styles.ts

- Keep the single default-exported `styled.div` wrapper.
- Rules only for what Cosmos cannot express; never grid, flex, card or gap rules.
- The theme is undefined here: `useTheme()` in `index.tsx`, pass values as transient props.
- Hide a grid item rather than relying on margins; delete selectors for markup that is gone.

## mock.ts and demo.stories.tsx

- `mock.ts` exports `configProps` (`label`, `showLabel`, `NumCols`, resolved values, never `@L`).
- Stories pass a `children` array and a fake `getPConnect` with exactly the methods the template calls (`getInheritedProps`, ...). For region or read-only behavior, fake children whose `getPConnect` provides `getRawMetadata`, `getChildren` and `setInheritedProp`.
- Base story is `Base<InnerFunctionName>`; one story per covered state.
- Meta `argTypes` gives every `config.json` property a matching control ([storybook-pattern.md](./storybook-pattern.md#controls-argtypes)); hide `getPConnect`.

## demo.test.tsx

- Query by role and accessible name (`getByRole('group', { name: 'Contact' })`); needing a test id is an accessibility finding. Use `fireEvent` (no `user-event`).
- One assertion per covered state: all regions populated; an empty optional region; all children hidden hides the heading; read-only calls `setInheritedProp` with both `readOnly` and `displayMode`; column count from config, including `'2'` and a missing value; region found by name when the order differs.
- Toggle props with `rerender`; never weaken an assertion.

## localizations.json

- A template that shows its own text lists every string under `fields` as `"English text": "English text"`, in step with the code.
- Use whole sentences with `{0}` placeholders; plurals are separate keys; do not translate data or cache translated text.

## Open a deep reference only when

| Situation | Read |
| --- | --- |
| Container-width columns, nested templates, label alignment, field groups, tabs, PAGE layouts, hidden-child re-render | [template-patterns.md](./template-patterns.md) |
| A FORM, DETAILS or PAGE specific rule | [form](../../form/SKILL.md), [details](../../details/SKILL.md), [page](../../page/SKILL.md) |
| A config format beyond the scaffold's, visibility, bindings | [config-schema.md](./config-schema.md) |
| A failing test, jsdom stubs, a fuller story fake | [test-pattern.md](./test-pattern.md), [storybook-pattern.md](./storybook-pattern.md) |
| A Cosmos component you have not used, theme palette keys | [cosmos-components.md](./cosmos-components.md), [styles-pattern.md](./styles-pattern.md) |
| Headings, focus, reflow, manual checks | [accessibility.md](./accessibility.md) |
| Placeholders, plurals, formatting | [localization.md](./localization.md) |
| Full prop list or skeleton | [props-contract.md](./props-contract.md), [component-patterns.md](./component-patterns.md) |
| The full state list | [state-matrix.md](./state-matrix.md) |
| An unusual layout | [choosing-type-and-subtype.md](./choosing-type-and-subtype.md) |

Finish with `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>`; see [cli-workflow.md](./cli-workflow.md).
