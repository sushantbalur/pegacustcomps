---
name: git-ops
description: Branching, Conventional Commits and PR workflow for this repo. Use when creating a branch, committing, pushing, opening a PR or resolving conflicts.
---

# Git & GitHub Operations Guide

## 1. Branching Strategy
- **Always** create a new branch from the latest `master` before making changes.
- Use strict naming prefixes:
  - `feat/<short-description>` for new features
  - `fix/<short-description>` for bug fixes
  - `chore/<short-description>` for maintenance, dependencies, or tooling
  - `docs/<short-description>` for documentation updates
- **Never** commit directly to `master`, `main`, or `production`.

## 2. Commit Standards
- Follow the **Conventional Commits** specification: `<type>(<scope>): <subject>`
  - Example: `feat(auth): add OAuth2 token refresh logic`
  - Example: `fix(api): handle null payload in user endpoint`
- Keep the subject line under 72 characters, use the imperative mood ("add", not "added"), and omit trailing periods.
- Make atomic commits: each commit must represent a single logical change and pass local checks before committing (`npm run lint`, `npm run test`, and `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` for any changed component).

## 3. Pull Request (PR) Workflow
- Keep PRs small and focused.
- When creating a PR via CLI (`gh pr create`), populate the description using this structure:
  - **Summary:** 1–3 bullets explaining *what* changed and *why*.
  - **Testing:** How the changes were verified.
  - **Related Issues:** Link issues using `Closes #<issue-number>`.
- Ensure all CI checks pass and resolve merge conflicts via rebase (`git pull --rebase origin master`) rather than merge commits.

## 4. Hard Boundaries & Safety Rules
- **NEVER** commit secrets, API keys, `.env` files, or credentials. Verify `.gitignore` covers sensitive files before staging; never stage `keys/` or secrets in `tasks.config.json`.
- **NEVER** merge your own Pull Request or approve PRs on behalf of human reviewers.
- **ASK FIRST** before modifying `.github/workflows/` CI/CD files, repository permissions, or branch protection rules.
