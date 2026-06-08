import { Router } from 'express';
import { sendMessage } from '../controllers/chat.controller.js';
import { validateChatMessage } from '../middleware/validation.js';

const router = Router();

router.post('/', validateChatMessage, sendMessage);

export default router;
