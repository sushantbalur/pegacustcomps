# PCore and PConnect API Reference

This file is an **index**. The authoritative method-by-method catalog (signature, purpose, example, notes) is installed with this project in [`.claude/skills/references/`](../../references/), and the workflow skills (`pconnect-*`) add cookbooks and pitfalls.

**Rules**

1. Before calling any PCore or PConnect method, look up its exact signature in the catalog. Do not write it from memory: names, argument order and return values are easy to get wrong.
2. Use only the methods documented in the catalog. Treat anything else on `PCore` or `pConn` as unsupported, and tell the user if the task needs it.
3. Component code reaches PConnect through `props.getPConnect()` and PCore through the global `PCore`. The type of `pConn` comes from `@pega/pcore-pconnect-typedefs`, so `tsc --noEmit` will reject a method that does not exist.

## Look up a method: search, don't read whole files

The catalog files are 5–22 KB each, so search them instead of reading them:

1. Search `.claude/skills/references/` for the bare method name as literal text (for example `getDataPageData` or `isFormValid`). A top-level method is a heading such as `` ### `finishAssignment(containerItemID, options?)` ``; a method on a sub-API object is a backticked first cell in a `| Method | Signature | Purpose |` table row. Do not limit the search to headings, or the table rows are missed.
2. Read only the matching section: from its heading to the next heading of the same level, or the matching table row and the rows around it.
3. If you know only the class (`FormUtils`, `EnvironmentInfo`), search for `` (via `PCore.get `` or use the tables below to pick the file.
4. For call order, cleanup or a sequence of several methods, read the matching `pconnect-*` skill's cookbook instead of assembling it from signatures.

Open the full catalog index, [`.claude/skills/README.md`](../../README.md), only when the search finds nothing and the tables below do not help.

## Where each API is documented

Paths are relative to [`.claude/skills/references/`](../../references/).

### PConnect (`const pConn = getPConnect()`)

| You need to...                                                         | Methods                                                           | Catalog file                                       |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| Read the bound property name, config, or inherited props               | `getStateProps`, `getConfigProps`, `getRawMetadata`, `getInheritedProps`, `resolveConfigProps` | `pconnect-state-config.md`      |
| Read or write values and pass props to children                        | `getValue`, `setValue`, `setInheritedProp`, `setInheritedConfig`  | `pconnect-state-config.md`                         |
| Know the context, component name, children                             | `getContextName`, `getComponentName`, `getChildren`               | `pconnect-reference-context-component.md`          |
| Create a child component                                               | `createComponent`                                                 | `pconnect-misc-suggestions-creation.md`            |
| Clear a validation message, accept or ignore a suggestion              | `clearErrorMessages`, `acceptSuggestion`, `ignoreSuggestion`      | `pconnect-misc-suggestions-creation.md`            |
| Update a field, submit, cancel, open actions                           | `getActionsApi().updateFieldValue`, `triggerFieldChange`, `finishAssignment`, `cancelAssignment`, `openLocalAction`, ... | `pconnect-actions-api.md` |
| Validate a value                                                       | `getValidationApi().validate`                                     | `pconnect-validation-api.md`                       |
| Read case details                                                      | `getCaseInfo().getKey`, `getID`, `getName`, ...                   | `pconnect-case-info-data-info-localization.md`     |
| Localize text                                                          | `getLocalizationService().getLocalizedText`                       | `pconnect-case-info-data-info-localization.md`     |
| Edit rows of a list property                                           | `getListActions()`                                                | `pconnect-list-actions.md`                         |
| Manage containers                                                      | `getContainerManager()`                                           | `pconnect-container-manager.md`                    |

### PCore (global)

| You need to...                                              | Accessor                                                     | Catalog file                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Load a data page or data view                               | `PCore.getDataApiUtils().getData`, `PCore.getDataPageUtils()` | `pcore-rest-data-messaging.md`, `pcore-rest-data-details.md`                  |
| Call a REST endpoint                                        | `PCore.getRestClient()`                                      | `pcore-rest-data-messaging.md`, `pcore-rest-data-details.md`                  |
| Publish or subscribe to events                              | `PCore.getPubSubUtils()`, `PCore.getEvents()`                | `pcore-rest-data-messaging.md`, `pcore-messaging-details.md`                  |
| Show or clear messages                                      | `PCore.getMessageManager()`                                  | `pcore-rest-data-messaging.md`, `pcore-messaging-details.md`                  |
| Use constants such as `CASE_INFO`                           | `PCore.getConstants()`                                       | `pcore-misc-utilities.md`                                                     |
| Read operator, locale or environment details                | `PCore.getEnvironmentInfo()`, `PCore.getLocaleUtils()`       | `pcore-environment-locale-namespace.md`, `pcore-environment-info-details.md`  |
| Work with cases, containers, attachments, feed, tags, users | `PCore.getCaseUtils()`, `getContainerUtils()`, `getAttachmentUtils()`, `getFeedUtils()`, `getTagUtils()`, `getUserApi()` | `pcore-case-collaboration-genai.md`, `pcore-case-collaboration-details.md` |
| Form helpers and error handling                             | `PCore.getFormUtils()`, `PCore.getErrorHandler()`            | `pcore-misc-utilities.md`, `pcore-misc-details.md`                            |
| Build deep links, change locale                             | `PCore.getSemanticUrlUtils()`, `PCore.getLocaleUtils()`      | `pcore-rest-data-messaging.md`, `pcore-environment-locale-namespace.md`       |
| GenAI assistant, analytics, personalization                 | `PCore.getGenAIAssistantUtils()`, `getAnalyticsUtils()`, `getPersonalizationUtils()` | `pcore-case-collaboration-genai.md`, `pcore-analytics-genai-details.md` |

For anything not listed here, search the catalog for the method name as described above.

## Which skill covers the workflow

| Task                                                                      | Skill                              |
| ------------------------------------------------------------------------- | ---------------------------------- |
| Submit, validate, cancel or delete assignments and cases; attachments     | `pconnect-assignment-lifecycle`    |
| Field validation, dependent fields, autosave, persisting widget UI state  | `pconnect-forms-and-fields`        |
| Data page subscriptions, pub/sub, real-time updates                       | `pconnect-data-subscriptions`      |
| Participants, followers, related cases, tags, feed                        | `pconnect-case-collaboration`      |
| Repeating rows, list view personalization, container lifecycle            | `pconnect-lists-and-views`         |
| Deep links, locale switching, GenAI assistant                             | `pconnect-navigation-locale-genai` |

Cross-cutting guidance (testing, error handling, performance, security, accessibility) is in [`.claude/skills/best-practices/`](../../best-practices/).

## Official documentation

- [Using PCore and PConnect public APIs](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/using-pcore-pconnect-public-apis.html)
- [Accessing APIs from the PConnect object](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/accessing-apis-pconnect-object.html)
- [Accessing APIs from the PCore object](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/accessing-apis-pcore-object.html)
- [Using type definitions for PCore and PConnect APIs](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/using-type-definitions-pcore-pconnect-apis.html)
