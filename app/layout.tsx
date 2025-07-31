import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cyberpunk Connect Four - Futuristic Gaming Experience",
  description: "Experience the future of Connect Four with stunning cyberpunk neon aesthetics, advanced AI opponents, and responsive gameplay optimized for all devices.",
  keywords: "connect four, cyberpunk, neon, game, AI, futuristic, responsive",
  authors: [{ name: "Cyberpunk Games Dev Team" }],
  openGraph: {
    title: "Cyberpunk Connect Four",
    description: "Futuristic neon-powered Connect Four with advanced AI",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00FFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
