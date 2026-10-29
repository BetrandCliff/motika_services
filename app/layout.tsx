import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motika Services Ultra Fast | School & Document Assistance",
  description: "Book reliable university, document, certification and school errand services with Motika.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
