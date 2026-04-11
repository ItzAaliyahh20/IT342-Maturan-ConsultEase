import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, LogOut } from 'lucide-react';

interface FacultySidebarProps {
  onLogout: () => void;
}

const linkBaseClass = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors';

const FacultySidebar: React.FC<FacultySidebarProps> = ({ onLogout }) => {
  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
      <nav className="p-3 space-y-1">
        <NavLink
          end
          to="/faculty"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/faculty/consultation-slots"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          <CalendarDays className="h-4 w-4" />
          Consultation Slots
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

export default FacultySidebar;
