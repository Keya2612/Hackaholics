import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // New component for client-side logic

export const metadata = {
  title: "InterviewAI",
  description: "AI-powered interview preparation platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} ${GeistMono.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}