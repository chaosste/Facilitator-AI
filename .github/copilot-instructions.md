# Facilitator-AI - AI-Powered Conversational Counsellor

Facilitator-AI is a sophisticated React + TypeScript conversational counsellor grounded in the 9 Core Counselling Skills (UCP framework). Features real-time voice interaction via Gemini Live API, empathic text chat, structured session note-taking, and specialist modules for psychedelic integration and harm reduction.

## Build, Test, and Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Architecture

### Application Overview

Facilitator-AI is a therapeutic support platform implementing professional counselling methodologies through AI. The system features:

1. **Text Chat** - Empathic text-based conversations
2. **Live Voice** - Real-time voice counselling with Gemini Live API
3. **Session Notes** - Structured note-taking using function calling
4. **Specialist Modules** - Psychedelic integration, sharing circles, harm reduction
5. **Ambient Soundscapes** - Calming audio backgrounds

### Project Structure

```
components/
├── ChatView.tsx              # Text-based counselling interface
├── LiveVoiceView.tsx         # Real-time voice counselling
├── SessionNotes.tsx          # Session notes journal display
├── HomeView.tsx              # Main navigation hub
├── SettingsView.tsx          # Voice & module configuration
├── AttunementsView.tsx       # Specialist module selection
├── WelcomeView.tsx           # Name collection onboarding
└── AmbientPlayer.tsx         # Background soundscape player

services/
└── geminiCachingService.ts   # Context caching for Gemini

App.tsx                       # Main application shell & state
types.ts                      # TypeScript type definitions
constants.tsx                 # System instructions, modules, avatars
proxyService.ts               # Gemini API proxy integration
vite.config.ts                # Vite configuration
```

### Core Counselling Framework

**UCP 9 Core Counselling Skills:**
1. Active Listening
2. Empathy
3. Nonverbal Awareness
4. Reflection
5. Questioning
6. Summarising
7. Rapport-Building
8. Goal Setting
9. Ethical Boundaries

**Voice attributes:**
- Slower, gentle, deliberate pace
- Frequent pauses
- Soft and warm tone
- UK English accent

**Interaction pattern:**
- Reflect 1-2 emotions per turn
- Ask 1 open question per turn
- Non-judgmental supportive stance

### Specialist Modules

**1. Psychedelic Integration (🌀)**
- Expertise in navigating altered states
- Integration of visionary experiences
- Supports processing of psychedelic journeys

**2. Sharing Circles (⭕)**
- Based on AyaSafe guidelines
- Strict workflow facilitation
- Group integration philosophy
- Includes Tibetan bell function for timing shares

**3. Harm Reduction (🛡️)**
- Ontological shock protocols
- Trauma-informed care
- Existential support
- Safety-focused interventions

**Module system:**
- Dynamically appends to base system instruction
- User toggles modules via Attunements view
- Saved to localStorage: `counselai_active_modules`

### State Management

**LocalStorage-based persistence:**
- Username: `counselai_username`
- Session notes: `counselai_notes`
- Voice settings: `counselai_voice_settings`
- Active modules: `counselai_active_modules`

**Session note structure:**
```typescript
{
  dateTimeUTC: string;
  presentingThemes: string[];
  emotionsObserved: string[];
  keyQuotes: string[];
  skillsApplied: string[];
  summary: string;
  goalsNextSteps: string[];
}
```

### Gemini Live API Integration

**LiveVoiceView workflow:**
1. Initialize WebSocket connection
2. Configure with dynamic system instruction
3. Stream bidirectional audio (16kHz PCM16)
4. Real-time transcript display
5. Function calling for session notes and bell

**Voice options:**
- UK Female: Kore
- UK Male: Puck

**Audio format:**
- Sample rate: 16kHz
- Encoding: PCM16
- Base64 transmission
- MIME type: `audio/pcm;rate=16000`

**Function calling:**
- `writesessionnote`: Creates structured session notes
- `play_bell`: Rings Tibetan singing bowl (for sharing circles)

### Proxy Architecture

**proxyService.ts:**
- Routes Gemini API calls through secure proxy server
- Default URL: `https://gemini-proxy-572556903588.us-central1.run.app`
- Prevents API key exposure in client code
- Configured via `VITE_PROXY_URL` environment variable

**Proxy endpoints:**
- `/v1/generate` - Content generation
- `/health` - Health check

**Usage pattern:**
```typescript
const response = await generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    systemInstruction: dynamicSystemInstruction,
    responseMimeType: 'application/json',
    responseSchema: noteSchema
  }
});
```

### Ambient Soundscapes

**Available tracks:**
- Ancient Forest 🌲
- Gentle Rain 🌧️
- Cosmic Drift ✨
- Ocean Breath 🌊
- Gentle Brook 💧

**Audio source:**
- Public domain files from Google Actions
- OGG format for broad compatibility
- Loop playback for continuous ambience

### Dynamic System Instructions

**Base instruction** includes:
- Foundation 9 counselling skills
- Voice attributes (pace, tone, accent)
- Mandatory greeting with user's name
- Name pronunciation confirmation

**Dynamic personalization:**
- `{userName}` placeholder replaced throughout
- Active modules appended to base instruction
- Real-time instruction regeneration on module toggle

