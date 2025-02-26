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
  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');

  const handleAICommand = (command: string) => {
    // Here we would typically process the NLP command
    // For now, we'll just log it
    console.log('Processing AI command:', command);
    
    // Example of basic NLP processing
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('study') || lowerCommand.includes('class')) {
      setActiveTab('academics');
    } else if (lowerCommand.includes('work')) {
      setActiveTab('work');
    } else if (lowerCommand.includes('analytics') || lowerCommand.includes('progress')) {
      setActiveTab('analytics');
    }
  };

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
      <SignedIn>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
        <AIInput onAICommand={handleAICommand} />
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  );
}

export default App;