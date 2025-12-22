
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
      <div className="flex justify-between items-end border-b border-[#96adb3]/10 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic text-[#2c3e50]">Journal of Becoming</h2>
          <p className="text-[10px] text-[#2c3e50]/40 uppercase tracking-[0.3em] font-bold">A repository of your internal landscapes.</p>
        </div>
        {notes.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[9px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors"
          >
            Purge All Records
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-10 pb-12 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-16 bg-white/40 rounded-[3rem] border border-dashed border-[#96adb3]/20">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-[#96adb3]/30 border border-[#96adb3]/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#2c3e50]/60 mb-2">The pages remain blank.</h3>
            <p className="text-xs text-[#2c3e50]/30 max-w-xs mx-auto leading-relaxed tracking-wider">
              Invoke a dialogue or session, then ask CounselAI to "archive our reflection" to populate your journal.
            </p>
          </div>
        ) : (
          notes.map((note, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-[2.5rem] p-10 border border-[#96adb3]/10 group hover:border-[#96adb3]/40 transition-all duration-700 relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Note Header */}
              <div className="flex justify-between items-start mb-8 border-b border-[#96adb3]/5 pb-8">
                <div className="space-y-3">
                  <div className="text-[9px] uppercase tracking-[0.4em] font-black text-[#96adb3] mb-1">
                    {new Date(note.dateTimeUTC).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-serif italic text-[#2c3e50]">{note.summary}</h3>
                </div>
                <button 
                  onClick={() => onDelete(idx)}
                  className="p-3 text-[#2c3e50]/10 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
                  title="Expunge Entry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.255H8.084a2.25 2.25 0 01-2.244-2.255L5.67 6.328m10.88 0a48.108 48.108 0 00-12.82 0m12.82 0V4.5a2.25 2.25 0 00-2.25-2.25h-4.5a2.25 2.25 0 00-2.25 2.25V6.328" />
                  </svg>
                </button>
              </div>

              {/* Note Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[8px] font-black text-[#96adb3] uppercase tracking-[0.4em] mb-4">Core Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {note.presentingThemes.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#96adb3]/10 border border-[#96adb3]/20 text-[#96adb3] text-[9px] uppercase tracking-widest rounded-lg font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[8px] font-black text-[#96adb3] uppercase tracking-[0.4em] mb-4">Aura of Sentiment</h4>
                    <div className="flex flex-wrap gap-2">
                      {note.emotionsObserved.map((e, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#fdfaf6] border border-[#96adb3]/10 text-[#2c3e50]/60 text-[9px] uppercase tracking-widest rounded-lg">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[8px] font-black text-[#96adb3] uppercase tracking-[0.4em] mb-4">Whispers of Truth</h4>
                    <div className="p-6 bg-[#fdfaf6] rounded-[2rem] italic text-[#2c3e50]/70 text-sm border-l-2 border-[#96adb3] leading-relaxed tracking-wide font-light">
                      "{note.keyQuotes[0] || "Silence is sometimes the loudest reflection."}"
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[8px] font-black text-[#96adb3] uppercase tracking-[0.4em] mb-4">Intentions Forward</h4>
                    <ul className="space-y-3">
                      {note.goalsNextSteps.map((step, i) => (
                        <li key={i} className="text-[11px] text-[#2c3e50]/60 flex gap-4 items-start tracking-wide leading-relaxed">
                          <span className="text-[#96adb3] text-xs font-bold">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-[#96adb3]/5 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex gap-3">
                  {note.skillsApplied.map((skill, i) => (
                    <span key={i} className="text-[8px] uppercase tracking-widest text-[#2c3e50]/40 bg-[#fdfaf6] px-2 py-1 rounded-full border border-[#96adb3]/10">{skill}</span>
                  ))}
                </div>
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#96adb3] font-black italic">UCP Core Skills Foundation</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionNotes;
