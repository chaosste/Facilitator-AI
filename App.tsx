
import React, { useState, useEffect, useMemo } from 'react';
import { View, SessionNote, VoiceSettings } from './types';
import { ICONS, BASE_SYSTEM_INSTRUCTION, SPECIALIST_MODULES } from './constants';
import ChatView from './components/ChatView';
import LiveVoiceView from './components/LiveVoiceView';
import SessionNotes from './components/SessionNotes';
import HomeView from './components/HomeView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [showCrisisInfo, setShowCrisisInfo] = useState(false);
  const [activeModuleIds, setActiveModuleIds] = useState<string[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceName: 'Kore',
    gender: 'feminine',
    accent: 'US'
  });

  const dynamicSystemInstruction = useMemo(() => {
    let instruction = BASE_SYSTEM_INSTRUCTION;
    activeModuleIds.forEach(id => {
      const mod = SPECIALIST_MODULES.find(m => m.id === id);
      if (mod) {
        instruction += `\n${mod.systemInstruction}`;
      }
    });
    return instruction;
  }, [activeModuleIds]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('counselai_notes');
    if (savedNotes) {
      try {
        setSessionNotes(JSON.parse(savedNotes));
      } catch (e) { console.error("Failed to parse notes", e); }
    }

    const savedSettings = localStorage.getItem('counselai_voice_settings');
    if (savedSettings) {
      try {
        setVoiceSettings(JSON.parse(savedSettings));
      } catch (e) { console.error("Failed to parse voice settings", e); }
    }

    const savedModules = localStorage.getItem('counselai_active_modules');
    if (savedModules) {
      try {
        setActiveModuleIds(JSON.parse(savedModules));
      } catch (e) { console.error("Failed to parse modules", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('counselai_notes', JSON.stringify(sessionNotes));
  }, [sessionNotes]);

  useEffect(() => {
    localStorage.setItem('counselai_voice_settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  useEffect(() => {
    localStorage.setItem('counselai_active_modules', JSON.stringify(activeModuleIds));
  }, [activeModuleIds]);

  const addNote = (note: SessionNote) => {
    setSessionNotes(prev => [note, ...prev]);
  };

  const deleteNote = (index: number) => {
    setSessionNotes(prev => prev.filter((_, i) => i !== index));
  };

  const toggleModule = (id: string) => {
    setActiveModuleIds(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  };

  const clearAllNotes = () => {
    if (confirm("Are you sure you want to delete all session history?")) {
      setSessionNotes([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-[#f4f1ea] overflow-hidden aura-bg">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-[#d4af37]/10 px-8 py-6 flex items-center justify-between z-10">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => setCurrentView(View.HOME)}
        >
          <div className="w-12 h-12 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37] font-serif text-2xl shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:border-[#d4af37] transition-all duration-700">C</div>
          <h1 className="text-2xl font-medium text-[#f4f1ea] font-serif tracking-widest uppercase">CounselAI</h1>
        </div>
        <div className="flex items-center gap-4">
           {activeModuleIds.length > 0 && (
             <div className="hidden sm:flex items-center gap-2 border border-[#d4af37]/20 px-4 py-1.5 rounded-full text-[10px] tracking-widest font-bold text-[#d4af37] uppercase">
                <span className="w-1 h-1 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_5px_#d4af37]"></span>
                {activeModuleIds.length} Attunements Active
             </div>
           )}
           <button 
            onClick={() => setCurrentView(View.SETTINGS)}
            className={`p-2.5 rounded-full transition-all duration-500 ${currentView === View.SETTINGS ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-[#f4f1ea]/40 hover:text-[#d4af37]'}`}
          >
            <ICONS.Settings />
          </button>
           <button 
            onClick={() => setShowCrisisInfo(!showCrisisInfo)}
            className="p-2.5 text-red-400 hover:text-red-300 transition-all"
          >
            <ICONS.Info />
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-hidden relative">
        {showCrisisInfo && (
          <div className="absolute inset-x-0 top-0 bg-[#3a0b0b] border-b border-red-900/50 text-[#fca5a5] p-6 z-50 animate-in slide-in-from-top duration-700 flex justify-between items-start shadow-2xl backdrop-blur-xl">
            <div className="max-w-4xl mx-auto flex gap-6 items-start">
              <ICONS.Info />
              <div className="space-y-4">
                <div>
                  <p className="font-serif italic text-xl mb-1 text-white">In immediate distress?</p>
                  <p className="text-sm opacity-80 leading-relaxed tracking-wide">If you are in danger, please reach out to emergency services. Text HOME to 741741 or call 988.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowCrisisInfo(false)} className="p-2 hover:bg-red-950/50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
          {currentView === View.HOME && <HomeView setView={setCurrentView} activeModuleIds={activeModuleIds} />}
          {currentView === View.CHAT && <ChatView onAddNote={addNote} systemInstruction={dynamicSystemInstruction} />}
          {currentView === View.VOICE && <LiveVoiceView onAddNote={addNote} voiceSettings={voiceSettings} systemInstruction={dynamicSystemInstruction} />}
          {currentView === View.NOTES && <SessionNotes notes={sessionNotes} onDelete={deleteNote} onClear={clearAllNotes} />}
          {currentView === View.SETTINGS && (
            <SettingsView 
              settings={voiceSettings} 
              onUpdate={setVoiceSettings} 
              activeModuleIds={activeModuleIds} 
              onToggleModule={toggleModule} 
            />
          )}
        </div>
      </main>

      {/* Navigation */}
      <nav className="bg-[#0a0a0a]/80 backdrop-blur-md border-t border-[#d4af37]/10 py-6 px-10 flex justify-around items-center md:justify-center md:gap-24">
        <NavButton active={currentView === View.HOME} onClick={() => setCurrentView(View.HOME)} icon={<ICONS.Home />} label="Home" />
        <NavButton active={currentView === View.CHAT} onClick={() => setCurrentView(View.CHAT)} icon={<ICONS.Chat />} label="Dialogue" />
        <NavButton active={currentView === View.VOICE} onClick={() => setCurrentView(View.VOICE)} icon={<ICONS.Mic />} label="Communion" />
        <NavButton active={currentView === View.NOTES} onClick={() => setCurrentView(View.NOTES)} icon={<ICONS.Note />} label="Journal" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all duration-700 ${active ? 'text-[#d4af37] scale-105' : 'text-[#f4f1ea]/30 hover:text-[#f4f1ea]/60'}`}>
    <div className="transition-transform duration-700">{icon}</div>
    <span className="text-[9px] uppercase tracking-[0.2em] font-medium">{label}</span>
  </button>
);

export default App;
