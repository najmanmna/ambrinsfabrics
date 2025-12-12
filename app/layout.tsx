import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster as HotToaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";

import "./globals.css";

// Import Google Font (Poppins) with multiple weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - ELDA",
    default: "ELDA | HOUSE OF BLOCK PRINTS",
  },
  description: "ELDA | HOUSE OF BLOCK PRINTS",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} pt-25 antialiased bg-tech_bg_color relative`}
      >
        {/* Background layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/bg-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "30%",
            backgroundAttachment: "fixed",
            opacity: 0.05, // 5% opacity
          }}
        ></div>

        {/* Content layer */}
        <div className="relative z-10">
          {children}

          {/* Toaster */}
        <HotToaster
      position="bottom-right" // <--- CHANGED THIS LINE
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "#2C3E50", // Deep, elegant charcoal
          color: "#FDFBF6", // Warm, off-white text
          padding: "16px",
          fontFamily: "var(--font-serif)", // Assumes you have a serif font variable
          fontWeight: "500",
          border: "1px solid #46627f", // Subtle border
        },
        success: {
          iconTheme: {
            primary: "#5A7D7C", // Muted, earthy green
            secondary: "#FDFBF6",
          },
        },
        error: {
          iconTheme: {
            primary: "#B85C5C", // Soft terracotta red
            secondary: "#FDFBF6",
          },
        },
      }}
    />
 

          {/* Sanity Live */}
          <SanityLive />

          {/* Floating WhatsApp Button */}
          {/* <WhatsAppButton /> */}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
