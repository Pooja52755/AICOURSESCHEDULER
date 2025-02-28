import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Academics from './components/Academics';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import AIInput from './components/AIInput';
import type { ActiveTab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule'); // Default tab is 'schedule'

  // Handle the AI command input to switch tabs
  const handleAICommand = (command: string) => {
    console.log('Processing AI command:', command);  // Log AI command for debugging

    // Basic NLP-based command handling
    const lowerCommand = command.toLowerCase();

    // Determine the tab based on the AI input
    if (lowerCommand.includes('study') || lowerCommand.includes('class')) {
      setActiveTab('academics');  // Switch to the Academics tab
    } else if (lowerCommand.includes('work')) {
      setActiveTab('work');  // Switch to Work tab (if available)
    } else if (lowerCommand.includes('analytics') || lowerCommand.includes('progress')) {
      setActiveTab('analytics');  // Switch to Analytics tab
    } else if (lowerCommand.includes('settings')) {
      setActiveTab('settings');  // Switch to Settings tab
    }
  };

  // Render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <Dashboard />;
      case 'academics':
        return <Academics />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SignedIn route when the user is authenticated */}
      <SignedIn>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} /> {/* Sidebar for navigation */}
        <main className="flex-1 overflow-auto p-8">
          {renderContent()} {/* Dynamically render the content based on active tab */}
        </main>
        <AIInput onAICommand={handleAICommand} /> {/* AI input for voice/text commands */}
        <UserButton /> {/* Show user button */}
      </SignedIn>

      {/* SignedOut route when the user is not authenticated */}
      <SignedOut>
        <SignIn /> {/* Render SignIn page if not logged in */}
      </SignedOut>
    </div>
  );
}

export default App;
