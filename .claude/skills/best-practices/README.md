---
title: Cross-Cutting Best Practices — Index
description: Testing, security, performance, error-handling, accessibility, GenAI-integration, and troubleshooting guidance that applies across all the PCore/PConnect skills, indexed by topic and symptom for AI/RAG retrieval.
---

# Cross-Cutting Best Practices

> Shared by all the skills in the [skills index](../README.md).

The skills and their `references/`/`cookbooks/` folders document individual methods and multi-method recipes. This folder is different: it covers practices that apply **regardless of which topic you're working in** — how to test a component that calls these APIs, how to use them without introducing a security or accessibility issue, how to integrate GenAI Assistant conversations specifically, and how to recognize/fix the same handful of mistakes that show up across every topic area.

## Guides

| Guide                                                                                     | Use when                                                                                                             |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [Testing components that use PCore/PConnect](./testing-pconnect-components.md)            | Writing or reviewing a Jest/React Testing Library test for a component that calls `PCore.*` or `pConn.*`             |
| [Security considerations](./security-considerations.md)                                   | Rendering feed/comment/GenAI content, building deep links, handling uploads, authenticating, or logging errors       |
| [Performance & efficiency](./performance-and-efficiency.md)                               | Debouncing input, caching/invalidating data pages, canceling stale requests, or avoiding redundant subscriptions     |
| [Error handling & resiliency](./error-handling-and-resiliency.md)                         | Deciding how a failed call should behave (recover/retry/degrade/block), or containing a failure so it doesn't spread |
| [Accessibility for async, API-driven components](./accessibility-for-async-components.md) | Announcing loading/success/error states, managing focus after navigation, or localizing status text                  |
| [GenAI Assistant integration patterns](./genai-assistant-integration-patterns.md)         | Starting/continuing a GenAI Assistant or Agent conversation, streaming responses, or handling `rewriteText` results  |
| [Troubleshooting common pitfalls](./troubleshooting-common-pitfalls.md)                   | Something calls the documented method correctly but the behavior is still wrong — search by symptom, not method name |

Nothing in this folder introduces a new API — every recommendation composes methods already cataloged in [`../references/`](../references/) or sequenced in a skill's `cookbooks/`. Use the reference/cookbook links inside each guide for exact signatures and call order.
