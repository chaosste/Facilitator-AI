
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { SessionNote, VoiceSettings } from '../types';

interface LiveVoiceViewProps {
  onAddNote: (note: SessionNote) => void;
  voiceSettings: VoiceSettings;
  systemInstruction: string;
}

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

  const startSession = async () => {
    setIsConnecting(true);
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
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVisualizerScale(1 + rms * 5);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.turnComplete) { setTranscription(''); }
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'writesessionnote') {
                  onAddNote(fc.args.json as SessionNote);
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "Note captured." } }
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
          tools: [{ functionDeclarations: [writeSessionNoteDeclaration] }],
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setIsConnecting(false); }
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsActive(false);
    setIsConnecting(false);
    setVisualizerScale(1);
  }, []);

  useEffect(() => { return () => stopSession(); }, [stopSession]);

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 font-serif mb-2">Voice Session</h2>
        <p className="text-slate-500 italic">Active voice: {voiceSettings.voiceName}</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute w-48 h-48 bg-indigo-100 rounded-full opacity-30 transition-transform duration-75" style={{ transform: `scale(${visualizerScale * 1.5})` }}></div>
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {isConnecting ? <span className="font-bold">Connecting...</span> : isActive ? <><span className="font-bold uppercase tracking-widest text-sm">End</span></> : <><span className="font-bold uppercase tracking-widest text-sm">Speak</span></>}
        </button>
      </div>

      {isActive && (
        <div className="max-w-md w-full text-center space-y-4 animate-in fade-in duration-500">
           <p className="text-slate-400 text-sm italic">{transcription || "Listening..."}</p>
        </div>
      )}
    </div>
  );
};

export default LiveVoiceView;
