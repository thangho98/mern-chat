require('dotenv').config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import socketIO from 'socket.io';
import { Conversation } from './app/models/conversation.model';
import { Message } from './app/models/message.model';
import mongoConnect from './common/database/mongodb/mongo';
import AppConfig from './configs';
import ApiRouters from './routes';
import {
  getUserConversationSession,
  removeUserConversationSession,
  userJoinConversation
} from './user-session';

const DEFAULT_LIMIT_MESSAGE = 20;

const io = socketIO(process.env.SOCKET_PORT, {
  cors: {
    origin: '*',
  },
});
const app = express();
app.use(cors());
app.use(morgan('dev'));
io.on('connection', (socket) => {
  console.log('Connection established: ' + socket.id);

  // Welcome current user
  socket.emit('log', 'Welcome to AppChat!');

  socket.on('join', function ({ conversationId, userId }) {
    const session = userJoinConversation(socket.id, userId, conversationId);
    console.log({
      session,
    });
    // join conversation
    socket.join(conversationId);

    // Broadcast when a user connects
    socket.broadcast.to(conversationId).emit('log', `${userId} has joined the chat`);

    //  // Send users and room info
    //  io.to(user.room).emit('roomUsers', {
    //   room: user.room,
    //   users: getRoomUsers(user.room)
    // });

    getMostRecentMessages(conversationId)
      .then((results) => {
        socket.emit('mostRecentMessages', {
          messages: results,
          isStillOldMessage: results.length === DEFAULT_LIMIT_MESSAGE
        });
      })
      .catch((error) => {
        socket.emit('mostRecentMessages', {
          messages: [],
          isStillOldMessage: false
        });
      });
  });

  socket.on('loadMoreOldMessage', (data) => {
    const {conversationId, skip} = data;
    console.log(data);
    getLastMessagesByOffsetLimit(conversationId, skip)
    .then((results) => {
      socket.emit('dataOldMessages', {
        messages: results,
        isStillOldMessage: results.length === DEFAULT_LIMIT_MESSAGE
      });
    })
    .catch((error) => {
      socket.emit('dataOldMessages', {
        messages: [],
        isStillOldMessage: false
      });
    });
  });

  socket.on('newChatMessage', (data) => {
    //send event to every single connected socket
    console.log({
      data,
    });

    try {
      const message = new Message({
        senderId: data.userId,
        conversationId: data.conversationId,
        text: data.text,
      });
      message
        .save()
        .then(() => {
          const session = getUserConversationSession(socket.id, data.conversationId);
          updateConversation(data.conversationId, data.text);
          Message.findById(message._id).populate('sender').then((newMessage)=>{
            if (session) {
              io.to(session.conversationId).emit('newChatMessage', newMessage);
            }
          });
        })
        .catch((error) => console.log('error: ' + error));
    } catch (e) {
      console.log('error: ' + e);
    }
  });

  socket.on('disconnect', () => {
    const sessions = removeUserConversationSession(socket.id);

    if (sessions.length) {
      sessions.forEach((session) => {
        io.to(session.conversationId).emit('log', `${session.userId} has left the chat`);
      });
      // Send users and room info
      // io.to(user.room).emit('roomUsers', {
      //   room: user.room,
      //   users: getRoomUsers(user.room)
      // });
    }
  });
});

/**
 * get 10 last messages
 * @returns {Promise<Model[]>}
 */
async function getMostRecentMessages(conversationId) {
  return getLastMessagesByOffsetLimit(conversationId, 0);
}

/**
 * get last messages by limit offset
 * @returns {Promise<Model[]>}
 */
async function getLastMessagesByOffsetLimit(conversationId, skip) {
  const data =  await Message.find({
    conversationId,
  })
    .populate('sender')
    .sort({ _id: -1 })
    .skip(skip)
    .limit(DEFAULT_LIMIT_MESSAGE);
  return data.reverse();
}
async function updateConversation(conversationId, messageText) {
  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    conversation.totalMessages = conversation.totalMessages + 1;
    conversation.lastMessage = messageText;
    conversation.save();
  }
}

app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  //headers clients can use in their requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  //allow request to continue and be handled by routes
  next();
});

//sending json data
app.use(express.json());

app.use(AppConfig.apiBaseURL, ApiRouters);

// app.post('/api/upload', upload.single('avatar'), fileUploader);

/**
 *
 * @returns {Promise<void>}
 */
const initApp = async () => {
  try {
    await mongoConnect();
    console.log('DB connection established');
    app.listen(AppConfig.httpPort, () => console.log(`HTTP Server listening on ${AppConfig.httpPort}`));
  } catch (e) {
    throw e;
  }
};

initApp().catch((err) => console.log(`Error on startup! ${err}`));
