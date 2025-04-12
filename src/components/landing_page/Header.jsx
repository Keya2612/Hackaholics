"use client";

import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 text-2xl font-bold">Alpha</div>
          <span className="text-gray-400 text-sm">|</span>
          <div className="text-gray-700">AI Interview Simulator</div>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
            Dashboard
          </Link>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignInButton
              mode="modal"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Sign In
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}