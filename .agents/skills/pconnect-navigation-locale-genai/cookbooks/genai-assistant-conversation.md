---
title: Start and continue a GenAI Assistant conversation
keywords: [chatbot, GenAI, coach, conversation, assistant]
primary_methods:
  [GenAIAssistantUtils.createConversation, GenAIAssistantUtils.sendMessage, GenAIAssistantUtils.getMessages]
related: []
---

# Recipe: Start and continue a GenAI Assistant conversation

> Part of the [Navigation, Locale & GenAI cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component needs to start a conversation with a configured GenAI Assistant, send a message, and then retrieve the Assistant's reply.

## Solution

Uses `GenAIAssistantUtils` (via `PCore.getGenAIAssistantUtils()`, see [pcore-analytics-genai-details.md](../../references/pcore-analytics-genai-details.md)).

```typescript
const { createConversation, sendMessage, getMessages } = PCore.getGenAIAssistantUtils();

// Resolves to a ConversationResponse — the conversation ID is on `data.ID`, not `id`.
const conversation = await createConversation(contextID, assistantID, context);
const conversationID = conversation.data.ID;
await sendMessage(assistantID, conversationID, userMessage, context);

// Re-fetch messages to pick up the Assistant's reply once it's ready.
// getMessages resolves to an AxiosResponse (not an array); the payload is on `response.data`.
const response = await getMessages(assistantID, conversationID, context);
const messages = response.data;
```

The 5.1.0 typedefs type `response.data` as `any`, so they do not specify the inner shape of the message list — confirm the field names against your server response before relying on them.

## Discussion

**MUST** use `createConversationForAgent`/`sendMessageForAgent`/`getMessagesForAgent` instead when talking to a configured Agent rather than an Assistant — the two conversation types are NOT interchangeable.

## Related recipes

None — see [pcore-analytics-genai-details.md](../../references/pcore-analytics-genai-details.md) for the full `GenAIAssistantUtils` catalog, including the Agent-specific variants.
