import React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google"; // 1. Luxury Serif Font
import { SanityLive } from "@/sanity/lib/live";
import { Toaster as HotToaster } from "react-hot-toast";

// 2. Ambrins Components
import Header from "@/components/header/Header";
import Footer from "@/components/common/Footer";
import LinkBadge from "@/components/common/LinkBadge";

import "./globals.css";

// Configure Cormorant Garamond for Headings
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ambrins Fabrics",
    default: "Ambrins Fabrics | Since 1999",
  },
  description: "Curating Colombo’s finest silks, laces, and artisan prints.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} antialiased bg-ambrins_linen text-ambrins_black relative font-body`}
      >
        {/* --- 1. Fixed Header --- */}
        {/* <Header /> */}

        {/* --- 2. Link Badge (Promo Bar) --- */}
        {/* Note: Since Header is fixed, ensure LinkBadge has appropriate top spacing if needed */}
        {/* <LinkBadge /> */}

        {/* --- 3. Main Content --- */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>

        {/* --- 4. Footer --- */}
        {/* <Footer /> */}

        {/* --- 5. Global Utilities --- */}
        
        {/* Luxury Themed Notifications */}
        <HotToaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "0px", // Sharp corners for luxury feel
              background: "#1A1A1A", // Ambrins Off-Black
              color: "#FDFCF9", // Linen White
              padding: "16px",
              fontFamily: "var(--font-satoshi)", 
              border: "1px solid #B89552", // Gold Border
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#B89552", // Gold Icon
                secondary: "#1A1A1A",
              },
            },
            error: {
              iconTheme: {
                primary: "#B85C5C", // Muted Red
                secondary: "#FDFCF9",
              },
            },
          }}
        />

        {/* Sanity Live Preview */}
        <SanityLive />
      </body>
    </html>
  );
}