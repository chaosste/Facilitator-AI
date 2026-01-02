
import React, { useState, useEffect, useMemo } from 'react';
import { View, SessionNote, VoiceSettings } from './types';
import { ICONS, BASE_SYSTEM_INSTRUCTION, SPECIALIST_MODULES, AVATARS } from './constants';
import ChatView from './components/ChatView';
import LiveVoiceView from './components/LiveVoiceView';
import SessionNotes from './components/SessionNotes';
import HomeView from './components/HomeView';
import SettingsView from './components/SettingsView';
import AttunementsView from './components/AttunementsView';
import WelcomeView from './components/WelcomeView';
import AmbientPlayer from './components/AmbientPlayer';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [currentView, setCurrentView] = useState<View>(View.WELCOME);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [showCrisisInfo, setShowCrisisInfo] = useState(false);
  const [showAmbientPanel, setShowAmbientPanel] = useState(false);
  const [activeModuleIds, setActiveModuleIds] = useState<string[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceName: 'Kore',
    gender: 'feminine',
    accent: 'UK'
  });

  const dynamicSystemInstruction = useMemo(() => {
    let instruction = BASE_SYSTEM_INSTRUCTION
      .replace(/{userName}/g, userName || 'friend');
    activeModuleIds.forEach(id => {
      const mod = SPECIALIST_MODULES.find(m => m.id === id);
      if (mod) {
        instruction += `\n${mod.systemInstruction.replace(/{userName}/g, userName || 'friend')}`;
      }
    });
    return instruction;
  }, [activeModuleIds, userName]);

  const avatarUrl = useMemo(() => {
    return AVATARS[voiceSettings.gender];
  }, [voiceSettings.gender]);

  useEffect(() => {
    const savedName = localStorage.getItem('counselai_username');
    if (savedName) {
      setUserName(savedName);
      setCurrentView(View.HOME);
    }

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
    if (userName) localStorage.setItem('counselai_username', userName);
  }, [userName]);

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

  if (currentView === View.WELCOME) {
    return <WelcomeView onComplete={(name) => { setUserName(name); setCurrentView(View.HOME); }} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf6] text-[#2c3e50] overflow-hidden aura-bg relative">
      <AmbientPlayer isOpen={showAmbientPanel} onClose={() => setShowAmbientPanel(false)} />

      {/* Buy Me a Coffee Button - Discrete Floating Action */}
      <a 
        href="https://buymeacoffee.com/stevebeale" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-28 right-8 z-[60] bg-white/60 backdrop-blur-md border border-[#96adb3]/20 p-3 rounded-full shadow-lg hover:shadow-xl hover:border-[#96adb3]/50 transition-all duration-500 group flex items-center gap-3 overflow-hidden max-w-[48px] hover:max-w-[180px]"
      >
        <span className="text-lg">☕</span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#96adb3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Support this vessel
        </span>
      </a>

      <header className="bg-[#fdfaf6]/80 backdrop-blur-md border-b border-[#96adb3]/20 px-8 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setCurrentView(View.HOME)}>
          <div className="w-12 h-12 bg-white border border-[#96adb3]/30 rounded-full flex items-center justify-center overflow-hidden shadow-[0_4px_12px_rgba(150,173,179,0.1)] group-hover:border-[#96adb3] transition-all duration-700">
            <img src={avatarUrl} alt="Facilitator Avatar" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-[#2c3e50] font-serif tracking-widest uppercase">Facilitator-AI</h1>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#96adb3] font-bold">Sitting with: {userName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
           {activeModuleIds.length > 0 && (
             <div className="hidden sm:flex items-center gap-2 border border-[#96adb3]/30 px-4 py-1.5 rounded-full text-[10px] tracking-widest font-bold text-[#96adb3] uppercase bg-white">
                <span className="w-1.5 h-1.5 bg-[#96adb3] rounded-full animate-pulse"></span>
                {activeModuleIds.length} Attunements
             </div>
           )}
           <button onClick={() => setShowAmbientPanel(!showAmbientPanel)} className={`p-2.5 rounded-full transition-all duration-500 ${showAmbientPanel ? 'bg-[#96adb3]/10 text-[#96adb3]' : 'text-[#2c3e50]/40 hover:text-[#96adb3]'}`} title="Atmosphere">
            <ICONS.Lotus />
          </button>
           <button onClick={() => setCurrentView(View.SETTINGS)} className={`p-2.5 rounded-full transition-all duration-500 ${currentView === View.SETTINGS ? 'bg-[#96adb3]/10 text-[#96adb3]' : 'text-[#2c3e50]/40 hover:text-[#96adb3]'}`} title="Settings">
            <ICONS.Settings />
          </button>
           <button onClick={() => setShowCrisisInfo(!showCrisisInfo)} className="p-2.5 text-red-500 hover:text-red-600 transition-all font-black text-[11px] tracking-widest" title="Help in a crisis">
            HELP!
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {showCrisisInfo && (
          <div className="absolute inset-x-0 top-0 bg-[#fff5f5] border-b border-red-100 text-red-700 p-6 z-50 animate-in slide-in-from-top duration-700 flex justify-between items-start shadow-xl backdrop-blur-xl">
            <div className="max-w-4xl mx-auto flex gap-6 items-start">
              <ICONS.Info />
              <div className="space-y-3">
                <p className="font-serif italic text-xl text-red-900">Immediate Support</p>
                <p className="text-sm opacity-80 leading-relaxed tracking-wide">If you are in danger, contact emergency services. Text HOME to 741741 or call 988.</p>
              </div>
            </div>
            <button onClick={() => setShowCrisisInfo(false)} className="p-2 hover:bg-red-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
          {currentView === View.HOME && <HomeView setView={setCurrentView} activeModuleIds={activeModuleIds} avatarUrl={avatarUrl} />}
          {currentView === View.CHAT && (
            <ChatView 
              onAddNote={addNote} 
              systemInstruction={dynamicSystemInstruction} 
              avatarUrl={avatarUrl}
              onToggleAmbient={() => setShowAmbientPanel(!showAmbientPanel)}
              isAmbientOpen={showAmbientPanel}
            />
          )}
          {currentView === View.VOICE && <LiveVoiceView onAddNote={addNote} voiceSettings={voiceSettings} systemInstruction={dynamicSystemInstruction} avatarUrl={avatarUrl} />}
          {currentView === View.NOTES && <SessionNotes notes={sessionNotes} onDelete={deleteNote} onClear={clearAllNotes} />}
          {currentView === View.SETTINGS && <SettingsView settings={voiceSettings} onUpdate={setVoiceSettings} onResetName={() => setCurrentView(View.WELCOME)} />}
          {currentView === View.ATTUNEMENTS && <AttunementsView activeModuleIds={activeModuleIds} onToggleModule={toggleModule} onBack={() => setCurrentView(View.HOME)} />}
        </div>
      </main>

      {/* Navigation & Footer Container */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-[#96adb3]/10 py-4 flex flex-col items-center gap-4">
        <nav className="px-10 flex justify-around items-center w-full md:justify-center md:gap-24">
          <NavButton active={currentView === View.HOME} onClick={() => setCurrentView(View.HOME)} icon={<ICONS.Home />} label="Home" />
          <NavButton active={currentView === View.CHAT} onClick={() => setCurrentView(View.CHAT)} icon={<ICONS.Chat />} label="Dialogue" />
          <NavButton active={currentView === View.VOICE} onClick={() => setCurrentView(View.VOICE)} icon={<ICONS.Mic />} label="Communion" />
          <NavButton active={currentView === View.NOTES} onClick={() => setCurrentView(View.NOTES)} icon={<ICONS.Note />} label="Journal" />
        </nav>
        
        {/* Centered Website Link */}
        <div className="pb-2">
          <a 
            href="https://newpsychonaut.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] uppercase tracking-[0.3em] font-light text-[#2c3e50]/30 hover:text-[#96adb3] transition-colors duration-500"
          >
            newpsychonaut.com
          </a>
        </div>
      </footer>
    </div>
  );
};

interface NavButtonProps { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }
const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-700 ${active ? 'text-[#96adb3] scale-105' : 'text-[#2c3e50]/30 hover:text-[#96adb3]'}`}>
    <div className="transition-transform duration-700">{icon}</div>
    <span className="text-[8px] uppercase tracking-[0.2em] font-bold">{label}</span>
  </button>
);

export default App;
