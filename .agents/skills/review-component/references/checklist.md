# Review Checklist

Each item has an id, the check, and the severity if it fails. The right-hand column names the reference that explains the rule. Mark an item not applicable only when it truly does not apply, and say so.

## Common (every component)

| Id | Check | If it fails | Reference |
| --- | --- | --- | --- |
| C1 | Every requirement in the brief is implemented. | Blocker | the brief |
| C2 | Every `config.json` property changes behavior. Its default in `config.json` matches the fallback in code, and numbers and booleans that arrive as strings are normalized. | Major | [config-schema.md](../../create-dx-component/references/config-schema.md) |
| C3 | The UI is built from Cosmos components. Styled-components appear only for what Cosmos cannot express, and there are no inline styles. | Minor, Major if layout or text is hand-built | [AGENTS.md](../../../../AGENTS.md) |
| C4 | No `dangerouslySetInnerHTML`. Any URL from data is checked against an allow-list of protocols before it is rendered as a link. No secrets or environment URLs. | Blocker | [field-behavior.md](../../create-dx-component/references/field-behavior.md) |
| C5 | Imports are only React, Cosmos packages, styled-components and local files, unless the user approved a library. | Major | [AGENTS.md](../../../../AGENTS.md) |
| C6 | The component is exported with `withConfiguration()` and imports `create-nonce`. | Major | [create-dx-component](../../create-dx-component/SKILL.md) |
| C7 | Visible text goes through the localization service, not hard-coded literals, apart from scaffold placeholders. | Minor | [widget-patterns.md](../../create-dx-component/references/widget-patterns.md) |
| C8 | Every PCore and PConnect method called appears in the API catalog. An undocumented one is justified to the user. | Major | [pcore-pconnect-apis.md](../../create-dx-component/references/pcore-pconnect-apis.md) |

## Field

| Id | Check | If it fails | Reference |
| --- | --- | --- | --- |
| F1 | Typing updates a local draft. The store is written on blur (or on change only for stepper and slider variants), not on every keystroke. | Major | [field-behavior.md](../../create-dx-component/references/field-behavior.md) |
| F2 | A blur with an unchanged value does not commit but still validates. An unchanged empty value validates `''`. | Major | field-behavior.md |
| F3 | Clearing sends `''`. Zero is a value: there is no `if (!value)` on a number. A `null` stored value is read as empty (`?? ''`). | Blocker if a clear or zero corrupts data | field-behavior.md |
| F4 | Invalid input is never silently turned into another value (`''`, `0`) and committed. An out-of-range or malformed draft is not committed, and the user sees an error. | Blocker | field-behavior.md |
| F5 | `DISPLAY_ONLY`, `readOnly`, `disabled` and `required` are handled, including string booleans. A read-only control cannot commit. | Major | [props-contract.md](../../create-dx-component/references/props-contract.md) |
| F6 | `validatemessage` becomes an error status and replaces the helper text. `clearErrorMessages` runs on edit. Hiding the label keeps the helper text. | Minor | field-behavior.md |
| F7 | The subtype traps in field-behavior.md are respected: date-only values are not time-zone shifted, a URL is checked against `http` and `https`, a phone number that is only a country code is empty, a picklist stores the key and shows the label. | Blocker or Major | field-behavior.md |

## Widget

| Id | Check | If it fails | Reference |
| --- | --- | --- | --- |
| W1 | The fetch effect resets loading and error at the start, ignores a response that arrives after unmount or a dependency change, and returns a cleanup. | Major | [widget-patterns.md](../../create-dx-component/references/widget-patterns.md) |
| W2 | A failed load is an error state, never an empty list. "Nothing to show" and "could not load" are different messages. | Major | widget-patterns.md |
| W3 | Object props are dependencies by a stable key, not by identity, and a change in any input refetches. | Major | widget-patterns.md |
| W4 | Loading, empty, error, retry and refresh exist and use Cosmos state components. Refresh keeps the current rows visible. | Major | [state-matrix.md](../../create-dx-component/references/state-matrix.md) |
| W5 | An async action cannot be activated twice, and its pending flag is reset when it fails. | Major | widget-patterns.md |
| W6 | Every subscription uses a unique name, unsubscribes with the same name and context, and is not recreated on every render. | Major | widget-patterns.md |
| W7 | A failed mutation shows a message. A destructive action asks for confirmation and does not run if confirmation is unavailable. Focus is restored after a delete. | Major | widget-patterns.md |
| W8 | List keys are stable ids, not the array index. | Minor | widget-patterns.md |

## Template

| Id | Check | If it fails | Reference |
| --- | --- | --- | --- |
| T1 | `children` are treated as regions. Fields come from `getChildren()`, regions are found by name, and the element from `getComponent()` is memoized. | Major | [template-patterns.md](../../create-dx-component/references/template-patterns.md) |
| T2 | A DETAILS template forces `readOnly` and `displayMode: 'DISPLAY_ONLY'` on its children. | Blocker for DETAILS | template-patterns.md |
| T3 | `NumCols` and other numeric settings are parsed from strings with a fallback. | Major | template-patterns.md |
| T4 | Hidden children leave no gap, and a region whose children are all hidden also drops its heading. | Minor | template-patterns.md |
| T5 | Columns use `minmax(0, 1fr)` tracks. There is no fixed pixel width for text, no `100vh`, no landmark such as `main`, and no `document.title` change. | Minor | template-patterns.md |
| T6 | Heading levels are sequential, and instructions appear only when a heading is shown. | Minor | template-patterns.md |

## Accessibility

| Id | Check | If it fails | Reference |
| --- | --- | --- | --- |
| A1 | Every control has an accessible name. Hiding the label keeps a name. Repeated controls have distinct names. | Major | [accessibility.md](../../create-dx-component/references/accessibility.md) |
| A2 | An error is tied to its control and is not shown by color alone. | Major | accessibility.md |
| A3 | Everything a pointer can do works from the keyboard, focus stays visible, and focus moves deliberately after an action, never on load. | Major | accessibility.md |
| A4 | Loading finished, saved and failed are announced without taking focus. | Major | accessibility.md |
| A5 | Text wraps, nothing needs a fixed width, and the layout works at narrow widths. | Minor | accessibility.md |

## Tests and stories

| Id | Check | If it fails | Reference |
| --- | --- | --- | --- |
| S1 | Each applicable state in the state matrix has a story and an assertion. | Major | [state-matrix.md](../../create-dx-component/references/state-matrix.md) |
| S2 | Tests assert what a user sees and the arguments of commits. No `.skip` or `.only`, no deleted assertions, and no test that only checks the mock. | Major | [test-pattern.md](../../create-dx-component/references/test-pattern.md) |
| S3 | Tests cover the edge cases: empty, `null`, zero, long values, and for widgets a late response and a failed request. | Major | test-pattern.md |
| S4 | Mock data is deterministic and contains no production data or secrets. | Minor | test-pattern.md |

## Report honesty

| Id | Check | If it fails |
| --- | --- | --- |
| R1 | Every claim in the author's report (built, tested, verified, accessible) is supported by the check table or by code you read. A step shown as `NOT RUN` or `FAIL` is not reported as passing. | Blocker |
