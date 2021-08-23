import { DEFAULT_LIMIT_MESSAGE } from '../../constant';
import { Message } from '../models/message.model';
import { ConversationService } from './conversation.service';

export const MessageService = {
  savedMessage: async (data) => {
    const message = new Message({
      ...data,
    });
    await message.save();
    await ConversationService.updateLatestMessageInConversation(data.conversationId, data.text || 'sent a photo');
    return Message.findById(message._id).populate('sender');
  },
  /**
   * get last messages by limit offset
   * @returns {Promise<Model[]>}
   */
  getLastMessagesByOffsetLimit: async (conversationId, skip) => {
    const data = await Message.find({
      conversationId,
    })
      .populate('sender')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(DEFAULT_LIMIT_MESSAGE);
    return data.reverse();
  },
  /**
   * get last messages
   * @returns {Promise<Model[]>}
   */
  getMostRecentMessages: async (conversationId) => {
    return MessageService.getLastMessagesByOffsetLimit(conversationId, 0);
  },
};
