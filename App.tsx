
import React, { useState, useEffect, useMemo } from 'react';
import { View, SessionNote, VoiceSettings, ApiKeys } from './types';
import { ICONS, BASE_SYSTEM_INSTRUCTION, SPECIALIST_MODULES, AVATARS, getAccentProfile } from './constants';
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
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ gemini: '', claude: '' });

  const dynamicSystemInstruction = useMemo(() => {
    let instruction = BASE_SYSTEM_INSTRUCTION
      .replace(/{userName}/g, userName || 'friend')
      .replace(/{accentProfile}/g, getAccentProfile(voiceSettings.accent));
    activeModuleIds.forEach(id => {
      const mod = SPECIALIST_MODULES.find(m => m.id === id);
      if (mod) {
        instruction += `\n${mod.systemInstruction.replace(/{userName}/g, userName || 'friend')}`;
      }
    });
    return instruction;
  }, [activeModuleIds, userName, voiceSettings.accent]);

  const avatarUrl = useMemo(() => {
    return AVATARS[voiceSettings.gender];
  }, [voiceSettings.gender]);

  // Load persisted state
  useEffect(() => {
    const savedName = localStorage.getItem('facilitatorai_username') ?? localStorage.getItem('counselai_username');
    if (savedName) {
      setUserName(savedName);
      setCurrentView(View.HOME);
    }

    const savedNotes = localStorage.getItem('facilitatorai_notes') ?? localStorage.getItem('counselai_notes');
    if (savedNotes) {
      try { setSessionNotes(JSON.parse(savedNotes)); } catch (e) { console.error("Failed to parse notes", e); }
    }

    const savedSettings = localStorage.getItem('facilitatorai_voice_settings') ?? localStorage.getItem('counselai_voice_settings');
    if (savedSettings) {
      try { setVoiceSettings(JSON.parse(savedSettings)); } catch (e) { console.error("Failed to parse voice settings", e); }
    }

    const savedModules = localStorage.getItem('facilitatorai_active_modules') ?? localStorage.getItem('counselai_active_modules');
    if (savedModules) {
      try { setActiveModuleIds(JSON.parse(savedModules)); } catch (e) { console.error("Failed to parse modules", e); }
    }

    const savedApiKeys = localStorage.getItem('facilitatorai_api_keys');
    if (savedApiKeys) {
      try { setApiKeys(JSON.parse(savedApiKeys)); } catch (e) { console.error("Failed to parse API keys", e); }
    }
  }, []);

  // Persist state
  useEffect(() => { if (userName) localStorage.setItem('facilitatorai_username', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('facilitatorai_notes', JSON.stringify(sessionNotes)); }, [sessionNotes]);
  useEffect(() => { localStorage.setItem('facilitatorai_voice_settings', JSON.stringify(voiceSettings)); }, [voiceSettings]);
  useEffect(() => { localStorage.setItem('facilitatorai_active_modules', JSON.stringify(activeModuleIds)); }, [activeModuleIds]);
  useEffect(() => { localStorage.setItem('facilitatorai_api_keys', JSON.stringify(apiKeys)); }, [apiKeys]);

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

  // Welcome screen — no chrome
  if (currentView === View.WELCOME) {
    return <WelcomeView onComplete={(name) => { setUserName(name); setCurrentView(View.HOME); }} />;
  }

  return (
    <div className="flex flex-col h-screen ground-bg text-charcoal overflow-hidden relative">
      <AmbientPlayer isOpen={showAmbientPanel} onClose={() => setShowAmbientPanel(false)} />

      {/* Buy Me a Coffee — floating action */}
      <a
        href="https://buymeacoffee.com/stevebeale"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 md:right-8 z-[60] bg-card/80 backdrop-blur-md border border-forest/12 p-3 rounded-xl shadow-lg hover:shadow-xl hover:border-amber/40 transition-all duration-500 group flex items-center gap-2.5 overflow-hidden max-w-[44px] hover:max-w-[200px] active:scale-[0.97]"
      >
        <ICONS.Coffee />
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-dark whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Buy me a coffee
        </span>
      </a>

      {/* Header */}
      <header className="bg-parchment/80 backdrop-blur-xl border-b border-forest/8 px-4 md:px-8 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView(View.HOME)}>
          <div className="w-10 h-10 bg-forest text-parchment rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-500 rotate-2 group-hover:rotate-0">
            <ICONS.Logo size={22} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-display italic text-charcoal tracking-tight">Facilitator-AI</h1>
            <span className="text-[9px] uppercase tracking-[0.2em] text-stone font-medium">
              Sitting with {userName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Attunements badge */}
          {activeModuleIds.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 border border-forest/12 px-3.5 py-1.5 rounded-xl text-[9px] tracking-widest font-bold text-forest uppercase bg-card/60">
              <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
              {activeModuleIds.length} Active
            </div>
          )}

          {/* Atmosphere toggle */}
          <button
            onClick={() => setShowAmbientPanel(!showAmbientPanel)}
            className={`p-2.5 rounded-xl transition-all duration-500 active:scale-95 ${
              showAmbientPanel ? 'bg-forest/10 text-forest' : 'text-stone-light hover:text-forest hover:bg-forest/5'
            }`}
            title="Atmosphere"
          >
            <ICONS.Leaf />
          </button>

          {/* Settings */}
          <button
            onClick={() => setCurrentView(View.SETTINGS)}
            className={`p-2.5 rounded-xl transition-all duration-500 active:scale-95 ${
              currentView === View.SETTINGS ? 'bg-forest/10 text-forest' : 'text-stone-light hover:text-forest hover:bg-forest/5'
            }`}
            title="Preferences"
          >
            <ICONS.Sliders />
          </button>

          {/* Crisis help */}
          <button
            onClick={() => setShowCrisisInfo(!showCrisisInfo)}
            className={`p-2.5 rounded-xl transition-all duration-500 active:scale-95 flex items-center gap-1.5 ${
              showCrisisInfo ? 'bg-crisis/10 text-crisis' : 'text-crisis/60 hover:text-crisis hover:bg-crisis/5'
            }`}
            title="Help in a crisis"
          >
            <ICONS.LifeBuoy />
          </button>
        </div>
      </header>

      {/* Crisis Info Banner */}
      {showCrisisInfo && (
        <div className="bg-crisis-light border-b border-crisis/15 text-crisis z-30 anim-slide-down">
          <div className="max-w-4xl mx-auto px-6 py-5 flex gap-5 items-start">
            <div className="text-crisis flex-shrink-0 mt-0.5">
              <ICONS.Shield />
            </div>
            <div className="flex-1 space-y-3">
              <p className="font-display italic text-lg text-crisis">Immediate Support</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a href="tel:988" className="flex items-center gap-2.5 bg-white/60 rounded-xl px-4 py-3 hover:bg-white transition-colors group">
                  <ICONS.Phone />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block">Call 988</span>
                    <span className="text-[9px] text-crisis/60 tracking-wide">Suicide &amp; Crisis Lifeline</span>
                  </div>
                </a>
                <a href="sms:741741&body=HOME" className="flex items-center gap-2.5 bg-white/60 rounded-xl px-4 py-3 hover:bg-white transition-colors group">
                  <ICONS.Chat />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block">Text HOME to 741741</span>
                    <span className="text-[9px] text-crisis/60 tracking-wide">Crisis Text Line</span>
                  </div>
                </a>
                <a href="tel:911" className="flex items-center gap-2.5 bg-white/60 rounded-xl px-4 py-3 hover:bg-white transition-colors group">
                  <ICONS.Phone />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block">Call 911</span>
                    <span className="text-[9px] text-crisis/60 tracking-wide">Emergency Services</span>
                  </div>
                </a>
              </div>
              <p className="text-[10px] text-crisis/70 leading-relaxed tracking-wide">
                If you are in immediate danger, please contact emergency services. This app is not a substitute for professional mental health support.
              </p>
            </div>
            <button
              onClick={() => setShowCrisisInfo(false)}
              className="p-2 hover:bg-crisis/10 rounded-xl transition-colors flex-shrink-0 active:scale-95"
            >
              <ICONS.X />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-8 lg:p-10">
          {currentView === View.HOME && (
            <HomeView setView={setCurrentView} activeModuleIds={activeModuleIds} avatarUrl={avatarUrl} />
          )}
          {currentView === View.CHAT && (
            <ChatView
              onAddNote={addNote}
              systemInstruction={dynamicSystemInstruction}
              avatarUrl={avatarUrl}
              onToggleAmbient={() => setShowAmbientPanel(!showAmbientPanel)}
              isAmbientOpen={showAmbientPanel}
              geminiApiKey={apiKeys.gemini}
            />
          )}
          {currentView === View.VOICE && (
            <LiveVoiceView
              onAddNote={addNote}
              voiceSettings={voiceSettings}
              systemInstruction={dynamicSystemInstruction}
              avatarUrl={avatarUrl}
              geminiApiKey={apiKeys.gemini}
            />
          )}
          {currentView === View.NOTES && (
            <SessionNotes notes={sessionNotes} onDelete={deleteNote} onClear={clearAllNotes} />
          )}
          {currentView === View.SETTINGS && (
            <SettingsView
              settings={voiceSettings}
              onUpdate={setVoiceSettings}
              onResetName={() => setCurrentView(View.WELCOME)}
              apiKeys={apiKeys}
              onUpdateApiKeys={setApiKeys}
            />
          )}
          {currentView === View.ATTUNEMENTS && (
            <AttunementsView activeModuleIds={activeModuleIds} onToggleModule={toggleModule} onBack={() => setCurrentView(View.HOME)} />
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-card/80 backdrop-blur-xl border-t border-forest/8 py-3 flex flex-col items-center gap-3 z-20">
        <nav className="px-6 flex justify-around items-center w-full md:justify-center md:gap-16">
          <NavButton active={currentView === View.HOME} onClick={() => setCurrentView(View.HOME)} icon={<ICONS.Home />} label="Home" />
          <NavButton active={currentView === View.CHAT} onClick={() => setCurrentView(View.CHAT)} icon={<ICONS.Chat />} label="Dialogue" />
          <NavButton active={currentView === View.VOICE} onClick={() => setCurrentView(View.VOICE)} icon={<ICONS.Mic />} label="Communion" />
          <NavButton active={currentView === View.NOTES} onClick={() => setCurrentView(View.NOTES)} icon={<ICONS.Book />} label="Journal" />
        </nav>

        <div className="pb-1">
          <a
            href="https://newpsychonaut.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] uppercase tracking-[0.25em] font-light text-stone-light hover:text-forest transition-colors duration-500"
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
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all duration-500 active:scale-95 px-3 py-1 rounded-xl ${
      active
        ? 'text-forest'
        : 'text-stone-light hover:text-forest hover:bg-forest/5'
    }`}
  >
    <div className={`transition-all duration-500 ${active ? 'scale-110' : ''}`}>{icon}</div>
    <span className={`text-[8px] uppercase tracking-[0.2em] font-bold ${active ? 'text-forest' : ''}`}>{label}</span>
    {active && <div className="w-1 h-1 bg-forest rounded-full" />}
  </button>
);

export default App;
