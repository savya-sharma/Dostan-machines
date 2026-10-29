import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import TextReveal from "@/components/TextReveal";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { festivalBootScript } from "@/lib/festival";
import "./globals.css";
import "../styles/festivals/diwali.css";

const suisseIntl = localFont({
  src: "../../public/fonts/SuisseIntl-Medium.ttf",
  variable: "--font-suisse",
  weight: "500",
  display: "swap",
});

const geistMono = localFont({
  src: "../../public/fonts/GeistMono-Regular.ttf",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Dostan Machines",
  description: "Industrial machinery engineering and manufacturing.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${suisseIntl.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
      // The festival boot script below adds data-festival to <html> before
      // hydration (dates are checked in the browser, since pages are
      // prerendered); this only silences the expected attribute mismatch on
      // <html> itself, not on anything inside it.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: festivalBootScript() }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <TextReveal />
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
