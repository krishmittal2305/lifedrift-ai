import type { Metadata } from 'next'
import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google'
import './globals.css'
import { OSShell } from '@/components/os/OSShell'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
})
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-rajdhani',
  display: 'swap',
})
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-share-tech-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LifeDrift OS — Student Stress Intelligence',
  description: 'AI-powered student stress prediction and lifestyle optimization platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <body className="antialiased">
        <OSShell>{children}</OSShell>
      </body>
    </html>
  )
}
