---
title: GenAI Assistant Integration Patterns
description: Conversation lifecycle, state rehydration, streaming, feedback, and safety-gate patterns for building custom components on top of GenAIAssistantUtils and GenAIUtils.
---

# GenAI Assistant Integration Patterns

> Part of [Cross-Cutting Best Practices](./README.md).

`GenAIAssistantUtils` and `GenAIUtils` (see [pcore-analytics-genai-details.md](../references/pcore-analytics-genai-details.md) and [pcore-case-collaboration-genai.md](../references/pcore-case-collaboration-genai.md)) let a custom component start and continue a conversation with a GenAI Assistant or Agent, and rewrite text. This guide covers the integration patterns specific to these APIs — for content-safety concerns (prompt injection, sanitizing model output), see [Security Considerations](./security-considerations.md); for the general async-state and mocking patterns, see [Testing](./testing-pconnect-components.md#testing-genai-assistant-conversations) and [Error Handling & Resiliency](./error-handling-and-resiliency.md).

## Gate on `isGenAIEnabled()` Before Rendering Any GenAI Affordance

Not every environment has GenAI enabled. Check `PCore.getEnvironmentInfo().isGenAIEnabled()` before rendering a GenAI-dependent button, panel, or suggestion — and treat "disabled" as an expected, silent state (simply don't render the affordance), not an error condition to surface to the user:

```typescript
const genAIEnabled = PCore.getEnvironmentInfo().isGenAIEnabled();

if (!genAIEnabled) return null; // no GenAI affordance in this environment — not an error
```

## Rehydrate Conversation History Instead of Trusting Local State Alone

`createConversation`/`createConversationForAgent` start a conversation that's tracked server-side; `getMessages`/`getMessagesForAgent` and the paginated `getConversations`/`getConversationsForAgent` retrieve what's already there. Local component state built up as the user sends/receives messages in the current session is a convenient cache, but it is not the source of truth — on mount (or when reopening a previously started conversation), call `getMessages(assistantID, conversationID, context)` to rehydrate rather than assuming a fresh component instance starts with no history (see [Troubleshooting: a GenAI Assistant conversation's history is empty after a page reload](./troubleshooting-common-pitfalls.md#a-genai-assistant-conversations-history-is-empty-after-a-page-reload)).

## Render Incrementally When `enableStreaming` Is Used

`sendMessage` supports an `enableStreaming` option for a more responsive, incremental reply rather than waiting for the full response. If a component uses streaming, render the partial response as it arrives (with its own visible "in progress" indicator distinct from a fully-loaded message) rather than buffering the whole thing client-side and only rendering once — buffering defeats the purpose of requesting streaming in the first place and leaves the user staring at nothing for longer than necessary.

## Handle `GenAIUtils.rewriteText`'s Discriminated Result Explicitly

`rewriteText({ originalText, rewriteAction })` resolves an object shaped as either `{ success: true, rewrittenText }` or a failure shape — it does not reject on a model-side failure the way a network error would. Check `result.success` explicitly and handle both branches (see [Testing: testing GenAI Assistant conversations](./testing-pconnect-components.md#testing-genai-assistant-conversations)); a component that only reads `result.rewrittenText` without checking `success` first will render `undefined` on failure instead of a clear fallback message.

## Use the Like/Unlike Feedback Loop, Don't Build a Parallel One

`likeAgentMessage`/`unLikeAgentMessage(agentID, conversationID, messageID, context, feedbackText?)` are the documented mechanism for capturing a user's reaction to an Agent's message, including optional free-text feedback on removal of a like. Route thumbs-up/thumbs-down UI through these calls rather than inventing a separate feedback-collection mechanism — this keeps feedback attached to the same conversation/message record the platform already tracks, rather than living in a disconnected system nobody correlates back to the conversation.

## Treat a Long-Running Conversation Call Like Any Other Async Operation

Nothing about `sendMessage`/`sendMessageForAgent` exempts it from the general patterns elsewhere in this folder: it's a `Promise` that can reject (see [Error Handling & Resiliency](./error-handling-and-resiliency.md)), a user can trigger a new message before a previous one resolves (consider whether to disable the input or track/cancel the stale one, per [Performance & Efficiency: cancel requests that are no longer needed](./performance-and-efficiency.md#cancel-requests-that-are-no-longer-needed)), and its pending/success/error states need the same live-region treatment as any other async UI (see [Accessibility for Async, API-Driven Components](./accessibility-for-async-components.md)).

## Checklist

- Check `PCore.getEnvironmentInfo().isGenAIEnabled()` before rendering any GenAI-dependent UI; treat "disabled" as a silent no-render, not an error.
- Rehydrate conversation history via `getMessages`/`getConversations` on mount rather than relying only on in-session local state.
- Render streamed responses incrementally, not buffered until fully complete, when `enableStreaming` is used.
- Explicitly branch on `rewriteText`'s `success` field rather than assuming the happy-path shape.
- Route message feedback through `likeAgentMessage`/`unLikeAgentMessage` instead of a separate, disconnected mechanism.
- Apply the same async-state, cancellation, and accessibility patterns used elsewhere in these guides to conversation calls — they aren't a special case.
