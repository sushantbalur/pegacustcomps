---
title: PCore / PConnect API Reference Skills
description: 'Index of the six PCore/PConnect skills, their shared method-by-method reference catalog, and cross-cutting testing/security/performance/error-handling/accessibility/GenAI-integration/troubleshooting guidance, for building Pega Constellation custom components.'
---

# PCore / PConnect API Reference Skills

This directory contains **six focused skills**, one per workflow area, plus a **shared reference catalog** (`references/`) that all six draw from. Splitting by workflow keeps each skill's `SKILL.md` narrowly scoped and loadable on its own, while the shared catalog avoids duplicating method-signature facts across skills.

Every API documented here was verified against the latest 26.x release.

Each skill is self-contained — it does not assume access to Pega's internal source code, only the public runtime APIs available to any component at runtime. Only the documented public API surface is covered; methods marked internal, private, or unstable in Pega's own API documentation are intentionally excluded — treat anything not listed here as unsupported and subject to change without notice.

## The Six Skills

| Skill                                                                                    | Covers                                                                                                        |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [pconnect-assignment-lifecycle/SKILL.md](./pconnect-assignment-lifecycle/SKILL.md)       | Opening, validating, submitting, and deleting assignments/cases; attachments; destructive-action confirmation |
| [pconnect-forms-and-fields/SKILL.md](./pconnect-forms-and-fields/SKILL.md)               | Form/field validation, cascading dependent fields, autosave tracking, persisting custom widget UI state       |
| [pconnect-data-subscriptions/SKILL.md](./pconnect-data-subscriptions/SKILL.md)           | Data page subscriptions, application-wide pub/sub, real-time server-pushed case updates                       |
| [pconnect-case-collaboration/SKILL.md](./pconnect-case-collaboration/SKILL.md)           | Participants, followers, related cases, tags                                                                  |
| [pconnect-lists-and-views/SKILL.md](./pconnect-lists-and-views/SKILL.md)                 | Repeating row edits, saved list view personalization, non-assignment container item lifecycle                 |
| [pconnect-navigation-locale-genai/SKILL.md](./pconnect-navigation-locale-genai/SKILL.md) | Deep links/semantic URLs, locale switching, GenAI Assistant conversations                                     |

Each skill's `SKILL.md` covers its own file-listing table and cookbook index. Start with the skill whose topic matches your task; consult [Architecture at a Glance](./references/architecture-overview.md) first if you're new to PCore/PConnect.

## Shared Reference Catalog

[`references/`](./references/) contains method-by-method reference files shared by all six skills above — each file documents a group of methods with a **signature**, a **purpose**, and a minimal **example**.

### PCore APIs

| File                                                                                                   | Covers                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [references/pcore-bootstrap-registry-routing.md](./references/pcore-bootstrap-registry-routing.md)     | Bootstrap lifecycle, component/module registration, routing, view resources                                                                |
| [references/pcore-store-context-state.md](./references/pcore-store-context-state.md)                   | Redux-backed store access, context tree, state machines, object diffing                                                                    |
| [references/pcore-environment-locale-namespace.md](./references/pcore-environment-locale-namespace.md) | Environment info, locale switching, namespace utilities, auth, network status                                                              |
| [references/pcore-rest-data-messaging.md](./references/pcore-rest-data-messaging.md)                   | REST client, data pages/views, cascade, messaging, pub/sub, events, refresh, expressions                                                   |
| [references/pcore-case-collaboration-genai.md](./references/pcore-case-collaboration-genai.md)         | Containers, attachments, feed, tags, stakeholders, user, related cases, GenAI, analytics, personalization                                  |
| [references/pcore-misc-utilities.md](./references/pcore-misc-utilities.md)                             | Constants, behavior overrides, error handling, forms, autosave, debug, mashup bridge, field/annotation utilities, asset loader, navigation |

### PConnect APIs

| File                                                                                                       | Covers                                                                         |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [references/pconnect-state-config.md](./references/pconnect-state-config.md)                               | State & configuration management, data access & property manipulation          |
| [references/pconnect-reference-context-component.md](./references/pconnect-reference-context-component.md) | Page/view reference, context & container management, component information     |
| [references/pconnect-case-validation-utilities.md](./references/pconnect-case-validation-utilities.md)     | Case & data info accessors, validation/condition checks, sub-API access points |
| [references/pconnect-misc-suggestions-creation.md](./references/pconnect-misc-suggestions-creation.md)     | Utilities & services, suggestions handling, component creation                 |

### Sub-API Deep Dives

| File                                                                                                                 | Class                                         | Obtained via                                                                   |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| [references/pconnect-actions-api.md](./references/pconnect-actions-api.md)                                           | `ActionsApi`                                  | `pConn.getActionsApi()`                                                        |
| [references/pconnect-validation-api.md](./references/pconnect-validation-api.md)                                     | `ValidationApi`                               | `pConn.getValidationApi()`                                                     |
| [references/pconnect-container-manager.md](./references/pconnect-container-manager.md)                               | `ContainerManager`                            | `pConn.getContainerManager()`                                                  |
| [references/pconnect-case-info-data-info-localization.md](./references/pconnect-case-info-data-info-localization.md) | `CaseInfo`, `DataInfo`, `LocalizationService` | `pConn.getCaseInfo()`, `pConn.getDataInfo()`, `pConn.getLocalizationService()` |
| [references/pconnect-list-actions.md](./references/pconnect-list-actions.md)                                         | `ListActions`                                 | `pConn.getListActions()`                                                       |

