# Requirements Template

Copy this into a file (for example `requirements/QuantityField.md`) and fill in what you know. **Leave anything you do not know blank**: the assistant will ask about it, or propose a default for you to approve. You can also ask the assistant to interview you and write the file for you.

You can attach images, paste links, or name a design system anywhere below.

## 1. What is it for?

- What problem does it solve, and for whom?
- In one or two sentences, what should the user be able to do?

## 2. Where will it appear?

- In which case type, step, page or dashboard?
- Is it one input for one value, a block that shows its own data, a layout that arranges other fields, or a replacement for the whole case view?
- Does it appear in more than one place?

## 3. Data

- What value or data does it show or change? Give the property name if you know it.
- Where does the data come from (a case property, a data page, something else)?
- Give two or three **example values**, including an empty one and an unusual one.
- If it changes data, when should the change be saved (as the user types, when they leave the field, on a button)?

## 4. Behavior

- What should happen when the user interacts with it? List the actions in order.
- What is allowed, and what must be refused (for example, only whole numbers from 1 to 999)?
- What error message should the user see, in your own words?

## 5. States

Say what should be shown in each state you care about. Skip the ones that do not apply.

| State | What the user sees and can do |
| --- | --- |
| Normal | |
| Empty | |
| Loading | |
| Error | |
| Read-only or display-only | |
| Disabled | |
| Success | |
| Very long or unusual content | |

## 6. Look and feel

- Screenshots, mockups or a sketch: attach them or give the file names, and say what each one shows.
- Public links to something similar (documentation, a demo, an example): paste them. Only public pages can be read. For a private ticket, wiki page or document, paste the relevant text or save an export into the project.
- Code or a prototype from a design tool, or a design file export: attach it and say what it should and should not decide.
- A design system or library you want it to resemble (name, version, component): the assistant will map it onto the Pega design system and tell you what will look different.
- Anything about the look that is a hard requirement.

## 7. What should the app designer be able to configure in App Studio?

List the settings you would like (for example a minimum, a label, a color map), and a default for each.

## 8. Quality and compliance

- Accessibility target (for example WCAG 2.2 level AA) and any regional rules that apply to you. Leave blank if you do not know; the assistant will propose a default and say so.
- Languages, including any right-to-left language.
- Browsers and devices it must work on.
- Performance expectations, and the largest amount of data it must handle.
- Privacy and data-handling rules, and whether it must leave an audit trail.

## 8a. Does it use AI?

Skip this if it does not generate or act on generated content.

- What does the AI produce or decide (suggestions, a summary, an answer, an action)?
- Where does it come from, and what data is sent to it?
- How should the user know it is machine-generated, and must a person approve it before it has an effect?
- Can the user stop it, retry it and give feedback?
- What should happen when it is slow, wrong, refused or unavailable?

## 9. Limits

- What must it **not** do?
- Which libraries are you willing, or not willing, to use?
- Deadline or size expectations, if any.

## 10. How will you know it works?

A short list of things you will check. Given/when/then sentences are ideal because each one becomes a test. For example "typing 0 shows an error", "clearing the field leaves it empty", "it looks right in a details view".

## 11. Anything else

Context, history, related components, links to tickets.
