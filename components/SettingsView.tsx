
import React, { useState } from 'react';
import { VoiceSettings, ApiKeys } from '../types';
import { ICONS } from '../constants';
import { GoogleGenAI, Modality } from '@google/genai';

interface SettingsViewProps {
  settings: VoiceSettings;
  onUpdate: (settings: VoiceSettings) => void;
  onResetName: () => void;
  apiKeys: ApiKeys;
  onUpdateApiKeys: (keys: ApiKeys) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onResetName, apiKeys, onUpdateApiKeys }) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);

  const selectProfile = (gender: VoiceSettings['gender'], accent: VoiceSettings['accent']) => {
    onUpdate({
      voiceName: gender === 'feminine' ? 'Kore' : 'Puck',
      gender,
      accent
    });
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handlePreviewVoice = async () => {
    if (isPreviewLoading) return;
    setIsPreviewLoading(true);
    try {
      const key = apiKeys.gemini || (typeof process !== 'undefined' && process.env?.API_KEY) || '';
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `I am your Facilitator. This is my ${settings.gender} voice with a ${settings.accent} style.` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voiceName } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decodedBytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (error) {
      console.error("Voice preview failed:", error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const voiceProfiles: { gender: VoiceSettings['gender']; accent: VoiceSettings['accent']; label: string; emoji: string }[] = [
    { gender: 'feminine', accent: 'UK', label: 'Female (UK)', emoji: '\u{2728}' },
    { gender: 'masculine', accent: 'UK', label: 'Male (UK)', emoji: '\u{1F33F}' },
    { gender: 'feminine', accent: 'Levantine-English', label: 'Female (Levantine)', emoji: '\u{1FAB7}' },
    { gender: 'masculine', accent: 'Levantine-English', label: 'Male (Levantine)', emoji: '\u{1F701}' },
  ];

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto space-y-8 overflow-y-auto pb-16 pr-1 anim-fade-up">

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-display italic text-charcoal">Preferences</h2>
        <p className="text-xs text-stone tracking-widest uppercase font-medium">Refine your experience</p>
      </div>

      {/* Identity Section */}
      <section className="bg-card rounded-2xl border border-forest/8 p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-forest">
            <ICONS.User />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Identity</h3>
          </div>
          <button
            onClick={onResetName}
            className="text-[10px] uppercase tracking-widest font-bold text-forest hover:text-forest-deep transition-colors border border-forest/15 px-5 py-2 rounded-xl hover:bg-forest/5 active:scale-[0.97]"
          >
            Change User
          </button>
        </div>
      </section>

      {/* Voice Section */}
      <section className="bg-card rounded-2xl border border-forest/8 p-6 md:p-8 space-y-8">
        <div className="flex items-center gap-3 text-forest">
          <ICONS.Volume />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Auditory Presence</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {voiceProfiles.map((profile) => {
            const isActive = settings.gender === profile.gender && settings.accent === profile.accent;
            return (
              <button
                key={`${profile.gender}-${profile.accent}`}
                onClick={() => selectProfile(profile.gender, profile.accent)}
                className={`py-6 px-4 rounded-xl border transition-all duration-500 flex flex-col items-center gap-3 active:scale-[0.97] ${
                  isActive
                    ? 'border-forest bg-forest/5 text-charcoal shadow-sm'
                    : 'border-forest/8 bg-parchment-light/50 text-stone hover:border-forest/25 hover:bg-card'
                }`}
              >
                <span className="text-3xl">{profile.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{profile.label}</span>
                {isActive && (
                  <div className="text-forest">
                    <ICONS.Check />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Preview Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handlePreviewVoice}
            disabled={isPreviewLoading}
            className={`px-8 py-3.5 rounded-xl border transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.97] ${
              isPreviewLoading
                ? 'bg-card border-forest/8 text-stone-light cursor-not-allowed'
                : 'bg-card border-forest/15 text-forest hover:border-forest/40 hover:bg-forest/5 shadow-sm'
            }`}
          >
            {isPreviewLoading ? (
              <div className="w-4 h-4 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
            ) : (
              <ICONS.Play />
            )}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sample Voice</span>
          </button>
        </div>

        <p className="text-[10px] text-stone-light text-center tracking-wide leading-relaxed">
          The selected voice applies to both Dialogue and Communion modes.
        </p>
      </section>

      {/* API Configuration Section */}
      <section className="bg-card rounded-2xl border border-forest/8 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 text-forest">
          <ICONS.Key />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">API Configuration</h3>
        </div>
        <p className="text-[10px] text-stone leading-relaxed tracking-wide">
          Enter your API keys to connect to AI models. Keys are stored locally in your browser and never sent to our servers.
        </p>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-sage rounded-full" />
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showGeminiKey ? 'text' : 'password'}
              value={apiKeys.gemini}
              onChange={(e) => onUpdateApiKeys({ ...apiKeys, gemini: e.target.value })}
              placeholder="AIza..."
              className="w-full bg-parchment-light border border-forest/10 focus:border-forest/30 rounded-xl px-4 py-3 pr-12 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/10 transition-all duration-300 placeholder:text-stone-light/50 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowGeminiKey(!showGeminiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-light hover:text-forest transition-colors p-1"
              title={showGeminiKey ? 'Hide key' : 'Show key'}
            >
              {showGeminiKey ? <ICONS.EyeOff /> : <ICONS.Eye />}
            </button>
          </div>
          <p className="text-[9px] text-stone-light tracking-wide">Required for Dialogue and Communion features</p>
        </div>

        {/* Claude API Key */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-amber rounded-full" />
            Anthropic Claude API Key
          </label>
          <div className="relative">
            <input
              type={showClaudeKey ? 'text' : 'password'}
              value={apiKeys.claude}
              onChange={(e) => onUpdateApiKeys({ ...apiKeys, claude: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full bg-parchment-light border border-forest/10 focus:border-forest/30 rounded-xl px-4 py-3 pr-12 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/10 transition-all duration-300 placeholder:text-stone-light/50 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowClaudeKey(!showClaudeKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-light hover:text-forest transition-colors p-1"
              title={showClaudeKey ? 'Hide key' : 'Show key'}
            >
              {showClaudeKey ? <ICONS.EyeOff /> : <ICONS.Eye />}
            </button>
          </div>
          <p className="text-[9px] text-stone-light tracking-wide">For future Claude-powered features</p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-card rounded-2xl border border-forest/8 p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3 text-forest">
          <ICONS.Info />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">About Facilitator-AI</h3>
        </div>
        <p className="text-xs text-stone leading-relaxed tracking-wide">
          Facilitator-AI is an experimental conversational AI tool that simulates the role of a psychedelic retreat facilitator. Grounded in the UCP 9 Core Skills framework for counselling, it offers supportive, non-judgemental dialogue through text and real-time voice interaction.
        </p>
        <p className="text-xs text-stone leading-relaxed tracking-wide">
          The app features specialist attunements for psychedelic integration, sharing circles facilitation, and harm reduction &mdash; each shaping the conversational approach to your specific needs.
        </p>
        <p className="text-xs text-crisis/80 leading-relaxed tracking-wide font-medium">
          Important: Facilitator-AI is not therapy. It does not form a therapeutic relationship, cannot diagnose, and is not a substitute for professional mental health support or emergency services.
        </p>
        <p className="text-xs text-stone-light leading-relaxed tracking-wide">
          Your data is stored locally in your browser. Nothing is sent to external servers beyond the AI model API. Part of the Descripteme microphenomenology research suite.
        </p>

        {/* Links */}
        <div className="pt-3 border-t border-forest/5 space-y-3">
          <a
            href="https://www.newpsychonaut.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-forest hover:text-forest-deep transition-colors group"
          >
            <ICONS.Globe />
            <span className="text-xs tracking-wide group-hover:underline underline-offset-2">newpsychonaut.com</span>
          </a>
          <a
            href="https://www.instagram.com/newpsychonaut/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-forest hover:text-forest-deep transition-colors group"
          >
            <ICONS.ExternalLink />
            <span className="text-xs tracking-wide group-hover:underline underline-offset-2">@newpsychonaut</span>
          </a>
          <a
            href="https://buymeacoffee.com/stevebeale"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-amber-dark hover:text-amber transition-colors group"
          >
            <ICONS.Coffee />
            <span className="text-xs tracking-wide group-hover:underline underline-offset-2">Buy me a coffee</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
