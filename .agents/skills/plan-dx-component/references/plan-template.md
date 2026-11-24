# Component Plan Template

Fill in every section that applies. Write "not applicable" with a reason instead of leaving a section out. Keep it short enough to read in one sitting; the point is a decision, not a document.

## 1. Summary

One paragraph: what the component does and for whom. Whether it is a plan from requirements or a port, and from what source.

## 2. Fit and type

- Buildable as a custom DX component: yes, partly, or no, and why.
- Type and subtype, and the reason (for a Field, the type of the stored value).
- Anything that does not fit, and the closest alternative.

## 3. Contract

| Item | Decision |
| --- | --- |
| Name and label | `<Org>_<Library>_<Name>`, and the label shown in App Studio |
| Where it appears | The view, page or placement |
| Data in | The bound property, the data page, or the props |
| Data out | What it writes back, and when it commits |
| Read-only and display-only behavior | |
| Edge values | Empty, `null`, zero, very long, malformed |

## 4. Authoring properties

| Property | Label | Format | Default | Why the designer needs it |
| --- | --- | --- | --- | --- |

Start with the smallest set that makes the component usable.

## 5. States

Choose the applicable rows from [state-matrix.md](../../create-dx-component/references/state-matrix.md). For each: what is shown, what can be done, what is announced.

## 6. Building blocks

- Cosmos components and what each is for (see [design-system-mapping.md](./design-system-mapping.md)).
- PCore and PConnect methods needed, each found in the API catalog.
- Anything custom, and why Cosmos does not cover it.

## 7. Quality and compliance

- The accessibility target and any regional rules, as stated by the user or marked as a proposed default.
- Languages (including right-to-left), supported browsers and devices, performance and data-size expectations, privacy and audit needs.

- Accessibility: names, keyboard path, focus, announcements ([accessibility.md](../../create-dx-component/references/accessibility.md)).
- Localization: the visible strings ([localization.md](../../create-dx-component/references/localization.md)).
- Tests and stories: one per state, plus the edge values.

### AI-assisted content (only if the component uses AI)

Source of the content and what is sent to it; how it is labeled as machine-generated; whether a person must approve it; stop, retry and feedback; the states from [state-matrix.md](../../create-dx-component/references/state-matrix.md); how model output is sanitized before rendering.

## 8. Dependencies and risks

| Item | Needed for | In Cosmos or the browser? | Consent |
| --- | --- | --- | --- |

Plus any platform behavior that could not be verified.

## 9. Open questions

Numbered, each with who can answer it.

## 10. Acceptance criteria and trace

A short list the user can check: observable behavior, not implementation. Keep the user's own wording where they gave criteria, and map each criterion to the test that will prove it.

| Requirement or criterion | Source (file, link, image, or the message) | Decision | Test |
| --- | --- | --- | --- |

## 11. Size

Small, medium or large, and the biggest uncertainty behind that estimate.
