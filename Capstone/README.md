# MetaSpark AI — Website Metadata Analyzer

A production-ready **AI-powered Website Metadata Analyzer** built with **Next.js 14**, **Vercel AI SDK**, and **Groq**. Simply enter any website URL and let the AI fetch, analyze, and summarize the website's metadata in real time through a modern conversational interface.

🌐 **Live Demo:** https://metaspark-ai.vercel.app/

---

# 1. Project Brief

**MetaSpark AI** is a conversational web application that extracts structured metadata from any public website. Instead of manually inspecting page source or using scattered SEO tools, users can paste a URL and receive an organized report containing the page title, meta description, Open Graph tags, Twitter Card data, favicon, HTTP status, and AI-generated observations—all in one chat-driven interface.

---

# 2. Problem It Solves

- Manual metadata inspection is time-consuming and requires technical knowledge.
- Scattered SEO tools force users to switch between multiple services.
- Inconsistent extraction across different websites and frameworks.
- No conversational AI layer to explain what the metadata means and how to improve it.

---

# 3. Target Users

- SEO specialists and digital marketers
- Web developers and QA engineers
- Content creators and social media managers
- Students and researchers learning about web metadata
- Founders and product managers doing quick website audits

---

# 4. Why This Idea Was Chosen

Website metadata directly impacts how content appears across search engines and social platforms. Building this as an AI chat tool demonstrates:

- Real-world **tool calling** with schema validation
- Streaming AI responses in a conversational UI
- Server-side data fetching with proper error handling
- Accessible, responsive design patterns
- Production-ready deployment on Vercel with Groq

---

# 5. Features

- 🤖 AI-powered conversational interface
- 🌐 URL validation and normalization
- 📄 Structured metadata extraction
  - Page title
  - Meta description
  - Open Graph tags
  - Twitter Card tags
  - Canonical URL
  - Robots directives
  - Language
  - Author
  - Favicon
  - HTTP status
  - Content type
- ⚡ Real-time AI streaming responses
- 🛠️ Server-side tool calling with Zod validation
- 🔄 Automatic fallback between Groq models
- 🌙 Dark mode with system preference detection
- 📱 Fully responsive UI
- ⬇️ Smart auto-scroll with "Jump to Latest"
- ♿ Accessibility support
- ⚠️ Missing metadata detection
- 🔁 Retry mechanism for failed analyses

---

# 6. Technology Stack

- Next.js 14 (App Router)
- React 18
- Vercel AI SDK v7
- @ai-sdk/react
- @ai-sdk/openai-compatible
- Groq (API: gsk_...Vgb)
- Tailwind CSS
- Zod
- JavaScript (ES6+)

---

# 7. Architecture Overview

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│  Next.js App │────▶│  /api/chat   │
│  (Client)   │◀────│  Router      │◀────│  Route       │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                            ┌─────────────┐
                                            │ AI Tool     │
                                            │ analyzeWebsite │
                                            └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │ Groq  │
                                            │    LLM      │
                                            └─────────────┘
```

### Flow

1. User enters a website URL.
2. URL is validated and normalized.
3. `/api/chat` streams responses using `useChat`.
4. The AI calls the `analyzeWebsite` tool.
5. The tool securely fetches the webpage.
6. Metadata is extracted and validated using Zod.
7. The AI summarizes findings.
8. Structured metadata is rendered in the UI.

---

# 8. Folder Structure

```text
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js
│   ├── error.jsx
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── ChatInput.jsx
│   ├── ChatMessage.jsx
│   ├── ChatError.jsx
│   ├── Icons.jsx
│   ├── LoadingSkeleton.jsx
│   ├── ResultSections.jsx
│   ├── ScrollToBottomButton.jsx
│   ├── ThinkingIndicator.jsx
│   ├── ToolInvocation.jsx
│   └── WelcomeScreen.jsx
├── lib/
│   ├── ai.js
│   ├── error-utils.js
│   ├── prompts.js
│   ├── tools.js
│   ├── url-security.js
│   └── url-utils.js
├── test/
│   ├── setup.js
│   ├── url-utils.test.js
│   ├── chat-input.test.jsx
│   ├── result-sections.test.jsx
│   ├── tool-invocation.test.jsx
│   └── app-flow.test.jsx
├── .env.local
├── .gitignore
├── AUDIT.md
├── DEPLOYMENT_CHECKLIST.md
├── TESTING.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── vitest.config.mjs
└── README.md
```

---

# 9. Local Setup

## Prerequisites

- Node.js 22+
- npm (or pnpm / yarn)
- Groq API Key

### Installation

```bash
git clone https://github.com/awaisaltaf5/MetaSpark.git

