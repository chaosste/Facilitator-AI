
import React from 'react';
import { SessionNote } from '../types';
import { ICONS } from '../constants';

interface SessionNotesProps {
  notes: SessionNote[];
  onDelete: (index: number) => void;
  onClear: () => void;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ notes, onDelete, onClear }) => {
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto space-y-8 overflow-hidden anim-fade-up">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-display italic text-charcoal">Journal</h2>
          <p className="text-xs text-stone tracking-widest uppercase font-medium">A record of your reflective journey</p>
        </div>
        {notes.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-crisis/70 hover:text-crisis transition-colors border border-crisis/15 px-4 py-2 rounded-xl hover:bg-crisis/5 active:scale-[0.97]"
          >
            <ICONS.Trash />
            Clear All
          </button>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6 pb-12">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-12 bg-card border border-dashed border-forest/12 rounded-2xl anim-fade-up anim-delay-1">
            <div className="w-14 h-14 bg-parchment-light rounded-xl flex items-center justify-center mb-5 text-stone-light border border-forest/8">
              <ICONS.Clock />
            </div>
            <h3 className="text-lg font-display italic text-charcoal/60 mb-2">The pages remain blank</h3>
            <p className="text-xs text-stone-light max-w-xs mx-auto leading-relaxed tracking-wide">
              Begin a dialogue or communion session, then ask the facilitator to "archive our reflection" to populate your journal.
            </p>
          </div>
        ) : (
          notes.map((note, idx) => (
            <div
              key={idx}
              className={`bg-card rounded-2xl p-7 md:p-8 border border-forest/8 group hover:border-forest/20 transition-all duration-500 relative overflow-hidden hover:shadow-md anim-fade-up anim-delay-${Math.min(idx + 1, 4)}`}
            >
              {/* Note Header */}
              <div className="flex justify-between items-start mb-6 pb-5 border-b border-forest/5">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-forest">
                    <ICONS.Clock />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">
                      {new Date(note.dateTimeUTC).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-display italic text-charcoal leading-snug">{note.summary}</h3>
                </div>
                <button
                  onClick={() => onDelete(idx)}
                  className="p-2.5 text-stone-light/40 hover:text-crisis transition-all rounded-xl hover:bg-crisis/5 flex-shrink-0 ml-3"
                  title="Delete entry"
                >
                  <ICONS.Trash />
                </button>
              </div>

              {/* Note Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Themes */}
                  <div>
                    <h4 className="text-[9px] font-bold text-forest uppercase tracking-[0.3em] mb-3">Core Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {note.presentingThemes.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 bg-forest/5 border border-forest/12 text-forest text-[9px] uppercase tracking-widest rounded-lg font-bold">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Emotions */}
                  {note.emotionsObserved && note.emotionsObserved.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-bold text-forest uppercase tracking-[0.3em] mb-3">Emotional Landscape</h4>
                      <div className="flex flex-wrap gap-2">
                        {note.emotionsObserved.map((e, i) => (
                          <span key={i} className="px-3 py-1.5 bg-parchment-light border border-forest/8 text-stone text-[9px] uppercase tracking-widest rounded-lg">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Key Quotes */}
                  {note.keyQuotes && note.keyQuotes.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-bold text-forest uppercase tracking-[0.3em] mb-3">Reflections</h4>
                      <div className="p-5 bg-parchment-light rounded-xl italic text-charcoal/70 text-sm border-l-2 border-forest leading-relaxed tracking-wide font-light">
                        &ldquo;{note.keyQuotes[0] || "Silence is sometimes the loudest reflection."}&rdquo;
                      </div>
                    </div>
                  )}

                  {/* Goals */}
                  {note.goalsNextSteps && note.goalsNextSteps.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-bold text-forest uppercase tracking-[0.3em] mb-3">Intentions Forward</h4>
                      <ul className="space-y-2.5">
                        {note.goalsNextSteps.map((step, i) => (
                          <li key={i} className="text-xs text-stone flex gap-3 items-start tracking-wide leading-relaxed">
                            <span className="text-forest text-xs font-bold mt-0.5">&#x2022;</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              {note.skillsApplied && note.skillsApplied.length > 0 && (
                <div className="mt-8 pt-5 border-t border-forest/5 flex flex-wrap justify-between items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex flex-wrap gap-2">
                    {note.skillsApplied.map((skill, i) => (
                      <span key={i} className="text-[8px] uppercase tracking-widest text-stone bg-parchment-light px-2.5 py-1 rounded-full border border-forest/8">{skill}</span>
                    ))}
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.25em] text-forest/60 font-bold italic">UCP Core Skills</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionNotes;
