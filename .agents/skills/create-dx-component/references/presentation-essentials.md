# Presentation essentials

Read this instead of the deep references for a typical presentation. Open a deep reference only for the cases listed at the end.

## Before you code

- There are no Presentation rows in the state matrix: use the Widget rows for the data the case view shows and the Template rows for its regions. Cover optional props being absent (`subheading`, `banners`, `utilities` and similar); long content and narrow width usually apply too.
- Each covered state gets a `mock.ts` fixture, a story and at least one test assertion.
- Start from the scaffolded files; the scaffold is a working sample, replace demo content that does not serve the request. Its plain-HTML markup is a placeholder to replace with Cosmos components.

## index.tsx

- Props are `CaseViewProps` from `@pega/cosmos-react-work` (`CASEVIEW`) or `@pega/cosmos-react-wss` (`WSSCASEVIEW`). Read `node_modules/@pega/cosmos-react-work/lib/components/CaseView/CaseView.types.d.ts` (for `WSSCASEVIEW`, the same path under `node_modules/@pega/cosmos-react-wss/lib/components/CaseView/`; if it is missing, list that folder) before using a prop.
- No `getPConnect`, `PCore`, `getActionsApi`, `getValidationApi` or any PCore/PConnect API; the lint rule `no-pcore-pconnect-in-presentation` rejects them. If the props do not carry the data, the component should be a Widget.
- Pure render: output is a deterministic function of props. No data fetching or side-effecting effects; local UI state (open, hover) is fine.
- Keep `export default withConfiguration(...)`. The scaffold has no `create-nonce` import: add `import '../shared/create-nonce';` if you keep `styled-components` (copy [create-nonce.ts](../assets/create-nonce.ts) into `src/components/shared/` if missing).
- Cosmos-first (`Flex`, `Text`, `Status`, `Tag`, `Count`, `Icon`, `FieldValueList`, `Tabs`, ...). Check any new Cosmos prop in its `.d.ts`.
- No inline `style={{ ... }}`, `dangerouslySetInnerHTML`, `console`, dead code, secrets, tokens or per-environment URLs (`check-component.mjs` fails).

## config.json

- Keep `type: "Presentation"` and the scaffolded `subtype`; `validate-schema` rejects any subtype other than `CASEVIEW` and `WSSCASEVIEW`.
- `"properties": []` by default. Add a property only if the user wants a designer-configurable setting, and make `index.tsx` read it.

## styles.ts

- Keep the single default-exported `styled.div` wrapper; add rules only for what Cosmos cannot express.
- The theme is undefined here: `useTheme()` in `index.tsx`, pass values as transient props.

## mock.ts and demo.stories.tsx

- `mock.ts` holds sample case view props; extend it when the component reads more props.
- Stories render the component with those props; no `getPConnect` or `PCore` fakes are needed. One story per covered state.

## demo.test.tsx

- Assert on rendered output only, querying by role and accessible name first. Use `fireEvent` (no `user-event`).
- One assertion per covered state, including a render with the optional props absent. Never weaken an assertion.

## localizations.json

- The scaffold ships one listing its visible strings under `fields` as `"English text": "English text"`. Keep it in step with the text the component renders.

## Open a deep reference only when

| Situation | Read |
| --- | --- |
| The full Presentation procedure | [presentation](../../presentation/SKILL.md) |
| The Widget and Template state rows | [state-matrix.md](./state-matrix.md) |
| A Cosmos component you have not used, theme palette keys | [cosmos-components.md](./cosmos-components.md), [styles-pattern.md](./styles-pattern.md) |
| A failing test | [test-pattern.md](./test-pattern.md) |
| Headings, focus, keyboard, manual checks | [accessibility.md](./accessibility.md) |
| Localization rules | [localization.md](./localization.md) |
| A config property | [config-schema.md](./config-schema.md) |
| The full skeleton or the props contract | [component-patterns.md](./component-patterns.md), [props-contract.md](./props-contract.md) |

Finish with `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>`; see [cli-workflow.md](./cli-workflow.md).
