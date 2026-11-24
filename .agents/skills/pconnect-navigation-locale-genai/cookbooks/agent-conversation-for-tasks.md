---
title: Start an Agent conversation for task automation
keywords: [agent, task automation, GenAI agent, agent conversation, like agent message]
primary_methods:
  [
    GenAIAssistantUtils.createConversationForAgent,
    GenAIAssistantUtils.sendMessageForAgent,
    GenAIAssistantUtils.getMessagesForAgent,
    GenAIAssistantUtils.likeAgentMessage
  ]
related: [genai-assistant-conversation]
---

# Recipe: Start an Agent conversation for task automation

> Part of the [Navigation, Locale & GenAI cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component needs to hand off a task to a configured Agent (for example, "resolve this case" automation) rather than a conversational GenAI Assistant — a distinct API surface from [Start and continue a GenAI Assistant conversation](./genai-assistant-conversation.md).

## Solution

Uses `GenAIAssistantUtils` (via `PCore.getGenAIAssistantUtils()`, see [pcore-analytics-genai-details.md](../../references/pcore-analytics-genai-details.md)).

```typescript
const { createConversationForAgent, sendMessageForAgent, getMessagesForAgent, likeAgentMessage } =
  PCore.getGenAIAssistantUtils();

// Resolves to a ConversationResponse — the conversation ID is on `data.ID`, not `id`.
const conversation = await createConversationForAgent(contextID, agentID, context);
const conversationID = conversation.data.ID;
await sendMessageForAgent(agentID, conversationID, taskInstruction, context);

// Re-fetch to pick up the Agent's response/result once it's ready.
// getMessagesForAgent resolves to an AxiosResponse (not an array); the payload is on `response.data`.
const response = await getMessagesForAgent(agentID, conversationID, context);

// Feedback uses the Agent-specific like/unlike methods, not the Assistant ones.
// `messageID` is the ID of the Agent message being rated, read from `response.data`.
await likeAgentMessage(agentID, conversationID, messageID, context);
```

The 5.1.0 typedefs type `response.data` as `any`, so they do not specify the shape of the message list (or the field that holds a message ID) — confirm it against your server response.

## Discussion

**MUST NOT** mix Assistant methods (`createConversation`, `sendMessage`, `getMessages`, `likeAgentMessage`'s Assistant counterpart) with Agent methods (`createConversationForAgent`, `sendMessageForAgent`, `getMessagesForAgent`, `likeAgentMessage`) for the same conversation — the two conversation types are tracked separately server-side, and mixing them for one conversation ID (`conversation.data.ID`) produces a conversation that neither API can fully read back.

**SHOULD** gate rendering of any Agent-conversation affordance on `PCore.getEnvironmentInfo().isGenAIEnabled()`, the same gate used for Assistant conversations — see the [GenAI Assistant integration patterns guide](../../best-practices/genai-assistant-integration-patterns.md).

## Related recipes

- [Start and continue a GenAI Assistant conversation](./genai-assistant-conversation.md)
