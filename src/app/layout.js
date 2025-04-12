import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "InterviewAI",
  description: "AI-powered interview preparation platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/resume"
    >
      <html lang="en">
        <body className={`${GeistSans.className} ${GeistMono.className} antialiased`}>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}