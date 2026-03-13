const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with the SkillSync AI assistant
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bot reply
 */
router.post('/', chat);

module.exports = router;
