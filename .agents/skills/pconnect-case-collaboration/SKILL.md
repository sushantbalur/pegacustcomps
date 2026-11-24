---
name: pconnect-case-collaboration
description: 'Reference catalog and cookbook for PCore/PConnect APIs governing case collaboration and relationships — StakeholderUtils, CaseFollowerApi, RelatedCasesApi, TagUtils, FeedUtils, AttachmentUtils, and UserApi — with recipes for adding a participant and follower, relating two cases, tagging a case to find related cases, listing/updating participants, posting and managing feed messages, listing/editing/deleting attachments, and looking up operator details. Use when you need the exact signature for these APIs, or the correct order to call them to manage participants, relationships, feed messages, attachments, or tags on a case.'
user-invocable: true
argument-hint: 'Use when adding a participant/follower to a case, relating two cases, or tagging a case to find similar ones — for the exact StakeholderUtils/CaseFollowerApi/RelatedCasesApi/TagUtils signature, or the correct call order.'
metadata:
  verified-against: 'latest 26.x'
---

# Case Collaboration & Relationships — PCore/PConnect Skill

This skill covers the PCore/PConnect APIs and recipes for **case collaboration and relationships**: participants, followers, related cases, and tags. It is one of the PCore/PConnect API skills — see the [skills index](../README.md) for the full method catalog, architecture primer, and the other five skills.

## When to Use This Skill

Load this skill when:

- You need the exact parameters, return type, or purpose of a `StakeholderUtils`, `CaseFollowerApi`, `RelatedCasesApi`, or `TagUtils` method.
- You're adding a user to a case in a role and/or as a follower.
- You're linking two cases together, or applying an informal tag/label and browsing other cases sharing it.

If your task is about the case's own submission/deletion lifecycle rather than its participants or relationships, see [pconnect-assignment-lifecycle](../pconnect-assignment-lifecycle/SKILL.md) instead.

New to PCore/PConnect? Start with [Architecture at a Glance](../references/architecture-overview.md).

## Key Reference Files

| File                                                                                                                     | Class(es)                                                            | Obtained via          |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------- |
| [../references/pcore-case-collaboration-details.md](../references/pcore-case-collaboration-details.md)                   | `StakeholderUtils`, `CaseFollowerApi`, `RelatedCasesApi`, `TagUtils` | `PCore.get*()`        |
| [../references/pcore-case-collaboration-genai.md](../references/pcore-case-collaboration-genai.md)                       | Stakeholders, tags, related cases (accessor-level)                   | `PCore.get*()`        |
| [../references/pconnect-case-info-data-info-localization.md](../references/pconnect-case-info-data-info-localization.md) | `CaseInfo`                                                           | `pConn.getCaseInfo()` |

See the [full reference index](../README.md) for every other PCore/PConnect method not directly related to this skill's topic.

## Cookbooks

Multi-method, ordering/cleanup recipes for this skill's topic live in [cookbooks/README.md](./cookbooks/README.md): adding a participant and follower, relating two cases, tagging a case to find related cases, listing/looking up/updating participants, posting and managing feed messages, listing/editing/deleting existing attachments, and looking up operator details.

Use the reference files above for a single method's signature. Use the cookbook index when you need the **order** multiple methods should be called in to complete a task.

For testing components that call these APIs, security considerations (sanitizing rendered feed/comment content), performance (avoiding redundant tag/related-case lookups), announcing feed/stakeholder updates accessibly, or troubleshooting a call that isn't behaving as documented, see [Cross-Cutting Best Practices](../best-practices/README.md).
