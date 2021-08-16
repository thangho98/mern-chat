import { Conversation, ConversationEnumType } from "../models/conversation.model";
import { Message } from "../models/message.model";

export const ConversationController = {
  getListRecentConversations: async (req, res) => {
    const auth = req.user;
    try {
      const conversations = await Conversation.find({
        members: { $in: [auth.sub] },
      }).populate('members').sort({'updatedAt': -1});
      return res.status(200).json(conversations);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getConversationDirectUser: async (req, res) => {
    const auth = req.user;
    try {
      const conversation = await Conversation.findOne({
        members: { $in: [auth.sub, req.params.userId] },
        type: ConversationEnumType.DIRECT,
      });
      return res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createConversationDirectUserIfNotExits: async (req, res) => {
    const auth = req.user;
    try {
      let conversation = await Conversation.findOne({
        members: { $in: [auth.sub, req.params.userId] },
        type: ConversationEnumType.DIRECT,
      });
      if(!conversation){
        const conversation = new Conversation({
          members: [auth.sub, req.body.receiverId],
          type: ConversationEnumType.DIRECT,
        });
      }
      return res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createConversationDirect: async (req, res) => {
    const auth = req.user;
    const newConversation = new Conversation({
      members: [auth.sub, req.body.receiverId],
      type: ConversationEnumType.DIRECT,
    });
    try {
      const savedConversation =
        await newConversation.save();
        return res.status(200).json(savedConversation);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getListMessagesOfConversation: async (req, res) => {
    try {
      const { limit, offset } = req.query;
      const { conversationId } = req.params;
      const messages = await Message.find({
        conversationId,
        limit,
        offset,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
