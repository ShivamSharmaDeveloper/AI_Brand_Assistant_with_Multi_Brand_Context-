import * as brandStore from '../store/brandStore.js';
import brandService from './brand.service.js';
import groqService from './groq.service.js';

class ChatService {
  /**
   * Process a chat message for a specific brand with isolated context.
   */
  async processMessage(brandId, userMessage) {
    const brand = brandService.getBrandById(brandId);
    if (!brand) {
      const error = new Error('Brand not found');
      error.statusCode = 404;
      throw error;
    }

    const trimmedMessage = userMessage.trim();

    brandStore.addMessage(brandId, 'user', trimmedMessage);

    const context = brandStore.getMessageContext(brandId);

    const assistantResponse = await groqService.generateResponse(context, brand.name);

    brandStore.addMessage(brandId, 'assistant', assistantResponse);

    return { response: assistantResponse };
  }
}

export default new ChatService();
