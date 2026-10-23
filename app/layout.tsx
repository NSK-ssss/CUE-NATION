import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import BilliardsBackground from "@/components/billiards/BilliardsBackground";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cue Nation | Billiards, Snooker & Café Management",
  description:
    "Premier billiards, snooker lounge and café management platform. Real-time table session tracking, online bookings, and café ordering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${outfit.variable} ${inter.variable} bg-[#080A0C]`}
    >
      <body className="font-sans antialiased min-h-screen selection:bg-brass selection:text-charcoal bg-transparent text-foreground relative">
        <BilliardsBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
