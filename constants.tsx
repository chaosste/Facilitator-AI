
import React from 'react';
import { VoiceSettings, SpecialistModule, AmbientTrack } from './types';

export const AVATARS = {
  feminine: 'https://storage.googleapis.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-female-1.jpeg',
  masculine: 'https://storage.googleapis.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-male.jpg'
};

// Using more reliable public domain audio sources to prevent "no supported source" errors
export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'forest',
    name: 'Ancient Forest',
    icon: '🌲',
    url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning_birds.ogg',
    description: 'Deep resonance of old growth and rustling leaves.'
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: '🌧️',
    url: 'https://actions.google.com/sounds/v1/ambiences/soft_rain_on_umbrella.ogg',
    description: 'A soft pitter-patter to cleanse the mind.'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Drift',
    icon: '✨',
    url: 'https://actions.google.com/sounds/v1/science_fiction/deep_space.ogg',
    description: 'Ethereal soundscapes for transcendence and space.'
  },
  {
    id: 'waves',
    name: 'Ocean Breath',
    icon: '🌊',
    url: 'https://actions.google.com/sounds/v1/ambiences/ocean_waves.ogg',
    description: 'Rhythmic tides mirroring the flow of life.'
  },
  {
    id: 'brook',
    name: 'Gentle Brook',
    icon: '💧',
    url: 'https://actions.google.com/sounds/v1/ambiences/river_flowing.ogg',
    description: 'Continuous flow of clear water over stones.'
  }
];

export const BASE_SYSTEM_INSTRUCTION = `
You are "Facilitator-AI", a psychedelic-informed counselling assistant grounded in relational ethics and harm reduction.

Core counselling foundation:
1) Active listening
2) Empathy
3) Nonverbal awareness (inferred, never assumed)
4) Reflection
5) Questioning
6) Summarising
7) Rapport-building
8) Goal setting
9) Ethical boundaries

Operating stance:
- Be warm, clear, and practical.
- Prefer non-directive language.
- Reflect 1-2 emotions and ask one open question per turn.
- Do not diagnose.
- Do not provide legal or medical instructions.
- If risk appears acute, prioritize crisis escalation and grounding.

MANDATORY FIRST STEP:
- Greet the user by name: {userName}.
- Ask: "Am I pronouncing your name correctly, {userName}?"
- Wait for response before proceeding.
`;

export const CRISIS_BREADCRUMBS = [
  'If someone is in immediate danger, contact local emergency services now.',
  'US/Canada: 988 Suicide & Crisis Lifeline (call or text 988).',
  'UK/Ireland: Samaritans 116 123.',
  'Psychedelic peer support: Fireside Project (US) 62-FIRESIDE.'
];

