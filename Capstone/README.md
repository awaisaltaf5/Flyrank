# FlyRank AI — Website Metadata Analyzer

A production-ready **AI-powered Website Metadata Analyzer** built with **Next.js 14**, **Vercel AI SDK**, and **OpenRouter**. Simply enter any website URL and let the AI fetch, analyze, and summarize the website's metadata in real time through a modern conversational interface.

🌐 **Live Demo:** https://metaspark-ai.vercel.app/

---

## 1. Project Brief

FlyRank AI is a conversational web application that extracts structured metadata from any public website. Instead of manually inspecting page source or using scattered SEO tools, users can paste a URL and receive an organized report containing the page title, meta description, Open Graph tags, Twitter Card data, favicon, HTTP status, and AI-generated observations—all in one chat-driven interface.

## 2. Problem It Solves

- **Manual metadata inspection** is time-consuming and requires technical knowledge.
- **Scattered SEO tools** force users to switch between multiple services.
- **Inconsistent extraction** across different websites and frameworks.
- **No conversational AI layer** to explain what the metadata means and how to improve it.

## 3. Target Users

- SEO specialists and digital marketers
- Web developers and QA engineers
- Content creators and social media managers
- Students and researchers learning about web metadata
- Founders and product managers doing quick website audits

## 4. Why This Idea Was Chosen

Metadata directly impacts how content appears across search engines and social platforms. Building this as an AI chat tool demonstrates:
- Real-world **tool calling** with schema validation
- Streaming AI responses in a conversational UI
- Server-side data fetching with proper error handling
- Accessible, responsive design patterns
- Production-ready deployment on Vercel with OpenRouter

## 5. Features

- 🤖 AI-powered conversational interface
- 🌐 URL validation and normalization
- 📄 Structured metadata extraction:
  - Title & meta description
  - Open Graph tags (title, description, image, type, site name)
  - Twitter Card data
  - Favicon
  - HTTP status & content type
  - Language, author, robots directives
  - Canonical URL
- ⚡ Real-time streaming AI responses
- 🛠️ Server-side tool calling with Zod validation
- 🔄 Automatic fallback between OpenRouter models
- 🌙 Dark mode with system preference detection
- 📱 Fully responsive (mobile, tablet, desktop)
- ⬇️ Smart auto-scroll with "Jump to Latest"
- ♿ Accessibility: ARIA labels, keyboard navigation, focus management
- ⚠️ Missing metadata warnings
- 🔁 Retry mechanism for failed analyses

## 6. Technology Stack

- **Next.js 14 (App Router)**
- **React 18**
- **Vercel AI SDK v7**
- **@ai-sdk/react**
- **@ai-sdk/openai-compatible**
- **OpenRouter**
- **Tailwind CSS**
- **Zod**
- **JavaScript (ES6+)**

## 7. Architecture Overview

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│  Next.js App │────▶│  /api/chat   │
│  (Client)   │◀────│  Router      │◀────│  Route       │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                            ┌─────────────┐
                                            │  AI Tool:   │
                                            │ analyzeWebsite │
                                            └──────┬──────┘
                                                  │
                                                  ▼
                                            ┌─────────────┐
                                            │  OpenRouter │
                                            │  (LLM)      │
                                            └─────────────┘
