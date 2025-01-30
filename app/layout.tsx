import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { init } from "@/data/initFb"
import theArcNoBackground from "@/assets/the_arc_no_background.png"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "The Arc",
  description: "Bend the arc of history— one letter at a time.",
  icons: {
    icon: theArcNoBackground.src,
    apple: theArcNoBackground.src,
  },
  openGraph: {
    title: "The Arc",
    description: "Bend the arc of history— one letter at a time.",
    url: "https://thearc.game",
    siteName: "The Arc",
    images: [{ url: theArcNoBackground.src }],
  },
}

init()
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
