import React from 'react';
import { SPECIALIST_MODULES, ICONS } from '../constants';

interface AttunementsViewProps {
  activeModuleIds: string[];
  onToggleModule: (id: string) => void;
  onBack: () => void;
}

const AttunementsView: React.FC<AttunementsViewProps> = ({ activeModuleIds, onToggleModule, onBack }) => {
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto space-y-8 overflow-y-auto pb-16 pr-1 anim-fade-up">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-display italic text-charcoal">Specialist Attunements</h2>
          <p className="text-xs text-stone tracking-widest uppercase font-medium">Shape the facilitator for your journey</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-forest hover:text-forest-deep transition-colors border border-forest/15 px-4 py-2 rounded-xl hover:bg-forest/5 active:scale-[0.97]"
        >
          <ICONS.ArrowLeft />
          Back
        </button>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {SPECIALIST_MODULES.map((mod, idx) => {
          const isActive = activeModuleIds.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => onToggleModule(mod.id)}
              className={`flex flex-col text-left p-7 md:p-8 rounded-2xl border transition-all duration-500 group relative overflow-hidden active:scale-[0.98] anim-fade-up anim-delay-${idx + 1} ${
                isActive
                  ? 'border-forest bg-forest/[0.04] shadow-md shadow-forest/[0.06]'
                  : 'border-forest/8 bg-card hover:border-forest/20 hover:shadow-sm'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-5 right-5 text-forest anim-scale">
                  <ICONS.Check />
                </div>
              )}

              <div className={`text-4xl mb-5 transition-all duration-500 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                {mod.icon}
              </div>

              <h4 className={`text-xl font-display mb-2 ${isActive ? 'text-charcoal' : 'text-charcoal/80'}`}>
                {mod.name}
              </h4>

              <p className={`text-xs leading-relaxed tracking-wide mb-6 ${isActive ? 'text-stone' : 'text-stone-light'}`}>
                {mod.description}
              </p>

              <div className={`mt-auto py-2.5 px-5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-center transition-all duration-500 ${
                isActive
                  ? 'bg-forest text-parchment shadow-sm'
                  : 'bg-forest/5 text-forest/40 group-hover:bg-forest/10 group-hover:text-forest'
              }`}>
                {isActive ? 'Active' : 'Activate'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="bg-card border border-forest/8 rounded-2xl p-7 anim-fade-up anim-delay-4">
        <h5 className="font-display italic text-lg text-charcoal/70 mb-3">How attunements work</h5>
        <p className="text-xs text-stone leading-relaxed tracking-wide">
          Each attunement shifts the foundational logic and vocabulary of your facilitator. Multiple attunements can be combined to create a unique support vessel tailored to your integration journey. Changes take effect immediately in new conversations.
        </p>
      </div>
    </div>
  );
};

export default AttunementsView;
