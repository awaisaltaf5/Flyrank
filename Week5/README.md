# 🤖 FlyRank AI — Website Metadata Analyzer

A production-ready **AI-powered Website Metadata Analyzer** built with **Next.js 14**, **Vercel AI SDK**, and **OpenRouter**. Simply enter any website URL and let the AI fetch, analyze, and summarize the website's metadata in real time through a modern conversational interface.

🌐 **Live Demo:** https://ai-website-analyzer-nu.vercel.app/

---

# ✨ Features

- 🤖 AI-powered conversational interface inspired by ChatGPT & Claude
- 🌐 Analyze any website by simply entering its URL
- 📄 Extract website metadata including:
  - Title
  - Meta Description
  - Open Graph Title
  - Open Graph Image
  - Favicon
  - HTTP Status Code
- ⚡ Real-time streaming AI responses using the Vercel AI SDK
- 🛠️ Server-side Tool Calling with Zod schema validation
- 🔄 Automatic fallback between free OpenRouter AI models
- 🌙 Dark Mode with system preference detection
- 📱 Fully Responsive (Mobile, Tablet & Desktop)
- ⬇️ Smart Auto Scroll with "Jump to Latest" button
- ♿ Accessibility support (ARIA labels, keyboard navigation & reduced motion)

---

# 🛠️ Tech Stack

- **Next.js 14 (App Router)**
- **React 18**
- **Vercel AI SDK v7**
- **@ai-sdk/react**
- **@ai-sdk/openai-compatible**
- **OpenRouter**
- **Tailwind CSS**
- **Zod**
- **JavaScript (ES6+)**

---

# 🤖 AI Provider

## OpenRouter

The application uses **OpenRouter** to access multiple free AI models.

### Features

- Automatic free-model fallback
- Streaming responses
- Tool calling support
- Production-ready API integration

---

# 🛠️ AI Tool

## Website Metadata Analyzer

The AI tool extracts and analyzes:

- 🌐 Website Title
- 📝 Meta Description
- 🖼️ Open Graph Image
- 📌 Open Graph Title
- 🎯 Favicon
- 📡 HTTP Status Code

The extracted metadata is summarized by the AI and presented inside an elegant chat interface.

---

# 📸 Screenshots

Dekstop view:
<img width="953" height="475" alt="image" src="https://github.com/user-attachments/assets/ce947d67-81c1-4869-880f-f0c37926ce06" />

Mobile View:
<img width="702" height="1600" alt="WhatsApp Image 2026-08-01 at 2 40 59 AM" src="https://github.com/user-attachments/assets/60c13a16-e406-4941-b17e-4ecc1b168160" />



---

# 📂 Project Structure

```bash
Week5/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
│
├── components/
│   ├── ChatInput.jsx
│   ├── ChatMessage.jsx
│   ├── ScrollToBottomButton.jsx
│   ├── ThinkingIndicator.jsx
│   ├── ToolInvocation.jsx
│   └── WelcomeScreen.jsx
│
├── lib/
│   ├── ai.js
│   └── tools.js
│
├── .env.local
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

# ⚙️ How It Works

```text
User enters Website URL
          │
          ▼
 AI receives prompt
          │
          ▼
 AI invokes analyzeWebsite Tool
          │
          ▼
 Website is fetched
          │
          ▼
 Metadata extracted
          │
          ▼
 AI summarizes results
          │
          ▼
 Beautiful metadata card rendered
```

---

# 🔄 Tool States

| State | Description |
|--------|-------------|
| 🔵 Input Streaming | AI prepares tool input |
| 🟡 Fetching | Website metadata is being fetched |
| 🟢 Success | Metadata displayed successfully |
| 🔴 Error | Website could not be analyzed |

---

# 🚀 Getting Started

## Prerequisites

- Node.js 22+
- OpenRouter API Key

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/flyrank-ai.git
```

Navigate to the project

```bash
cd flyrank-ai
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env.local` file.

```env
OPENROUTER_API_KEY=your_api_key_here
```

> ⚠️ Never commit your API key to GitHub.

---

## Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
npm start
```

---

# 🧠 Key Concepts Demonstrated

- AI Chat Interface
- Streaming Responses
- Tool Calling
- Server-side AI Tools
- Vercel AI SDK v7
- OpenRouter Integration
- Zod Schema Validation
- Async Data Fetching
- Responsive Design
- Accessibility
- Modern UI/UX

---

# 🚀 Deployment

The application is deployed on **Vercel**.

🌐 **Live Demo**

https://ai-website-analyzer-nu.vercel.app/

---

# 🔮 Future Improvements

- 🌍 Multi-language support
- 📊 SEO score analysis
- 🖼️ Social media preview generation
- 📈 Performance insights
- 📋 Export metadata as JSON/PDF
- 🔍 Compare metadata between websites
- 🤖 Support for additional AI providers

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 👨‍💻 Author

**Muhammad Awais Altaf**

GitHub:  
https://github.com/awaisaltaf5

---

# 🙏 Acknowledgements

Special thanks to:

- OpenRouter
- Vercel AI SDK
- Next.js
- React
- Tailwind CSS
- Zod

---

# ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

---

<div align="center">

### 🤖 Built with ❤️ using Next.js, Vercel AI SDK & OpenRouter

### 🌐 Live Demo

https://ai-website-analyzer-nu.vercel.app/

</div>
