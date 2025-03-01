import React from 'react';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router } from 'react-router-dom';
import NotionPage from './components/NotionPage';
import { 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { UserDataProvider } from './context/UserDataContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <UserDataProvider>
            <div className="min-h-screen bg-white">
              {/* SignedIn route when the user is authenticated */}
              <SignedIn>
                <div className="flex h-screen overflow-hidden">
                  {/* Main content */}
                  <div className="flex-1 overflow-auto">
                    <NotionPage />
                  </div>
                </div>
              </SignedIn>

              {/* SignedOut route when the user is not authenticated */}
              <SignedOut>
                <div className="flex min-h-screen items-center justify-center bg-gray-50">
                  <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-indigo-600 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-900">StudySync AI</h1>
                      </div>
                      <p className="text-gray-600">Your AI-powered study schedule assistant</p>
                      <div className="mt-4 flex justify-center space-x-4">
                        <div className="flex items-center text-sm text-indigo-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Smart Scheduling</span>
                        </div>
                        <div className="flex items-center text-sm text-indigo-600">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          <span>Analytics</span>
                        </div>
                        <div className="flex items-center text-sm text-indigo-600">
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span>Academic Planning</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                      <SignIn />
                    </div>
                  </div>
                </div>
              </SignedOut>
            </div>
          </UserDataProvider>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
