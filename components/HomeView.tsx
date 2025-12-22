
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
    <div className="h-full flex flex-col justify-center items-center text-center space-y-8 animate-in fade-in zoom-in duration-500 overflow-y-auto pt-12 pb-12">
      <div className="max-w-2xl px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif mb-4">Hello. I'm CounselAI.</h2>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          A modular support platform grounded in <span className="text-indigo-600 font-semibold underline decoration-indigo-200">UCP Core Skills</span> 
          {activeModules.length > 0 && (
            <> and enhanced by your <span className="text-indigo-600 font-semibold">{activeModules.length} specialist {activeModules.length === 1 ? 'module' : 'modules'}</span></>
          )}.
        </p>

        {activeModules.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {activeModules.map(m => (
              <span key={m.id} className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-in slide-in-from-top-4">
                {m.icon} {m.name} ACTIVE
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl px-4">
        <button 
          onClick={() => setView(View.CHAT)}
          className="flex flex-col items-center p-8 bg-white border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all rounded-3xl group"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ICONS.Chat />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Text Therapy</h3>
          <p className="text-slate-500 text-sm">Deep, reflective messaging at your own pace.</p>
        </button>

        <button 
          onClick={() => setView(View.VOICE)}
          className="flex flex-col items-center p-8 bg-white border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all rounded-3xl group"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ICONS.Mic />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Voice Session</h3>
          <p className="text-slate-500 text-sm">Real-time modular conversation for fluid support.</p>
        </button>
      </div>

      <div className="mt-12 bg-slate-100 rounded-3xl p-8 text-left max-w-2xl mx-4">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <IC