```

**Flow:**
1. User enters a URL in the chat input or welcome screen.
2. Client-side validation normalizes the URL.
3. The `/api/chat` route streams the conversation using `useChat`.
4. The AI model decides to call the `analyzeWebsite` tool.
5. The server-side tool fetches the target website, extracts metadata, and validates it against a Zod schema.
6. Structured metadata is returned to the AI.
7. The AI summarizes findings and recommendations.
8. The UI renders the structured `ToolInvocation` card with `ResultSections`.

## 8. Folder Structure

```
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # AI streaming endpoint
│   ├── error.jsx                 # Error boundary
│   ├── globals.css               # Global styles
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Home / chat page
├── components/
│   ├── ChatInput.jsx             # Message input with URL validation
│   ├── ChatMessage.jsx           # Message bubble renderer
│   ├── ChatError.jsx             # Error display with retry
│   ├── Icons.jsx                 # Shared memoized SVG icons
│   ├── LoadingSkeleton.jsx       # Placeholder loading state
│   ├── ResultSections.jsx        # Structured metadata display
│   ├── ScrollToBottomButton.jsx  # Scroll control
│   ├── ThinkingIndicator.jsx     # AI thinking state
│   ├── ToolInvocation.jsx        # Tool result card
│   └── WelcomeScreen.jsx         # First-run screen
├── lib/
│   ├── ai.js                     # AI model config (OpenRouter)
│   ├── error-utils.js            # Friendly error messages
│   ├── prompts.js                # System prompt
│   ├── tools.js                  # Tool definitions + Zod schemas
│   ├── url-security.js           # SSRF protection helpers
│   └── url-utils.js              # URL normalization/validation
├── test/
│   ├── setup.js                  # Vitest + jsdom setup
│   ├── url-utils.test.js         # Unit tests for URL utils
│   ├── chat-input.test.jsx       # ChatInput tests
│   ├── result-sections.test.jsx  # ResultSections tests
│   ├── tool-invocation.test.jsx  # ToolInvocation tests
│   └── app-flow.test.jsx         # Primary flow integration tests
├── .env.local                    # Local secrets (ignored)
├── .gitignore
├── AUDIT.md                      # Accessibility & performance audit
├── DEPLOYMENT_CHECKLIST.md       # Pre/post-deploy checklist
├── TESTING.md                    # Test strategy and commands
├── package.json
├── next.config.js
├── tailwind.config.js
├── vitest.config.mjs
└── README.md
```

## 9. Local Setup

### Prerequisites

- **Node.js 22+**
- **npm** (or pnpm/yarn)
- **OpenRouter API Key**

### Installation

```bash
# Clone the repository
git clone https://github.com/awaisaltaf5/Flyrank.git

# Navigate into the project
cd Flyrank/Capstone

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> ⚠️ **Never commit your API key to version control.**

