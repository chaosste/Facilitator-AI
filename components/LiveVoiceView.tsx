
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { SessionNote, VoiceSettings } from '../types';

interface LiveVoiceViewProps {
  onAddNote: (note: SessionNote) => void;
  voiceSettings: VoiceSettings;
  systemInstruction: string;
}

const BELL_URL = 'https://storage.cloud.google.com/ai-studio-bucket-572556903588-us-west1/services/self-test-images/Tibetan%20Singing%20Bowl%20Sounds%20-%20OM.mp3';

const writeSessionNoteDeclaration: FunctionDeclaration = {
  name: 'writesessionnote',
  parameters: {
    type: Type.OBJECT,
    description: 'Create a concise, counselling-style session note based on the last exchange.',
    properties: {
      json: {
        type: Type.OBJECT,
        properties: {
          dateTimeUTC: { type: Type.STRING },
          presentingThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
          emotionsObserved: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillsApplied: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          goalsNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["dateTimeUTC", "presentingThemes", "summary"]
      }
    },
    required: ["json"]
  }
};

const playBellDeclaration: FunctionDeclaration = {
  name: 'play_bell',
  parameters: {
    type: Type.OBJECT,
    description: 'Rings the Tibetan bell to signify the end of a share duration.',
    properties: {}
  }
};

const LiveVoiceView: React.FC<LiveVoiceViewProps> = ({ onAddNote, voiceSettings, systemInstruction }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [visualizerScale, setVisualizerScale] = useState(1);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const silenceIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    bellAudioRef.current = new Audio(BELL_URL);
    return () => {
      if (silenceIntervalRef.current) window.clearInterval(silenceIntervalRef.current);
    };
  }, []);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; }
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  const monitorSilence = useCallback(() => {
    if (!isActive) return;
    const elapsed = Date.now() - lastInteractionTimeRef.current;
    if (elapsed > 10000) {
      if (sessionRef.current) {
        sessionRef.current.sendRealtimeInput({
          text: "[Facilitator Note: 10 seconds of silence. Transition to closing the circle smoothly, following the gentle pace instructions.]"
        });
        lastInteractionTimeRef.current = Date.now();
      }
    }
  }, [isActive]);

  const startSession = async () => {
    setIsConnecting(true);
    lastInteractionTimeRef.current = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              let peak = 0;
              for(let i=0; i<inputData.length; i++) {
                sum += inputData[i] * inputData[i];
                if (Math.abs(inputData[i]) > 0.05) peak = Math.abs(inputData[i]);
              }
              if (peak > 0.05) lastInteractionTimeRef.current = Date.now();

              const rms = Math.sqrt(sum / inputData.length);
              setVisualizerScale(1 + rms * 5);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            silenceIntervalRef.current = window.setInterval(monitorSilence, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            lastInteractionTimeRef.current = Date.now();
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.turnComplete) { setTranscription(''); }
            
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'writesessionnote') {
                  onAddNote(fc.args.json as SessionNote);
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "Note archived." } }
                  }));
                } else if (fc.name === 'play_bell') {
                  if (bellAudioRef.current) {
                    bellAudioRef.current.currentTime = 0;
                    bellAudioRef.current.play().catch(e => console.error("Bell error", e));
                  }
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "Bell rung." } }
                  }));
                }
              }
            }
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const outputCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => stopSession(),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceSettings.voiceName } } },
          tools: [{ functionDeclarations: [writeSessionNoteDeclaration, playBellDeclaration] }],
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setIsConnecting(false); }
  };

  const stopSession = useCallback(() => {
    if (silenceIntervalRef.current) window.clearInterval(silenceIntervalRef.current);
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close().catch(() => {});
    }
    setIsActive(false);
    setIsConnecting(false);
    setVisualizerScale(1);
  }, []);

  useEffect(() => { return () => stopSession(); }, [stopSession]);

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-16 animate-in fade-in duration-1000">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-serif italic text-[#2c3e50] tracking-tight">Sacred Communion</h2>
        <p className="text-[#96adb3] text-[10px] uppercase tracking-[0.3em] font-bold tracking-widest">Presence: {voiceSettings.voiceName}</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute w-64 h-64 bg-[#96adb3]/5 rounded-full blur-3xl transition-transform duration-300" style={{ transform: `scale(${visualizerScale * 1.8})` }}></div>
        <div className="absolute w-48 h-48 border border-[#96adb3]/20 rounded-full transition-transform duration-200" style={{ transform: `scale(${visualizerScale})` }}></div>
        
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-1000 group ${
            isActive 
              ? 'bg-[#fff5f5] border border-red-200 text-red-600' 
              : 'bg-white border border-[#96adb3]/30 text-[#96adb3] hover:border-[#96adb3] hover:scale-105 duck-egg-glow'
          }`}
        >
          {isConnecting ? (
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold animate-pulse text-[#96adb3]">Aligning...</span>
          ) : isActive ? (
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Depart</span>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Commence</span>
          )}
        </button>
      </div>

      <div className="h-24 flex items-center justify-center">
        {isActive && (
          <div className="max-w-md w-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-6">
             <p className="text-[#2c3e50]/50 text-sm font-light italic tracking-widest leading-relaxed">{transcription || "Listening deeply..."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveVoiceView;
