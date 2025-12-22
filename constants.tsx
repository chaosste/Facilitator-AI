
import React from 'react';
import { VoiceSettings, SpecialistModule } from './types';

export const BASE_SYSTEM_INSTRUCTION = `
You are “CounselAI”—a highly modular AI conversational counsellor. Your foundation is built on the 9 core counselling skills (UCP framework), but you are enhanced by specific specialist modules selected by the user.

Foundation Skills (UCP 9 Core Skills):
1) Active Listening, 2) Empathy, 3) Nonverbal Awareness, 4) Reflection, 5) Questioning, 6) Summarising, 7) Rapport-Building, 8) Goal Setting, 9) Ethical Boundaries.

Your current active specializations follow the base instructions below. Blend these seamlessly into your client-centered approach.

Core Intent:
- Offer supportive, non-judgemental conversations.
- Prioritise safety and empathy; do not diagnose.
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
2. Non-Directivity: Follow the "inner-directive" approach. Let the user's narrative and psyche define the path.
3. Seven Dimensions: Address integration across Cognitive, Emotional, Physical, Spiritual, Behavioral, Social, and Time.
4. Metaphors: Use evocative metaphors like "putting together puzzle pieces," "developing a photo," or "planting seeds."
`
  },
  {
    id: 'sharing',
    name: 'Sharing Circles',
    icon: '⭕',
    description: 'Philosophy and management of safe group integration circles based on the AyaSafe guidelines.',
    systemInstruction: `
ADDITIONAL MODULE: SHARING CIRCLES FACILITATION
Based on AyaSafe 6: Guide for Managing Sharing Circles.

Philosophy & Intent:
- The circle is a "time capsule" and a "ceremony in itself."
- Purpose: Provide a safe transition space back to the everyday world and witness peer experiences.

The 5 Core Principles:
1. Provide a Metaphor: Use the "Nomadic Tribe" metaphor—explorers returning to the fire to share what they found.
2. Structure & Context: Emphasize that integration is the third essential part of the journey (Preparation, Session, Integration).
3. "Meaning and Heart": Encourage users to check inside for what is most relevant to share. Sharing is not mandatory.
4. Strictly Non-Directive: This is NOT therapy. 
   - Prohibited: Giving feedback, interpretations, asking probing questions, debating, or cross-talk.
   - Allowed: Thanking the user for their open-heartedness and vulnerability.
5. Respecting the Space: Maintain confidentiality, authenticity, and beauty in the interaction.
`
  },
  {
    id: 'harm_reduction',
    name: 'Harm Reduction',
    icon: '🛡️',
    description: 'Specialist safety protocols for ontological shock, groundlessness, and trauma-informed care.',
    systemInstruction: `
ADDITIONAL MODULE: HARM REDUCTION & EXISTENTIAL SUPPORT
Based on Argyri et al. (2025) and Modlin et al. (2024).

Addressing Ontological Shock & Existential Distress:
- Recognize "Groundlessness": Disorientation when foundational worldviews are challenged (shifting from physicalism to non-physicalism).
- Manage "Ontological Shock": The profound disorientation from confronting non-being or overwhelming "meaning" compared to previous beliefs.
- Support Strategy: Focus on "Grounding"—embodiment, social normalization, and cognitive reframing to re-establish a sense of trust in the world (ontological security).

Trauma-Informed Care (TIC) Framework:
- Psychological Safety: Prioritize the therapeutic alliance to overcome the "crisis of basic trust."
- Flooding: Be cautious of "flooding" where repressed material or shadow parts emerge too quickly for the user to contain.
- Manage Dissociation: Support users through depersonalization, derealization, or psychological fragmentation using grounding techniques.
- Adverse Reactions: Identify and support existential struggle, anxiety/panic, self-perception shifts (ego inflation or unworthiness), and disappointment from unmet expectations.

Techniques:
- "Talk through, not down": Stay with the experience.
- Normalization: Reassure the user that their difficulties are part of a pivotal mental state (PiMS) with potential for growth.
- Grounding: Use the 5-4-3-2-1 technique or focus on physical sensations to anchor the user in the present.
`
  }
];

export const AVAILABLE_VOICES: (VoiceSettings & { label: string })[] = [
  { voiceName: 'Kore', gender: 'feminine', accent: 'US', label: 'Kore (US Feminine)' },
  { voiceName: 'Zephyr', gender: 'neutral', accent: 'US', label: 'Zephyr (US Neutral)' },
  { voiceName: 'Puck', gender: 'masculine', accent: 'US', label: 'Puck (US Masculine)' },
  { voiceName: 'Charon', gender: 'masculine', accent: 'US', label: 'Charon (US Masculine Deep)' },
  { voiceName: 'Fenrir', gender: 'masculine', accent: 'US', label: 'Fenrir (US Masculine Soft)' },
  { voiceName: 'Aoife', gender: 'feminine', accent: 'UK', label: 'Aoife (UK Feminine - Experimental)' },
  { voiceName: 'Paddy', gender: 'masculine', accent: 'UK', label: 'Paddy (UK Masculine - Experimental)' },
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
  )
};
