import React from 'react';
import { Home, Calendar, BarChart2, BookOpen, Settings, Menu, X, Clock, Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  closeSidebar: () => void;
  openPomodoroTimer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  setActivePage, 
  closeSidebar,
  openPomodoroTimer
}) => {
  const { signOut } = useClerk();
  
  const navItems = [
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'academic', label: 'Academic Planner', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavigation = (page: string) => {
    setActivePage(page);
    closeSidebar();
  };
  
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">AI Course Scheduler</h1>
        <button
          onClick={closeSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activePage === item.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Tools Section */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Tools
        </h3>
        <div className="space-y-2">
          <button 
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
            onClick={openPomodoroTimer}
          >
            <Clock className="w-4 h-4 mr-2 text-indigo-600" />
            <span>Pomodoro Timer</span>
          </button>
          <div className="flex items-center text-sm text-gray-700 px-3 py-2">
            <Bell className="w-4 h-4 mr-2 text-indigo-600" />
            <span>Reminders</span>
          </div>
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;