### PCore Sub-API Method Details

The files above cover each `PCore.get*()` accessor's own signature. The files below catalog the methods on the _objects those accessors return_ (for example, what you can call on the `EnvironmentInfo` object returned by `PCore.getEnvironmentInfo()`).

| File                                                                                               | Covers                                                                                                                                         |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [references/pcore-environment-info-details.md](./references/pcore-environment-info-details.md)     | `EnvironmentInfo`, `LocaleUtils`, `AuthUtils`                                                                                                  |
| [references/pcore-rest-data-details.md](./references/pcore-rest-data-details.md)                   | `RestClient`, `DataApi`, `DataApiUtils`, `DataPageUtils`, `DataTypeUtils`, `CascadeManager`, `MashupApi`                                       |
| [references/pcore-messaging-details.md](./references/pcore-messaging-details.md)                   | `SemanticUrlUtils`, `MessageManager`, `PubSubUtils`, `Events`, `MessagingServiceManager`                                                       |
| [references/pcore-case-collaboration-details.md](./references/pcore-case-collaboration-details.md) | `ContainerUtils`, `AttachmentUtils`, `FeedUtils`, `TagUtils`, `StakeholderUtils`, `UserApi`, `CaseFollowerApi`, `CaseUtils`, `RelatedCasesApi` |
| [references/pcore-analytics-genai-details.md](./references/pcore-analytics-genai-details.md)       | `AnalyticsUtils`, `GenAIAssistantUtils`                                                                                                        |
| [references/pcore-bootstrap-init-details.md](./references/pcore-bootstrap-init-details.md)         | `ComponentsRegistry`, `Initialiser`, `BootstrapUtils` (mostly portal-shell/SDK-bridge internals)                                               |
| [references/pcore-store-context-details.md](./references/pcore-store-context-details.md)           | `StateUtils`, `ContextTreeManager`                                                                                                             |
| [references/pcore-misc-details.md](./references/pcore-misc-details.md)                             | `ErrorHandler`, `FormUtils`, `AutosaveUtils`, `MashupBridge`, `ConfirmDialogService`, `FieldDefaultUtils`, `AssetLoader`, `NavigationUtils`    |

## Cross-Cutting Best Practices

[`best-practices/`](./best-practices/) holds guidance that applies across all six skills rather than to one topic: how to test a component that calls these APIs, security considerations when rendering/uploading/linking with them, performance patterns (debouncing, caching, cancellation), a deliberate error-handling/resiliency strategy, accessibility for async/API-driven state, GenAI Assistant integration patterns, and a symptom-indexed troubleshooting guide for the handful of mistakes that recur across every topic area.

| File                                                                                                               | Use when                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [best-practices/testing-pconnect-components.md](./best-practices/testing-pconnect-components.md)                   | Writing or reviewing a Jest/React Testing Library test for a component that calls `PCore.*` or `pConn.*`             |
| [best-practices/security-considerations.md](./best-practices/security-considerations.md)                           | Rendering feed/comment/GenAI content, building deep links, handling uploads, authenticating, or logging errors       |
| [best-practices/performance-and-efficiency.md](./best-practices/performance-and-efficiency.md)                     | Debouncing input, caching/invalidating data pages, canceling stale requests, or avoiding redundant subscriptions     |
| [best-practices/error-handling-and-resiliency.md](./best-practices/error-handling-and-resiliency.md)               | Deciding how a failed call should behave (recover/retry/degrade/block), or containing a failure so it doesn't spread |
| [best-practices/accessibility-for-async-components.md](./best-practices/accessibility-for-async-components.md)     | Announcing loading/success/error states, managing focus after navigation, or localizing status text                  |
| [best-practices/genai-assistant-integration-patterns.md](./best-practices/genai-assistant-integration-patterns.md) | Starting/continuing a GenAI Assistant or Agent conversation, streaming responses, or handling `rewriteText` results  |
| [best-practices/troubleshooting-common-pitfalls.md](./best-practices/troubleshooting-common-pitfalls.md)           | A method is called correctly per its signature but the behavior is still wrong — search by symptom, not method name  |

## Finding a Specific Method Fast

Don't guess which file covers a method by category alone — search for it directly, using the method's exact name:

