const express = require('express');
const { AuthController } = require('../app/controllers/auth.controller');
const router = express.Router();

router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);

module.exports = router;