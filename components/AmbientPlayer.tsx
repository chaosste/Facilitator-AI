
import React, { useState, useRef, useEffect } from 'react';
import { AMBIENT_TRACKS, ICONS } from '../constants';
import { AmbientTrack } from '../types';

interface AmbientPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ isOpen, onClose }) => {
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [freqData, setFreqData] = useState<number[]>(new Array(6).fill(0));
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  const initAudioSystem = () => {
    if (!audioContextRef.current && audioRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      audioContextRef.current = audioContext;
    }
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
  };

  const updateVisualizer = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setFreqData([dataArray[2] || 0, dataArray[5] || 0, dataArray[8] || 0, dataArray[11] || 0, dataArray[14] || 0, dataArray[17] || 0]);
    }
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  useEffect(() => {
    if (isPlaying) updateVisualizer();
    else { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); setFreqData(new Array(6).fill(0)); }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [isPlaying]);

  const handleAudioError = () => {
    setLoadError("Atmosphere could not be aligned. Check connection.");
    setIsPlaying(false);
  };

  const toggleTrack = (track: AmbientTrack) => {
    initAudioSystem();
    setLoadError(null);
    if (currentTrack?.id === track.id) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else { audioRef.current?.play().catch(handleAudioError); setIsPlaying(true); }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        audioRef.current.play().catch(handleAudioError);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-24 right-8 w-80 max-h-[75vh] bg-white/95 backdrop-blur-2xl border border-[#96adb3]/30 rounded-[3rem] shadow-2xl z-[100] p-8 animate-in fade-in zoom-in duration-500 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
           <ICONS.Lotus />
           <h3 className="text-[10px] font-black text-[#96adb3] uppercase tracking-[0.4em]">Atmosphere</h3>
        </div>
        <button onClick={onClose} className="text-[#2c3e50]/30 hover:text-[#96adb3] p-2 hover:bg-[#96adb3]/10 rounded-full transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {loadError && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-[10px] uppercase font-bold tracking-widest rounded-xl text-center">
          {loadError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {AMBIENT_TRACKS.map((track) => {
          const active = currentTrack?.id === track.id;
          return (
            <button
              key={track.id}
              onClick={() => toggleTrack(track)}
              className={`w-full flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all duration-700 text-left relative group ${
                active && isPlaying ? 'bg-white border-[#96adb3] shadow-md' : 'bg-white/40 border-transparent hover:border-[#96adb3]/20'
              }`}
            >
              <div className={`text-6xl transition-transform duration-1000 ${active && isPlaying ? 'scale-110' : 'opacity-40'}`}>{track.icon}</div>
              <div className="flex-1 space-y-1">
                <span className={`text-[11px] font-black uppercase tracking-widest block ${active && isPlaying ? 'text-[#2c3e50]' : 'text-[#2c3e50]/60'}`}>{track.name}</span>
                <p className="text-[10px] font-light text-[#2c3e50]/40 leading-tight">{track.description}</p>
              </div>
              {active && isPlaying && (
                <div className="flex gap-1 items-end h-6 w-10">
                  {freqData.map((val, i) => (<div key={i} className="flex-1 bg-[#96adb3] rounded-full" style={{ height: `${Math.max(15, (val / 255) * 100)}%` }}></div>))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-[#96adb3]/10 space-y-6">
        <div className="flex justify-between items-center text-[9px] font-black text-[#96adb3] uppercase tracking-[0.3em]">
          <span>Silence</span>
          <span className="text-[#2c3e50] font-serif italic text-sm">{Math.round(volume * 100)}%</span>
          <span>Immersion</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.01" value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#96adb3]/10 rounded-full appearance-none cursor-pointer accent-[#96adb3] group-hover:bg-[#96adb3]/20 transition-all"
        />
      </div>

      <audio ref={audioRef} crossOrigin="anonymous" onAbort={handleAudioError} onError={handleAudioError} style={{ display: 'none' }} />
    </div>
  );
};

export default AmbientPlayer;
