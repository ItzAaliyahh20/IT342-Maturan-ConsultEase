import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Calendar, Settings } from 'lucide-react';
import authService from '../../auth/services/authService';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems =
    user?.role === 'FACULTY'
      ? [
          { label: 'Home', icon: Home, href: '/faculty' },
          { label: 'My Slots', icon: Calendar, href: '/faculty/consultation-slots' },
          { label: 'Settings', icon: Settings, href: '/auth/change-password' }
        ]
      : [
          { label: 'Home', icon: Home, href: '/dashboard' },
          { label: 'Book Consultation', icon: Calendar, href: '/dashboard/book-consultation' },
          { label: 'My Bookings', icon: Calendar, href: '/dashboard/my-bookings' },
          { label: 'Settings', icon: Settings, href: '/auth/change-password' }
        ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-2 bg-amber-500 text-white rounded-full shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative left-0 top-16 md:top-0 z-40 h-[calc(100vh-64px)] md:h-auto w-64 bg-white border-r border-gray-200 transition-transform duration-300 overflow-y-auto`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors text-left"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
