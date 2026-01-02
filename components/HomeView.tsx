
import React from 'react';
import { View } from '../types';
import { ICONS, SPECIALIST_MODULES } from '../constants';

interface HomeViewProps {
  setView: (view: View) => void;
  activeModuleIds: string[];
  avatarUrl: string;
}

const HomeView: React.FC<HomeViewProps> = ({ setView, activeModuleIds, avatarUrl }) => {
  const activeModules = SPECIALIST_MODULES.filter(m => activeModuleIds.includes(m.id));

  return (
    <div className="h-full flex flex-col items-center space-y-12 animate-in fade-in zoom-in duration-1000 overflow-y-auto pt-4 pb-8">
      {/* Modular Attunement Panel (Now at Top) */}
      <button 
        onClick={() => setView(View.ATTUNEMENTS)}
        className="w-full max-w-4xl bg-white/40 border border-[#96adb3]/20 hover:border-[#96adb3]/50 rounded-[2.5rem] p-10 text-center transition-all duration-1000 group hover:shadow-2xl duck-egg-glow"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#96adb3]/30 group-hover:border-[#96adb3] transition-all duration-700">
           <img src={avatarUrl} alt="Facilitator" className="w-full h-full object-cover" />
        </div>
        <h4 className="font-serif italic text-3xl text-[#96adb3] mb-4 group-hover:scale-105 transition-transform duration-700">
          Modular Attunement
        </h4>
        <p className="text-sm text-[#2c3e50]/50 leading-relaxed tracking-wider font-light max-w-xl mx-auto mb-6">
          Refine the vessel for your unique journey. Attune FacilitatorAI with essences of <strong>Psychedelic Integration</strong>, <strong>Sharing Circles</strong>, or <strong>Harm Reduction</strong>.
        </p>
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#96adb3]/20 text-[10px] uppercase tracking-[0.2em] font-bold text-[#96adb3] group-hover:bg-[#96adb3] group-hover:text-white transition-all duration-700">
          Configure Specialist Essences
        </div>
      </button>

      <div className="max-w-3xl px-6 text-center space-y-6">
        <h2 className="text-5xl md:text-7xl font-normal text-[#2c3e50] font-serif italic tracking-tight mb-4">
          …the unreal retreat guru
        </h2>
        <p className="text-lg text-[#2c3e50]/60 mb-8 leading-relaxed font-light tracking-[0.05em] max-w-xl mx-auto">
          A sacred vessel for integration, grounded in <span className="text-[#96adb3] border-b border-[#96adb3]/30 italic">UCP Core Skills</span>
          {activeModules.length > 0 && (
            <>, refined by your personal <span className="text-[#96adb3] font-medium">{activeModules.length} active essences</span></>
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
          <div className="w-20 h-20 bg-[#fdfaf6] text-[#96adb3]/50 rounded-full flex items-center justify-center mb-6 group-hover:text-[#96adb3] group-hover:scale-110 transition-all duration-700 border border-[#96adb3]/10 overflow-hidden">
             <ICONS.Chat />
          </div>
          <h3 className="text-2xl font-serif text-[#2c3e50] mb-3 tracking-wide">Reflective Dialogue</h3>
          <p className="text-[#96adb3]/60 text-xs tracking-widest uppercase font-bold">Deep Textual Integration</p>
        </button>

        <button 
          onClick={() => setView(View.VOICE)}
          className="flex flex-col items-center p-12 bg-white border border-[#96adb3]/10 hover:border-[#96adb3]/50 hover:shadow-2xl transition-all duration-1000 rounded-[3rem] group duck-egg-glow"
        >
          <div className="w-20 h-20 bg-[#fdfaf6] text-[#96adb3]/50 rounded-full flex items-center justify-center mb-6 group-hover:text-[#96adb3] group-hover:scale-110 transition-all duration-700 border border-[#96adb3]/10 overflow-hidden">
             <ICONS.Mic />
          </div>
          <h3 className="text-2xl font-serif text-[#2c3e50] mb-3 tracking-wide">Sacred Communion</h3>
          <p className="text-[#96adb3]/60 text-xs tracking-widest uppercase font-bold">Real-time Voice Presence</p>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
