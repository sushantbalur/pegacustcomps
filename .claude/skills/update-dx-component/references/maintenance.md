# Maintenance, Renames, Versions and Upgrades

What a customer owns after the first publish, and the commands that exist for it. Every command here is the user's to run unless they explicitly ask you to; they need credentials, a server, or change or delete data. The exact forms are in [cli-workflow.md](../../create-dx-component/references/cli-workflow.md) and [publish-library](../../publish-library/SKILL.md).

## What the customer owns

The CLI prints this on its help screen, and it should be said plainly to anyone building custom components: by choosing to create and use custom components, you agree to keep them up to date with every release of Pega Infinity, and to meet compliance standards for data privacy and accessibility. Pega does not update a custom component for you.

## Rename, move and delete

| Goal | Command | Effect and caution |
| --- | --- | --- |
| Rename a component | `npm run rename` | Changes the component key, which is the component's persisted identity. A view that references the old key is likely to stop finding it, so treat a rename of a published component as a breaking change and ask the user first. Prefer a new component with the new name and retire the old one later |
| Move or copy a component (or all) to another version or library | `npm run move` | Check the target library and version with the user first |
| Delete a component | `npm run delete` | Destructive. Confirm which one, and that no view still uses it |
| Delete everything | `npm run deleteAll`, `npm run deleteLib`, `npm run deleteLibVersion`, `npm run deletePublishedLib` | Destructive and often permanent. Never run unasked |

## Library versions

| Goal | Command | Note |
| --- | --- | --- |
| See the current library, version and component count | `npm run showStatus` | Safe |
| List the contents of a library or version | `npm run listLib`, `npm run list` | `listLib` prompts and cannot run without a terminal |
| Start a new version | `npm run createLibVersion` | Ask the user first |
| Switch version or library | `npm run switchLibVersion`, `npm run switchLib` | Changes which version later commands act on |
| Save a version locally | `npm run storeLibVersion` | Save components before storing |
| Go back to the stored copy | `npm run restoreLibVersion` | The CLI warns that current changes will be **lost**. Never run unasked |
| Export or import a version as a zip | `npm run exportLibVersion`, `npm run importLibVersion` | |
| Publish | `npm run publish` | See [publish-library](../../publish-library/SKILL.md) |

## Upgrading

- **The CLI.** `npm run upgrade` reinstalls `@pega/custom-dx-components` at the latest version. It changes the project's dependencies, so ask first, then run the check script for every component and `npm run validateAll`.
- **Pega Infinity.** After the customer's Infinity version changes, republish and retest the components in App Studio. Check the Pega documentation for the new release for anything that affects custom components, and tell the user what you could not verify.
- **Cosmos.** Components are built against the installed `@pega/cosmos-react-core`. When it changes, a prop can be added, renamed or removed. After any dependency change run `npx tsc --noEmit`, the check script and the Storybook states, and read the `.d.ts` of any Cosmos component that now fails to compile instead of guessing the new prop.
- **AI skills.** `npm run enableAi` restores missing skill files but never overwrites an existing one, so installed skills do not update themselves. If the guidance feels out of date, ask the user to compare `.claude/skills` with the version that ships in the installed CLI package.

## Before any structural change

1. Run `npm run showStatus` and `npm run list` to see the current library, version and components.
2. Say exactly what the command will change and what cannot be undone.
3. Make sure local work is saved, for example with `npm run storeLibVersion`, if the command can lose it.
4. Let the user run the command, or run it only when they ask.