## 10. Run Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Tests
npm test
```

## 11. AI Integration

The app uses the **Vercel AI SDK** (`ai` v7, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) to stream chat completions. The AI model is configured in `lib/ai.js` using OpenRouter as the provider. The SDK handles:
- Streaming text and tool calls
- Message history management
- Error propagation
- Client/server boundary

## 12. OpenRouter Integration

OpenRouter provides access to multiple free-tier models through a single API. The app:
- Reads `OPENROUTER_API_KEY` server-side only.
- Uses `@ai-sdk/openai-compatible` with the OpenRouter base URL.
- Configures model fallbacks in `lib/ai.js`.
- Streams responses via the AI SDK.

## 13. AI System Prompt Purpose

Defined in `lib/prompts.js`, the system prompt:
- Establishes the assistant as a **website metadata analyst**.
- Instructs the model to use the `analyzeWebsite` tool.
- Sets output format expectations (structured, concise, actionable).
- Prevents the model from fabricating metadata when fields are missing.
- Ensures the tool is called exactly once per user request.

## 14. Website Analyzer Tool

Defined in `lib/tools.js`. The `analyzeWebsite` tool:
- Accepts a normalized URL.
- Fetches the page using a secure HTTP client.
- Parses HTML with regex/DOM extraction (no heavy parser dependencies).
- Returns structured metadata plus `missingFields` and `error` fields.

## 15. Tool Input Schema

```ts
{
  url: string // normalized http(s) URL
}
```

Validated with Zod in `lib/tools.js`.

## 16. Tool Output / Return Shape

```ts
{
  url: string;
  finalUrl: string;
  httpStatus: number | null;
  contentType: string | null;
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogSiteName: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  favicon: string | null;
  lang: string | null;
  author: string | null;
  robots: string | null;
  analyzedAt: string | null;
  error: string | null;
  missingFields: string[];
}
```

## 17. Error Handling

- **Client-side**: URL validation errors shown inline with `role="alert"`.
- **Server-side**: Tool failures return structured `error` messages.
- **AI layer**: Friendly error classification in `lib/error-utils.js` and `components/ToolInvocation.jsx`.
- **Network**: Retry button in `ChatError` and `ToolInvocation`.
- **SSRF protection**: `lib/url-security.js` blocks private/reserved IPs and non-HTTP(S) schemes.

## 18. Testing

```bash
npm test
```

- **Unit tests**: URL utilities (`lib/url-utils.js`)
- **Component tests**: `ChatInput`, `ResultSections`, `ToolInvocation`
- **Integration tests**: Primary user flow (`app-flow.test.jsx`)
- **Test framework**: Vitest + React Testing Library
- **Coverage**: 60 tests covering validation, rendering, tool states, error handling, and app flow.

See `TESTING.md` for details.

## 19. Accessibility

- Semantic HTML (`header`, `main`, headings, lists).
- ARIA labels on icon-only buttons.
- `aria-live` regions for streaming tool states and errors.
- `role="alert"` for validation and tool errors.
- Keyboard navigation supported throughout.
- Visible focus states preserved.
- Touch targets ≥ 40×40px.
- Responsive layout with no horizontal overflow.

See `AUDIT.md` for the manual audit results.

## 20. Performance

- Centralized memoized `Icon` component to reduce SVG re-creation.
- Client-side URL validation to avoid unnecessary API calls.
- Minimal dependencies; no heavy parsers.
- Streaming responses reduce time-to-first-token.
- Shared Next.js chunks reduce bundle duplication.

Production First Load JS: ~66.8 kB (main page), shared chunks ~87.3 kB.

## 21. Deployment

### Vercel

1. Push to GitHub.
2. Import repository in Vercel.
3. Add environment variable `OPENROUTER_API_KEY`.
4. Deploy.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key for AI model access |

See `DEPLOYMENT_CHECKLIST.md` for the full pre/post-deploy checklist.

## 22. Known Limitations

- **No automated axe/a11y scan** was performed; accessibility findings are manual.
- **No color-contrast metrics** collected.
- **External metadata images** are not optimized with `next/image` due to missing external loader config.
- **No `aria-busy`** on the input form during submission/streaming.
- **Free OpenRouter models** may have rate limits or latency variability.
- **SSRF protection** blocks private/reserved ranges; some corporate proxies may be affected.
- **Metadata extraction** relies on regex and DOM APIs; extremely malformed HTML may reduce accuracy.

## 23. Future Improvements

- 🌍 Multi-language support
- 📊 SEO score analysis
- 🖼️ Social media preview generation
- 📈 Performance insights (Core Web Vitals)
- 📋 Export metadata as JSON/PDF
- 🔍 Compare metadata between websites
- 🤖 Support for additional AI providers
- ♿ Automated a11y testing (axe, Lighthouse CI)
- 🖼️ `next/image` with external loader for metadata images
- 📱 PWA support

---

# 🚀 Getting Started

## Prerequisites

- Node.js 22+
- OpenRouter API Key

## Installation

```bash
git clone https://github.com/awaisaltaf5/Flyrank.git
cd Flyrank/Capstone
npm install
```

## Environment Variables

```env
OPENROUTER_API_KEY=your_api_key_here
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

---

# 🧪 Testing

```bash
npm test
```

- 60 tests covering URL validation, components, tool states, and primary user flow.
- See `TESTING.md` for test structure and coverage.

---

# 📄 License

MIT

---

# 👨‍💻 Author

**Muhammad Awais Altaf**

- GitHub: https://github.com/awaisaltaf5
- LinkedIn: https://www.linkedin.com/in/awaisaltaf5/

---

# 🙏 Acknowledgements

- OpenRouter
- Vercel AI SDK
- Next.js
- React
- Tailwind CSS
- Zod

---

<div align="center">

### 🤖 Built with ❤️ using Next.js, Vercel AI SDK & OpenRouter

</div>
