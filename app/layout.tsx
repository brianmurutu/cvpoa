import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CVPoa — AI Resume Builder for East Africa',
    template: '%s | CVPoa',
  },
  description:
    'Build ATS-optimized CVs and cover letters in minutes. Pay via M-Pesa. Built for East Africa. 🇰🇪',
  keywords: ['CV builder', 'resume builder', 'ATS', 'M-Pesa', 'Kenya', 'East Africa', 'cover letter'],
  openGraph: {
    title: 'CVPoa — AI Resume Builder for East Africa',
    description: 'Build ATS-optimized CVs and cover letters in minutes. Pay via M-Pesa.',
    siteName: 'CVPoa',
    locale: 'en_KE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased font-body">
        {children}
      </body>
    </html>
  )
}
