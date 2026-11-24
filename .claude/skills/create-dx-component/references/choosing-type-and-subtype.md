# Choosing a Component Type and Subtype

Use this when the request is not a plain "make a <subtype> field": a custom control (a star rating, a signature pad), a block you cannot name a subtype for (a kanban board), or something that may not be a custom component at all. The CLI accepts a fixed set of subtypes, and `validate-schema` rejects any other, so every idea has to land on one of them or be declared out of scope. Never invent a subtype.

## 1. Fit check

A custom DX component is one of four things:

| Type | It is |
| --- | --- |
| Field | One control bound to **one case property** |
| Widget | A standalone block that loads and shows its own data |
| Template | A layout that arranges child views and fields |
| Presentation | A replacement for the whole case view page |

If the request is none of these, say so plainly, name the closest option, and let the user decide. Do not stretch a type to fit. Examples that do not fit as stated:

- Changing the app shell, navigation, theme or portal frame.
- Adding or intercepting the buttons and flow actions of an assignment.
- Business logic, validation rules or data models. Those live in the Pega application, not in a DX component.
- A control that stores a **list** of values or **several properties** at once. No Field subtype binds more than one scalar property. Offer instead: a Template that arranges existing fields; a Widget that writes back to the property (confirm the stored shape with the app designer and flag it as a risk); or a delimited string in a Text field if the user accepts that.

If you are unsure whether something is possible on the platform, say that you are unsure instead of building a guess.

## 2. Pick the type

Ask in this order and stop at the first yes:

1. Does it replace how the whole case view page is rendered? **Presentation** (`CASEVIEW` or `WSSCASEVIEW`).
2. Does it edit or show **one** case property? **Field**.
3. Does its main job arrange other components that the app designer places inside it? **Template**.
4. Does it show its own data (chart, list, KPI, board, timeline)? **Widget**.

A read-only badge, pill, icon or formatted value bound to a property is a Field that handles `DISPLAY_ONLY`. If it loads its own data instead, it is a Widget.

## 3. Pick the subtype

**Field: choose by the type of the stored value, not by how the control looks.** The control can be anything Cosmos or the browser can render.

| Stored value | Subtype |
| --- | --- |
| Short or free text | `Text`, `Text-Input` (single line), `Text-Paragraph` (multi-line) |
| Email, phone, web address | `Text-Email`, `Text-Phone`, `Text-URL`; `Icon-Button-URL` for a link shown as an icon button |
| Whole number | `Integer` |
| Fractional number | `Decimal`; `Decimal-Currency` for money; `Decimal-Percentage` for a percent |
| True or false | `Boolean` |
| Date, date and time, time of day | `Date`, `DateTime`, `TimeOfDay` |
| One choice from a list | `Picklist` (dropdown), `Picklist-RadioButtons`, `Picklist-Autocomplete` (searchable) |

**Template:** `FORM` (editable fields), `DETAILS` (read-only label/value pairs), `PAGE` (whole-page regions). `FORM-region` and `DETAILS-region` are the multi-region variants. `PAGE` is the template to use for an app-level layout with named regions.

**Widget:** `CASE` when it belongs inside a case view and uses the current case, `PAGE` when it sits on a portal page or dashboard with no case, and, if the same widget must work in both, the `config.json` subtype can be the array `["PAGE", "CASE"]` (shown as "PAGE & CASE"). The `create` argument for that combination is not documented in [cli-workflow.md](./cli-workflow.md), so pick `CASE` or `PAGE` unless the user needs both, and then check the CLI help first.

**Presentation:** `CASEVIEW`, or `WSSCASEVIEW` for the Web Self Service portal.

## 4. Worked examples

| The user wants | Type and subtype | Notes |
| --- | --- | --- |
| A star rating (1 to 5) | Field `Integer` | Custom control over a whole number. The Cosmos `Rating` component in the build checked takes `value`, `maxRating` and `readOnly` and has no change callback, so use it for the `DISPLAY_ONLY` view and build the editable control from a Cosmos radio group so it stays keyboard and screen-reader operable. Check `Rating.d.ts` in the installed version |
| A slider for a quantity | Field `Integer` | Cosmos has a slider; check its `.d.ts` first |
| A status pill or badge for a property | Field `Text` with `DISPLAY_ONLY` | See [the status badge recipe](../cookbooks/status-badge-field.md) |
| A color picker | Field `Text` | Store a hex string such as `#1A2B3C` |
| A signature pad | Field `Text-Paragraph` | Stores a data URL, which can be large; confirm the property's size limit with the user. Try the browser canvas before asking to add a library |
| A time picker | Field `TimeOfDay` | |
| A searchable customer lookup | Field `Picklist-Autocomplete` | The options come from the property's configured source |
| Tag input or multi-select | Not a Field | See the fit check: it stores a list |
| An address block | Not a Field | It binds several properties. Offer a Template that arranges the existing address fields |
| A kanban board, timeline, chart, KPI tile, map, org chart | Widget `CASE` or `PAGE` | `CASE` if it shows the current case's data, otherwise `PAGE`. Data comes from a data page. Check Cosmos for a ready component before proposing a charting or map library |
| A tabbed or stepper layout of fields | Template `FORM-region` or `PAGE` | One region per tab or step. Use Cosmos `Tabs`; editable steps must all stay mounted so validation sees every field (see [template-patterns.md](./template-patterns.md)) |
| A read-only summary panel | Template `DETAILS` | Must force read-only on its children |
| A sidebar layout or dashboard grid | Template `PAGE` | Regions `A` and `B` |
| A custom case header with tabs on the left | Presentation `CASEVIEW` | Props only; no PCore or PConnect |

## 5. Decide, then say what you decided

- If two types or subtypes both fit, take the narrowest, state the assumption in one sentence, and ask once. The ambiguity rule in [AGENTS.md](../../../../AGENTS.md) applies.
- Say which subtype you chose and **why** (for a Field, the stored value type). The user can then correct a wrong storage assumption before any code exists.
- If the idea needs a third-party library, first check whether Cosmos or the browser already does it. Propose a library only when neither does, and follow the consent rule in [AGENTS.md](../../../../AGENTS.md).
