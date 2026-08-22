import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseReviewPopup from "@/components/CaseReviewPopup";
import FloatingResourceWidget from "@/components/FloatingResourceWidget";
import MobileCtaBar from "@/components/MobileCtaBar";
import { siteConfig } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${siteConfig.site_title} — Birth Injury, Malpractice & Accident Attorney`,
  description:
    "Trial attorney Larry F. Taylor, Jr. represents families in birth injury, medical malpractice, mass torts, traumatic brain injury and accident cases across TX, OK, NM & AZ. No fee unless we win.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="relative">
        {/* Purple-to-black glow at the top of every page, matching the homepage
            hero — sits behind the content; any section with its own background
            (cards, the hero/stat-bar gradients) simply paints over it, and it
            resolves to the same black as the page background so there's no
            visible seam once it fades out. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-hero-gradient" />
        <Header />
        <main>{children}</main>
        <Footer />
        <CaseReviewPopup />
        <FloatingResourceWidget />
        <MobileCtaBar />
      </body>
    </html>
  );
}
