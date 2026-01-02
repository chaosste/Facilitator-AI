
import React, { useMemo, useState } from 'react';
import { VoiceSettings } from '../types';
import { AVAILABLE_VOICES, ICONS } from '../constants';
import { GoogleGenAI, Modality } from '@google/genai';

interface SettingsViewProps {
  settings: VoiceSettings;
  onUpdate: (settings: VoiceSettings) => void;
  onResetName: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onResetName }) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const filteredVoices = useMemo(() => {
    return AVAILABLE_VOICES.filter(v => v.gender === settings.gender && v.accent === settings.accent);
  }, [settings.gender, settings.accent]);

  const handleGenderChange = (gender: 'feminine' | 'masculine' | 'neutral') => {
    const firstMatch = AVAILABLE_VOICES.find(v => v.gender === gender && v.accent === settings.accent);
    onUpdate({ ...settings, gender, voiceName: firstMatch?.voiceName || settings.voiceName });
  };

  const handleAccentChange = (accent: 'US' | 'UK' | 'Dutch') => {
    const firstMatch = AVAILABLE_VOICES.find(v => v.gender === settings.gender && v.accent === accent);
    onUpdate({ ...settings, accent, voiceName: firstMatch?.voiceName || settings.voiceName });
  };

  // Helper functions for audio decoding (as per Gemini Live API requirements for raw PCM)
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say cheerfully: I am your Facilitator-AI, using the ${settings.voiceName} persona. How can I support your integration today?` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: settings.voiceName },
            },
          },
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
              {(['US', 'UK', 'Dutch'] as const).map((a) => (
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
          <div className="flex gap-4">
            <div className="relative group flex-1">
              <select
                value={settings.voiceName}
                onChange={(e) => onUpdate({ ...settings, voiceName: e.target.value })}
                className="w-full bg-white border border-[#96adb3]/10 rounded-2xl px-8 py-5 appearance-none focus:outline-none focus:border-[#96adb3] transition-all duration-700 text-[#2c3e50] font-medium tracking-widest text-sm cursor-pointer shadow-sm hover:border-[#96adb3]/40"
              >
                {filteredVoices.map((v) => <option key={v.voiceName} value={v.voiceName} className="bg-white">{v.label}</option>)}
                {filteredVoices.length === 0 && <option value={settings.voiceName} className="bg-white">Voice Mismatch - Auto adjusting...</option>}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#96adb3]/40 group-hover:text-[#96adb3] transition-all duration-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handlePreviewVoice}
              disabled={isPreviewLoading}
              className={`p-5 rounded-2xl border transition-all duration-500 flex items-center justify-center gap-3 min-w-[140px] ${
                isPreviewLoading 
                  ? 'bg-white border-[#96adb3]/10 text-[#96adb3]/30 cursor-not-allowed' 
                  : 'bg-white border-[#96adb3]/30 text-[#96adb3] hover:border-[#96adb3] hover:bg-[#96adb3]/5'
              }`}
            >
              {isPreviewLoading ? (
                <div className="w-4 h-4 border-2 border-[#96adb3]/30 border-t-[#96adb3] rounded-full animate-spin"></div>
              ) : (
                <ICONS.Play />
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Preview</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
