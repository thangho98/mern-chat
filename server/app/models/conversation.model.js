require('../models/user.model');
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Types = mongoose.Types;
export const ConversationEnumType = {
  DIRECT: 'direct',
  GROUP: 'group',
};

const conversationSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(ConversationEnumType),
      default: ConversationEnumType.DIRECT,
    },
    members: {
      type: [{ type: Types.ObjectId, ref: 'User' }],
      default: [],
    },
    totalMessages: {
      type: Number,
      required: false,
      default: 0,
    },
    lastMessage: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    //when a new version of row is added to database
    //automatically add timestamp to that row
    //we save created time, but don't need for the scope of this project
    //an update time
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
