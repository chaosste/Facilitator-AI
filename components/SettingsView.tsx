
import React, { useMemo } from 'react';
import { VoiceSettings, SpecialistModule } from '../types';
import { AVAILABLE_VOICES, SPECIALIST_MODULES, ICONS } from '../constants';

interface SettingsViewProps {
  settings: VoiceSettings;
  onUpdate: (settings: VoiceSettings) => void;
  activeModuleIds: string[];
  onToggleModule: (id: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, activeModuleIds, onToggleModule }) => {
  const filteredVoices = useMemo(() => {
    return AVAILABLE_VOICES.filter(v => v.gender === settings.gender && v.accent === settings.accent);
  }, [settings.gender, settings.accent]);

  const handleGenderChange = (gender: 'feminine' | 'masculine' | 'neutral') => {
    const firstMatch = AVAILABLE_VOICES.find(v => v.gender === gender && v.accent === settings.accent);
    onUpdate({ ...settings, gender, voiceName: firstMatch?.voiceName || settings.voiceName });
  };

  const handleAccentChange = (accent: 'US' | 'UK') => {
    const firstMatch = AVAILABLE_VOICES.find(v => v.gender === settings.gender && v.accent === accent);
    onUpdate({ ...settings, accent, voiceName: firstMatch?.voiceName || settings.voiceName });
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000 overflow-y-auto pb-12 pr-4">
      <div className="space-y-4">
        <h2 className="text-4xl font-serif italic text-[#f4f1ea]">Attunements & Preferences</h2>
        <p className="text-sm text-[#f4f1ea]/40 tracking-widest uppercase font-light">Configure your modular acumen and presence.</p>
      </div>

      {/* Specialist Modules Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#d4af37]/10 pb-4">
          <div className="text-[#d4af37]/40"><ICONS.Modules /></div>
          <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.3em]">Specialist Essences</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SPECIALIST_MODULES.map((mod) => {
            const isActive = activeModuleIds.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => onToggleModule(mod.id)}
                className={`flex flex-col text-left p-8 rounded-[2rem] border transition-all duration-1000 group relative overflow-hidden ${
                  isActive 
                    ? 'border-[#d4af37] bg-[#d4af37]/5 gold-glow' 
                    : 'border-white/5 bg-[#111111]/50 hover:border-[#d4af37]/30'
                }`}
              >
                {isActive && (
                  <div className="absolute top-4 right-4 text-[#d4af37]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shadow-[0_0_10px_#d4af37]">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.01-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-1000">{mod.icon}</div>
                <h4 className={`text-xl font-serif mb-2 ${isActive ? 'text-[#f4f1ea]' : 'text-[#f4f1ea]/80'}`}>{mod.name}</h4>
                <p className={`text-xs mt-1 leading-relaxed font-light tracking-wide ${isActive ? 'text-[#f4f1ea]/60' : 'text-[#f4f1ea]/30'}`}>{mod.description}</p>
                <div className={`mt-8 py-2 px-4 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] inline-block transition-all duration-700 ${
                  isActive ? 'bg-[#d4af37] text-[#0a0a0a]' : 'bg-white/5 text-[#f4f1ea]/20 group-hover:bg-white/10 group-hover:text-[#f4f1ea]/40'
                }`}>
                  {isActive ? 'Active Attunement' : 'Attune Essence'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Voice Selection Section */}
      <section className="space-y-10 bg-[#111111]/80 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
        <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.3em] flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          Auditory Presence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[9px] font-bold text-[#f4f1ea]/30 uppercase tracking-[0.2em]">Gender Energy</label>
            <div className="flex gap-2">
              {(['feminine', 'masculine', 'neutral'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderChange(g)}
                  className={`flex-1 py-3 px-2 rounded-2xl border transition-all duration-700 capitalize text-[10px] font-bold tracking-widest ${
                    settings.gender === g ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-white/5 bg-white/5 text-[#f4f1ea]/30 hover:border-white/20'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[9px] font-bold text-[#f4f1ea]/30 uppercase tracking-[0.2em]">Regional Accent</label>
            <div className="flex gap-2">
              {(['US', 'UK'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => handleAccentChange(a)}
                  className={`flex-1 py-3 px-2 rounded-2xl border transition-all duration-700 font-bold text-[10px] tracking-widest ${
                    settings.accent === a ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-white/5 bg-white/5 text-[#f4f1ea]/30 hover:border-white/20'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <label className="text-[9px] font-bold text-[#f4f1ea]/30 uppercase tracking-[0.2em]">Specific Persona</label>
          <div className="relative group">
            <select
              value={settings.voiceName}
              onChange={(e) => onUpdate({ ...settings, voiceName: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-5 appearance-none focus:outline-none focus:border-[#d4af37]/50 transition-all duration-700 text-[#f4f1ea] font-medium tracking-widest text-sm cursor-pointer"
            >
              {filteredVoices.map((v) => <option key={v.voiceName} value={v.voiceName} className="bg-[#0a0a0a]">{v.label}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]/30 group-hover:text-[#d4af37] transition-all duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
