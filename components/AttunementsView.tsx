import React from 'react';
import { SPECIALIST_MODULES, ICONS } from '../constants';

interface AttunementsViewProps {
  activeModuleIds: string[];
  onToggleModule: (id: string) => void;
  onBack: () => void;
}

const AttunementsView: React.FC<AttunementsViewProps> = ({ activeModuleIds, onToggleModule, onBack }) => {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-y-auto pb-12 pr-4 custom-scrollbar">
      <div className="flex justify-between items-end border-b border-[#96adb3]/20 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic text-[#2c3e50]">Specialist Essences</h2>
          <p className="text-[10px] text-[#2c3e50]/40 uppercase tracking-[0.3em] font-bold">Refine FacilitatorAI for your specific landscapes.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-[9px] uppercase tracking-widest font-black text-[#96adb3] hover:text-[#2c3e50] transition-colors border border-[#96adb3]/20 px-4 py-2 rounded-full"
        >
          Return to Clearing
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {SPECIALIST_MODULES.map((mod) => {
          const isActive = activeModuleIds.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => onToggleModule(mod.id)}
              className={`flex flex-col text-left p-10 rounded-[2.5rem] border transition-all duration-1000 group relative overflow-hidden shadow-sm ${
                isActive 
                  ? 'border-[#96adb3] bg-white duck-egg-glow scale-[1.02] shadow-xl' 
                  : 'border-[#96adb3]/10 bg-white/40 hover:border-[#96adb3]/40 hover:bg-white/60'
              }`}
            >
              {isActive && (
                <div className="absolute top-8 right-8 text-[#96adb3]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 animate-in zoom-in duration-500">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.01-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="text-5xl mb-8 transition-all duration-1000 group-hover:scale-110">
                {mod.icon}
              </div>
              <h4 className={`text-2xl font-serif mb-3 ${isActive ? 'text-[#2c3e50]' : 'text-[#2c3e50]/80'}`}>
                {mod.name}
              </h4>
              <p className={`text-sm leading-relaxed font-light tracking-wide mb-8 ${isActive ? 'text-[#2c3e50]/70' : 'text-[#2c3e50]/40'}`}>
                {mod.description}
              </p>
              <div className={`mt-auto py-3 px-6 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] inline-block transition-all duration-700 text-center ${
                isActive ? 'bg-[#96adb3] text-white shadow-lg' : 'bg-[#96adb3]/5 text-[#96adb3]/40 group-hover:bg-[#96adb3]/10 group-hover:text-[#96adb3]'
              }`}>
                {isActive ? 'Essence Active' : 'Attune Essence'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-[#fdfaf6] border border-[#96adb3]/10 rounded-[2.5rem] p-10 text-center shadow-sm">
        <h5 className="font-serif italic text-xl text-[#2c3e50]/60 mb-4">How Attunements Work</h5>
        <p className="text-xs text-[#2c3e50]/40 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
          By selecting an essence, you shift the foundational logic and vocabulary of FacilitatorAI. Multiple essences can be combined to create a unique multi-dimensional support vessel tailored to your integration journey.
        </p>
      </div>
    </div>
  );
};

export default AttunementsView;