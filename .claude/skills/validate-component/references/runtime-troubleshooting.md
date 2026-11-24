# Troubleshooting a Component After It Builds

For problems that appear after `check-component` is green: the component is not offered in App Studio, its property panel is wrong, it renders blank or wrongly in a real view, or it behaves differently from Storybook. Work down the ladder, **ask the user for the evidence in each rung instead of guessing**, and say what you could not check. You usually cannot see the Pega server, so never claim that something works or fails there without evidence from the user.

## 0. Get the facts first

Ask for, or look up:

- The exact symptom and where it appears (App Studio picker, property panel, a case view, a portal page).
- The text of any error in the browser console, and what the page shows instead (nothing, a generic failure message, the old version).
- `npm run showStatus` output (library, version, permanence, component count) and whether the component was published, and to which server and ruleset.
- The Pega Infinity version and the `@pega/cosmos-react-core` version in `package.json`.
- Whether Storybook shows the component correctly in the same state.

## 1. It is not offered in App Studio

| Check | How |
| --- | --- |
| It was published, from the right library and version | `npm run showStatus` and `npm run listPublishedLib` (local or server). Publishing is the user's step |
| The `type` and `subtype` suit the placement | A Field appears where fields are picked, a Template where layouts are picked, a Widget in a case view (`CASE`) or on a page (`PAGE`). A wrong subtype is a different placement, not an error. Compare against [choosing-type-and-subtype.md](../../create-dx-component/references/choosing-type-and-subtype.md) |
| The component key matches what was published | The key is `<Org>_<Library>_<Name>` and must agree in `config.json`, the folder and `tasks.config.json` (library mode enforces library and organization) |
| The user is looking in the right application and ruleset | These are server settings in `tasks.config.json` (`rulesetName`, `rulesetVersion`). Ask; do not change them |

## 2. The property panel is wrong or empty

- `validate-schema` only checks that `format` is a string. A format the platform does not support passes and then does nothing in App Studio. Read the `check-component` table for the formats warning, and compare with [config-schema.md](../../create-dx-component/references/config-schema.md).
- A `visibility` expression that references a variable the authoring runtime does not provide hides the property. Use only the forms listed in config-schema.md.
- A property whose `name` is not read by the component has no effect; `check-component` fails on that.
- A property saved before a change can leave an old value behind. See [update-dx-component](../../update-dx-component/SKILL.md).

## 3. It renders blank, or shows a generic failure message

The platform wraps every component in an error boundary, so a component that throws shows a generic failure message instead of crashing the page. The real error is in the browser console.

| Likely cause | Evidence and fix |
| --- | --- |
| An exception in render, often reading a property of `undefined` | The console stack trace names the file. Guard the absent value. Typical sources: a prop that arrives `null`, `children` treated as fields (they are regions), a missing optional config key |
| Missing `withConfiguration()` | The component does not register. Check the export |
| Missing `create-nonce` import | styled-components styles are blocked by the page's content security policy, so the component renders unstyled or broken. Keep the side-effect import in `index.tsx` |
| A prop arrives as a string when you expected a boolean or a number | `readOnly`, `required`, `disabled` and numeric settings can arrive as strings. Normalize them (see [field-behavior.md](../../create-dx-component/references/field-behavior.md)) |
| `PCore` or `getPConnect` used in a Presentation component | Not available there; the lint rule rejects it |
| A PCore or PConnect method that is not documented | It may not exist in the user's Infinity version. Check the API catalog |

## 4. It works in Storybook but not in a real view

Storybook uses the mocks you wrote. The usual causes are a mock that differs from the real payload shape, a platform value that is `null` or a string in real data, and a data page or property that the real application does not have. Ask the user for the real payload (with any customer data removed), compare it with `mock.ts`, and fix the component and the mock together.

To debug against the running platform with browser breakpoints, the CLI has `npm run startDevServer` ("debug runtime with browser break points using a local component server"; library mode). It is a long-running server, so the user runs it. Ask them to set a breakpoint where the console error occurs and report what they see.

## 5. It shows an old version

Confirm with the user that the new version was published and that they refreshed the application. Check `npm run showStatus` for the library version and whether it is permanent. Do not guess at server-side caching; say that you cannot see it and ask the user to check with their Pega administrator.

## 6. Still stuck

Summarize what was checked and what each check showed, list what you could not see, and tell the user exactly what to bring to Pega support or their administrator: component key, Infinity version, Cosmos version, the console error, and the `showStatus` output. Never include credentials, tokens or customer data.
