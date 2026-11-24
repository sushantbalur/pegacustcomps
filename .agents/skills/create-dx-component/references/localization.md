# Localization

Every string a user sees must be translatable, because the same component runs in many languages. This file covers what the scaffolds do and the rules that follow. Anything about how translations reach Pega at runtime is a Pega localization process outside the component: say that you cannot see it and ask the user.

## What the scaffolds do

- A scaffold that shows its own text ships a `localizations.json` next to `index.tsx`. Its shape is a `fields` object whose keys are the English strings, each mapped to the same English string as the default. The Widget `CASE` scaffold, for example, lists `Date`, `Description`, `Performed by` and `Loading case history`.
- The component asks the platform for the translation of an English string with `pConn.getLocalizationService().getLocalizedText('English text')`. One scaffold uses `PCore.getLocaleUtils().getLocaleValue('English text', category)` with a category name (`'Case'`). Both are in the API catalog.
- The English text is the lookup key. If no translation exists, the English text is shown.

## Rules

1. **Never hard-code visible text in JSX.** Pass every label, message, button text, empty-state message, error message, `aria-label` and placeholder through `getLocalizedText`.
2. **Every string you pass must appear in `localizations.json`**, as `"English text": "English text"`. Keep that file in step with the code: a string added in code is added there, and a string removed from code is removed there. A reviewer should be able to diff the two.
3. **Use a stable, complete sentence as the key.** Do not build a sentence from fragments (`'Showing ' + n + ' of ' + total`), because word order differs between languages. Use a whole string with placeholders that you substitute yourself (for example `'Showing {0} of {1}'` and replace `{0}`, `{1}` after translating). `getLocaleValue` has no placeholder engine.
4. **Plurals are separate strings.** `'1 item'` and `'{0} items'` are two keys. Do not append an `s`.
5. **Do not translate values that are data.** A picklist stores the key; show the label the platform provides. Case ids, user names and amounts are not translated.
6. **Do not store translated text.** Resolve it at render time. When the user switches language, the component receives a new `locale` prop and re-renders, so the translated text must not be cached in state.
7. **Format numbers, dates and currency with the Cosmos formatters and display components** (`NumberDisplay`, `CurrencyDisplay`, `DateTimeDisplay`, `formatNumber`) and the operator's locale. Do not format by string concatenation.
8. **Leave room for longer text.** Translations are often 30 to 40 percent longer. Wrap text, avoid fixed widths, and check the longest string in Storybook.
9. **Labels you put in `config.json` are authoring-time text.** Keep them in sentence case and plain English; only default values that appear to the end user (for example a default heading in `defaultConfig`) use the `@L` prefix to mark them as localizable.
10. **Right-to-left languages** are handled by Cosmos layout components. Do not hard-code `left` and `right`; use logical properties or Cosmos layout props.

## In tests and stories

Mock `getLocalizationService` to return the key unchanged, so a test asserts the English text. Add one test that passes a non-English mock and checks that the component renders what the service returns instead of its own literal.

## Review checks

[review-component](../../review-component/SKILL.md) item C7 checks that visible text goes through the service. When you review, grep the JSX for string literals and compare the keys used with `localizations.json`.
