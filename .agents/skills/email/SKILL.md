---
name: email
description: 'Scaffold a Pega DX Field component with subtype **Email** — email address input bound to a string case property. Use when: user asks for an email input, contact address field, mailto link display, or email validation.'
argument-hint: 'Describe the email field (e.g., "a work email input restricted to the company domain")'
---

# Create Email Field

Field subtype `Email`. Binds to a string case property holding an email address.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Email`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `Input` with `type='email'` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | `EmailDisplay` — renders a `mailto:` link |

## Value Handling

- `value` is a plain string. Default to `''`.
- Lowercasing and trimming is **this skill's design choice**: the platform's own Email field commits the raw string. Ask the user before normalizing, since it changes stored data. If they agree, trim and lowercase on blur, then dispatch the normalized value:
  Compute the normalized value, send it with `handleEvent(actions, 'blur', ...)`, then call `getValidationApi().validate(normalized)`.
- Do not validate on every keystroke. Users see an error before they finish typing the domain.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `allowedDomains` | Allowed domains (comma separated) | `TEXT` |  |  |
| `showMailtoLink` | Link the address when read-only | `BOOLEAN` | `true` |  |

## Gotchas

- Keep client-side validation permissive. Pega runs the authoritative rule, and an over-strict regex rejects valid addresses such as plus-addressing and long TLDs.
- `EmailDisplay` builds the `mailto:` href itself. Do not construct the link manually, and never interpolate the raw value into an `href` string.
- Domain restriction is a business rule. Read it from `config.json`, do not hard-code it.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
