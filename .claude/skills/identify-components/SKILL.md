---
name: identify-components
description: 'Analyze an attached screenshot, mockup or UI description and decide which custom Pega DX components to build (Field, Template, Widget, Presentation). Use when the user shares a design and asks what to build, or asks to break a UI into components. Outputs a compact list that feeds the `generate-component-set` skill.'
argument-hint: 'Attach a screenshot or describe the UI'
---

# Identify Components from a Design

Analyze the attached screenshot, mockup or described UI (for written requirements, links or a design system as the source, use [plan-dx-component](../plan-dx-component/SKILL.md)) and identify which **custom** Pega DX components are needed. Emit only type and subtype names that appear in [component-manifest.json](../generate-component-set/component-manifest.json).

**Output only these lines**, nothing else:

```
fields="Text,Date,Picklist"
templates="Form,Details"
widgets="Name:CASE:dataPageOrSource"
presentation="Name:CASEVIEW"
```

Omit any line that would be empty. The output can be handed straight to the [generate-component-set](../generate-component-set/SKILL.md) skill.

## Visual recognition guide

### Field: a control bound to a single case property

| What you see                                         | Subtype        |
| ---------------------------------------------------- | -------------- |
| Single-line text box, textarea, masked string        | `text`         |
| Checkbox, toggle, yes/no, consent switch             | `boolean`      |
| Whole-number spinner, count, quantity, year          | `integer`      |
| Fractional number, measurement, rate, score          | `decimal`      |
| Money input, price, amount, budget (currency prefix) | `currency`     |
| Percent input, discount, completion rate (% suffix)  | `percentage`   |
| Calendar icon input, due date, birth date            | `date`         |
| Email input, envelope icon, `mailto` display         | `email`        |
| Telephone input with country code prefix             | `phone`        |
| Web address input, external link icon                | `url`          |
| Dropdown / select / lookup with chevron              | `picklist`     |
| Radio group, small mutually exclusive choice         | `radiobuttons` |

A status pill, count badge, tag, icon or formatted value bound to a property is also a Field: it handles `DISPLAY_ONLY`. Pick the subtype that matches the bound value.

### Template: a layout that arranges other components

| What you see                                   | Subtype   |
| ---------------------------------------------- | --------- |
| Card or panel wrapping editable input fields   | `form`    |
| Read-only label/value pair summary block       | `details` |
| Full-page shell: header, regions, content area | `page`    |

### Widget: a self-fetching data block

| What you see                                           | Scope  |
| ------------------------------------------------------ | ------ |
| Chart, KPI tile, or related-records list inside a case | `CASE` |
| Dashboard tile or portal block with no case context    | `PAGE` |

For each widget emit `Name:SCOPE:source`. If the data source is not inferable from the image, use `unknown`. Do not guess a data page name.

### Presentation: a replacement case view page

| What you see                                                                        | Subtype       |
| ----------------------------------------------------------------------------------- | ------------- |
| A full case page: case header, summary panel, stage tracker, tabs, tasks, utilities | `CASEVIEW`    |
| The same case page in a Web Self Service portal                                     | `WSSCASEVIEW` |

For each emit `Name:SUBTYPE`. A badge, pill, tag, icon or formatted value is **not** a Presentation component: classify it as the Field subtype that matches the bound value, or as a Widget if it loads its own data.

## Rules

1. **Only list what is visible.** Do not include components that might exist off-screen.
2. **Do not list anything Constellation already ships.** This project builds custom components. A plain stock input, stock case view or stock nav bar is left out.
3. **A read-only value bound to a property is a Field**, not a Presentation component.
4. **A block that loads its own data is a Widget, not a Template.** Templates arrange `children` handed to them; widgets fetch.
5. **When torn between two subtypes** (for example `decimal` vs `currency`), pick the one whose formatting affordance is visible. A currency symbol means `currency`.
6. **Output only the lines shown above.** No explanation, no prose, no bullet list.
