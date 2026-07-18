import type { Metadata } from "next"
import { Fredoka, Nunito } from "next/font/google"
import "./globals.css"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spin-display",
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-spin-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Random Wheel Picker | Spin the Wheel Online Free",
    template: "%s | Picker Wheel",
  },
  description:
    "Spin the wheel online for free with our random wheel picker. Create custom wheels, add names or options, and make fair random choices in seconds.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body
        className="font-spin-body antialiased"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
