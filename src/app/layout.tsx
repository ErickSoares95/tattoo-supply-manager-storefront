import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { TopBar } from "@/components/layout/TopBar";
import { AuthProvider } from "@/lib/store/AuthContext";
import { CartProvider } from "@/lib/store/CartContext";
import "./globals.css";

// next/font self-hosts and subsets at build time (no request to Google Fonts at
// runtime, no layout-shift while the font loads) - strictly better than the mockup's
// <link href="fonts.googleapis.com/..."> for a real production site.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vanessa Gazanez Tattoo — Supply Store",
  description:
    "Equipamento profissional para tatuadores: máquinas, tintas, agulhas e descartáveis selecionados pela Vanessa Gazanez.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <SkipLink />
            <TopBar />
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
