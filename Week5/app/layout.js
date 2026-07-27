import './globals.css'

export const metadata = {
  title: 'AI Streaming Chat',
  description: 'Production-ready AI streaming chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<body className="antialiased bg-slate-950">
        {children}
      </body>
    </html>
  )
}
