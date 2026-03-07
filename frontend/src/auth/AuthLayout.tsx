import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Calendar, Users, BookOpen, Star } from 'lucide-react';

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
              Consult<span className="text-amber-500">Ease</span>
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
      <div className="hidden w-1/2 gradient-hero lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12 relative overflow-hidden">
        {/* Animated decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-amber-500/20 rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
          
          {/* Floating icons */}
          <div className="absolute top-28 right-24 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
            <Calendar className="h-6 w-6 text-white/30" />
          </div>
          <div className="absolute bottom-40 left-16 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <Users className="h-5 w-5 text-white/20" />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>
            <BookOpen className="h-5 w-5 text-white/25" />
          </div>
          
          {/* Decorative dots pattern */}
          <div className="absolute top-10 right-10 grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            ))}
          </div>
          
          {/* Horizontal decorative lines */}
          <div className="absolute bottom-20 left-10 right-10">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        <div className="max-w-md text-center relative z-10">
          {/* Logo with glow effect */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 animate-glow-pulse" style={{ animationDuration: '2s' }}>
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          
          {/* Animated title */}
          <h2 className="mb-4 text-4xl font-bold text-white tracking-tight animate-fade-in-down">
            Consult<span style={{ color: '#F39C12' }}>Ease</span>
          </h2>
          
          {/* Animated subtitle */}
          <p className="text-lg text-white/80 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Book faculty consultations effortlessly.
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-sm">Easy scheduling</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-sm">Real-time availability</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-sm">Instant notifications</span>
            </div>
          </div>
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