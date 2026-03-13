# Amkyaw.Dev AI Platform

A modern AI platform with multiple AI models, authentication, and powerful tools.

## Features

- 🔐 **Firebase Authentication** - Login, Register, Password Reset
- 💬 **AI Chat** - Chat with ChatGPT, Gemini, DeepSeek, Claude, Llama, Mixtral
- 💻 **Code Generator** - Generate code in multiple languages
- 🌍 **Translator** - Translate between 100+ languages
- 📄 **Summarizer** - Summarize long text
- 🎭 **Roleplay** - AI character roleplay
- 📱 **Mobile Responsive** - Works on all devices
- ⚡ **3D Design** - Modern floating orbs and glassmorphism

## Tech Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript (ES6 Modules)
- **Auth**: Firebase Authentication
- **AI API**: https://ai.amkyaw.workers.dev

## Project Structure

```
amkyawdev/
├── index.html              # Landing page
├── auth/
│   ├── login.html        # Login page
│   ├── register.html     # Register page
│   └── reset.html       # Password reset
├── pages/
│   ├── chat.html        # AI Chat
│   ├── coder.html       # Code Generator
│   ├── translate.html    # Translator
│   ├── summarize.html   # Summarizer
│   ├── roleplay.html    # Roleplay
│   └── docs.html       # API Docs
├── components/          # UI Components (future)
├── layouts/             # Page layouts (future)
├── styles/
│   └── main.css        # Custom styles
├── js/
│   ├── core/           # Core system
│   ├── engine/         # AI logic
│   ├── services/       # API services
│   ├── ui/            # UI controls
│   └── utils/         # Utilities
├── assets/
│   ├── images/
│   └── icons/
└── config/
    ├── api.config.js   # API config
    └── firebase.config.js # Firebase config
```

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Or serve with a local server

## Firebase Setup

Update `config/firebase.config.js` with your Firebase config:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## API Usage

```bash
# Chat
curl "https://ai.amkyaw.workers.dev/?mode=chat&msg=Hello&model=gpt-4o"

# Code
curl "https://ai.amkyaw.workers.dev/?mode=code&msg=Python%20hello%20world"

# Translate
curl "https://ai.amkyaw.workers.dev/?mode=translate&lang=ja&msg=Hello"
```

## Available Models

- ChatGPT-4o (OpenAI)
- Gemini 1.5 Pro (Google)
- DeepSeek V3 (DeepSeek)
- Claude 3.5 (Anthropic)
- Llama 3.1 (Meta)
- Mixtral 8x7B (Mistral)

## License

MIT
