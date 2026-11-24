---
name: pconnect-navigation-locale-genai
description: 'Reference catalog and cookbook for PCore/PConnect APIs governing navigation, localization, and GenAI Assistant integration — SemanticUrlUtils, NavigationUtils, PCore.switchLocale, LocalizationService, and GenAIAssistantUtils — with recipes for building a shareable deep link, switching locale and re-resolving labels, starting a GenAI Assistant conversation, persisting operator preferences, keeping filter/sort state bookmarkable in the URL, and starting an Agent conversation for task automation. Use when you need the exact signature for these APIs, or the correct order to call them for deep linking, localization, or GenAI conversations.'
user-invocable: true
argument-hint: 'Use when building a shareable deep link/semantic URL, switching the active locale and re-resolving labels, or starting a GenAI Assistant conversation — for the exact SemanticUrlUtils/PCore.switchLocale/GenAIAssistantUtils signature, or the correct call order.'
metadata:
  verified-against: 'latest 26.x'
---

# Navigation, Locale & GenAI — PCore/PConnect Skill

This skill covers the PCore/PConnect APIs and recipes for **navigation, localization, and GenAI Assistant integration**: shareable deep links, locale switching, and GenAI Assistant conversations. It is one of the PCore/PConnect API skills — see the [skills index](../README.md) for the full method catalog, architecture primer, and the other five skills.

## When to Use This Skill

Load this skill when:

- You need the exact parameters, return type, or purpose of a `SemanticUrlUtils`, `NavigationUtils` (URL params), `PCore.switchLocale`, `LocalizationService`, or `GenAIAssistantUtils` method.
- You're building a shareable/bookmarkable URL to a specific case or assignment, or reading an identifier back out of the current URL.
- You're switching the operator's active locale at runtime and need to refresh already-resolved label text.
- You're starting or continuing a conversation with a configured GenAI Assistant or Agent.

If your task is about persisting a custom widget's own UI state (not the URL) across navigation, see [pconnect-forms-and-fields](../pconnect-forms-and-fields/SKILL.md) instead.

New to PCore/PConnect? Start with [Architecture at a Glance](../references/architecture-overview.md).

## Key Reference Files

| File                                                                                                                     | Class(es)                         | Obtained via                     |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------------------- |
| [../references/pcore-messaging-details.md](../references/pcore-messaging-details.md)                                     | `SemanticUrlUtils`                | `PCore.getSemanticUrlUtils()`    |
| [../references/pcore-misc-details.md](../references/pcore-misc-details.md)                                               | `NavigationUtils`                 | `PCore.getNavigationUtils()`     |
| [../references/pcore-environment-locale-namespace.md](../references/pcore-environment-locale-namespace.md)               | Locale switching (accessor-level) | `PCore.switchLocale()`           |
| [../references/pconnect-case-info-data-info-localization.md](../references/pconnect-case-info-data-info-localization.md) | `LocalizationService`             | `pConn.getLocalizationService()` |
| [../references/pcore-analytics-genai-details.md](../references/pcore-analytics-genai-details.md)                         | `GenAIAssistantUtils`             | `PCore.getGenAIAssistantUtils()` |

See the [full reference index](../README.md) for every other PCore/PConnect method not directly related to this skill's topic.

## Cookbooks

Multi-method, ordering/cleanup recipes for this skill's topic live in [cookbooks/README.md](./cookbooks/README.md): building a shareable deep link, switching locale and re-resolving labels, starting a GenAI Assistant conversation, persisting operator preferences, keeping filter/sort state bookmarkable in the URL, and starting an Agent conversation for task automation.

Use the reference files above for a single method's signature. Use the cookbook index when you need the **order** multiple methods should be called in to complete a task.

For testing components that call these APIs, security considerations (deep links, sanitizing GenAI Assistant responses, prompt injection), performance/resiliency for GenAI calls, dedicated GenAI Assistant conversation-integration patterns, accessible focus management after a locale/navigation change, or troubleshooting a call that isn't behaving as documented, see [Cross-Cutting Best Practices](../best-practices/README.md).