cd MetaSpark

npm install
```

---

# 10. Environment Variables

Create `.env.local`

```env
GROQ_API_KEY=your_groq_api_key_here
```

> Never commit API keys.

---

# 11. Run Commands

```bash
npm run dev

npm run build

npm start

npm run lint

npm test
```

---

# 12. AI Integration

MetaSpark AI uses the **Vercel AI SDK** together with **Groq** to stream conversational responses.

The SDK manages:

- Streaming text
- Tool calls
- Message history
- Error propagation
- Client/server communication

---

# 13. Groq Integration

Groq provides fast access to multiple LLMs through one API.

The application:

- Reads the API key server-side only
- Uses the OpenAI-compatible provider
- Configures fallback models
- Streams responses with AI SDK

---

# 14. AI System Prompt

The system prompt:

- Defines the assistant as a website metadata expert
- Forces use of the `analyzeWebsite` tool
- Produces concise and structured responses
- Prevents fabricated metadata
- Ensures one tool call per request

---

# 15. Website Analyzer Tool

The `analyzeWebsite` tool:

- Accepts a normalized URL
- Fetches the webpage securely
- Extracts metadata
- Validates data using Zod
- Returns structured metadata plus missing fields and errors

---

# 16. Tool Input

```ts
{
  url: string
}
```

---

# 17. Tool Output

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
  ogImage: string |null;
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

---

# 18. Error Handling

- Client-side URL validation
- Structured server-side errors
- Friendly AI error messages
- Retry support
- SSRF protection
- Reserved IP blocking
- HTTP(S) only enforcement

---

# 19. Testing

```bash
npm test
```

Includes:

- URL utility tests
- Component tests
- Integration tests
- Vitest
- React Testing Library

Coverage:

- 60+ tests

---

# 20. Accessibility

- Semantic HTML
- ARIA labels
- Live regions
- Keyboard navigation
- Focus management
- Large touch targets
- Responsive layouts

---

# 21. Performance

- Memoized icons
- Lightweight metadata parser
- Streaming responses
- Client-side validation
- Optimized shared chunks

Production First Load JS

- Main page ≈66.8 kB
- Shared chunks ≈87.3 kB

---

# 22. Deployment

## Vercel

**Live Demo:** https://metaspark-ai.vercel.app/

1. Push repository to GitHub.
2. Import into Vercel.
3. Add environment variable (get your key from [Groq Console](https://console.groq.com/keys)):

```
GROQ_API_KEY=your_groq_api_key_here
```

4. Deploy.

---

# 23. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GROQ_API_KEY | Yes | Groq API key |

---

# 24. Known Limitations

- Manual accessibility audit only
- No automated axe testing
- No Lighthouse CI
- Regex-based metadata parsing
- Free model rate limits
- External OG images not optimized
- No aria-busy during streaming

---

# 25. Future Improvements

- 🌍 Multi-language support
- 📊 SEO scoring
- 🖼️ Social preview generation
- 📈 Core Web Vitals
- 📋 Export as JSON/PDF
- 🔍 Compare multiple websites
- 🤖 Additional AI providers
- ♿ Automated accessibility testing
- 🖼️ next/image optimization
- 📱 Progressive Web App (PWA)

---

# 🚀 Getting Started

## Requirements

- Node.js 22+
- Groq API Key

## Clone

```bash
git clone https://github.com/awaisaltaf5/MetaSpark.git

cd MetaSpark

npm install
```

Create

```env
GROQ_API_KEY=your_groq_api_key_here
```

Run

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

Production

```bash
npm run build

npm start
```

---

# 🧪 Testing

```bash
npm test
```

Includes over **60 tests** covering validation, components, tool invocation, error handling, and the complete application flow.

---

# 📄 License

MIT

---

# 👨‍💻 Author

**Muhammad Awais Altaf**

GitHub: https://github.com/awaisaltaf5

LinkedIn: https://www.linkedin.com/in/awaisaltaf5/

---

# 🙏 Acknowledgements

- Groq
- Vercel AI SDK
- Next.js
- React
- Tailwind CSS
- Zod

---

<div align="center">

## ✨ MetaSpark AI

### AI-powered Website Metadata Analyzer

Built with ❤️ using Next.js, Vercel AI SDK & Groq

</div>

