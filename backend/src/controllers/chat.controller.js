import chatService from '../services/chat.service.js';

export async function sendMessage(req, res, next) {
  try {
    const { brandId, message } = req.body;
    const result = await chatService.processMessage(brandId, message);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
