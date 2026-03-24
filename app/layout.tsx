import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anupam & Aastha - Wedding Invitation",
  description: "Wedding celebrations of Anupam and Aastha in Himachal, May 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
