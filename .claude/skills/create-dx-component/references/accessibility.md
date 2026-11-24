# Accessibility

Accessibility is part of the component contract, not a final polish step. Cosmos components already carry most of the semantics (labels, roles, ARIA state, focus rings, keyboard behavior), which is the main reason to build from them (see the Cosmos-first rule in [AGENTS.md](../../../../AGENTS.md)). This file lists what the component author is still responsible for, and how to verify it with the tools the project already has.

Target: WCAG 2.2 AA.

## What Cosmos gives you, and what it does not

| Cosmos provides | You must still provide |
| --- | --- |
| Label association, `required`, `aria-invalid` and error text on its inputs | A meaningful `label`, kept even when `hideLabel` is set (hide it visually, do not remove it) |
| Roles, `aria-selected`, roving focus and arrow keys for `Tabs`; `inert` on inactive panels | Unique, stable tab ids; a sensible active tab when one disappears |
| `role='alert'` on urgent and warning `Banner`, polite for the rest | Choosing the right variant, and an array for `messages` |
| `fieldset` and `legend` for a named `FieldGroup`, `aria-expanded` on collapsible groups | Heading levels that stay sequential (see below) |
| Visible `:focus-visible` rings | Not removing them in `styles.ts`, and deciding where focus goes after an action |
| A busy indicator in `Progress` | A status message screen readers can hear: the `Progress` in the build checked does not announce by itself |

## Rules

1. **Semantic first.** Use the native element or the Cosmos component, then ARIA only to fill a real gap. Do not put `role` on something a Cosmos component already renders with that role.
2. **Every control has an accessible name** that is stable and specific. Icon-only buttons need a `label` or `aria-label`. When several controls repeat (a row of Delete buttons), give each a distinct name (the item name in the label, or `contextualLabel` on a `SummaryList` item).
3. **Associate help and errors with the control.** Pass `helperText` and `validatemessage` to the Cosmos control (as `info`) instead of rendering a separate paragraph. A validation message replaces helper text.
4. **Never convey state by color alone.** Required, error, warning and success need text or an icon as well. Cosmos `status` does this for inputs.
5. **Keyboard parity.** Everything a pointer can do, the keyboard can do, in a logical tab order. Hover-only information (a tooltip, a preview) needs a focus or key equivalent. Do not trap focus, except inside a modal, which Cosmos handles.
6. **Announce asynchronous change without moving focus.** Loading finished, save succeeded, validation failed and a list changed should be announced through a polite live region or a `Banner`. Do not steal focus for a status message. Use `aria-busy` on a region that is refreshing in place.
7. **Move focus deliberately, and only when the user acted.**
   - After a destructive action on a list item, focus the next item or the Add button (`SummaryList` / `ViewAll` do this when given `deletedItemId` and `fallbackFocusRef`).
   - After a refresh replaces the control that was activated, restore focus to a control that still exists (save `document.activeElement` first).
   - After an error the user must fix, focus the first invalid control or the error summary (`Banner` accepts a `handle` with `focus()`).
   - Do not move focus on load, on a timer, or when a background request finishes.
8. **Headings.** The page template owns the `h1`. A top-level section is `h2`, nested sections `h3` and below, with no skipped levels. Use `Text variant` or `headingTag`, not a styled `span`. A `FieldGroup` title is a `legend`, not a heading, unless you pass `headingTag`.
9. **Do not add landmarks** (`main`, `nav`) in a field, widget or template. The shell owns them.
10. **Hidden means gone.** Remove hidden content (`display: none`, `inert`, or not rendering it), do not just move it off-screen or make it transparent, so it leaves the tab order and the reading order.
11. **Reflow and zoom.** Content must work at 320 CSS pixels wide and at 200% zoom without two-dimensional scrolling. Use `minmax(0, 1fr)` grid tracks, wrapping text, and container-based breakpoints. Do not use fixed pixel widths for text containers.
12. **Motion.** Respect `prefers-reduced-motion` for any animation you add in `styles.ts`. Cosmos handles its own.
13. **Target size.** Interactive targets are at least 24 by 24 CSS pixels. Use Cosmos `Button` and `Link` rather than a bare clickable `span`.
14. **Localization.** Labels, status text and error messages go through the localization service, and the layout must tolerate text that is 30 to 40 percent longer.
15. **Reading order equals visual order.** In a multi-column template, the DOM order must match the order a sighted user reads; when columns stack, the semantic order must survive.

## By component type

- **Field:** the label, `required`, `disabled`, `readOnly` and error state must each be observable by role and name. A radio group has a group name. A masked or formatted input exposes the formatted value, not the raw one. The display-only form still needs a label (visible or associated). Clearing an error on edit must not silently remove the information the user needs.
- **Widget:** a distinct, announced state for loading, empty, error, success and pending action. A list is a list (`ul`/`ol` or a Cosmos list component), a data table is a `Table` with headers. A chart needs a text alternative or a table with the same data. A control that changes the content below it says so.
- **Template:** one `h1` only in a page template, sequential headings, `fieldset`/`legend` for groups of fields, `EmptyState` for an empty region, and a collapse order that keeps the reading order.

## Verification

Do these in the Jest test and in Storybook; an automated pass never replaces a keyboard check.

**In `demo.test.tsx`** (only `fireEvent` and Testing Library are installed; do not rely on `user-event`):

- Find controls by role and accessible name: `screen.getByRole('textbox', { name: /email/i })`, `getByRole('group', { name: 'Contact' })`, `getByRole('alert')`. A query that needs a test id because there is no role or name is an accessibility finding.
- Assert state attributes: `toBeRequired()`, `toBeDisabled()`, `toHaveAttribute('aria-invalid', 'true')`, `toHaveAttribute('aria-busy', 'true')`, `toBeVisible()`.
- Assert the error is exposed: after setting `validatemessage`, the message text is in the document and the control is described by it (`toHaveAccessibleDescription` where the installed jest-dom has it).
- Keyboard path: `control.focus()`, `expect(control).toHaveFocus()`, `fireEvent.keyDown(control, { key: 'Enter' })` or `'ArrowDown'`, and assert the result. Test the Escape and Enter paths of any popover or modal you add.
- Focus after an action: delete an item, then `expect(addButton).toHaveFocus()`; close a modal, then the trigger has focus.
- Status announcement: `expect(await screen.findByRole('status')).toHaveTextContent(...)` or the `Banner` text, for loading finished, saved and failed.

**Automated rule checking** with `jest-axe` is optional and is **not installed** in the project template. Adding it is a new dependency, so ask the user first (AGENTS.md, Third-Party Library Consent) with the library name (`jest-axe`), why (it catches missing names, invalid ARIA and contrast-independent rule violations that role queries miss), and that it would be a new dev dependency. Do not add it without approval.

**By hand, in Storybook** (`npm run startStorybook` is user-run):

1. Tab through the component without a mouse: order, visible focus, no trap, every action reachable.
2. Operate every action with Enter and Space, and every list or tab group with the arrow keys.
3. Zoom to 200% and narrow the viewport to 320px; nothing is clipped or needs horizontal scrolling.
4. Turn on a screen reader (VoiceOver on macOS) and check the name, role, state and announcement for the default, error, loading and empty states.
5. Check the error, required and read-only states without relying on color.

## Reporting

In the final report, say which of these were done and which were not. Never claim an accessibility pass from the automated tests alone.
