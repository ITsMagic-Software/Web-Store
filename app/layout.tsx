import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MotionProvider } from "@/components/MotionProvider";
import en from "@/locales/en.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { title: en.storeName, description: en.metadataDescription };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`try{var p=location.pathname.toLowerCase().replace(/^\\/store(?=\\/|$)/,"");if(p==="/pt-br"||p.startsWith("/pt-br/"))document.documentElement.lang="pt-BR";else if(p==="/en"||p.startsWith("/en/"))document.documentElement.lang="en";var t=localStorage.getItem("itsmagic-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=t==="light"||t==="dark"?t:"light dark"}catch{}`}
        </Script>
        <MotionProvider>
          <Providers initialLocale="en">{children}</Providers>
        </MotionProvider>
      </body>
    </html>
  );
}
