const express = require('express');
const { ConversationController } = require('../app/controllers');
const { AuthorizationMiddleware } = require('../app/middlewares/authorization.middleware');
const router = express.Router();

router.route('/direct/:userId').get(AuthorizationMiddleware, ConversationController.getConversationDirectUser);
router.route('/direct/:userId').post(AuthorizationMiddleware, ConversationController.getConversationDirectUser);
router.route('/recent').get(AuthorizationMiddleware, ConversationController.getListRecentConversations);
router.route('/direct').post(AuthorizationMiddleware, ConversationController.createConversationDirect);
router.route('/:conversationId/messages').get(AuthorizationMiddleware, ConversationController.getListMessagesOfConversation);

module.exports = router;