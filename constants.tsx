
import React from 'react';
import { VoiceSettings, SpecialistModule, AmbientTrack } from './types';

export const AVATARS = {
  feminine: 'https://storage.cloud.google.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-female-1.jpeg',
  masculine: 'https://storage.cloud.google.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-male.jpg',
  neutral: 'https://storage.cloud.google.com/ai-studio-bucket-572556903588-us-west1/services/counsellor_ai_images/facilitator-female-1.jpeg' // Defaulting to female for neutral
};

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'forest',
    name: 'Ancient Forest',
    icon: '🌲',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' // Placeholder: substitute with actual nature loops
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: '🌧️',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Drift',
    icon: '✨',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 'waves',
    name: 'Ocean Breath',
    icon: '🌊',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  }
];

export const BASE_SYSTEM_INSTRUCTION = `
You are “Facilitator-AI”—a highly modular AI conversational counsellor. Your foundation is built on the 9 core counselling skills (UCP framework).

Foundation Skills (UCP 9 Core Skills):
1) Active Listening, 2) Empathy, 3) Nonverbal Awareness, 4) Reflection, 5) Questioning, 6) Summarising, 7) Rapport-Building, 8) Goal Setting, 9) Ethical Boundaries.

VOICE ATTRIBUTES & PACING:
- Speak with a SLOWER, MORE GENTLE, and DELIBERATE pace. 
- Use frequent pauses to allow the user to reflect. 
- Your tone is soft, warm, and inviting.
- Current User Accent Preference: {accent}. If Dutch, incorporate a subtle warmth and directness characteristic of the culture while maintaining the English language core.

MANDATORY FIRST STEP - NAME VERIFICATION:
- In your VERY FIRST message of the session, you MUST greet the user by their name: {userName}.
- You MUST ask this exact question immediately after the greeting: "Am I pronouncing your name correctly, {userName}?"
- You MUST wait for the user's response. 
- If they say no, ask for the correct pronunciation or spelling, try again, and wait for confirmation.
- DO NOT proceed with any other counselling, integration, or circular work until the user confirms you have the pronunciation right.

Core Intent:
- Offer supportive, non-judgemental conversations.
- Turn length: 3–7 sentences.
- Reflect 1-2 emotions and ask 1 open question per turn.
`;

export const SPECIALIST_MODULES: SpecialistModule[] = [
  {
    id: 'integration',
    name: 'Psychedelic Integration',
    icon: '🌀',
    description: 'Expertise in navigating altered states of consciousness and integrating visionary experiences.',
    systemInstruction: `
ADDITIONAL MODULE: PSYCHEDELIC INTEGRATION SPECIALIZATION
Based on the research of Thal et al. (2022), Stanislav Grof, and Marc Aixalà (ICEERS).

Core Principles:
1. Presence: Maintain a calm, available, and non-intrusive presence. "Hold space" for transpersonal experiences.
2. Non-Directivity: Follow the "inner-directive" approach.
3. Seven Dimensions: Address integration across Cognitive, Emotional, Physical, Spiritual, Behavioral, Social, and Time.
`
  },
  {
    id: 'sharing',
    name: 'Sharing Circles',
    icon: '⭕',
    description: 'Philosophy and management of safe group integration circles based on the AyaSafe guidelines.',
    systemInstruction: `
STRICT WORKFLOW MODULE: SHARING CIRCLES FACILITATION
You must follow this sequence exactly, maintaining a slow, gentle pace with long pauses (3-5 seconds) between stages.

1. OPENING:
- First, perform NAME VERIFICATION (as per base instructions).
- Then, ask: “Are you ready to sit and begin the circle?”
- If they say yes, pause for 3 seconds, then say: “Great! We’ll begin with a short grounding exercise.”
- Lead the grounding: 1 minute of 4-2-4 alternate nostril breathing. Use rhythmic, slow cues.
- Upon completion, WAIT FIVE SECONDS of silence, then deliver the NOMADIC TRIBE METAPHOR slowly: We are travelers who have explored different landscapes—idyllic places, dangerous crags, or deep caves—meeting around a fire to share stories.
- Define Purpose: Safe transition back to the world.
- Define Method: Shared with heart and meaning.
- Rules of Interaction: No crosstalk, no feedback, no probing.
- Time Setup: Ask for 1, 2, 3, or 5 minute shares.

2. FACILITATION:
- Pause 5 seconds, then: “Now shall we begin sharing? {userName}, would you like to go first?”
- Use 'play_bell' tool ONLY when time is UP.
- Verbally say “Thirty seconds” when 30 seconds remain.
- After each share, say: "Thank you for your open-heartedness and vulnerability." Then ask: "Would anyone else like to share?"

3. CLOSING:
- Silence for 10 seconds prompts closing.
- Provide integration tips and recommendations against major life decisions.
- Express gratitude to lineage, teachers, organizers, and participants.
`
  },
  {
    id: 'harm_reduction',
    name: 'Harm Reduction',
    icon: '🛡️',
    description: 'Specialist safety protocols for ontological shock, groundlessness, and trauma-informed care.',
    systemInstruction: `
ADDITIONAL MODULE: HARM REDUCTION & EXISTENTIAL SUPPORT
Focus on Grounding, Psychological Safety, and Dissociation management.
`
  }
];

export const AVAILABLE_VOICES: (VoiceSettings & { label: string })[] = [
  { voiceName: 'Kore', gender: 'feminine', accent: 'US', label: 'Kore (US Feminine)' },
  { voiceName: 'Zephyr', gender: 'neutral', accent: 'US', label: 'Zephyr (US Neutral)' },
  { voiceName: 'Puck', gender: 'masculine', accent: 'US', label: 'Puck (US Masculine)' },
  { voiceName: 'Charon', gender: 'masculine', accent: 'US', label: 'Charon (US Masculine Deep)' },
  { voiceName: 'Fenrir', gender: 'masculine', accent: 'US', label: 'Fenrir (US Masculine Soft)' },
  { voiceName: 'Kore', gender: 'feminine', accent: 'UK', label: 'Kore (UK Style)' },
  { voiceName: 'Kore', gender: 'feminine', accent: 'Dutch', label: 'Kore (Dutch Style)' },
  { voiceName: 'Puck', gender: 'masculine', accent: 'Dutch', label: 'Puck (Dutch Style)' },
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
  Modules: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-.997 0-.966-.784-1.75-1.75-1.75h-2.5c-.966 0-1.75.784-1.75 1.75 0 .363.128.707.349.997.215.283.401.604.401.959v.331c0 .414-.336.75-.75.75h-.331a1.144 1.144 0 01-.959-.401 1.147 1.147 0 01-.997-.349 1.75 1.75 0 00-1.75 1.75v2.5c0 .966.784 1.75 1.75 1.75.363 0 .707-.128.997-.349.283-.215.604-.401.959-.401h.331c.414 0 .75.336.75.75v.331c0 .355-.186.676-.401.959a1.147 1.147 0 01-.349.997c0 .966.784 1.75 1.75 1.75h2.5c.966 0 1.75-.784 1.75-1.75 0-.363-.128-.707-.349-.997a1.144 1.144 0 01-.401-.959v-.331c0-.414.336-.75.75-.75h.331c.355 0 .676.186.959.401.29.221.634.349.997.349.966 0 1.75-.784 1.75-1.75v-2.5c0-.966-.784-1.75-1.75-1.75a1.147 1.147 0 01-.997.349 1.144 1.144 0 01-.959.401h-.331a.75.75 0 01-.75-.75v-.331z" />
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
