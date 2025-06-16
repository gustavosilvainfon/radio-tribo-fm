import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'
import { RadioProvider } from '@/context/RadioContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rádio Tribo FM - A Sua Música, A Sua Tribo',
  description: 'Rádio Tribo FM - A melhor música, chat ao vivo, notícias atualizadas e programação especial. Ouça ao vivo 24/7 e junte-se à nossa tribo musical!',
  keywords: 'radio, música, ao vivo, streaming, chat, notícias, sertanejo, pop, rock, tribo fm, rádio online',
  authors: [{ name: 'Rádio Tribo FM' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Rádio Tribo FM - Música Ao Vivo 24/7',
    description: 'A melhor música está aqui! Chat interativo, notícias em tempo real e os maiores sucessos. Faça parte da nossa tribo!',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Rádio Tribo FM - A Sua Música'
      }
    ],
    siteName: 'Rádio Tribo FM'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rádio Tribo FM 🎵',
    description: 'Sua música favorita ao vivo! Participe do chat e descubra novos hits todos os dias.',
    images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://radiotribofm.com.br',
  },
  category: 'entertainment',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="application-name" content="Rádio Tribo FM" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rádio Tribo FM" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RadioStation",
              "name": "Rádio Tribo FM",
              "description": "A melhor música, chat ao vivo e programação especial 24/7",
              "url": "https://radiotribofm.com.br",
              "logo": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
              "sameAs": [
                "https://facebook.com/radiotribofm",
                "https://instagram.com/radiotribofm", 
                "https://twitter.com/radiotribofm"
              ],
              "broadcastAffiliateOf": {
                "@type": "Organization",
                "name": "Rádio Tribo FM"
              },
              "genre": ["Pop", "Sertanejo", "Rock", "MPB"],
              "audience": {
                "@type": "Audience",
                "geographicArea": "Brasil"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <ThemeProvider>
          <RadioProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </RadioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}