const express = require('express');
const router = express.Router();
const { MessageController } = require('../app/controllers/message.controller');
const { AuthorizationMiddleware } = require('../app/middlewares/authorization.middleware');
const { FileHandler } = require('../common/handler/file-handler');

router.route('/send').post(AuthorizationMiddleware, FileHandler.array('files', 12) , MessageController.sendMessage);

module.exports = router;