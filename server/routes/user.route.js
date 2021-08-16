const express = require('express');
const router = express.Router();
const { UserController } = require('../app/controllers/user.controller');
const { AuthorizationMiddleware } = require('../app/middlewares/authorization.middleware');
const { FileHandler } = require('../common/handler/file-handler');

router.route('/profile').get(AuthorizationMiddleware, UserController.getCurrentUser);
router.route('/profile').post(AuthorizationMiddleware, UserController.updateProfile);
router.route('/profile/avatar').post(AuthorizationMiddleware, FileHandler.single('avatar'), UserController.updateAvatar);

module.exports = router;