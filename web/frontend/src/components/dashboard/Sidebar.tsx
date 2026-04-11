import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarCheck2, ClipboardList, LayoutDashboard, LogOut, User } from 'lucide-react';
import authService from '../../auth/authService';

interface SidebarProps {
  onLogout: () => void;
}

const linkBaseClass = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors';

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const user = authService.getCurrentUser();

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
      <div className="px-4 py-5 border-b border-gray-200">
        <p className="text-sm text-gray-500">Signed in as</p>
        <div className="mt-2 flex items-center gap-2 text-gray-800">
          <User className="h-4 w-4" />
          <span className="text-sm font-semibold truncate">{user?.fullName || 'User'}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{user?.role || 'UNKNOWN'}</p>
      </div>

      <nav className="p-3 space-y-1">
        <NavLink
          end
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/book"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          <CalendarCheck2 className="h-4 w-4" />
          Book Consultation
        </NavLink>

        <NavLink
          to="/dashboard/bookings"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          <ClipboardList className="h-4 w-4" />
          My Bookings
        </NavLink>

        <button
          onClick={onLogout}
          className="w-full text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
