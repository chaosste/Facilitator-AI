
import React from 'react';
import { View } from '../types';
import { ICONS, SPECIALIST_MODULES } from '../constants';

interface HomeViewProps {
  setView: (view: View) => void;
  activeModuleIds: string[];
}

const HomeView: React.FC<HomeViewProps> = ({ setView, activeModuleIds }) => {
  const activeModules = SPECIALIST_MODULES.filter(m => activeModuleIds.includes(m.id));

  return (
    <div className="h-full flex flex-col justify-center items-center text-center space-y-12 animate-in fade-in zoom-in duration-1000 overflow-y-auto pt-8 pb-8">
      <div className="max-w-3xl px-6 space-y-6">
        <h2 className="text-5xl md:text-7xl font-normal text-[#f4f1ea] font-serif italic tracking-tight mb-4">
          Welcome to Inner Space
        </h2>
        <p className="text-lg text-[#f4f1ea]/60 mb-8 leading-relaxed font-light tracking-[0.05em] max-w-xl mx-auto">
          A sacred vessel for integration, grounded in <span className="text-[#d4af37] border-b border-[#d4af37]/30 italic">UCP Core Skills</span>
          {activeModules.length > 0 && (
            <>, refined by your personal <span className="text-[#d4af37]">{activeModules.length} attunements</span></>
          )}.
        </p>

        {activeModules.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {activeModules.map(m => (
              <span key={m.id} className="bg-[#1a1a1a] border border-[#d4af37]/30 text-[#d4af37] px-5 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold shadow-2xl animate-in slide-in-from-top-2 duration-700">
                {m.icon} {m.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-6">
        <button 
          onClick={() => setView(View.CHAT)}
          className="flex flex-col items-center p-12 bg-[#111111] border border-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all duration-1000 rounded-[3rem] group mystic-glass gold-glow"
        >
          <div className="w-20 h-20 bg-[#1a1a1a] text-[#d4af37]/50 rounded-full flex items-center justify-center mb-6 group-hover:text-[#d4af37] group-hover:scale-110 transition-all duration-700 border border-[#d4af37]/5">
            <ICONS.Chat />
          </div>
          <h3 className="text-2xl font-serif text-[#f4f1ea] mb-3 tracking-wide">Reflective Dialogue</h3>
          <p className="text-[#f4f1ea]/40 text-xs tracking-widest uppercase font-light">Deep Textual Integration</p>
        </button>

        <button 
          onClick={() => setView(View.VOICE)}
          className="flex flex-col items-center p-12 bg-[#111111] border border-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all duration-1000 rounded-[3rem] group mystic-glass gold-glow"
        >
          <div className="w-20 h-20 bg-[#1a1a1a] text-[#d4af37]/50 rounded-full flex items-center justify-center mb-6 group-hover:text-[#d4af37] group-hover:scale-110 transition-all duration-700 border border-[#d4af37]/5">
            <ICONS.Mic />
          </div>
          <h3 className="text-2xl font-serif text-[#f4f1ea] mb-3 tracking-wide">Sacred Communion</h3>
          <p className="text-[#f4f1ea]/40 text-xs tracking-widest uppercase font-light">Real-time Voice Presence</p>
        </button>
      </div>

      <div className="mt-16 bg-[#0a0a0a] border border-[#d4af37]/5 rounded-[2.5rem] p-10 text-center max-w-2xl mx-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="w-10 h-10 mx-auto mb-6 text-[#d4af37]/30">
          <ICONS.Modules />
        </div>
        <h4 className="font-serif italic text-2xl text-[#d4af37] mb-4">
          Modular Attunement
        </h4>
        <p className="text-sm text-[#f4f1ea]/50 leading-relaxed tracking-wider font-light">
          CounselAI adapts to your journey. Attune the vessel in Settings with essences of <strong>Psychedelic Integration</strong>, <strong>Sharing Circles</strong>, or <strong>Harm Reduction</strong> to refine my support for your altered states.
        </p>
      </div>
    </div>
  );
};

export default HomeView;
