require('dotenv').config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import socketIO from 'socket.io';
import { MessageService } from './app/services/messages.service';
import mongoConnect from './common/database/mongodb/mongo';
import AppConfig from './configs';
import { DEFAULT_LIMIT_MESSAGE } from './constant';
import ApiRouters from './routes';
import socketEvent from './socket-even';
import {
  getUserConversationSession,
  removeUserConversationSession,
  userJoinConversation
} from './user-session';

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

  // Welcome current user
  socket.emit('retryConnect', 'retry connect socket...');

  socket.on('join', function ({ conversationId, userId }) {
    const session = userJoinConversation(socket.id, userId, conversationId);
    console.log({
      session,
    });
    // join conversation
    socket.join(conversationId);

    // Broadcast when a user connects
    socket.broadcast.to(conversationId).emit('log', `${userId} has joined the chat`);

    MessageService.getMostRecentMessages(conversationId)
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
    MessageService.getLastMessagesByOffsetLimit(conversationId, skip)
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

    try {
      MessageService.savedMessage(data)
        .then((newMessage) => {
          const session = getUserConversationSession(socket.id, data.conversationId);
          if (session) {
            io.to(session.conversationId).emit('newChatMessage', newMessage);
          }
        })
        .catch((error) => console.log('error: ' + error));
    } catch (e) {
      console.log('error: ' + e);
    }
  });

  socketEvent.on('newMessage',(newMessage)=>{
  
    const session = getUserConversationSession(socket.id, newMessage.conversationId);
    if (session) {
      console.log('newMessage: ' + newMessage);
      io.to(session.conversationId).emit('newChatMessage', newMessage);
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
