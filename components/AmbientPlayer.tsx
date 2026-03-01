
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
    else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setFreqData(new Array(6).fill(0));
    }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [isPlaying]);

  const handleAudioError = () => {
    setLoadError("Could not load this soundscape. Check your connection.");
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
    <div className="absolute top-[72px] right-4 md:right-8 w-[320px] max-h-[75vh] bg-card/98 backdrop-blur-2xl border border-forest/12 rounded-2xl shadow-xl shadow-charcoal/[0.06] z-[100] flex flex-col anim-slide-down overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-forest/6">
        <div className="flex items-center gap-2.5 text-forest">
          <ICONS.Leaf />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Atmosphere</h3>
        </div>
        <button onClick={onClose} className="text-stone-light hover:text-forest p-1.5 hover:bg-forest/5 rounded-lg transition-all active:scale-90">
          <ICONS.X />
        </button>
      </div>

      {loadError && (
        <div className="mx-5 mt-3 p-3 bg-crisis-light text-crisis text-[10px] uppercase font-bold tracking-widest rounded-xl text-center">
          {loadError}
        </div>
      )}

      {/* Track List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
        {AMBIENT_TRACKS.map((track) => {
          const active = currentTrack?.id === track.id;
          const playing = active && isPlaying;
          return (
            <button
              key={track.id}
              onClick={() => toggleTrack(track)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 text-left group active:scale-[0.98] ${
                playing
                  ? 'bg-forest/5 border-forest/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-parchment-light hover:border-forest/8'
              }`}
            >
              <div className={`text-3xl transition-all duration-500 ${playing ? 'scale-110' : 'opacity-50 group-hover:opacity-80'}`}>
                {track.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[11px] font-bold uppercase tracking-widest block truncate ${playing ? 'text-charcoal' : 'text-stone'}`}>
                  {track.name}
                </span>
                <p className="text-[10px] font-light text-stone-light leading-snug truncate">{track.description}</p>
              </div>
              {playing ? (
                <div className="flex gap-[3px] items-end h-5 w-8 flex-shrink-0">
                  {freqData.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-forest rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(15, (val / 255) * 100)}%` }}
                    />
                  ))}
                </div>
              ) : active ? (
                <div className="text-stone-light flex-shrink-0"><ICONS.Pause /></div>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Volume Control */}
      <div className="px-6 pt-4 pb-5 border-t border-forest/6 space-y-3">
        <div className="flex justify-between items-center text-[9px] font-bold text-stone uppercase tracking-[0.25em]">
          <span>Quiet</span>
          <span className="text-charcoal font-display text-sm not-italic">{Math.round(volume * 100)}%</span>
          <span>Full</span>
        </div>
        <input
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>

      <audio ref={audioRef} crossOrigin="anonymous" onAbort={handleAudioError} onError={handleAudioError} style={{ display: 'none' }} />
    </div>
  );
};

export default AmbientPlayer;
