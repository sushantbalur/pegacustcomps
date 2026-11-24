---
name: publish-library
description: 'Connect to a Pega Infinity server and publish a DX component library — authentication, `tasks.config.json` server settings, SSL keys, library versions, and the store/export lifecycle. Use when: the user wants to authenticate, publish, version, store, restore, export, or import a component library, or is debugging a failed `npm run publish` or `npm run authenticate`.'
argument-hint: 'Describe the goal (e.g. "publish the current library version" or "authenticate against a new Infinity server")'
---

# Publish DX Component Library Skill

Building and testing a component is covered by [validate-component](../validate-component/SKILL.md). This skill starts once the component builds clean and needs to reach a Pega server.

## This repo is in Library mode

[tasks.config.json](../../../tasks.config.json) sets `"libraryModeCL": true`. That determines which npm scripts are legal:

| Available in Library mode                                                                                          | **Not** available (Component mode only)                    |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `createLib`, `switchLib`, `listLib`, `deleteLib`                                                                    | `publishAll`                                               |
| `createLibVersion`, `switchLibVersion`, `deleteLibVersion`                                                          | `promoteWebPack`, `revertWebPack`                          |
| `publishLibVersion`, `restoreLibVersion`, `storeLibVersion`                                                         | `exportRC`                                                 |
| `listPublishedLib`, `deletePublishedLib`, `showStatus`, `setPermanent`                                              |                                                            |
| `importLibVersion`, `exportLibVersion`, `move`, `startDevServer`                                                    |                                                            |

`npm run publish` and `npm run publishLibVersion` both resolve to `custom-dx-components publish`. Never suggest a Component-mode command while `libraryModeCL` is `true` — it will fail.

## Server configuration

All connection settings live under `server-config` in [tasks.config.json](../../../tasks.config.json). Read it before advising anything — do not assume defaults.

| Key                              | Meaning                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `server`                         | Infinity base URL, e.g. `https://localhost:1080/prweb`                        |
| `serverType`                     | `infinity`                                                                     |
| `authService`                    | Infinity authentication service alias — used when `grantType` is `authCode`   |
| `grantType`                      | `authCode`, `passwordCreds`, or `clientCreds`                                 |
| `clientId`                       | OAuth client registration ID                                                   |
| `clientSecret`                   | Required **only** for `passwordCreds` and `clientCreds`                       |
| `redirectUri`                    | OAuth redirect, e.g. `https://localhost:4010/`                                |
| `cert` / `key`                   | SSL cert and key, needed when `grantType` is `authCode` and `redirectUri` is `https://localhost` |
| `rulesetName` / `rulesetVersion` | Target ruleset for published components                                        |
| `archiveRulesetName` / `archiveRulesetVersion` | Ruleset used by `exportLibVersion` / `importLibVersion`          |
| `devBuild`, `devServerPort`      | Local dev server settings for `startDevServer`                                |
| `questions_ask*`                 | Controls which settings `npm run authenticate` re-prompts for                 |

### Secrets

`clientSecret`, `user`, and `password` sit in a tracked file. **Never** write a real secret into [tasks.config.json](../../../tasks.config.json) on the user's behalf, never echo one into the terminal, and never paste one into a chat response. If a credential is needed, tell the user to enter it themselves at the `npm run authenticate` prompt.

The [keys/](../../../keys) folder holds `dxcb.crt` and `dxcb.key` for the local HTTPS redirect listener. These are local development certificates — they are not deployment credentials and must not be reused as such.

## Procedure

### Authenticate

```bash
npm run authenticate
```

Run this first whenever the token may be stale, the server has changed, or a publish returns 401/403. It prompts only for the settings listed in `questions_askOnce` / `questions_askAlways` — currently `server,authService` are asked once.

### Publish

```bash
npm run validate -- <Org>_<Library>_<Name> N N        # the component must build clean first
npm run test
npm run publish
```

Publish only when the user explicitly asks. Publishing writes to a shared Pega server and is not a local, reversible action.

### Version lifecycle

```bash
npm run listLib               # what libraries exist locally
npm run listPublishedLib      # what is already on the server
npm run showStatus            # local vs published drift
npm run createLibVersion      # start a new version
npm run switchLibVersion      # move between versions
npm run storeLibVersion       # snapshot the current version into store/
npm run restoreLibVersion     # bring a stored version back
npm run setPermanent          # lock a published version
```

`store/` and `<Org>_<Library>/` are **generated** folders — they do not exist until `storeLibVersion` and a build have run. Do not reference them as if they were checked in.

### Versioning rules

- `component.version` in [tasks.config.json](../../../tasks.config.json) seeds the `version` written into each new component's `config.json`.
- `component.library` must equal the `library` value in every `config.json` and the `Pega_<library>_` name prefix. A mismatch fails the build.
- Bump the version before publishing a change to an already-published library version, or use `createLibVersion` for a breaking change.
- `setPermanent` makes a published version immutable — confirm with the user before running it.

## Common Failures

- **401 / 403 on publish** — token expired. Run `npm run authenticate`.
- **Redirect never completes on `authCode`** — `cert` and `key` are missing or untrusted. Both are required when `redirectUri` starts with `https://localhost`.
- **`clientSecret` empty with `passwordCreds` or `clientCreds`** — that grant type requires it; `authCode` does not.
- **Command "not found" or silently wrong** — a Component-mode script was used while `libraryModeCL` is `true`. Check the table above.
- **Library name mismatch** — `component.library`, the `library` key in `config.json`, and the `<Org>_<Library>_` folder prefix must all agree.

## Before Publishing

1. `npm run validate -- <Org>_<Library>_<Name> N N` (or `validateAll`) passes
2. `npm run test` passes, coverage thresholds met
3. `npm run lint` and `npm run _lint:spelling` pass
4. Version bumped if the target version is already published
5. The user has explicitly asked to publish
