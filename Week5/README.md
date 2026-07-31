# FlyRank AI · Website Metadata Analyzer

A production-ready AI-powered website metadata analyzer built with Next.js, the Vercel AI SDK, and OpenRouter. Enter any website URL and the AI assistant will fetch and analyze the page's metadata in real time.

## Features

- **AI Chat Interface** — ChatGPT/Claude-inspired conversational UI with streaming responses
- **Website Metadata Analysis** — Extracts title, meta description, Open Graph tags, favicon, and HTTP status
- **Tool Calling** — Server-side tool with Zod schema validation
- **Streaming** — Real-time streaming with `streamText()` from the Vercel AI SDK v7
- **Free Model Fallback** — Automatically switches between free OpenRouter models if one is unavailable
- **Dark Mode** — Full dark mode support with system preference detection
- **Responsive Design** — Works seamlessly on mobile and desktop
- **Auto-scroll** — Smart scroll detection with "Jump to Latest" button
- **Accessibility** — Keyboard navigation, ARIA labels, reduced motion support

## Tech Stack

| Technology | Version |
|---|---|
| Next.js | 14.2.35 (App Router) |
| React | 18.3.1 |
| Vercel AI SDK | 7.0.45 |
| @ai-sdk/react | 4.0.48 |
| @ai-sdk/openai-compatible | 3.0.19 |
| Tailwind CSS | 3.4.10 |
| Zod | 3.25.76 |
| OpenRouter | Free models |

## Getting Started

### Prerequisites

- Node.js 22+
- An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_api_key_here
```

> **Important:** Never hardcode your API key. Always use the environment variable.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
Week5/
├── app/
│   ├── api/chat/route.js    # Streaming chat API with tool calling
│   ├── globals.css          # Global styles, dark mode, animations
│   ├── layout.jsx           # Root layout with fonts and theme
│   └── page.jsx             # Main chat page
├── components/
│   ├── ChatInput.jsx        # URL input with send/stop buttons
│   ├── ChatMessage.jsx      # Message bubbles with avatars
│   ├── ScrollToBottomButton.jsx  # Jump to latest button
│   ├── ThinkingIndicator.jsx     # Loading animation
│   ├── ToolInvocation.jsx   # Tool state cards (4 states)
│   └── WelcomeScreen.jsx    # Welcome screen with suggestions
├── lib/
│   ├── ai.js                # OpenRouter provider + free model fallback
│   └── tools.js             # analyzeWebsite tool with Zod
├── .env.local               # API key (not committed)
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## How It Works

1. **User enters a URL** in the chat input
2. **The AI model** receives the message and decides to call the `analyzeWebsite` tool
3. **The tool** fetches the website, parses the HTML, and extracts:
   - Website title
   - Meta description
   - Open Graph title
   - Open Graph image
   - Favicon
   - HTTP status code
4. **The AI model** receives the tool results and provides a summary
5. **The UI** renders the results as a professional information card

## Tool States

The UI renders four distinct tool states:

| State | Description |
|---|---|
| `input-streaming` | Model is generating tool input (blue loading card) |
| `input-available` | Tool is fetching the website (amber progress card) |
| `output-available` | Results displayed as professional info card (green) |
| `error` | Error displayed with explanation (red card) |

## Deployment

This app is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add `OPENROUTER_API_KEY` as an environment variable
4. Deploy

## License

MIT