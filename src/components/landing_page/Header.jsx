"use client"

import { useState } from 'react';
import Link from 'next/link';
import SignInModal from '../auth/sign_in';
import SignUpModal from '../auth/sign_up';
import ForgotPasswordModal from '../auth/forget_password';

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  
  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
    setIsForgotPasswordOpen(false);
  };
  
  const openSignUp = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
    setIsForgotPasswordOpen(false);
  };
  
  const openForgotPassword = () => {
    setIsForgotPasswordOpen(true);
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };
  
  const closeModals = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
    setIsForgotPasswordOpen(false);
  };

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
          <button 
            onClick={openSignIn} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Sign In
          </button>
        </nav>
      </div>
      
      {/* Modal components */}
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={closeModals} 
        openSignUp={openSignUp}
        openForgotPassword={openForgotPassword}
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={closeModals} 
        openSignIn={openSignIn} 
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={closeModals}
        openSignIn={openSignIn}
      />
    </header>
  );
}