import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Reserva de Cine',
  description: 'Sistema avanzado de reserva de entradas de cine con tecnología de previsualización de asientos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Video de fondo */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="fixed inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(0.2) contrast(0.6) saturate(0.3) blur(1px)' }}
          >
            <source src="/assets/fondo.mp4" type="video/mp4" />
          </video>

          {/* Overlay para mejor legibilidad */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10 pointer-events-none"></div>

          {/* Contenido principal */}
          <div className="relative z-20">
            {children}
          </div>

          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
