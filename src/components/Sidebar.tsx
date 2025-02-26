import React from 'react';
import { Calendar, BookOpen, Briefcase, Users, Settings, PieChart, LogOut } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import type { ActiveTab } from '../types';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const Sidebar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const { signOut } = useClerk();

  const menuItems = [
    { icon: Calendar, label: 'schedule', title: 'Schedule' },
    { icon: BookOpen, label: 'academics', title: 'Academics' },
    { icon: Briefcase, label: 'work', title: 'Work' },
    { icon: Users, label: 'activities', title: 'Activities' },
    { icon: PieChart, label: 'analytics', title: 'Analytics' },
    { icon: Settings, label: 'settings', title: 'Settings' },
  ] as const;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
      <div className="flex items-center space-x-3 mb-8">
        <Calendar className="w-8 h-8 text-indigo-600" />
        <h1 className="text-xl font-bold">StudySync AI</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.label
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </button>
        ))}
        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 mt-8 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;