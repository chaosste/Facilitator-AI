
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { SessionNote, VoiceSettings } from '../types';
import { ICONS } from '../constants';

interface LiveVoiceViewProps {
  onAddNote: (note: SessionNote) => void;
  voiceSettings: VoiceSettings;
  systemInstruction: string;
  avatarUrl: string;
  geminiApiKey: string;
}

const BELL_URL = 'https://storage.googleapis.com/ai-studio-bucket-572556903588-us-west1/services/self-test-images/Tibetan%20Singing%20Bowl%20Sounds%20-%20OM.mp3';

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

const LiveVoiceView: React.FC<LiveVoiceViewProps> = ({ onAddNote, voiceSettings, systemInstruction, avatarUrl, geminiApiKey }) => {
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
    bellAudioRef.current.onerror = () => console.warn("Could not load bell audio.");
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
    for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
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
    if (elapsed > 15000) {
      if (sessionRef.current) {
        sessionRef.current.sendRealtimeInput({
          text: "[Facilitator Note: 15s of silence detected. Transition gently to closing the circle.]"
        });
        lastInteractionTimeRef.current = Date.now();
      }
    }
  }, [isActive]);

  const stopSession = useCallback(() => {
    if (silenceIntervalRef.current) window.clearInterval(silenceIntervalRef.current);
    if (sessionRef.current) { try { sessionRef.current.close(); } catch(e) {} sessionRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close().catch(() => {});
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') outputAudioContextRef.current.close().catch(() => {});
    setIsActive(false); setIsConnecting(false); setVisualizerScale(1);
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    lastInteractionTimeRef.current = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const key = geminiApiKey || (typeof process !== 'undefined' && process.env?.API_KEY) || '';
      const ai = new GoogleGenAI({ apiKey: key });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true); setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0, peak = 0;
              for(let i=0; i<inputData.length; i++) { sum += inputData[i] * inputData[i]; if (Math.abs(inputData[i]) > 0.05) peak = Math.abs(inputData[i]); }
              if (peak > 0.05) lastInteractionTimeRef.current = Date.now();
              setVisualizerScale(1 + Math.sqrt(sum / inputData.length) * 5);
              sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            silenceIntervalRef.current = window.setInterval(monitorSilence, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            lastInteractionTimeRef.current = Date.now();
            if (message.serverContent?.outputTranscription) setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            if (message.serverContent?.turnComplete) setTranscription('');
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'writesessionnote') {
                  onAddNote(fc.args.json as SessionNote);
                  sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "Note archived." } } }));
                } else if (fc.name === 'play_bell') {
                  bellAudioRef.current?.play().catch(() => {});
                  sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "Bell rung." } } }));
                }
              }
            }
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const oCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, oCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), oCtx, 24000, 1);
              const source = oCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(oCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) { sourcesRef.current.forEach(s => s.stop()); sourcesRef.current.clear(); nextStartTimeRef.current = 0; }
          },
          onerror: () => stopSession(),
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

  useEffect(() => { return () => stopSession(); }, [stopSession]);

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-14 anim-fade-up">

      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-display italic text-charcoal tracking-tight">Sacred Communion</h2>
        <p className="text-[10px] text-stone uppercase tracking-[0.3em] font-bold">
          Presence: {voiceSettings.voiceName}
        </p>
      </div>

      {/* Central Orb */}
      <div className="relative flex items-center justify-center">
        {/* Ambient glow */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl transition-transform duration-300 pointer-events-none"
          style={{
            transform: `scale(${visualizerScale * 1.8})`,
            background: isActive
              ? 'radial-gradient(circle, rgba(61,90,76,0.12) 0%, rgba(107,143,113,0.06) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(61,90,76,0.05) 0%, transparent 70%)'
          }}
        />

        {/* Secondary breathing ring */}
        {isActive && (
          <div
            className="absolute w-56 h-56 rounded-full border border-forest/10 anim-breathe pointer-events-none"
            style={{ transform: `scale(${visualizerScale * 1.2})` }}
          />
        )}

        {/* Main button */}
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 w-44 h-44 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-700 group overflow-hidden active:scale-[0.97] ${
            isActive
              ? 'bg-crisis-light border-2 border-crisis/30 text-crisis'
              : isConnecting
                ? 'bg-card border-2 border-forest/20 text-stone cursor-wait'
                : 'bg-card border-2 border-forest/20 text-forest hover:border-forest/50 hover:shadow-2xl'
          }`}
        >
          {/* Avatar background */}
          <img
            src={avatarUrl}
            alt="Presence"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              isActive
                ? 'grayscale-0 opacity-100 scale-110'
                : 'grayscale-[30%] opacity-15 group-hover:opacity-30'
            }`}
          />

          {/* Label overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-white/30 backdrop-blur-[2px]">
            {isConnecting ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold bg-card/80 px-4 py-1.5 rounded-full shadow-sm">
                  Aligning...
                </span>
              </div>
            ) : (
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-5 py-2 rounded-full shadow-sm ${
                isActive ? 'bg-crisis-light/90 text-crisis' : 'bg-card/90 text-forest'
              }`}>
                {isActive ? 'Depart' : 'Commence'}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Transcription Area */}
      <div className="h-20 flex items-center justify-center px-6">
        {isActive && (
          <p className="text-stone/60 text-sm font-light italic tracking-widest text-center max-w-md anim-fade">
            {transcription || "Listening deeply..."}
          </p>
        )}
        {!isActive && !isConnecting && (
          <p className="text-stone-light text-xs tracking-wide text-center max-w-sm">
            Press the circle to open a live voice channel with your facilitator.
          </p>
        )}
      </div>

      {/* Status indicator */}
      {isActive && (
        <div className="flex items-center gap-2.5 anim-fade-up">
          <div className="w-2 h-2 bg-sage rounded-full animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-sage">Session active</span>
        </div>
      )}
    </div>
  );
};

export default LiveVoiceView;
