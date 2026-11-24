# Other Field Subtypes

Six valid Field subtypes have no skill of their own: `Text-Input`, `Text-Paragraph`, `Icon-Button-URL`, `DateTime`, `TimeOfDay` and `Picklist-Autocomplete`. This file gives what is specific to each. The shared rules (commit protocol, empty and zero handling, message precedence) are in [field-behavior.md](./field-behavior.md); props and display modes are in [props-contract.md](./props-contract.md).

Three of them are variants of a base scaffold: the CLI generates `Text-Input` from the `Text` scaffold, `Icon-Button-URL` from `Text-URL`, and `Picklist-Autocomplete` and `Picklist-RadioButtons` from `Picklist`. The `subtype` in `config.json` is what tells App Studio where the author can pick the component. Anything beyond the base scaffold's behavior is **your** implementation, so read the scaffolded `index.tsx` first and change only what the user asked for. Check every Cosmos prop in the installed `.d.ts` before using it.

## Text-Input

A single-line text value. Same as [text](../../text/SKILL.md) with the Cosmos `Input` control and no multi-line option. Do not add a `multiLine` property; if the user needs several lines, the subtype is `Text-Paragraph`.

## Text-Paragraph

A multi-line text value.

| Concern | Guidance |
| --- | --- |
| Control | Cosmos `TextArea`. Display mode uses `ParagraphDisplay` (pass `undefined`, not `''`, for an empty value) |
| Length | Read `maxLength` from `fieldMetadata` when present. Pass `maxLength` and `displayCharCount` to `TextArea`; its `hardStop` prop blocks typing past the limit |
| Commit | Like Text: keep a local draft, commit on blur only when the value changed. Also call `PCore.getAutosaveUtils().notifyChange(context, pageReference + propName, value)` on change so autosave sees the edit (documented in the catalog) |
| Size | A paragraph can be long. Test a very long value for layout and for performance |
| Rich text | Rich text editing is a different control with its own package and an HTML value. Do not build it as a Paragraph, and never render stored HTML with `dangerouslySetInnerHTML` |

## Icon-Button-URL

A web address shown as an icon button that opens the link. It carries all the risk of [url](../../url/SKILL.md): allow only `http:` and `https:`, set `rel='noopener noreferrer'` when opening a new tab, and do not trust the display component to block unsafe schemes. Two additions: an icon-only button **must** have an accessible name (a `label`, never icon alone), and an empty or unsafe value should render no link rather than a dead one.

## DateTime

A date and time stored as a UTC instant, `YYYY-MM-DDTHH:mm:ss.000Z`.

| Concern | Guidance |
| --- | --- |
| Conversion | Convert the stored value to the operator's time zone for the input, and back to UTC on commit. The zone comes from `PCore.getEnvironmentInfo().getTimeZone()`; if it is empty and the feature flag `pyEnableDateTimeSystemTimezoneFallback` is on in `getEnvironmentInfo().getFeatureMap()`, use `PCore.getLocaleUtils().getTimeZoneInUse()` |
| Library | Time-zone arithmetic needs a date library such as `dayjs` with its `utc` and `timezone` plugins. Check whether it is already installed and follow the consent rule in [AGENTS.md](../../../../AGENTS.md) before importing it |
| Options | `pickerInterval` accepts only 5, 10, 15, 20, 30 or 60 minutes (fall back to 30). `clockFormat` accepts 12 or 24 (fall back to the locale default). Both arrive as strings |
| Input state | While the Cosmos input reports an invalid or incomplete state, keep the draft and validate; commit only a complete valid value |
| Read-only | Guard the commit handlers with `!readOnly` |
| Display | `DateTimeDisplay`. A relative display ("3 hours ago") needs no zone conversion |

## TimeOfDay

A time without a date, stored as `HH:mm:ss`.

| Concern | Guidance |
| --- | --- |
| Control | Cosmos `TimeInput`; display `DateTimeDisplay` with the time variant |
| Commit | On blur only, using the same helper as Date: a complete valid time, otherwise keep the draft and validate |
| Empty | Pass `undefined` to the control for an empty value |
| Time zones | A time of day is not an instant. Do not convert it between zones |

## Picklist-Autocomplete

A single choice from a list the user filters by typing.

| Concern | Guidance |
| --- | --- |
| Options | As in [picklist](../../picklist/SKILL.md): the platform resolves the options and passes them as props (`datasource`, `listType`, `fieldMetadata`). Do not fetch the list yourself unless the user needs a source the platform does not provide, and then follow [widget-patterns.md](./widget-patterns.md) for the request lifecycle |
| Control | Cosmos `ComboBox` in single-select mode with a `menu` of items |
| Two values | Keep the **typed filter text** separate from the **selected item**. Clearing the text deselects the item. Store the key of the selected item, never the text |
| Loading | Initialize the list on first focus or open, not on mount |
| Search | Debounce the search (500 ms is typical) and ignore or abort the previous request before sending a new one, so a late response cannot overwrite a newer one. Page long lists. Highlight matches with `createStringMatcher` from Cosmos |
| Stored key not in the first page | Look the stored key up on its own so the selected label still shows |
| Empty and error | A search with no match shows an empty message; a failed search shows an error and keeps what the user typed |
| Accessibility | Keep the combo box's role and arrow-key behavior from Cosmos; do not rebuild it |

## Picklist-RadioButtons

See [radiobuttons](../../radiobuttons/SKILL.md).
