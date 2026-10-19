import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITsMagic Store",
  description: "Discover apps and resources from ITsMagic.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