**Example flow:**
```typescript
const dynamicSystemInstruction = useMemo(() => {
  let instruction = BASE_SYSTEM_INSTRUCTION
    .replace(/{userName}/g, userName || 'friend');
  activeModuleIds.forEach(id => {
    const mod = SPECIALIST_MODULES.find(m => m.id === id);
    if (mod) {
      instruction += `\n${mod.systemInstruction.replace(/{userName}/g, userName)}`;
    }
  });
  return instruction;
}, [activeModuleIds, userName]);
```

## Key Conventions

### Environment Variables

**Development (.env.local):**
```bash
VITE_PROXY_URL=https://gemini-proxy-572556903588.us-central1.run.app
```

**Security:**
- No API keys in client code
- All Gemini calls routed through proxy server
- Proxy handles authentication server-side

### TypeScript Configuration

- Target: `ES2022`
- Experimental decorators enabled
- `useDefineForClassFields: false`
- Path alias: `@/*` maps to project root
- Module resolution: `bundler`
- JSX: `react-jsx`

### UI/UX Patterns

**View-based navigation:**
- `WELCOME` - Name collection
- `HOME` - Main navigation hub
- `CHAT` - Text counselling
- `VOICE` - Live voice counselling
- `NOTES` - Session notes journal
- `SETTINGS` - Voice/avatar configuration
- `ATTUNEMENTS` - Specialist module selection

**Color scheme:**
- Primary: `#2c3e50` (dark blue-gray)
- Accent: `#96adb3` (soft teal)
- Backgrounds: White with subtle opacity
- Minimal, calming aesthetic

**Typography:**
- Serif for headings (elegant, professional)
- Sans-serif for body (readable, modern)
- Uppercase tracking for labels (refined, clinical)

### Avatar System

**Gender-based avatars:**
- Feminine: Facilitator female portrait
- Masculine: Facilitator male portrait

**Storage:**
- Hosted in Google Cloud Storage
- High-quality professional portraits
- Synchronized with voice gender selection

### Function Calling Schema

**Session note function:**
```typescript
{
  name: 'writesessionnote',
  parameters: {
    json: {
      dateTimeUTC: string,
      presentingThemes: string[],
      emotionsObserved: string[],
      keyQuotes: string[],
      skillsApplied: string[],
      summary: string,
      goalsNextSteps: string[]
    }
  }
}
```

**Bell function:**
```typescript
{
  name: 'play_bell',
  parameters: {}  // No parameters, just triggers audio
}
```

**Function handling:**
- AI invokes via function calling
- Client executes function locally
- Results stored in state/localStorage
- Bell plays from Cloud Storage URL

## Deployment

### Docker + nginx

**Dockerfile:**
- Multi-stage build (Node builder + nginx)
- Vite build → `/usr/share/nginx/html`
- nginx on port 8080 (Cloud Run standard)

**nginx.conf:**
- SPA routing (all routes → index.html)
- Static file serving

### Cloud Run

**cloudbuild.yaml:**
- Automated builds on push
- Deploy to Cloud Run
- Environment variables for proxy URL

**Production setup:**
```bash
npm run build
docker build -t facilitator-ai .
docker run -p 8080:8080 facilitator-ai
```

## Counselling Methodology

### First Contact Protocol

**Mandatory greeting sequence:**
1. Greet user by name
2. Ask: "Am I pronouncing your name correctly, {userName}?"
3. Wait for confirmation
4. Proceed with supportive conversation

### Response Pattern

**Each AI turn should:**
- Reflect 1-2 emotions observed
- Ask 1 open-ended question
- Avoid judgmental language
- Maintain soft, deliberate pace

**Example:**
```
"It sounds like you're feeling both excited and anxious about this change. 
Can you tell me more about what the anxiety feels like in your body?"
```

### Session Note Creation

**When to create:**
- After meaningful exchanges
- User requests: "archive our reflection"
- End of session
- Significant insights emerge

**Note structure emphasizes:**
- Presenting themes (not diagnoses)
- Emotions observed (not interpretations)
- Key quotes (verbatim when possible)
- Skills applied (from UCP 9)
- Goals and next steps (collaborative)

### Sharing Circles Protocol

**When module active:**
- Facilitator guides group integration
- Tracks share durations
- Rings Tibetan bell at end of shares
- Maintains sacred container
- Follows AyaSafe principles

**Bell timing:**
- AI tracks share duration
- Invokes `play_bell` function
- Audio plays from Cloud Storage
- Signals respectful close of share

## Important Notes

- **Project root**: `/Users/stephenbeale/Projects/Facilitator-AI/`
- **Microphone access**: Required for voice mode, needs HTTPS in production
- **Proxy dependency**: Requires proxy server for Gemini API calls
- **Crisis resources**: App includes crisis hotline information (not shown in current view)
- **Ethical boundaries**: AI reminds users it's not a replacement for professional therapy
- **Data privacy**: All data stays in browser (localStorage), no backend database
- **UK English**: System uses UK spelling and tone throughout
- **Professional framework**: Based on UCP (University Counselling Practice) 9 core skills
- **Specialist knowledge**: Psychedelic integration draws from clinical literature and harm reduction principles
