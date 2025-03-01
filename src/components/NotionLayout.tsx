import React, { useState } from 'react';
import { Menu, Search, Plus, ChevronDown, Settings, User } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import type { ActiveTab } from '../types';

interface NotionLayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const NotionLayout: React.FC<NotionLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { signOut, user } = useClerk();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewPageMenu, setShowNewPageMenu] = useState(false);

  const menuItems = [
    { label: 'schedule', title: 'Schedule' },
    { label: 'academics', title: 'Academics' },
    { label: 'work', title: 'Work' },
    { label: 'activities', title: 'Activities' },
    { label: 'analytics', title: 'Analytics' },
    { label: 'settings', title: 'Settings' },
  ] as const;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!sidebarCollapsed && <span className="font-semibold text-lg">StudySync AI</span>}
          </div>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="mt-4">
          {/* New Page Button */}
          <div className="px-4 mb-4 relative">
            <button 
              className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 w-full"
              onClick={() => setShowNewPageMenu(!showNewPageMenu)}
            >
              <Plus size={16} />
              {!sidebarCollapsed && <span>New Page</span>}
            </button>
            
            {/* New Page Dropdown */}
            {showNewPageMenu && !sidebarCollapsed && (
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10 border border-gray-200">
                <div className="py-1">
                  <button 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      onTabChange('schedule');
                      setShowNewPageMenu(false);
                    }}
                  >
                    Empty Page
                  </button>
                  <button 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      onTabChange('academics');
                      setShowNewPageMenu(false);
                    }}
                  >
                    Academic Template
                  </button>
                  <button 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      onTabChange('work');
                      setShowNewPageMenu(false);
                    }}
                  >
                    Work Template
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onTabChange(item.label)}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2 w-full ${
                  activeTab === item.label
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </div>
                {!sidebarCollapsed && activeTab === item.label && <ChevronDown size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile at Bottom */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <button 
            onClick={() => signOut()}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2'} text-gray-700 hover:text-gray-900`}
          >
            <User size={20} />
            {!sidebarCollapsed && <span>{user?.firstName || 'User'}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-medium">{menuItems.find(item => item.label === activeTab)?.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button className="text-gray-700 hover:text-gray-900">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NotionLayout; 