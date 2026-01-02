
export enum View {
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  NOTES = 'NOTES',
  HOME = 'HOME',
  SETTINGS = 'SETTINGS',
  ATTUNEMENTS = 'ATTUNEMENTS',
  WELCOME = 'WELCOME'
}

export interface VoiceSettings {
  voiceName: string;
  gender: 'feminine' | 'masculine';
  accent: 'UK';
}

export interface SpecialistModule {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  icon: string;
}

export interface AmbientTrack {
  id: string;
  name: string;
  icon: string;
  url: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

export interface SessionNote {
  dateTimeUTC: string;
  presentingThemes: string[];
  emotionsObserved: string[];
  keyQuotes: string[];
  skillsApplied: string[];
  summary: string;
  goalsNextSteps: string[];
}

export interface CrisisResource {
  name: string;
  contact: string;
  description: string;
}
