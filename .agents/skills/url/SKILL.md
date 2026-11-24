---
name: url
description: 'Scaffold a Pega DX Field component with subtype **URL** — web address input bound to a string case property. Use when: user asks for a URL input, website link field, external reference, or a clickable link display.'
argument-hint: 'Describe the URL field (e.g., "a company website input that opens in a new tab")'
---

# Create URL Field

Field subtype `URL`. Binds to a string case property holding a web address.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `URL`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `Input` with `type='url'` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | `URLDisplay` |

## Value Handling

- Trim on blur and prepend `https://` when the user omitted a scheme, then dispatch the normalized value.
- Validate the scheme before storing. **Only `http:` and `https:` are acceptable.**
  Parse the value with `new URL(raw)` inside a try/catch, and accept it only when the protocol is `http:` or `https:`. A value that does not parse is unsafe. The helper shape is in [field-behavior.md](../create-dx-component/references/field-behavior.md).

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `openInNewTab` | Open in a new tab | `BOOLEAN` | `true` |  |
| `linkText` | Link text override | `TEXT` |  |  |

## Security

This is the highest-risk Field subtype in the set.

- **Reject `javascript:`, `data:`, `vbscript:`, and `file:` schemes.** Rendering an unchecked user-supplied URL in an `href` is a stored XSS vector.
- Do not assume `URLDisplay` makes a value safe. In the Cosmos build checked, its `Link` only drops hrefs that match `javascript:`; `data:`, `vbscript:` and `file:` pass through, and it sets no `rel` on the anchor. Run the allow-list check above on the value before rendering, and verify the behavior against the installed Cosmos version.
- When `openInNewTab` is on, set `rel='noopener noreferrer'` yourself unless you have confirmed the rendered anchor already has it.
- Cosmos exports `disallowedURI` (a regex) in some builds; if it exists in the installed version you may use it as an extra check, but keep the explicit protocol allow-list.
- Never interpolate the value into `dangerouslySetInnerHTML`.
- Production URL fields commit the raw string on blur and do no scheme check, so the scheme rule above is **your** responsibility, not the platform's.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
