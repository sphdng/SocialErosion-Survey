import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Erosion Survey",
  description: "NYU Qualtrics survey hosted on Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
