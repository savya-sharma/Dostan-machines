import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

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
      className={`${suisseIntl.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
