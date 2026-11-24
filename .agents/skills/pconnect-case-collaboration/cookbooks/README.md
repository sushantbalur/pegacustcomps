---
title: Case Collaboration & Relationships Cookbook — Recipe Index
description: Multi-method recipes for participants, followers, related cases, and tags, indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Case Collaboration & Relationships

> Part of the [Case Collaboration & Relationships skill](../SKILL.md).

Every file in [`../../references/`](../../references/) documents one method at a time. Each file in this folder shows how to **chain multiple documented methods together** to complete one common real-world task. Every recipe only uses methods already cataloged in `references/` — follow the links in each recipe for full signatures. Nothing here invents a new API; every call is a direct composition of already-documented methods.

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement — what you're trying to accomplish, in plain language.
- A **Solution** — the minimal correct code, linking to the individual reference files for each method used.
- A **Discussion** — the ordering/cleanup/gotcha pitfall that makes this worth documenting as a recipe instead of assembling from scratch.
- **Related recipes** — links to recipes that share a pattern (lifecycle, cleanup, error handling, etc.), including recipes in sibling skills.

## Recipe Index

Search by symptom or keyword before assembling a sequence of calls from scratch — there is a good chance the ordering/cleanup pitfalls have already been worked out below.

| Recipe                                                                      | Keywords                                                                                     | Primary methods                       |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Add a participant and follower](./participant-and-follower.md)             | stakeholder, participant, role, follower, notify a user                                      | `StakeholderUtils`, `CaseFollowerApi` |
| [Relate two cases](./relate-cases.md)                                       | related case, link cases, case relationship                                                  | `RelatedCasesApi`                     |
| [Tag a case and find related cases](./tag-case-and-find-related.md)         | tag, label, categorize case, find similar cases, tags landing page                           | `TagUtils`                            |
| [List, look up, and update participants](./manage-case-participants.md)     | participants list, stakeholder list, team panel, participant roles, edit participant         | `StakeholderUtils`                    |
| [Post, edit, and delete feed messages](./post-and-manage-feed.md)           | feed, pulse, comment, post message, discussion, reply                                        | `FeedUtils`                           |
| [List, edit, and delete existing attachments](./manage-case-attachments.md) | attachment list, attachment panel, edit attachment, delete attachment, attachment categories | `AttachmentUtils`                     |
| [Look up operator details](./look-up-user-details.md)                       | operator lookup, user profile, glimpse, avatar, display name                                 | `UserApi`                             |

Use the individual reference files in [`../../references/`](../../references/) to look up a single method's exact signature. Use a recipe here when you need to know the **order** multiple methods should be called in to complete a task.

As more cookbooks are added, add one file per recipe (not more content to an existing recipe file) and a row here — see any existing recipe file for the expected frontmatter/structure.
