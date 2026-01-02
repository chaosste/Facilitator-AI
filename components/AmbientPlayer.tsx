
import React, { useState, useRef, useEffect } from 'react';
import { AMBIENT_TRACKS } from '../constants';
import { AmbientTrack } from '../types';

interface AmbientPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ isOpen, onClose }) => {
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  const toggleTrack = (track: AmbientTrack) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-24 right-8 w-72 bg-white/80 backdrop-blur-xl border border-[#96adb3]/20 rounded-[2rem] shadow-2xl z-[100] p-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-[#96adb3] uppercase tracking-[0.3em]">Atmosphere</h3>
        <button onClick={onClose} className="text-[#2c3e50]/40 hover:text-[#96adb3] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {AMBIENT_TRACKS.map((track) => {
          const active = currentTrack?.id === track.id;
          return (
            <button
              key={track.id}
              onClick={() => toggleTrack(track)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                active && isPlaying 
                  ? 'bg-[#96adb3]/10 border-[#96adb3] text-[#96adb3]' 
                  : 'bg-white/40 border-transparent hover:border-[#96adb3]/30 text-[#2c3e50]/60'
              }`}
            >
              <span className="text-xl">{track.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest flex-1 text-left">{track.name}</span>
              {active && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-0.5 bg-[#96adb3] animate-[bounce_0.6s_infinite]"></div>
                  <div className="w-0.5 bg-[#96adb3] animate-[bounce_0.8s_infinite]"></div>
                  <div className="w-0.5 bg-[#96adb3] animate-[bounce_0.5s_infinite]"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between text-[8px] font-black text-[#96adb3] uppercase tracking-[0.2em]">
          <span>Silence</span>
          <span>Intensity</span>
        </div>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-[#96adb3] h-1 bg-[#96adb3]/10 rounded-full appearance-none cursor-pointer"
        />
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AmbientPlayer;
