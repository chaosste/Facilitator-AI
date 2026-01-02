
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
    <div className="absolute top-24 right-8 w-80 max-h-[75vh] bg-white/90 backdrop-blur-2xl border border-[#96adb3]/20 rounded-[2.5rem] shadow-2xl z-[100] p-8 animate-in fade-in zoom-in duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
           <ICONS.Lotus />
           <h3 className="text-[10px] font-black text-[#96adb3] uppercase tracking-[0.4em]">Ambient Field</h3>
        </div>
        <button onClick={onClose} className="text-[#2c3e50]/30 hover:text-[#96adb3] transition-colors p-2 hover:bg-[#96adb3]/5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {AMBIENT_TRACKS.map((track) => {
          const active = currentTrack?.id === track.id;
          return (
            <button
              key={track.id}
              onClick={() => toggleTrack(track)}
              className={`w-full flex items-center gap-6 p-6 rounded-[2rem] border transition-all duration-700 text-left relative overflow-hidden group ${
                active && isPlaying 
                  ? 'bg-white border-[#96adb3] shadow-lg' 
                  : 'bg-white/40 border-transparent hover:border-[#96adb3]/20 text-[#2c3e50]/60'
              }`}
            >
              <div className={`text-4xl transition-transform duration-700 ${active && isPlaying ? 'scale-110' : 'group-hover:scale-110 opacity-60'}`}>
                {track.icon}
              </div>
              <div className="flex-1 space-y-1">
                <span className={`text-xs font-bold uppercase tracking-widest block transition-colors ${active && isPlaying ? 'text-[#2c3e50]' : ''}`}>
                  {track.name}
                </span>
                <p className="text-[10px] font-light opacity-60 leading-tight">
                  {track.description}
                </p>
              </div>
              {active && isPlaying && (
                <div className="flex gap-1 items-end h-5 w-8">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#96adb3] rounded-full animate-bounce"
                      style={{ animationDuration: `${0.5 + Math.random() * 0.5}s`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-[#96adb3]/10 space-y-6">
        <div className="flex justify-between items-center text-[9px] font-black text-[#96adb3] uppercase tracking-[0.3em]">
          <span>Silence</span>
          <div className="flex items-center gap-2">
            <span className="opacity-40">Volume</span>
            <span className="text-[#2c3e50]">{Math.round(volume * 100)}%</span>
          </div>
          <span>Atmosphere</span>
        </div>
        <div className="relative h-6 flex items-center">
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#96adb3]/10 rounded-full appearance-none cursor-pointer accent-[#96adb3]"
          />
        </div>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AmbientPlayer;
