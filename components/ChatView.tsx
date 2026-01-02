
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { ChatMessage, SessionNote } from '../types';

interface ChatViewProps {
  onAddNote: (note: SessionNote) => void;
  systemInstruction: string;
  avatarUrl: string;
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

const ChatView: React.FC<ChatViewProps> = ({ onAddNote, systemInstruction, avatarUrl }) => {
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    <div className="flex flex-col h-full rounded-[3rem] overflow-hidden border border-[#96adb3]/10 mystic-glass shadow-xl bg-white/40">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
            <div className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#96adb3]/20 flex-shrink-0">
                  <img src={avatarUrl} alt="Facilitator" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`max-w-[85%] px-7 py-5 rounded-[2.2rem] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#96adb3] text-white' 
                  : 'bg-white text-[#2c3e50] border border-[#96adb3]/10'
              }`}>
                <p className="text-sm leading-relaxed font-light tracking-wide">{msg.text}</p>
                <span className={`text-[9px] uppercase tracking-widest block mt-3 font-bold opacity-40`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-[2rem] border border-[#96adb3]/10 flex gap-2 items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#96adb3] rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-[#96adb3] rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#96adb3] rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-[#fdfaf6]/80 backdrop-blur-md border-t border-[#96adb3]/10">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your reflection..."
            className="flex-1 bg-white border border-[#96adb3]/20 text-[#2c3e50] rounded-full px-8 py-4 focus:outline-none focus:border-[#96adb3] focus:ring-0 transition-all duration-700 tracking-wide font-light placeholder:text-[#2c3e50]/20"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-[#96adb3] text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#2c3e50] disabled:opacity-20 transition-all duration-700 active:scale-95 shadow-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
