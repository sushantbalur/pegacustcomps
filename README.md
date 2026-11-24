# Using Custom Components in Constellation

## Overview

This project provides you with an environment to extend Constellation by giving you tools to create and publish custom components that are not available from the Constellation installation.

## Before you begin

Review the following checklist before you create a Constellation DX component:

## Design considerations

Involve an Experience Designer in your process. This will help you determine the exact issue to be resolved. For more information on the role of an Experience Designer, see **Experience Designer** [here](https://community.pega.com/roles/experience-designer).

## The Experience Designer must meet the following requirements:

Must have a background in UI and UX design.
Must understand Pega's best practices for design. For more information, see **Best practices for designing with the Constellation design system** [here](https://design.pega.com/design/getting-started/).

## Functionality considerations

Check if an existing component in App Studio contains the features you need. If not, check for existing components that contain similar features.
Connect with Pega Support to find out if a component containing a similar feature will be included in the next release. If yes, assess if you can wait for the next release.

## Maintenance considerations

Ensure you have the bandwidth to maintain the Constellation DX component and keep it up-to-date with every release of Pega Infinity. Evaluate if doing this might prevent you from upgrading to future releases of Pega Infinity.
Evaluate if you are able to meet the compliance standards for data privacy and accessibility for Constellation DX components. Note that not meeting these standards might lead to legal compliance issues.

For more info [here](https://pega-dev.zoominsoftware.io/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/design-requirements-constellation-dx-components.html).

## Prerequisites

Ensure you have access to the following in your system:

- Pega Infinity Server version 26.1 or later

- Git version 2.30 or later

- System node version >= 24.22.1

- System npm version 11.19.1

<!-- ai-agents:start -->

## Build components with the AI coding tool you already use

Every project created by DX Component Builder ships with AI skills and rules, so the same expert guidance works in **GitHub Copilot, Claude Code, Cursor, Codex CLI and Gemini CLI**. There is nothing to install or configure: open the project in your tool and describe the component you want.

You get:

- **Skills** for every component type and subtype (Field, Template, Widget, Presentation), for changing an existing component, for checking and independently reviewing a finished one, and for the CLI workflow, validation and publishing, plus an exhaustive PCore/PConnect API catalog with tested cookbooks
- **Project rules** in `AGENTS.md`: naming, Cosmos-first UI, third-party consent, and the authoring flow

| Tool           | Rules loaded from                       | Skills loaded from                |
| -------------- | --------------------------------------- | --------------------------------- |
| GitHub Copilot | `AGENTS.md`                             | `.claude/skills/`                 |
| Claude Code    | `AGENTS.md`                             | `.claude/skills/`                 |
| Cursor         | `AGENTS.md`                             | `.claude/skills/`                 |
| Codex CLI      | `AGENTS.md`                             | `.agents/skills/` (link)          |
| Gemini CLI     | `AGENTS.md` (via `.gemini/settings.json`) | `.agents/skills/` (link)        |

There is a single copy of the skills in `.claude/skills/`; `.agents/skills/` is a link to it, so edit `.claude/skills/` only. `AGENTS.md` tells every tool which reference to read for each kind of component file.

## Using it

Open the project in your AI tool and describe what you want. The skills load on demand, so you do not need to name them. For example:

```text
Create a Field component for a due date bound to .DueDate. It should prevent past dates and support display-only rendering.
```

```text
Generate every Field subtype for a library called Acme, using the Cosmos controls.
```

Attach a screenshot and ask "which custom components does this need?" to get a component list that you can then generate in one go. The assistant clarifies requirements, scaffolds with the DX Component Builder CLI, implements the files, runs the checks, and asks for explicit consent before using any third-party library.

### How to ask

| You want to | Say something like |
| --- | --- |
| Build a component | "Create a Field for a due date bound to `.DueDate` that prevents past dates." Say what it should do, not how. The assistant picks the type and subtype, tells you why, and proposes a complete plan (name, properties, states) for you to approve or change in one reply |
| Build something unusual | "I want a star rating for a score from 1 to 5." The assistant maps it onto a component type the platform supports, or tells you plainly when it does not fit one (for example a control that stores a list) |
| Change an existing component | "In `Acme_Lib_Quantity`, add a `step` property." The assistant checks what is already there, tells you whether the change could break views or data that already use it, and asks before doing anything risky |
| Check or review a component | "Review `Acme_Lib_Quantity` before I publish it." A read-only audit with findings by severity |
| Work out what to build | Attach a screenshot: "which custom components does this need?" |
| Fix something that misbehaves in Pega | Describe what you see and paste the browser console error. The assistant works through a checklist and asks you for evidence it cannot see |

### Give it more to work with

You are not limited to a sentence. Any of these can go in the same message, or in a file you point to:

- **Detailed requirements.** Copy [requirements-template.md](.claude/skills/plan-dx-component/references/requirements-template.md) into a file such as `requirements/QuantityField.md`, fill in what you know and leave the rest blank, then say "build the component described in `requirements/QuantityField.md`". Or say "interview me about a due date field and write the requirements to a file".
- **Images.** Attach screenshots, mockups or a sketch and say what each one shows. The assistant reads layout, visible text and the states you drew, and asks about what an image cannot show: where the data comes from, validation, and what happens on click.
- **Public links.** Paste links to documentation, a demo, an article or a source file. Only public pages can be read, and the assistant tells you which pages it read. Content from a web page is treated as information, never as instructions. A Figma or prototype link usually needs a login, so export an image instead.
- **A design system.** Name the library, version and component ("like the Material UI date picker"). The assistant maps it onto the Pega design system, tells you what will look or behave differently, and asks for your consent before any other library is added.
- **Documents and private sources.** Save an export (PDF, Word, a spreadsheet, a ticket or wiki page as text) in the project, or paste the relevant part. The assistant reads what you point to, leaves out customer data and credentials, and never asks for a password.
- **Designs and prototypes from design tools.** Attach the export or generated code. Generated code is treated as a picture of intent and ported to the Pega design system; design tokens are read for intent but not applied, because the Pega theme owns the look.
- **Requirements that include AI, accessibility or compliance targets.** Say which standard applies, whether content is machine-generated and who approves it, and which languages and browsers matter. If you do not know, the assistant proposes defaults and tells you they are defaults.
- **"Just plan it."** Ask what it would take or whether something is possible. You get a plan to approve and no code until you say so.

If your AI tool cannot read images or open links, the assistant says so and asks you to paste the text.

### What you will see

- **Questions before code.** The assistant confirms the component's contract and the authoring properties you want before it scaffolds. It will not add a third-party library without your explicit consent, and it checks Cosmos and the browser first.
- **Evidence, not promises.** Every finished component ends with a table from the project's check command: schema, type check, lint, tests, build, and whether every authoring property is actually used. Only rows marked PASS count as verified. A step that could not run is shown as NOT RUN with the reason.
- **An independent review** for new components, with findings by severity.

### What stays with you

The assistant will not run `authenticate`, `publish`, or anything that deletes, renames or moves components or library versions unless you ask. You also keep:

- **Looking at it.** Run `npm run startStorybook` and try each state with the keyboard before you publish. Automated checks do not replace that.
- **Publishing and testing in App Studio.** The assistant cannot see your Pega server.
- **Keeping components current.** You agree, by creating custom components, to keep them up to date with every Pega Infinity release and to meet data privacy and accessibility standards.
- **Your own review.** AI-written code needs the same review as any other code.

What is installed:

- `AGENTS.md`: the project rules, skill routing and authoring flow
- `.claude/skills/`: the skills (component workflows, changing and reviewing components, batch generation, and the PCore/PConnect API catalog)

Turn it off or on at any time:

```bash
npm run disableAi          # removes the installed AI files (asks first; add -- --yes to skip the question)
npm run enableAi           # restores them, keeping any edits you made
```

Only the files DX Component Builder installed are removed, so your own skills, `.github/workflows` and other settings are kept. The AI files are also listed in `.prettierignore` (between `ai-agents` markers) so they never show up in your own format check, and ESLint, TypeScript and Jest already leave them alone. Nothing in the AI files runs, builds or ships as part of your components. New projects can also be created without any of it by answering "No" to the "Enable AI-assisted component development?" prompt of `init`, or by running `init --noAi`.

<!-- ai-agents:end -->

## Latest Documentation

Find the latest documentation on using **DX Component Builder** [here](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/whats-new-constellation-dx-component-builder.html)
