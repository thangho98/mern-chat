// import socketIO from 'socket.io';

// const io = socketIO(process.env.SOCKET_PORT, {
//   cors: {
//     origin: '*',
//   },
// });

// io.on('connection', (socket) => {
//   console.log('Connection established: ' + socket.id);

//   // Welcome current user
//   socket.emit('log', 'Welcome to AppChat!');

//   socket.on('join', function ({ conversationId, userId }) {
//     const session = userJoinConversation(socket.id, userId, conversationId);
//     console.log({
//       session,
//     });
//     // join conversation
//     socket.join(conversationId);

//     // Broadcast when a user connects
//     socket.broadcast.to(conversationId).emit('log', `${userId} has joined the chat`);

//     //  // Send users and room info
//     //  io.to(user.room).emit('roomUsers', {
//     //   room: user.room,
//     //   users: getRoomUsers(user.room)
//     // });

//     getMostRecentMessages(conversationId)
//       .then((results) => {
//         socket.emit('mostRecentMessages', {
//           messages: results,
//           isStillOldMessage: results.length === DEFAULT_LIMIT_MESSAGE
//         });
//       })
//       .catch((error) => {
//         socket.emit('mostRecentMessages', {
//           messages: [],
//           isStillOldMessage: false
//         });
//       });
//   });

//   socket.on('loadMoreOldMessage', (data) => {
//     const {conversationId, skip} = data;
//     console.log(data);
//     getLastMessagesByOffsetLimit(conversationId, skip)
//     .then((results) => {
//       socket.emit('dataOldMessages', {
//         messages: results,
//         isStillOldMessage: results.length === DEFAULT_LIMIT_MESSAGE
//       });
//     })
//     .catch((error) => {
//       socket.emit('dataOldMessages', {
//         messages: [],
//         isStillOldMessage: false
//       });
//     });
//   });

//   socket.on('newChatMessage', (data) => {
//     //send event to every single connected socket
//     console.log({
//       data,
//     });

//     try {
//       const message = new Message({
//         senderId: data.userId,
//         conversationId: data.conversationId,
//         text: data.text,
//       });
//       message
//         .save()
//         .then(() => {
//           const session = getUserConversationSession(socket.id, data.conversationId);
//           updateConversation(data.conversationId, data.text);
//           Message.findById(message._id).populate('sender').then((newMessage)=>{
//             if (session) {
//               io.to(session.conversationId).emit('newChatMessage', newMessage);
//             }
//           });
//         })
//         .catch((error) => console.log('error: ' + error));
//     } catch (e) {
//       console.log('error: ' + e);
//     }
//   });

//   socket.on('disconnect', () => {
//     const sessions = removeUserConversationSession(socket.id);

//     if (sessions.length) {
//       sessions.forEach((session) => {
//         io.to(session.conversationId).emit('log', `${session.userId} has left the chat`);
//       });
//       // Send users and room info
//       // io.to(user.room).emit('roomUsers', {
//       //   room: user.room,
//       //   users: getRoomUsers(user.room)
//       // });
//     }
//   });
// });