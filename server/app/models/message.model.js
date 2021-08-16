require('../models/user.model');
require('../models/conversation.model');
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Types = mongoose.Types;

const fileSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
});

const messageSchema = new Schema(
  {
    conversationId: {
      type: Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: false,
    },
    files: {
      type: [fileSchema],
      required: false,
      default: [],
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

messageSchema.virtual('sender',{
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});


messageSchema.virtual('conversation',{
  ref: 'Conversation',
  localField: 'conversationId',
  foreignField: '_id',
  justOne: true
});

messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });
export const Message = mongoose.model('Message', messageSchema);
