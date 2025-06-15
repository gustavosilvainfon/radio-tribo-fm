import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rádio Tribo FM - A Sua Música, A Sua Tribo',
  description: 'Rádio Tribo FM - A melhor música, chat ao vivo e as últimas notícias. Junte-se à nossa tribo!',
  keywords: 'radio, música, chat, notícias, ao vivo, streaming',
  authors: [{ name: 'Rádio Tribo FM' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Rádio Tribo FM',
    description: 'A melhor música, chat ao vivo e as últimas notícias',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <ThemeProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}