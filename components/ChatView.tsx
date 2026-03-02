
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { ChatMessage, SessionNote } from '../types';
import { ICONS } from '../constants';

interface ChatViewProps {
  onAddNote: (note: SessionNote) => void;
  systemInstruction: string;
  avatarUrl: string;
  onToggleAmbient: () => void;
  isAmbientOpen: boolean;
  geminiApiKey: string;
}

const writeSessionNoteDeclaration: FunctionDeclaration = {
  name: 'writesessionnote',
  parameters: {
    type: Type.OBJECT,
    description: 'Create a concise, counselling-style session note based on the last exchange.',
    properties: {
      json: {
        type: Type.OBJECT,
        properties: {
          dateTimeUTC: { type: Type.STRING },
          presentingThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
          emotionsObserved: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillsApplied: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          goalsNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["dateTimeUTC", "presentingThemes", "summary"]
      }
    },
    required: ["json"]
  }
};

const ChatView: React.FC<ChatViewProps> = ({ onAddNote, systemInstruction, avatarUrl, onToggleAmbient, isAmbientOpen, geminiApiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: "Welcome to this space. How are you feeling in this moment?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const key = geminiApiKey || (typeof process !== 'undefined' && process.env?.API_KEY) || '';
      const ai = new GoogleGenAI({ apiKey: key });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [writeSessionNoteDeclaration] }]
        }
      });

      const response = await chat.sendMessage({ message: input });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'assistant', text: response.text || '', timestamp: new Date() }]);
      }

      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'writesessionnote') {
            const note = fc.args.json as SessionNote;
            onAddNote(note);
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "The connection to your inner space is temporarily clouded. Please try again soon.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-forest/8 bg-card/60 backdrop-blur-sm shadow-lg relative">

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} anim-fade-up`}>
            <div className={`flex gap-3 items-start ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-forest/15 flex-shrink-0 mt-1">
                  <img src={avatarUrl} alt="Facilitator" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`max-w-[80%] px-6 py-4 rounded-2xl shadow-sm transition-all duration-500 ${
                msg.role === 'user'
                  ? 'bg-forest text-parchment-light rounded-br-md'
                  : 'bg-card border border-forest/8 text-charcoal rounded-bl-md'
              }`}>
                <p className="text-sm leading-relaxed tracking-wide font-light whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[9px] uppercase tracking-widest block mt-2.5 font-bold ${
                  msg.role === 'user' ? 'text-parchment-light/40' : 'text-stone-light'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start anim-fade-up">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-forest/15 flex-shrink-0 mt-1">
                <img src={avatarUrl} alt="Facilitator" className="w-full h-full object-cover" />
              </div>
              <div className="bg-card px-6 py-4 rounded-2xl rounded-bl-md border border-forest/8 flex gap-1.5 items-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 md:p-5 bg-parchment/80 backdrop-blur-md border-t border-forest/8">
        <div className="flex gap-3 max-w-4xl mx-auto items-center">
          <button
            onClick={onToggleAmbient}
            className={`p-3 rounded-xl transition-all duration-500 flex-shrink-0 active:scale-95 ${
              isAmbientOpen
                ? 'bg-forest text-parchment shadow-sm'
                : 'bg-card border border-forest/10 text-forest/40 hover:border-forest/25 hover:text-forest'
            }`}
            title="Toggle Atmosphere"
          >
            <ICONS.Leaf />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your reflection..."
            className="flex-1 bg-card border border-forest/10 text-charcoal rounded-xl px-5 py-3 focus:outline-none focus:border-forest/30 focus:ring-2 focus:ring-forest/10 transition-all duration-500 tracking-wide font-light placeholder:text-stone-light/50 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-forest text-parchment-light p-3 rounded-xl hover:bg-forest-deep disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500 active:scale-95 shadow-sm flex-shrink-0"
            title="Send"
          >
            <ICONS.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
