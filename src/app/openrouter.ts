import { characterProfile } from '@/app/character';
import { generateSystemPrompt } from '@/app/prompt';

export class OpenRouter {
    private OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    async getResponse(message: string) {
      const systemPrompt = generateSystemPrompt(characterProfile);
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gryphe/mythomax-l2-13b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }
  }