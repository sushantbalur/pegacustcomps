---
name: review-component
description: 'Independent, read-only audit of a finished Pega DX component (Field, Widget, Template or Presentation) against the project checklist. Use when: the user asks to review, audit, check or sign off a component; or before reporting a new component as done. Reports findings by severity with file and line evidence; it does not edit files.'
argument-hint: 'The component key to review (for example Acme_Lib_Quantity), plus the brief if you have it'
---

# Review a DX Component

A second pair of eyes for a component that is already built. The author checked their own work; this review exists to catch what they missed and what they claimed without proof. It is **read-only**: report findings, do not fix them. The author (or a separate step) fixes, then the check script is rerun.

## When to run it

- A new Field, Widget or Template is built and about to be reported done. Skip it for a one-line fix.
- The user asks for a review, audit or quality check of an existing component.

## Stay independent

A reviewer that reads the author's conclusions tends to agree with them.

- If your tool can start a sub-agent or a fresh session, delegate the review and give it only: the component key, the original brief (or the user's request), and this skill. **Do not pass the author's summary, test results or opinion of the code.**
- If you must review in the same session, re-read every file from disk instead of relying on memory, and treat every claim in your own earlier report as unproven until you find the code or test that shows it.

## Procedure

1. **Locate the component** at `src/components/<Org>_<Library>_<Name>/` and note its type and subtype from `config.json`. If you were not given a brief, reconstruct the intended behavior from the user's request and `config.json`, and say that you did.
2. **Get the mechanical facts first.** Run `node .claude/skills/validate-component/scripts/check-component.mjs <key> --no-build` and take its table as given. Do not repeat what it checks (schema, `tsc`, ESLint, Jest, properties read, scans). Spend your effort on what a script cannot judge. Note any `FAIL` row as a finding.
3. **Read the files in this order:** `config.json`, `index.tsx` and any helper files, `styles.ts`, `mock.ts`, `demo.stories.tsx`, `demo.test.tsx`.
4. **Walk the checklist** in [references/checklist.md](./references/checklist.md): the common section, the section for the component type, accessibility, and tests and stories. For every item decide pass, fail or not applicable. A fail needs evidence.
5. **Use a saved plan if there is one** (for example `requirements/<Name>.plan.md`): its acceptance criteria and trace are the brief. Then **trace each requirement in the brief** to the code that implements it and the test that proves it. A requirement with no test is a finding. A test that does not assert the behavior it is named after is a finding.
6. **Check the author's report, if there is one,** against the check table and the code. A claim with no support is a Blocker (checklist item R1).
7. **Write the report** in the format below.

## Rules for the reviewer

- Every finding cites `file:line` and the checklist id. No evidence, no finding.
- Say "cannot determine" instead of guessing, and list it under Not verified.
- Do not invent platform behavior. Use the references this project ships; for a PCore or PConnect method, check the API catalog under `.claude/skills/references/`.
- Report the real problems. Do not pad the report with style opinions the checklist does not mention, and do not repeat one root cause as several findings.
- Do not edit, create or delete files. Do not run publish, authenticate or delete commands.

## Report format

1. **Verdict:** `Ready`, `Ready after minor fixes`, or `Not ready`, with one sentence of reasoning. `Not ready` if there is any Blocker or two or more Majors.
2. **Findings**, most severe first. Each one: severity, checklist id, `file:line`, what is wrong, why it matters to a user or to saved data, and the smallest fix.
   - **Blocker:** corrupts or loses data, a security problem, an accessibility barrier, a requirement not met, or a false claim in the report.
   - **Major:** breaks a platform contract, a missing state, a missing guard, or a missing test for a stated requirement.
   - **Minor:** convention or polish that does not change behavior.
3. **Requirements trace:** each requirement, the code that implements it, the test that proves it, or `no test`.
4. **Not verified:** what you could not check (for example the build, a real Pega server, a screen reader) and why.
