import { defaultCharacter } from '@/app/character';
import { generateSystemPrompt } from '@/app/prompt';

export class OpenRouter {
  private OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  async getResponse(message: string, conversationHistory: { role: string; content: string }[]) {
    const systemPrompt = generateSystemPrompt(defaultCharacter);
console.log("systemPrompt",systemPrompt)
    // Combine the system prompt, conversation history, and the new user message
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory, // Include the conversation history
      { role: 'user', content: message }, // Add the latest user message
    ];

    console.log('Sending messages:', messages);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-haiku',
        messages: messages,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }
}