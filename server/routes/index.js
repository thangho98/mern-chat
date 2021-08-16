const express = require('express');
const router = express.Router();
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const conversationRoutes = require("./conversation.route");
const messageRoutes = require("./message.route");

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);
router.use('/messages', messageRoutes);

export default router;