import { Conversation } from "../models/conversation.model";

export const ConversationService = {
  updateLatestMessageInConversation: async (conversationId, messageText) => {
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.totalMessages = conversation.totalMessages + 1;
      conversation.lastMessage = messageText;
      conversation.save();
    }
  },
};
