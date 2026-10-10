import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SpaceWarpBackground } from "@/components/SpaceWarpBackground";
import { WelcomeIntro } from "@/components/WelcomeIntro";
import { OfflineBanner } from "@/components/states/OfflineBanner";
import { DynamicTabTitle } from "@/components/DynamicTabTitle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genzlog.com"),
  title: "GENZLOG — Website Development & Free Frontend Code Platform",
  description:
    "GENZLOG builds websites and digital experiences for businesses, while sharing useful frontend code and resources for everyone to learn from and customize.",
  keywords: [
    "GENZLOG",
    "Website Development",
    "Web Development Business",
    "Free Frontend Code",
    "UI Components",
    "HTML CSS JS Templates",
    "Business Websites",
    "Landing Pages",
    "Frontend Resources",
  ],
  authors: [{ name: "GENZLOG" }],
  openGraph: {
    title: "GENZLOG — Website Development & Free Frontend Code Platform",
    description:
      "GENZLOG builds websites and digital experiences for businesses, while sharing useful frontend code and resources for everyone to learn from and customize.",
    url: "https://genzlog.com",
    siteName: "GENZLOG",
    images: [
      {
        url: "/genzlog-logo-white.png",
        width: 1024,
        height: 682,
        alt: "GENZLOG Brand Mark",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GENZLOG — Website Development & Free Frontend Code Platform",
    description:
      "GENZLOG builds websites and digital experiences for businesses, while sharing useful frontend code and resources for everyone to learn from and customize.",
    images: ["/genzlog-logo-white.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-white.ico?v=4", sizes: "any" },
      { url: "/favicon-white-32x32.png?v=4", type: "image/png", sizes: "32x32" },
      { url: "/favicon-white-48x48.png?v=4", type: "image/png", sizes: "48x48" },
      { url: "/favicon-white-192x192.png?v=4", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon-white.ico?v=4",
    apple: [
      { url: "/favicon-white-192x192.png?v=4", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${caveat.variable} scroll-smooth antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var p = window.location.pathname;
                if (p === '/' || p === '') {
                  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (!prefersReduced) {
                    document.documentElement.classList.add('welcome-active');
                    window.__GENZLOG_FULL_HOME_LOAD__ = true;
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#050505] text-[#FFFFFF] selection:bg-[#FFFFFF] selection:text-[#050505] flex flex-col justify-between relative overflow-x-hidden">
        {/* Cinematic First-Visit Welcome Experience */}
        <WelcomeIntro />

        {/* Global Continuous Monochrome Space Warp Background */}
        <SpaceWarpBackground />

        {/* Dynamic Browser Tab Title Manager */}
        <DynamicTabTitle />

        {/* Global Network Connectivity Banner */}
        <OfflineBanner />

        {/* Global Navigation Header */}
        <Navbar />

        {/* Dynamic Route Content */}
        <div className="flex-1 relative z-10 space-warp-content">
          {children}
        </div>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
