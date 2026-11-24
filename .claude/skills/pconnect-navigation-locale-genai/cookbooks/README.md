---
title: Navigation, Locale & GenAI Cookbook — Recipe Index
description: Multi-method recipes for deep links, locale switching, and GenAI Assistant conversations, indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Navigation, Locale & GenAI

> Part of the [Navigation, Locale & GenAI skill](../SKILL.md).

Every file in [`../../references/`](../../references/) documents one method at a time. Each file in this folder shows how to **chain multiple documented methods together** to complete one common real-world task. Every recipe only uses methods already cataloged in `references/` — follow the links in each recipe for full signatures. Nothing here invents a new API; every call is a direct composition of already-documented methods.

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement — what you're trying to accomplish, in plain language.
- A **Solution** — the minimal correct code, linking to the individual reference files for each method used.
- A **Discussion** — the ordering/cleanup/gotcha pitfall that makes this worth documenting as a recipe instead of assembling from scratch.
- **Related recipes** — links to recipes that share a pattern (lifecycle, cleanup, error handling, etc.), including recipes in sibling skills.

## Recipe Index

Search by symptom or keyword before assembling a sequence of calls from scratch — there is a good chance the ordering/cleanup pitfalls have already been worked out below.

| Recipe                                                                               | Keywords                                                                    | Primary methods                             |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------- |
| [Deep link to a case or assignment](./deep-link-semantic-url.md)                     | deep link, semantic URL, shareable link, permalink, bookmark, query param   | `SemanticUrlUtils`, `NavigationUtils`       |
| [Locale switch and re-localize](./locale-switch-and-relocalize.md)                   | locale switch, language change, i18n, localization, hot reload              | `PCore.switchLocale`, `LocalizationService` |
| [GenAI Assistant conversation](./genai-assistant-conversation.md)                    | chatbot, GenAI, coach, conversation, assistant                              | `GenAIAssistantUtils`                       |
| [Store and restore operator preferences](./persist-operator-preferences.md)          | user settings, operator preferences, persist settings, remember preference  | `NavigationUtils`                           |
| [Keep filter/sort state bookmarkable in the URL](./bookmarkable-filter-state.md)     | bookmarkable filters, URL state, query parameters, shareable filtered view  | `NavigationUtils`                           |
| [Start an Agent conversation for task automation](./agent-conversation-for-tasks.md) | agent, task automation, GenAI agent, agent conversation, like agent message | `GenAIAssistantUtils`                       |

Use the individual reference files in [`../../references/`](../../references/) to look up a single method's exact signature. Use a recipe here when you need to know the **order** multiple methods should be called in to complete a task.

As more cookbooks are added, add one file per recipe (not more content to an existing recipe file) and a row here — see any existing recipe file for the expected frontmatter/structure.
