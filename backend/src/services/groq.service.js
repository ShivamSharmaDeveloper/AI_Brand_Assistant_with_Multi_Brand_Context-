import axios from 'axios';
import { GROQ_API_URL, GROQ_MODEL, SYSTEM_PROMPT } from '../utils/constants.js';

class GroqService {
  get apiKey() {
    return process.env.GROQ_API_KEY;
  }

  /**
   * Send conversation history + current message to Groq and return assistant text.
   * @param {Array<{ role: string, content: string }>} messageHistory
   * @param {string} brandName
   * @returns {Promise<string>}
   */
  async generateResponse(messageHistory, brandName) {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const systemContent = `${SYSTEM_PROMPT}\n\nYou are currently helping with the brand: "${brandName}".`;

    const messages = [
      { role: 'system', content: systemContent },
      ...messageHistory.map(({ role, content }) => ({ role, content })),
    ];

    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: GROQ_MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from Groq API');
      }
      return content.trim();
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const detail =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          'Unknown Groq API error';
        throw new Error(`Groq API error (${status}): ${detail}`);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Groq API request timed out');
      }
      throw error;
    }
  }
}

export default new GroqService();
