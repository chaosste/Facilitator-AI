import React, { useState } from 'react';
import { ICONS } from '../constants';

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
    <div className="h-screen w-screen flex flex-col justify-center items-center ground-bg p-8 text-center relative overflow-hidden">

      {/* Decorative background circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-forest/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber/[0.04] blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full space-y-14 relative z-10">

        {/* Logo & Title */}
        <div className="space-y-6 anim-fade-up">
          <div className="w-16 h-16 bg-forest text-parchment rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-forest/20 rotate-3 hover:rotate-0 transition-transform duration-700 cursor-default">
            <ICONS.Logo size={32} />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-display italic text-charcoal tracking-tight">
              Facilitator-AI
            </h1>
            <p className="text-sm text-stone tracking-widest uppercase font-light">
              the unreal retreat guru
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone leading-relaxed tracking-wide font-light max-w-sm mx-auto anim-fade-up anim-delay-2">
          A supportive AI companion for reflection, integration, and holding space
          &mdash; grounded in core counselling skills.
        </p>

        {/* Name Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-8 anim-fade-up anim-delay-3">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-forest uppercase tracking-[0.35em] block">
              How shall I address you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full bg-card border border-forest/10 focus:border-forest/40 text-xl font-display text-center py-4 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-forest/10 transition-all duration-500 placeholder:text-stone-light/60 text-charcoal shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-forest text-parchment-light rounded-2xl font-bold uppercase tracking-[0.25em] text-[11px] hover:bg-forest-deep disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Enter the Space
          </button>
        </form>

        {/* Safety & Privacy Notice */}
        <div className="space-y-4 anim-fade-up anim-delay-5">
          <div className="flex items-center justify-center gap-2 text-crisis/70">
            <ICONS.Info />
            <span className="text-[10px] uppercase tracking-widest font-bold">Not a substitute for professional support</span>
          </div>
          <p className="text-[10px] text-stone-light leading-relaxed tracking-wide">
            If you are in crisis, please contact emergency services, call 988 (Suicide &amp; Crisis Lifeline),
            or text HOME to 741741 (Crisis Text Line). Your data is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
