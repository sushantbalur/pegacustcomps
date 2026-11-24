---
title: Switch the active locale and re-resolve already-fetched labels
keywords: [locale switch, language change, i18n, localization, hot reload, getLocalizedText]
primary_methods: [PCore.switchLocale, LocalizationService.getLocalizedText]
related: [pubsub-cleanup]
---

# Recipe: Switch the active locale and re-resolve already-fetched labels

> Part of the [Navigation, Locale & GenAI cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A custom language switcher needs to change the operator's active locale at runtime, and any label text the component already resolved and stored in local state must be refreshed — it won't update on its own.

## Solution

Uses `PCore.switchLocale()` (see [pcore-environment-locale-namespace.md](../../references/pcore-environment-locale-namespace.md)) and `LocalizationService.getLocalizedText()` (see [pconnect-case-info-data-info-localization.md](../../references/pconnect-case-info-data-info-localization.md)).

```typescript
async function onLanguageChange(nextLocale: string) {
  await PCore.switchLocale(nextLocale);

  // Re-resolve any label already cached in component state — switchLocale
  // does not retroactively update strings you resolved before it finished.
  setSubmitLabel(pConn.getLocalizationService().getLocalizedText('Submit'));
}
```

## Discussion

**MUST** re-call `getLocalizedText`/`getLocalizedMessage` after `switchLocale` resolves, for any text your component holds in its own state rather than re-reading on every render. `switchLocale` resolves once the new locale bundle finishes loading, but it does NOT push updated values into code that already called `getLocalizedText` earlier and stored the result.

If multiple sibling components (not just the one that triggered the switch) need to react, pair this with an application-wide event (see [Publish/subscribe between unrelated components](../../pconnect-data-subscriptions/cookbooks/pubsub-cleanup.md)) rather than assuming every open component will independently notice the change.

## Related recipes

- [Publish/subscribe between unrelated components, with cleanup](../../pconnect-data-subscriptions/cookbooks/pubsub-cleanup.md)
