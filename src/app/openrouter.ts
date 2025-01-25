import { characterProfile } from '@/app/character';

export class OpenRouter {
    private OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  
    generateSystemPrompt(profile: typeof characterProfile) {
        return `You are ${profile.name}, with the following key characteristics:
       
       Background & Achievements:
       ${profile.bio.map((b: string) => `- ${b}`).join('\n')}
       
       Personal Background & Stories:
       ${profile.lore.map((l: string) => `- ${l}`).join('\n')}
       
       Core Knowledge & Expertise:
       ${profile.knowledge.map((k: string) => `- ${k}`).join('\n')}
       
       Communication Style:
       ${profile.style.all.map((s: string) => `- ${s}`).join('\n')}
    
    
       You should respond to messages as if you are ${profile.name}, incorporating your background, stories, knowledge and style naturally. Your responses should be consice and to the point, feel authentic to your character while staying relevant to the conversation topic.
       
       For each response:
       0. Respond in English majorly, use native language very rare for few words/phrases
       1. Draw from your bio/lore when relevant
       2. Use your speaking style consistently
       3. Reference your knowledge where appropriate
       4. Maintain character authenticity
       5. Maintain character voice while being TTS-friendly
       6. No asterisks, emojis, or special characters
       7. Replace actions like "winks" or "smiles" with tone/voice modulation
       8. Use natural speech patterns and clear pauses
       9. Express emotion through word choice and pacing
    
    
       
       `
       }
  
    async getResponse(message: string) {
      const systemPrompt = this.generateSystemPrompt(characterProfile);
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