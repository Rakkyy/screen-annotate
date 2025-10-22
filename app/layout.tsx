import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screen Annotate - Screenshot Annotation Tool",
  description: "Upload and annotate screenshots with arrows, rectangles, and text",
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
