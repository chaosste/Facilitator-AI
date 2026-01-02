
import React, { useMemo } from 'react';
import { VoiceSettings } from '../types';
import { AVAILABLE_VOICES, ICONS } from '../constants';

interface SettingsViewProps {
  settings: VoiceSettings;
  onUpdate: (settings: VoiceSettings) => void;
  onResetName: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onResetName }) => {
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
        <h2 className="text-4xl font-serif italic text-[#2c3e50]">Vessel Preferences</h2>
        <p className="text-sm text-[#2c3e50]/40 tracking-widest uppercase font-bold tracking-[0.2em]">Refine your vocal and personal experience.</p>
      </div>

      <section className="space-y-10 bg-white/60 p-10 rounded-[3rem] border border-[#96adb3]/10 shadow-sm">
        <div className="flex justify-between items-center border-b border-[#96adb3]/10 pb-6">
          <h3 className="text-xs font-black text-[#96adb3] uppercase tracking-[0.3em]">Identity</h3>
          <button 
            onClick={onResetName}
            className="text-[9px] uppercase tracking-widest font-bold text-[#96adb3] hover:text-[#2c3e50] transition-colors border border-[#96adb3]/20 px-4 py-2 rounded-full"
          >
            Change Name
          </button>
        </div>

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
          <label className="text-[9px] font-black text-[#2c3e50]/30 uppercase tracking-[0.2em]">Auditory Persona</label>
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
