import "./globals.css";

export const metadata = {
  title: "FlyRank AI · Website Metadata Analyzer",
  description:
    "AI-powered website metadata analyzer using Vercel AI SDK, OpenRouter, and tool calling. Analyze any website's title, description, Open Graph tags, and more.",
  keywords: [
    "AI",
    "metadata analyzer",
    "OpenRouter",
    "Vercel AI SDK",
    "website analysis",
    "SEO",
    "Open Graph",
  ],
  authors: [{ name: "FlyRank" }],
};

// Use environment variable for production, fallback to localhost for dev
export const metadataBase = process.env.NEXT_PUBLIC_APP_URL 
  ? new URL(process.env.NEXT_PUBLIC_APP_URL)
  : new URL("http://localhost:3000");

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Set initial theme before hydration to prevent flash.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}