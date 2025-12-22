
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
        <h2 className="text-5xl md:text-7xl font-normal text-[#2c3e50] font-serif italic tracking-tight mb-4">
          The Internal Clearing
        </h2>
        <p className="text-lg text-[#2c3e50]/60 mb-8 leading-relaxed font-light tracking-[0.05em] max-w-xl mx-auto">
          A sacred vessel for integration, grounded in <span className="text-[#96adb3] border-b border-[#96adb3]/30 italic">UCP Core Skills</span>
          {activeModules.length > 0 && (
            <>, refined by your personal <span className="text-[#96adb3] font-medium">{activeModules.length} attunements</span></>
          )}.
        </p>

        {activeModules.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {activeModules.map(m => (
              <span key={m.id} className="bg-white border border-[#96adb3]/20 text-[#96adb3] px-5 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold shadow-sm animate-in slide-in-from-top-2 duration-700">
                {m.icon} {m.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-6">
        <button 
          onClick={() => setView(View.CHAT)}
          className="flex flex-col items-center p-12 bg-white border border-[#96adb3]/10 hover:border-[#96adb3]/50 hover:shadow-2xl transition-all duration-1000 rounded-[3rem] group duck-egg-glow"
        >
          <div className="w-20 h-20 bg-[#fdfaf6] text-[#96adb3]/50 rounded-full flex items-center justify-center mb-6 group-hover:text-[#96adb3] group-hover:scale-110 transition-all duration-700 border border-[#96adb3]/10">
            <ICONS.Chat />
          </div>
          <h3 className="text-2xl font-serif text-[#2c3e50] mb-3 tracking-wide">Reflective Dialogue</h3>
          <p className="text-[#96adb3]/60 text-xs tracking-widest uppercase font-bold">Deep Textual Integration</p>
        </button>

        <button 
          onClick={() => setView(View.VOICE)}
          className="flex flex-col items-center p-12 bg-white border border-[#96adb3]/10 hover:border-[#96adb3]/50 hover:shadow-2xl transition-all duration-1000 rounded-[3rem] group duck-egg-glow"
        >
          <div className="w-20 h-20 bg-[#fdfaf6] text-[#96adb3]/50 rounded-full flex items-center justify-center mb-6 group-hover:text-[#96adb3] group-hover:scale-110 transition-all duration-700 border border-[#96adb3]/10">
            <ICONS.Mic />
          </div>
          <h3 className="text-2xl font-serif text-[#2c3e50] mb-3 tracking-wide">Sacred Communion</h3>
          <p className="text-[#96adb3]/60 text-xs tracking-widest uppercase font-bold">Real-time Voice Presence</p>
        </button>
      </div>

      <div className="mt-16 bg-white/40 border border-[#96adb3]/10 rounded-[2.5rem] p-10 text-center max-w-2xl mx-6 shadow-sm">
        <div className="w-10 h-10 mx-auto mb-6 text-[#96adb3]/30">
          <ICONS.Modules />
        </div>
        <h4 className="font-serif italic text-2xl text-[#96adb3] mb-4">
          Modular Attunement
        </h4>
        <p className="text-sm text-[#2c3e50]/50 leading-relaxed tracking-wider font-light">
          CounselAI adapts to your journey. Attune the vessel in Settings with essences of <strong>Psychedelic Integration</strong>, <strong>Sharing Circles</strong>, or <strong>Harm Reduction</strong> to refine my support for your internal landscapes.
        </p>
      </div>
    </div>
  );
};

export default HomeView;
