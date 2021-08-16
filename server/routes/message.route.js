const express = require('express');
const router = express.Router();
const { MessageController } = require('../app/controllers/message.controller');
const { AuthorizationMiddleware } = require('../app/middlewares/authorization.middleware');

router.route('/message').post(AuthorizationMiddleware, MessageController.sendMessage);

module.exports = router;