# JobPulse AI

<img width="1024" height="254" alt="image" src="https://github.com/user-attachments/assets/afc41742-6a70-41dd-b323-4694b44962a6" />

A conversational AI assistant with recruiter & career intelligence, built with React, Vite, and Tailwind CSS in the style of Claude.ai and ChatGPT.

## Project Structure

```
JobPulse AI/
├── src/
│   ├── components/      # UI components (ChatView, Header, PromptInput, Sidebar, etc.)
│   ├── services/        # AI engines, search resolvers, conversational fallbacks
│   ├── types/           # TypeScript interfaces and type definitions
│   ├── data/            # Preset models and candidate profile data
│   ├── App.tsx          # Root application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets, images, icons
├── index.html           # HTML entry point
├── package.json         # NPM scripts and dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
