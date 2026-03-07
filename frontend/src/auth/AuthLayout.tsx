import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin: boolean;
  isCentered?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, isLogin, isCentered = false }) => {
  // For centered layout (admin login), show full-screen centered form without side panel
  if (isCentered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-hero">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">
              Consult<span className="text-amber">Ease</span>
            </h2>
          </div>
          
          {/* Login Form Container */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
          
          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Authorized administrators only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 gradient-hero lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Consult<span style={{ color: '#F39C12' }}>Ease</span>
          </h2>
          <p className="text-lg text-white/70">
            Book faculty consultations effortlessly. No more waiting in long queues.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Consult<span className="text-amber">Ease</span>
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;