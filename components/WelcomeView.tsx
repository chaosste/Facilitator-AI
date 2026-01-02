import React, { useState } from 'react';

interface WelcomeViewProps {
  onComplete: (name: string) => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#fdfaf6] aura-bg p-8 text-center animate-in fade-in duration-1000">
      <div className="max-w-md w-full space-y-12">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-white border border-[#96adb3]/30 rounded-full flex items-center justify-center text-[#96adb3] font-serif text-4xl shadow-xl mx-auto">F</div>
          <h2 className="text-4xl font-serif italic text-[#2c3e50]">Welcome to Facilitator-AI</h2>
          <p className="text-sm text-[#2c3e50]/40 leading-relaxed font-light tracking-widest uppercase">The unreal retreat guru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#96adb3] uppercase tracking-[0.4em] block">How shall I address you?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full bg-white border-b border-[#96adb3]/30 focus:border-[#96adb3] text-2xl font-serif text-center py-4 focus:outline-none transition-all duration-700 placeholder:opacity-20 text-[#2c3e50]"
            />
          </div>
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-5 bg-[#96adb3] text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#2c3e50] disabled:opacity-20 transition-all duration-700 shadow-lg active:scale-95"
          >
            Enter the Space
          </button>
        </form>

        <p className="text-[9px] text-[#2c3e50]/20 tracking-widest leading-relaxed">
          Your presence is valued here. Your information is stored locally in your browser to maintain the sanctity of your privacy.
        </p>
      </div>
    </div>
  );
};

export default WelcomeView;