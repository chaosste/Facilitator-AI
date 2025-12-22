
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
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000 overflow-y-auto pb-12 pr-4 custom-scrollbar">
      <div className="space-y-4">
        <h2 className="text-4xl font-serif italic text-[#2c3e50]">Attunements & Preferences</h2>
        <p className="text-sm text-[#2c3e50]/40 tracking-widest uppercase font-bold tracking-[0.2em]">Refine your modular experience.</p>
      </div>

      {/* Specialist Modules Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#96adb3]/20 pb-4">
          <div className="text-[#96adb3]"><ICONS.Modules /></div>
          <h3 className="text-xs font-bold text-[#96adb3] uppercase tracking-[0.3em]">Specialist Essences</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SPECIALIST_MODULES.map((mod) => {
            const isActive = activeModuleIds.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => onToggleModule(mod.id)}
                className={`flex flex-col text-left p-8 rounded-[2.5rem] border transition-all duration-1000 group relative overflow-hidden ${
                  isActive 
                    ? 'border-[#96adb3] bg-white duck-egg-glow scale-[1.02]' 
                    : 'border-[#96adb3]/10 bg-white/40 hover:border-[#96adb3]/40'
                }`}
              >
                {isActive && (
                  <div className="absolute top-6 right-6 text-[#96adb3]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.01-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-80 group-hover:opacity-100">{mod.icon}</div>
                <h4 className={`text-xl font-serif mb-2 ${isActive ? 'text-[#2c3e50]' : 'text-[#2c3e50]/80'}`}>{mod.name}</h4>
                <p className={`text-xs mt-1 leading-relaxed font-light tracking-wide ${isActive ? 'text-[#2c3e50]/70' : 'text-[#2c3e50]/40'}`}>{mod.description}</p>
                <div className={`mt-8 py-2.5 px-5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] inline-block transition-all duration-700 ${
                  isActive ? 'bg-[#96adb3] text-white' : 'bg-[#96adb3]/5 text-[#96adb3]/40 group-hover:bg-[#96adb3]/10 group-hover:text-[#96adb3]'
                }`}>
                  {isActive ? 'Active Attunement' : 'Attune Essence'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Voice Selection Section */}
      <section className="space-y-10 bg-white/60 p-10 rounded-[3rem] border border-[#96adb3]/10 shadow-sm">
        <h3 className="text-xs font-black text-[#96adb3] uppercase tracking-[0.3em] flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          Auditory Presence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[9px] font-black text-[#2c3e50]/30 uppercase tracking-[0.2em]">Gender Energy</label>
            <div className="flex gap-2">
              {(['feminine', 'masculine', 'neutral'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderChange(g)}
                  className={`flex-1 py-4 px-2 rounded-2xl border transition-all duration-700 capitalize text-[10px] font-bold tracking-widest ${
                    settings.gender === g ? 'border-[#96adb3] bg-[#96adb3]/10 text-[#96adb3]' : 'border-[#96adb3]/5 bg-white text-[#2c3e50]/30 hover:border-[#96adb3]/20'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[9px] font-black text-[#2c3e50]/30 uppercase tracking-[0.2em]">Regional Accent</label>
            <div className="flex gap-2">
              {(['US', 'UK'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => handleAccentChange(a)}
                  className={`flex-1 py-4 px-2 rounded-2xl border transition-all duration-700 font-bold text-[10px] tracking-widest ${
                    settings.accent === a ? 'border-[#96adb3] bg-[#96adb3]/10 text-[#96adb3]' : 'border-[#96adb3]/5 bg-white text-[#2c3e50]/30 hover:border-[#96adb3]/20'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <label className="text-[9px] font-black text-[#2c3e50]/30 uppercase tracking-[0.2em]">Specific Persona</label>
          <div className="relative group">
            <select
              value={settings.voiceName}
              onChange={(e) => onUpdate({ ...settings, voiceName: e.target.value })}
              className="w-full bg-white border border-[#96adb3]/10 rounded-2xl px-8 py-5 appearance-none focus:outline-none focus:border-[#96adb3] transition-all duration-700 text-[#2c3e50] font-medium tracking-widest text-sm cursor-pointer shadow-sm hover:border-[#96adb3]/40"
            >
              {filteredVoices.map((v) => <option key={v.voiceName} value={v.voiceName} className="bg-white">{v.label}</option>)}
            </select>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#96adb3]/40 group-hover:text-[#96adb3] transition-all duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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
