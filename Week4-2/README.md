# AI Chat Application

A modern, premium AI chat application with a sleek dark/light mode interface, built with Next.js 14, Tailwind CSS, and AI SDK.

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-cyan)
![AI SDK](https://img.shields.io/badge/AI_SDK-7.0.37-green)

## 🎯 Live Demo

**Production URL**: [https://ai-chat-made-by-awais-icnswxb5a-muhammad-awais-altafs-projects.vercel.app/](https://ai-chat-made-by-awais.vercel.app/)

## ✨ Features

- 🎨 **Premium UI/UX Design**: Modern, minimalist interface inspired by leading platforms (Claude, ChatGPT, Grok, Perplexity)
- 🌓 **Dark/Light Mode**: Fully functional theme toggle with smooth transitions
- 💬 **Real-time AI Streaming**: Powered by AI SDK with Groq and Google integrations
- 📱 **Fully Responsive**: Optimized for desktop ($1440px+$), laptop ($1024px$), tablet ($768px$), and mobile ($375px$)
- 💾 **Chat History**: Persistent localStorage-based chat history with edit/delete functionality
- ⚡ **Smooth Animations**: Premium micro-interactions, hover states, and transitions
- 🎯 **Glassmorphism Design**: Translucent panels with backdrop blur effects
- ⌨️ **Keyboard Accessible**: Full WCAG AA compliance with proper ARIA attributes

## 🎨 Design System

### Color Palette

**Dark Mode (Default)**:
- Backgrounds: Deep slate (#0B0F17, #0F1419, #161B22)
- Accents: Electric Blue (#3B82F6) and Neon Violet (#8B5CF6)
- Text Hierarchy: Primary (#F1F5F9), Secondary (#94A3B8), Muted (#64748B)

**Light Mode**:
- Backgrounds: Clean whites and slate-50
- Accents: Same electric gradients
- Text Hierarchy: Dark slate tones

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono for code blocks
- **Scale**: Responsive text sizing with proper line heights and kerning

### Animations
- Fade effects (fadeIn, fadeInDown, fadeInUp)
- Slide transitions (slideInLeft, slideInRight, slideUp)
- Glow effects (pulseGlow, borderGlow)
- Typing indicators for AI responses
- Smooth 200-300ms cubic-bezier transitions

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/awaisaltaf5/Flyrank.git
cd Flyrank/Week5
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

### Core
- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS 3.4.19
- **Font**: Inter + JetBrains Mono

### AI & Streaming
- **AI SDK**: @ai-sdk/react 4.0.40
- **Providers**: Groq, Google AI
- **Markdown**: react-markdown 10.1.0

### Development
- **Linting**: ESLint
- **CSS Processing**: PostCSS with Autoprefixer
- **Package Manager**: npm

## 📁 Project Structure

```
Week5/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # AI chat API endpoint
│   ├── globals.css                # Global styles, animations, theme variables
│   ├── layout.js                  # Root layout component
│   └── page.js                    # Main chat page
├── lib/
│   └── ai.js                      # AI configuration
├── .env.local                     # Environment variables
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🎯 Key Components

### Sidebar
- Collapsible navigation rail
- Chat history grouped by date
- New chat button with gradient styling
- Edit/delete chat functionality
- Smooth slide animations

### Chat Area
- Centered max-width container (max-w-4xl)
- User prompts: gradient bubbles with glow effects
- AI responses: glassmorphic cards with backdrop blur
- Typing indicators with animated dots
- Auto-scroll with "Jump to Latest" button
- Custom Markdown rendering with syntax highlighting

### Input Dock
- Floating glass container
- Auto-expanding text field
- Send/Stop toggle buttons
- Attachment button (UI ready)
- Focus-within border glow effect

### Theme Toggle
- Fixed position button (top-right)
- Sun/Moon icons
- localStorage persistence
- Smooth theme transitions
- System-wide class toggle

## 🎨 Customization

### Theme Variables

All theme colors are defined as CSS variables in `app/globals.css`:

```css
:root {
  --bg-primary: #0B0F17;
  --bg-secondary: #0F1419;
  --accent-blue: #3B82F6;
  --accent-purple: #8B5CF6;
  --text-primary: #F1F5F9;
  /* ... */
}

.light {
  --bg-primary: #F8FAFC;
  --text-primary: #0F172A;
  /* ... */
}
```

### Tailwind Configuration

Custom animations and colors are extended in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'slate-950': '#0B0F17',
      'accent-blue': '#3B82F6',
      'accent-purple': '#8B5CF6',
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-out',
      'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      // ...
    }
  }
}
```

## 📱 Responsive Breakpoints

- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px
- **Laptop**: 1024px - 1439px
- **Desktop**: 1440px+

## ♿ Accessibility

- Semantic HTML5 elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📸 Screenshots
<img width="959" height="475" alt="1" src="https://github.com/user-attachments/assets/95621c0b-6590-46bb-ba9f-a7e7aed1f862" />


### Dark Mode
- Deep slate background with gradient orbs
- Glassmorphic sidebar with frosted effect
- Gradient user message bubbles with glow
- Smooth animations throughout

### Light Mode
- Clean slate-50 background
- White sidebar with subtle shadows
- Same gradient accents with adjusted opacity
- Professional light theme

## 🚢 Deployment

Build and deploy to Vercel:

```bash
npm run build
```

Or deploy directly using Vercel CLI:

```bash
vercel deploy
```

## 📝 License

This project is part of the Flyrank internship program.

## 👨‍💻 Author

**Muhammad Awais Altaf**

## 🔗 Links

- **Live Demo**: [https://ai-chat-made-by-awais-icnswxb5a-muhammad-awais-altafs-projects.vercel.app/](https://ai-chat-made-by-awais.vercel.app/)
- **GitHub Repository**: https://github.com/awaisaltaf5/Flyrank

---

Made with ❤️ as part of the Flyrank AI Internship Program
