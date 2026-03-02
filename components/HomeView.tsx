
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
    <div className="h-full flex flex-col items-center overflow-y-auto py-6 md:py-10 px-2 space-y-10">

      {/* Hero */}
      <div className="max-w-3xl text-center space-y-5 anim-fade-up">
        <h2 className="text-3xl md:text-[2.8rem] font-display italic text-charcoal leading-tight tracking-tight">
          &hellip;the unreal retreat guru
        </h2>
        <p className="text-base text-stone leading-relaxed font-light tracking-wide max-w-xl mx-auto">
          A vessel for integration, grounded in{' '}
          <span className="text-forest font-normal">UCP Core Skills</span>
          {activeModules.length > 0 && (
            <>, refined by{' '}
            <span className="text-amber-dark font-medium">{activeModules.length} active attunement{activeModules.length > 1 ? 's' : ''}</span>
            </>
          )}.
        </p>

        {/* Active attunement pills */}
        {activeModules.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {activeModules.map(m => (
              <span
                key={m.id}
                className="bg-forest/5 border border-forest/15 text-forest px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold anim-scale"
              >
                {m.icon} {m.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl anim-fade-up anim-delay-2">

        {/* Dialogue */}
        <button
          onClick={() => setView(View.CHAT)}
          className="group flex flex-col items-center text-center p-8 md:p-10 bg-card border border-forest/8 hover:border-forest/25 rounded-2xl transition-all duration-500 hover:shadow-lg hover:shadow-forest/[0.06] active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl bg-forest/5 text-forest/50 flex items-center justify-center mb-5 group-hover:bg-forest group-hover:text-parchment transition-all duration-500">
            <ICONS.Chat />
          </div>
          <h3 className="text-lg font-display text-charcoal mb-1.5">Reflective Dialogue</h3>
          <p className="text-[10px] text-stone-light tracking-widest uppercase font-bold">Text-based</p>
        </button>

        {/* Communion */}
        <button
          onClick={() => setView(View.VOICE)}
          className="group flex flex-col items-center text-center p-8 md:p-10 bg-card border border-forest/8 hover:border-forest/25 rounded-2xl transition-all duration-500 hover:shadow-lg hover:shadow-forest/[0.06] active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl bg-forest/5 text-forest/50 flex items-center justify-center mb-5 group-hover:bg-forest group-hover:text-parchment transition-all duration-500">
            <ICONS.Mic />
          </div>
          <h3 className="text-lg font-display text-charcoal mb-1.5">Sacred Communion</h3>
          <p className="text-[10px] text-stone-light tracking-widest uppercase font-bold">Voice presence</p>
        </button>

        {/* Journal */}
        <button
          onClick={() => setView(View.NOTES)}
          className="group flex flex-col items-center text-center p-8 md:p-10 bg-card border border-forest/8 hover:border-forest/25 rounded-2xl transition-all duration-500 hover:shadow-lg hover:shadow-forest/[0.06] active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl bg-forest/5 text-forest/50 flex items-center justify-center mb-5 group-hover:bg-forest group-hover:text-parchment transition-all duration-500">
            <ICONS.Book />
          </div>
          <h3 className="text-lg font-display text-charcoal mb-1.5">Journal</h3>
          <p className="text-[10px] text-stone-light tracking-widest uppercase font-bold">Session archive</p>
        </button>

        {/* Attunements */}
        <button
          onClick={() => setView(View.ATTUNEMENTS)}
          className="group flex flex-col items-center text-center p-8 md:p-10 bg-card border border-forest/8 hover:border-forest/25 rounded-2xl transition-all duration-500 hover:shadow-lg hover:shadow-forest/[0.06] active:scale-[0.98] relative"
        >
          <div className="w-14 h-14 rounded-xl bg-forest/5 text-forest/50 flex items-center justify-center mb-5 group-hover:bg-forest group-hover:text-parchment transition-all duration-500">
            <ICONS.Sliders />
          </div>
          <h3 className="text-lg font-display text-charcoal mb-1.5">Attunements</h3>
          <p className="text-[10px] text-stone-light tracking-widest uppercase font-bold">Specialist modes</p>
          {activeModuleIds.length > 0 && (
            <span className="absolute top-4 right-4 w-6 h-6 bg-amber text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
              {activeModuleIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Facilitator Avatar & Presence Indicator */}
      <div className="flex items-center gap-4 py-3 px-6 bg-card/60 border border-forest/8 rounded-2xl anim-fade-up anim-delay-4">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-forest/15">
          <img src={avatarUrl} alt="Facilitator" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-medium text-charcoal">Your facilitator is ready</p>
          <p className="text-[10px] text-stone-light tracking-wide">Choose a modality above to begin</p>
        </div>
        <div className="w-2 h-2 bg-sage rounded-full animate-pulse ml-2" />
      </div>

      {/* Safety Footer */}
      <div className="max-w-3xl w-full pt-4 border-t border-forest/5 anim-fade-up anim-delay-5">
        <div className="flex items-start gap-3 text-stone-light">
          <ICONS.Info />
          <p className="text-[10px] leading-relaxed tracking-wide">
            <strong className="text-stone font-medium">This is not therapy.</strong> Facilitator-AI is an experimental AI tool for personal reflection. It cannot diagnose, treat, or replace professional mental health support.
            In a crisis, call <strong className="text-crisis">988</strong> or text <strong className="text-crisis">HOME to 741741</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
