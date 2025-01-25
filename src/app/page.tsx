'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { OpenRouter } from '@/app/openrouter';
import { playAudio } from '@/app/audio';


import Live2DScripts from '@/components/Live2DScripts';
import useLive2DModel from '@/hooks/useLive2DModel';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useLive2DModel(canvasRef);


  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>([]);
  const ai = useRef(new OpenRouter());


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    setIsLoading(true);
    try {
      const response = await ai.current.getResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      // playTTS(response);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I had trouble responding. Please try again.',
        isUser: false
      }]);
    }
    setIsLoading(false);
  }, [input, isLoading]);

  return (
    <main className="flex min-h-screen relative">


      {/* Canvas Container */}
      <div className="w-[50%] h-[50%] absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full " />
      </div>
      <div className="w-[15%] p-4 flex flex-col bg-gray-900">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i}
              className={`p-3 rounded-lg ${msg.isUser ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
                } max-w-[80%] break-words`}>
              <p className="text-white">{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-700 p-3 rounded-lg max-w-[80%]">
              <p className="text-white">Thinking...</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button
              type="button"
              className={`p-2 rounded  'bg-red-600' : 'bg-blue-600'} hover:opacity-80 transition-opacity`}
            >

            </button>
          </div>
        </form>
      </div>

      {/* Live2D Scripts */}
      <Live2DScripts />
    </main>
  );
}