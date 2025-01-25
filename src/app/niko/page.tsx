'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { OpenRouter } from '@/app/openrouter';
import Live2DScripts from '@/components/Live2DScripts';
import useLive2DModel from '@/hooks/useLive2DModel';
import { textToSpeech } from '@/app/utils/tts'; // Import the TTS utility

export default function NikoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useLive2DModel(canvasRef);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const ai = useRef(new OpenRouter());
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, []);

  // Toggle speech recognition
  const toggleSpeechToText = () => {
    if (recognitionRef.current) {
      if (!isListening) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage = input;
      setInput('');
      setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);

      setIsLoading(true);

      try {
        const conversationHistory = messages.map((msg) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text,
        }));

        const response = await ai.current.getResponse(userMessage, conversationHistory);
        setMessages((prev) => [...prev, { text: response, isUser: false }]);

        // Use ElevenLabs TTS to read the AI's response
        await textToSpeech(response);
      } catch (error) {
        console.error('Failed to get AI response:', error);
        setMessages((prev) => [
          ...prev,
          { text: 'Sorry, I had trouble responding. Please try again.', isUser: false },
        ]);
      }

      setIsLoading(false);
    },
    [input, isLoading, messages]
  );

  return (
    <main className="flex min-h-screen relative font-poppins">
      {/* Background and Canvas */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-[url('/background.jpg')] bg-cover bg-center"
          style={{
            filter: 'brightness(0.6) contrast(1.1)',
          }}
        />
      </div>
      <div className="absolute inset-0 z-10">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Chat Interface */}
      <div className="w-[25rem] ml-auto h-screen flex flex-col bg-dark-pastel-base/95 backdrop-blur-sm border-l border-dark-pastel-border/30 z-20 shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-dark-pastel-border/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-pastel-peach to-dark-pastel-coral flex items-center justify-center shadow-sm">
              <span className="text-xl text-dark-pastel-charcoal">🐻</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dark-pastel-text">Niko</h2>
              <p className="text-sm text-dark-pastel-text/80 font-medium">Your AI Companion</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-dark-pastel-border/50 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.isUser ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div
                className={`relative max-w-[80%] rounded-lg p-3 ${
                  msg.isUser
                    ? 'bg-gradient-to-br from-dark-pastel-sky to-dark-pastel-aqua text-dark-pastel-charcoal'
                    : 'bg-dark-pastel-muted text-dark-pastel-text'
                } shadow-sm backdrop-blur-sm`}
              >
                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-dark-pastel-muted rounded-lg p-3 max-w-[80%] backdrop-blur-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-dark-pastel-text/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-dark-pastel-text/50 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-dark-pastel-text/50 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-dark-pastel-border/30">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 pl-4 pr-20 rounded-lg bg-dark-pastel-muted/70 backdrop-blur-sm text-dark-pastel-text placeholder-dark-pastel-text/50 border border-dark-pastel-border/30 focus:outline-none focus:ring-2 focus:ring-dark-pastel-sky/50 focus:border-dark-pastel-sky transition-all shadow-sm font-medium"
              placeholder="Type a message..."
              disabled={isLoading}
              ref={inputRef}
            />
            <button
              type="button"
              onClick={toggleSpeechToText}
              className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-dark-pastel-peach hover:bg-dark-pastel-coral'
              } transition-all duration-200 shadow-sm`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-dark-pastel-charcoal"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
                <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 00-2 0v1a9 9 0 008 8.94V21H9a1 1 0 000 2h6a1 1 0 000-2h-2v-1.06A9 9 0 0021 11v-1a1 1 0 00-2 0z" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-br from-dark-pastel-peach to-dark-pastel-coral hover:from-dark-pastel-coral hover:to-dark-pastel-peach transition-all duration-200 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-dark-pastel-charcoal"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <Live2DScripts />
    </main>
  );
}