
import React from 'react';
import { SessionNote } from '../types';

interface SessionNotesProps {
  notes: SessionNote[];
  onDelete: (index: number) => void;
  onClear: () => void;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ notes, onDelete, onClear }) => {
  return (
    <div className="h-full flex flex-col space-y-10 overflow-hidden animate-in fade-in duration-1000">
      <div className="flex justify-between items-end border-b border-[#d4af37]/10 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic text-[#f4f1ea]">Journal of Becoming</h2>
          <p className="text-[10px] text-[#f4f1ea]/30 uppercase tracking-[0.3em] font-bold">A repository of your internal landscapes.</p>
        </div>
        {notes.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[9px] uppercase tracking-widest font-bold text-red-400/40 hover:text-red-400 transition-colors"
          >
            Purge All Records
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-10 pb-12 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-16 bg-[#111111]/30 rounded-[3rem] border border-dashed border-[#d4af37]/10">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 text-[#d4af37]/20 border border-[#d4af37]/5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#f4f1ea]/60 mb-2">The pages remain blank.</h3>
            <p className="text-xs text-[#f4f1ea]/20 max-w-xs mx-auto leading-relaxed tracking-wider">
              Invoke a dialogue or session, then ask CounselAI to "archive our reflection" to populate your journal.
            </p>
          </div>
        ) : (
          notes.map((note, idx) => (
            <div 
              key={idx} 
              className="bg-[#111111]/50 rounded-[2.5rem] p-10 border border-[#d4af37]/5 group hover:border-[#d4af37]/20 transition-all duration-700 relative overflow-hidden mystic-glass gold-glow"
            >
              {/* Note Header */}
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8">
                <div className="space-y-3">
                  <div className="text-[9px] uppercase tracking-[0.4em] font-black text-[#d4af37] mb-1">
                    {new Date(note.dateTimeUTC).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-serif italic text-[#f4f1ea]">{note.summary}</h3>
                </div>
                <button 
                  onClick={() => onDelete(idx)}
                  className="p-3 text-white/10 hover:text-red-400 transition-all rounded-full hover:bg-red-950/20"
                  title="Expunge Entry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.255H8.084a2.25 2.25 0 01-2.244-2.255L5.67 6.328m10.88 0a48.108 48.108 0 00-12.82 0m12.82 0V4.5a2.25 2.25 0 00-2.25-2.25h-4.5a2.25 2.25 0 00-2.25 2.25V6.328" />
                  </svg>
                </button>
              </div>

              {/* Note Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[8px] font-black text-[#d4af37]/40 uppercase tracking-[0.4em] mb-4">Core Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {note.presentingThemes.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#d4af37]/5 border border-[#d4af37]/10 text-[#d4af37] text-[9px] uppercase tracking-widest rounded-lg font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[8px] font-black text-[#d4af37]/40 uppercase tracking-[0.4em] mb-4">Aura of Sentiment</h4>
                    <div className="flex flex-wrap gap-2">
                      {note.emotionsObserved.map((e, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 text-[#f4f1ea]/60 text-[9px] uppercase tracking-widest rounded-lg">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[8px] font-black text-[#d4af37]/40 uppercase tracking-[0.4em] mb-4">Whispers of Truth</h4>
                    <div className="p-6 bg-[#0a0a0a]/50 rounded-[2rem] italic text-[#f4f1ea]/70 text-sm border-l border-[#d4af37]/20 leading-relaxed tracking-wide font-light">
                      "{note.keyQuotes[0] || "Silence is sometimes the loudest reflection."}"
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[8px] font-black text-[#d4af37]/40 uppercase tracking-[0.4em] mb-4">Intentions Forward</h4>
                    <ul className="space-y-3">
                      {note.goalsNextSteps.map((step, i) => (
                        <li key={i} className="text-[11px] text-[#f4f1ea]/50 flex gap-4 items-start tracking-wide leading-relaxed">
                          <span className="text-[#d4af37] text-xs">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex gap-3">
                  {note.skillsApplied.map((skill, i) => (
                    <span key={i} className="text-[8px] uppercase tracking-widest text-white/20 bg-white/5 px-2 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#d4af37]/40 font-bold italic">Grounded in UCP 9 Core Skills</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionNotes;