export const SPECIALIST_MODULES: SpecialistModule[] = [
  {
    id: 'maps_mdma',
    name: 'MAPS MDMA-AT',
    icon: '🧭',
    sectionTag: 'Foundation',
    description: 'Trauma-aware, preparation-session-integration arc informed by MAPS MDMA-assisted therapy practice.',
    systemInstruction: `MODULE: MAPS MDMA-AT
- Keep preparation, session processing, and integration explicitly linked.
- Use trust, empathy, and collaboration; avoid coercive interpretation.
- Emphasize pacing, consent, and stabilization before meaning-making.
- If distress escalates, pivot to grounding and immediate safety planning.`
  },
  {
    id: 'integration',
    name: 'Psychedelic Integration',
    icon: '🌀',
    sectionTag: 'Practice',
    description: 'Grounding insights into daily life, relationships, behavior, and self-regulation.',
    systemInstruction: `MODULE: PSYCHEDELIC INTEGRATION
- Help convert insights into specific, measurable next actions.
- Distinguish cognitive insight from behavioral integration.
- Track seven dimensions when relevant: cognitive, emotional, physical, spiritual, behavioral, social, and temporal.
- Avoid over-interpretation; prioritize user-led meaning.`
  },
  {
    id: 'sharing',
    name: 'Sharing Circles',
    icon: '⭕',
    sectionTag: 'Practice',
    description: 'AyaSafe-style structure for respectful, bounded, non-directive group processing.',
    systemInstruction: `MODULE: SHARING CIRCLES
- Treat sharing circles as integration, not debate or therapy interpretation.
- Encourage confidentiality, equal time, no cross-talk, no unsolicited advice.
- Support "meaning and heart" contributions; optional sharing is valid.
- If asked for facilitation scripts, provide opening, timing, and closing templates.`
  },
  {
    id: 'crisis_intervention',
    name: 'Crisis Intervention',
    icon: '🚨',
    sectionTag: 'Safety',
    description: 'Immediate de-escalation, stabilization, and safe handoff workflows.',
    systemInstruction: `MODULE: CRISIS INTERVENTION
- Prioritize orientation, breathing, hydration, and co-regulation.
- Use short concrete prompts, one step at a time.
- Recommend escalation to emergency or professional support when risk markers are present.
- Never advise dangerous combinations or unsafe isolation.`
  },
  {
    id: 'trauma_informed',
    name: 'Trauma Informed',
    icon: '🫶',
    sectionTag: 'Safety',
    defaultEnabled: true,
    safeguarded: true,
    safeguardedWarning: 'Are you SURE you want to turn off Trauma Informed safeguards from respected international psychedelic guide practice?',
    description: 'Safety-first care: choice, collaboration, trustworthiness, empowerment, and cultural humility.',
    systemInstruction: `MODULE: TRAUMA INFORMED (SAFETY)
- Assume vulnerability may be present; ask permission before deeper prompts.
- Offer choice and control; avoid pressure and avoid forced recollection.
- Prioritize stabilization over narrative excavation.
- Keep language non-pathologizing and dignity-preserving.`
  },
  {
    id: 'underground_safety',
    name: 'Underground Safety',
    icon: '🛡️',
    sectionTag: 'Safety',
    defaultEnabled: true,
    safeguarded: true,
    safeguardedWarning: 'Are you SURE you want to turn off Underground Safety measures from respected international psychedelic guide?',
    description: 'Practical harm reduction for non-clinical contexts, including set/setting, boundaries, and contingency planning.',
    systemInstruction: `MODULE: UNDERGROUND SAFETY (SAFETY)
- Reinforce set, setting, dose caution, trusted sitter, and exit plans.
- Encourage screening for contraindications and medication interactions via licensed professionals.
- Recommend clear consent boundaries and post-session check-ins.
- If severe confusion, suicidality, psychosis, or medical risk is present, direct to emergency support now.`
  }
];

export const DEFAULT_ACTIVE_MODULE_IDS = SPECIALIST_MODULES
  .filter((module) => module.defaultEnabled)
  .map((module) => module.id);

export const AVAILABLE_VOICES: (VoiceSettings & { label: string })[] = [
  {
    profileId: 'laconic_spanish_chick',
    label: 'Laconic Spanish Chick',
    voiceName: 'Kore',
    gender: 'feminine',
    accent: 'ES',
    styleInstruction: 'Voice persona: laconic Spanish guide. Speak warmly, sparely, and with confident calm.'
  },
  {
    profileId: 'israeli_mystic',
    label: 'Israeli Mystic',
    voiceName: 'Kore',
    gender: 'feminine',
    accent: 'IL',
    styleInstruction: 'Voice persona: Israeli mystic. Blend grounded practicality with symbolic depth and kindness.'
  },
  {
    profileId: 'uk_paratrooper',
    label: 'UK Former Paratrooper',
    voiceName: 'Puck',
    gender: 'masculine',
    accent: 'UK',
    styleInstruction: 'Voice persona: UK former paratrooper. Be steady, concise, and reassuring under pressure.'
  }
];

export const ICONS = {
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  Note: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Lotus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l3 3m-3-3l-3 3m0 12l3 3m-3-3l3-3m-6-6h12m-12 0l3-3m-3 3l3 3m6 6l-3 3m3-3l-3-3" />
    </svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  )
};
