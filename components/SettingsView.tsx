
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
    <div className="h-full flex flex-col max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto pb-12 pr-2">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 font-serif">Platform Settings</h2>
        <p className="text-slate-500">Configure your CounselAI module extensions and voice.</p>
      </div>

      {/* Specialist Modules Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ICONS.Modules />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Specialist Skill Modules</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SPECIALIST_MODULES.map((mod) => {
            const isActive = activeModuleIds.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => onToggleModule(mod.id)}
                className={`flex flex-col text-left p-5 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.01-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="text-3xl mb-2">{mod.icon}</div>
                <h4 className={`font-bold ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{mod.name}</h4>
                <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>{mod.description}</p>
                <div className={`mt-3 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}>
                  {isActive ? 'Active & Bolted On' : 'Click to Bolt On'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Voice Selection Section */}
      <section className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          Voice Config
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
            <div className="flex gap-2">
              {(['feminine', 'masculine', 'neutral'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderChange(g)}
                  className={`flex-1 py-2 px-3 rounded-xl border-2 transition-all capitalize text-xs font-bold ${
                    settings.gender === g ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accent</label>
            <div className="flex gap-2">
              {(['US', 'UK'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => handleAccentChange(a)}
                  className={`flex-1 py-2 px-3 rounded-xl border-2 transition-all font-bold text-xs ${
                    settings.accent === a ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specific Persona</label>
          <div className="relative">
            <select
              value={settings.voiceName}
              onChange={(e) => onUpdate({ ...settings, voiceName: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-indigo-600 transition-all text-slate-700 font-bold text-sm"
            >
              {filteredVoices.map((v) => <option key={v.voiceName} value={v.voiceName}>{v.label}</option>)}
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