- Every top-level `PCore.*` / `pConn.*` method is a markdown heading in the form `` `methodName(params)` ``.
- Every method on a _sub-API_ (an object returned by another method — for example, what `PCore.getEnvironmentInfo()` returns) is a row in a `| Method | Signature | Purpose |` table, with the method name as the first cell, still wrapped in backticks.
- Both forms are plain text and consistently backtick-wrapped, so a literal (non-regex) full-text search for the bare method name — for example `getDebouncedSubject` or `isFormValid` — across `references/*.md` will find it regardless of which file or which form (heading vs. table row) it's in. Do not restrict a search to `^## ` headings only, or sub-API table methods will be missed.
- If you only know the class name (e.g. `FormUtils`, `EnvironmentInfo`), search for `` (via `PCore.get...` `` or check the "PCore Sub-API Method Details" / "Sub-API Deep Dives" tables above, which map every class to its file.
- If the question is about **order, sequencing, cleanup, or combining more than one method** to complete a task (rather than a single method's signature), check the relevant skill's `cookbooks/README.md` first — see the table above for which skill covers which topic — before assembling your own sequence from individual reference files.

## Conventions Used Across These Skills

- Examples use `pConn` for a `PConnect` instance and `getPConnect` for the prop function that returns one — the standard naming convention in Constellation component code.
- Examples are minimal and illustrative, written directly from each method's documented signature and behavior — they demonstrate the calling pattern, not a specific production implementation.
- A method's return type notes whether it resolves a `Promise` — always handle the rejection case for any API that returns one.
- Only publicly documented, supported methods are included. If you find a method on `PCore` or `pConn` at runtime that isn't listed here, treat it as unsupported and avoid depending on it.

## Coverage Roadmap

### Documented across these skills

- PCore top-level APIs (`PCore.*`) and PConnect / component-context APIs (`pConn.*`).
- Sub-API deep dives: `ActionsApi`, `ValidationApi`, `ContainerManager`, `CaseInfo`, `DataInfo`, `LocalizationService`, `ListActions`.
- Every sub-API class reachable from a documented `PCore.get*()` accessor now has its own methods cataloged (see the "PCore Sub-API Method Details" table above): `EnvironmentInfo`, `LocaleUtils`, `AuthUtils`, `NamespaceUtils`, `NetworkStatusManager`, `RestClient`, `DataApi`, `DataApiUtils`, `DataPageUtils`, `DataTypeUtils`, `CascadeManager`, `MashupApi`, `SemanticUrlUtils`, `MessageManager`, `PubSubUtils`, `Events`, `MessagingServiceManager`, `ExpressionEngine`, `ContainerUtils`, `AttachmentUtils`, `FeedUtils`, `TagUtils`, `StakeholderUtils`, `UserApi`, `CaseFollowerApi`, `CaseUtils`, `RelatedCasesApi`, `AnalyticsUtils`, `GenAIAssistantUtils`, `GenAIUtils`, `PersonalizationUtils`, `AsynchronousUtils`, `ComponentsRegistry`, `ViewResources`, `Initialiser`, `BootstrapUtils`, `StateUtils`, `ContextTreeManager`, `ErrorHandler`, `FormUtils`, `AutosaveUtils`, `MashupBridge`, `ConfirmDialogService`, `FieldUtils`, `FieldDefaultUtils`, `AnnotationUtils`, `AssetLoader`, `NavigationUtils`.
- Some large classes (`EnvironmentInfo`, `ContainerUtils`, `CaseUtils`, `DataApi`, `AssetLoader`, `DataApiUtils`, `DataPageUtils`) are documented as a **curated subset** — methods that are purely internal framework plumbing (low-level query builders, container bookkeeping used only by the framework itself, and so on) are intentionally omitted to keep the signal-to-noise ratio high for component authors.
- Composed, multi-method recipes for common real-world tasks (see each skill's `cookbooks/README.md`) — these chain together methods already cataloged elsewhere and call out ordering/cleanup pitfalls.
- Cross-cutting testing, security, performance, error-handling, accessibility, GenAI-integration, and troubleshooting guidance (see [`best-practices/`](./best-practices/)) that applies across all six skills rather than to one topic.

### Permanently out of scope

The following classes are only reachable through a `PCore.get*()` accessor that is itself unsupported/private, so there is no supported way to obtain them — they are intentionally not documented anywhere in these skills: `RuntimeParamsAPI`, `RemoteCase`, `MetadataUtils`, `Debugger`, `DeferLoadManager`, `RefreshManager`, `AccessPrivilege`, `ObjectTransformer`, `RoutingUtils`, `CoexistenceManager`.

## Related Documentation

- [Using PCore and PConnect public APIs](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/using-pcore-pconnect-public-apis.html) — official entry point for the public API spec.
- [Accessing APIs from the PCore object](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/accessing-apis-pcore-object.html)
- [Accessing APIs from the PConnect object](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/accessing-apis-pconnect-object.html)
- [Working with Containers](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/working-containers.html)
- [Working with Messaging Service](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/working-messaging-service.html)
- [Initializing the Constellation environment](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/initializing-constellation-environment.html)
- [Caching and invalidating data pages](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/caching-invalidating-constellation-data-pages.html)
- [Invoking a savable data page](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/invoking-savable-data-page.html)
- [Using type definitions for PCore and PConnect APIs](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/using-type-definitions-pcore-pconnect-apis.html)
- [Pega Academy: PCore and PConnect APIs in Constellation DX components](https://academy.pega.com/topic/pcore-and-pconnect-apis-constellation-dx-components/v1)
