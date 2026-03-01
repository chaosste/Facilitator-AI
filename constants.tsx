
import React from 'react';
import { VoiceSettings, SpecialistModule, AmbientTrack } from './types';

export const AVATARS = {
  feminine: 'https://storage.googleapis.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-female-1.jpeg',
  masculine: 'https://storage.googleapis.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-male.jpg'
};

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'forest',
    name: 'Ancient Forest',
    icon: '\u{1F332}',
    url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning_birds.ogg',
    description: 'Deep resonance of old growth and rustling leaves.'
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: '\u{1F327}\u{FE0F}',
    url: 'https://actions.google.com/sounds/v1/ambiences/soft_rain_on_umbrella.ogg',
    description: 'A soft pitter-patter to cleanse the mind.'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Drift',
    icon: '\u{2728}',
    url: 'https://actions.google.com/sounds/v1/science_fiction/deep_space.ogg',
    description: 'Ethereal soundscapes for transcendence and space.'
  },
  {
    id: 'waves',
    name: 'Ocean Breath',
    icon: '\u{1F30A}',
    url: 'https://actions.google.com/sounds/v1/ambiences/ocean_waves.ogg',
    description: 'Rhythmic tides mirroring the flow of life.'
  },
  {
    id: 'brook',
    name: 'Gentle Brook',
    icon: '\u{1F4A7}',
    url: 'https://actions.google.com/sounds/v1/ambiences/river_flowing.ogg',
    description: 'Continuous flow of clear water over stones.'
  }
];

export const BASE_SYSTEM_INSTRUCTION = `
You are "Facilitator-AI"\u2014a conversational counsellor. Your foundation is built on the 9 core counselling skills (UCP framework).

Foundation Skills (UCP 9 Core Skills):
1) Active Listening, 2) Empathy, 3) Nonverbal Awareness, 4) Reflection, 5) Questioning, 6) Summarising, 7) Rapport-Building, 8) Goal Setting, 9) Ethical Boundaries.

VOICE ATTRIBUTES:
- Speak with a SLOWER, MORE GENTLE, and DELIBERATE pace.
- Use frequent pauses.
- Your tone is soft and warm.
- Accent: {accentProfile}

MANDATORY FIRST STEP:
- Greet the user by their name: {userName}.
- Ask: "Am I pronouncing your name correctly, {userName}?"
- Wait for the user's response before proceeding.

Core Intent:
- Offer supportive, non-judgemental conversations.
- Reflect 1-2 emotions and ask 1 open question per turn.
`;

export const getAccentProfile = (accent: VoiceSettings['accent']): string => {
  if (accent === 'Levantine-English') {
    return 'fluent English with a gentle Levantine/Mediterranean inflection, keeping pronunciation clear and natural';
  }
  return 'fluent UK English with calm, measured diction';
};

export const SPECIALIST_MODULES: SpecialistModule[] = [
  {
    id: 'integration',
    name: 'Psychedelic Integration',
    icon: '\u{1F300}',
    description: 'Expertise in navigating altered states and integrating visionary experiences.',
    systemInstruction: `ADDITIONAL MODULE: PSYCHEDELIC INTEGRATION SPECIALIZATION...`
  },
  {
    id: 'sharing',
    name: 'Sharing Circles',
    icon: '\u{2B55}',
    description: 'Philosophy of safe group integration based on AyaSafe guidelines.',
    systemInstruction: `STRICT WORKFLOW MODULE: SHARING CIRCLES FACILITATION...`
  },
  {
    id: 'harm_reduction',
    name: 'Harm Reduction',
    icon: '\u{1F6E1}\u{FE0F}',
    description: 'Specialist safety protocols for ontological shock and trauma-informed care.',
    systemInstruction: `ADDITIONAL MODULE: HARM REDUCTION & EXISTENTIAL SUPPORT...`
  }
];

export const AVAILABLE_VOICES: (VoiceSettings & { label: string })[] = [
  { voiceName: 'Kore', gender: 'feminine', accent: 'UK', label: 'UK Female' },
  { voiceName: 'Puck', gender: 'masculine', accent: 'UK', label: 'UK Male' },
  { voiceName: 'Kore', gender: 'feminine', accent: 'Levantine-English', label: 'Levantine Female' },
  { voiceName: 'Puck', gender: 'masculine', accent: 'Levantine-English', label: 'Levantine Male' }
];

// --- SVG Icon Components ---
const svgBase = { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" };

export const ICONS = {
  Logo: ({ size = 22 }: { size?: number } = {}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: size, height: size }}>
      {/* Cupped hands */}
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        d="M7 16.5c-1.5-.8-3-2.5-3-5 0-1.8 1-3.2 2.2-4M17 16.5c1.5-.8 3-2.5 3-5 0-1.8-1-3.2-2.2-4" />
      {/* Seedling / flame */}
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        d="M12 20v-6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        d="M12 14c0-3.5 2.5-5.5 2.5-8.5C14.5 3 12 2 12 2s-2.5 1-2.5 3.5C9.5 8.5 12 10.5 12 14z" />
      {/* Small leaves */}
      <path stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
        d="M12 16c-1.2-.3-3-.2-3.5 1.5M12 16c1.2-.3 3-.2 3.5 1.5" />
    </svg>
  ),
  Home: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Chat: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h3l5 4 5-4h3a2 2 0 002-2V4a2 2 0 00-2-2z" />
      <path strokeLinecap="round" d="M8 9h8M8 13h5" />
    </svg>
  ),
  Mic: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8" />
    </svg>
  ),
  Book: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  Leaf: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 019.8 6.9C15.5 6.9 20 3 20 3s-3 4.5-3 10.1A4.94 4.94 0 0111 20zM6.7 17.3l9.6-9.6" />
    </svg>
  ),
  Sliders: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </svg>
  ),
  LifeBuoy: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
    </svg>
  ),
  X: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Play: () => (
    <svg {...svgBase} className="w-5 h-5">
      <polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none" />
    </svg>
  ),
  Pause: () => (
    <svg {...svgBase} className="w-5 h-5">
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Send: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  ),
  Check: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6L9 17l-5-5" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  Trash: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
    </svg>
  ),
  Key: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  User: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Eye: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <path strokeLinecap="round" d="M1 1l22 22" />
    </svg>
  ),
  Volume: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  ),
  ExternalLink: () => (
    <svg {...svgBase} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  ),
  Heart: () => (
    <svg {...svgBase} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Info: () => (
    <svg {...svgBase} className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Phone: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Globe: () => (
    <svg {...svgBase} className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M2 12h20" />
      <path strokeLinecap="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  Clock: () => (
    <svg {...svgBase} className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  ),
  Shield: () => (
    <svg {...svgBase} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Coffee: () => (
    <svg {...svgBase} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  Note: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  Settings: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </svg>
  ),
  Lotus: () => (
    <svg {...svgBase} className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 019.8 6.9C15.5 6.9 20 3 20 3s-3 4.5-3 10.1A4.94 4.94 0 0111 20zM6.7 17.3l9.6-9.6" />
    </svg>
  ),
};
