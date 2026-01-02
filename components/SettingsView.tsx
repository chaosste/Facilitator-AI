
import React, { useState } from 'react';
import { VoiceSettings } from '../types';
import { ICONS } from '../constants';
import { GoogleGenAI, Modality } from '@google/genai';

interface SettingsViewProps {
  settings: VoiceSettings;
  onUpdate: (settings: VoiceSettings) => void;
  onResetName: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onResetName }) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Simplified selection logic for UK Male/Female
  const selectFemale = () => {
    onUpdate({
      voiceName: 'Kore',
      gender: 'feminine',
      accent: 'UK'
    });
  };

  const selectMale = () => {
    onUpdate({
      voiceName: 'Puck',
      gender: 'masculine',
      accent: 'UK'
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `I am your Facilitator. This is my ${settings.gender} voice.` }] }],
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
            className="text-[9px] uppercase tracking-widest font-bold text-[#96adb3] hover:text-[#2c3e50] transition-colors border border-[#96adb3]/20 px-6 py-2 rounded-full"
          >
            Change User
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <label className="text-[9px] font-black text-[#2c3e50]/30 uppercase tracking-[0.4em] block text-center">Auditory Presence</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={selectFemale}
                className={`py-8 px-6 rounded-[2rem] border transition-all duration-700 flex flex-col items-center gap-4 ${
                  settings.gender === 'feminine' 
                    ? 'border-[#96adb3] bg-white shadow-lg text-[#2c3e50]' 
                    : 'border-[#96adb3]/10 bg-white/40 text-[#2c3e50]/30 hover:border-[#96adb3]/30'
                }`}
              >
                <span className="text-4xl">✨</span>
                <span className="text-xs font-black uppercase tracking-[0.3em]">Female (UK)</span>
              </button>

              <button
                onClick={selectMale}
                className={`py-8 px-6 rounded-[2rem] border transition-all duration-700 flex flex-col items-center gap-4 ${
                  settings.gender === 'masculine' 
                    ? 'border-[#96adb3] bg-white shadow-lg text-[#2c3e50]' 
                    : 'border-[#96adb3]/10 bg-white/40 text-[#2c3e50]/30 hover:border-[#96adb3]/30'
                }`}
              >
                <span className="text-4xl">🌿</span>
                <span className="text-xs font-black uppercase tracking-[0.3em]">Male (UK)</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handlePreviewVoice}
              disabled={isPreviewLoading}
              className={`px-10 py-5 rounded-2xl border transition-all duration-500 flex items-center justify-center gap-4 ${
                isPreviewLoading 
                  ? 'bg-white border-[#96adb3]/10 text-[#96adb3]/30 cursor-not-allowed' 
                  : 'bg-white border-[#96adb3]/30 text-[#96adb3] hover:border-[#96adb3] hover:bg-[#96adb3]/5 shadow-sm'
              }`}
            >
              {isPreviewLoading ? (
                <div className="w-4 h-4 border-2 border-[#96adb3]/30 border-t-[#96adb3] rounded-full animate-spin"></div>
              ) : (
                <ICONS.Play />
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sample Presence</span>
            </button>
          </div>
        </div>
      </section>

      <div className="p-8 text-center opacity-40">
        <p className="text-[9px] uppercase tracking-[0.2em] font-medium leading-relaxed">
          The selected voice will be used for both Dialogue and Sacred Communion experiences.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
