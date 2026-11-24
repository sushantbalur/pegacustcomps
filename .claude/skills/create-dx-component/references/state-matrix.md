# State Matrix

Decide which states a component covers **before** writing code, and show the list to the user with the contract. The same list then drives `mock.ts`, the stories and the tests, so a state that is not in the matrix is not built, not demonstrated and not tested.

Cover every row marked *applicable* for the type. Mark a row *not applicable* with a reason instead of silently skipping it.

## How to use it

1. Copy the rows for the component type into the plan and mark each *applicable* or *not applicable*.
2. For each applicable row, state what is visible, what is interactive and what is announced.
3. Give each applicable row one `mock.ts` fixture and one story (see [storybook-pattern.md](./storybook-pattern.md)).
4. Give each applicable row at least one assertion in `demo.test.tsx` (see [test-pattern.md](./test-pattern.md)).

Do not model states as independent booleans (`isLoading`, `hasError`, `isEmpty`) when contradictory combinations are possible. Use one status value, for example `'loading' | 'ready' | 'empty' | 'error'`.

## Field

A Field receives its state from the platform as props ([props-contract.md](./props-contract.md)). The matrix is about how the control reacts to those props.

| State | Platform input | Check |
| --- | --- | --- |
| Empty | `value` is `''` or `undefined` | Control stays controlled (default to `''`); placeholder or empty display is meaningful |
| Populated | `value` set | Formatted consistently; the stored value is not the formatted text |
| Editing | user input | Change goes through `handleEvent`; commit happens on the event the contract names (change or blur) |
| Invalid | `validatemessage` is a non-empty string | Error is visible, tied to the control and not conveyed by color alone |
| Required | `required` | Required status is shown without color alone |
| Disabled | `disabled` | Not focusable or operable; the reason is clear when the label alone does not explain it |
| Read-only | `readOnly` | Value readable; does not look editable |
| Display only | `displayMode === 'DISPLAY_ONLY'` | Just the value, no label or input (details views and tables) |
| Long or malformed value | very long string, wrong type, `null` | Layout holds and nothing throws |
| Narrow width | small container | Label, control, helper text and error reflow in order |
| Suggestion available / accepted | platform suggestion, `status` | Pending status shown only when the suggested value is among the options; accepted and rejected paths both clear it |
| Field warning | `showFieldMessage` with `messageConfig` | Shown when enabled, suppressed when read-only, hidden when its condition is false |
| Unchanged or empty blur | blur with the stored value | No commit; `validate` still runs so a required field reports its error |

Add `status` (`'error'`, `'success'`, `'pending'`) rows only if the component reads it.

## Widget

A Widget owns its data, so the matrix is mostly about the request lifecycle. Keep these cases distinct: they are often merged and then misreported.

| State | Check |
| --- | --- |
| Initial loading | Placeholder (`Progress` or a skeleton) keeps the layout stable |
| Loaded | Data and available actions are clear |
| Empty | Wording separates "no results" from "not configured" |
| Error | Message is actionable, hides internals, and offers a retry when retrying can help |
| Refreshing | Existing content stays visible while new data loads |
| Stale response | A late response for an older request is ignored |
| Action pending | Duplicate activation is blocked and progress is announced |
| Partial data | One failing section does not blank the others (only if the widget has sections) |
| Permission-limited | Restricted content is omitted and not reported as an error (only if the data source can restrict) |
| Failed mutation | A message is shown in a `Banner`, the control is re-enabled, and the list is unchanged |
| Late response | A response for an older request or an unmounted widget is ignored |
| Offline | A visible offline message accompanies Retry; no spinner that cannot finish |
| Long content | Lists, labels and actions stay usable |
| Narrow width | Information hierarchy survives; actions stay reachable |

For the fetch itself follow the [data widget cookbook](../cookbooks/build-a-data-widget.md). Cancel or ignore a request on unmount and on a context change.

## Template

A Template arranges `children`, so the matrix is about composition.

| State | Check |
| --- | --- |
| All regions populated | Reading order is clear |
| Optional region empty | Layout collapses or keeps space on purpose |
| Required region empty | The problem is visible, not a blank gap |
| One child unavailable or unsupported | The other regions keep working |
| Long child content | Wraps, scrolls or reflows predictably |
| Narrow width | Regions stack in the intended semantic order |
| Wide width | Extra space is handled without fixed positioning |
| All children of a region hidden | The region and its heading disappear; no empty titled section |
| Read-only parent | Children are forced to `readOnly` and `DISPLAY_ONLY`, and none show an input |
| Active tab becomes hidden or removed | Falls back to the first visible tab; no dangling id |
| Nested template | Inherits or overrides the parent column count on purpose |
| Missing or string config | `NumCols` as `'2'`, absent or non-numeric falls back to one column |

## Presentation

Use the Widget rows for the data the case view loads and the Template rows for its regions.

## AI-assisted content

Add these rows to a Widget or Field that shows or acts on generated content, in addition to the rows above. See the best-practices notes on GenAI integration in the API catalog.

| State | Check |
| --- | --- |
| Generating | A progress indication and partial output that can be read. Announce start and finish politely, not every update |
| Complete | The result is shown with a clear marker that it is machine-generated |
| Cancelled | The user can stop it, and the interface returns to a usable state with nothing half-applied |
| Failed or unavailable | An actionable message, a retry, and the rest of the component still works |
| Refused or blocked | A plain explanation instead of a blank or an error code |
| Low confidence or uncertain | Flagged, not presented as fact |
| Awaiting review | Nothing takes effect until a person accepts it, when the requirements say so |
| Feedback | The user can accept, reject or rate the result |
| Untrusted output | Rendered as plain text or sanitized; never as raw HTML |

## Recording the result

Write the matrix as a table in the plan you show the user, with a column for the story name that will demonstrate each row. After building, every row marked applicable must have a story and an assertion. If one cannot be built (for example a state the mocked PConnect cannot reproduce), say so in the report instead of dropping it.
