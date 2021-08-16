let userConversationSessions = [];

// user join conversation
export function userJoinConversation(socketId, userId, conversationId) {
  const session = { socketId, userId, conversationId };
  userConversationSessions.push(session);
  return session;
}

// Get session
export function getUserConversationSession(socketId, conversationId) {
  return userConversationSessions.find(
    (session) => session.socketId === socketId && session.conversationId === conversationId
  );
}

// Clear session
export function removeUserConversationSession(socketId) {
  const sessionsBySocketId = [];
  const sessionsAnother = [];

  userConversationSessions.forEach((session) => {
    if (session.socketId === socketId) {
      sessionsBySocketId.push(session);
    } else {
      sessionsAnother.push(session);
    }
  });
  
  userConversationSessions = [...sessionsAnother];
  return sessionsBySocketId;
}

// Get room users
export function getJoiningUsersByConversation(conversationId) {
  return userConversationSessions.filter((session) => session.conversationId === conversationId);
}
