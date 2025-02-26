import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import AIScheduleSuggestions from './AIScheduleSuggestions';
import type { Task } from '../types';

interface Props {
  onAICommand: (command: string) => void;
}

const generateScheduleOptions = (prompt: string): Array<{
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}> => {
  // This would typically come from an AI service
  // For now, we'll generate mock data
  return [
    {
      id: '1',
      title: 'Balanced Schedule',
      description: 'Equal distribution of study and breaks',
      tasks: [
        {
          id: 'task1',
          title: 'Study Session: Database Systems',
          startTime: new Date(new Date().setHours(9, 0)),
          endTime: new Date(new Date().setHours(10, 30)),
          priority: 'high',
          category: 'academic',
          completed: false,
        },
        {
          id: 'task2',
          title: 'Break',
          startTime: new Date(new Date().setHours(10, 30)),
          endTime: new Date(new Date().setHours(11, 0)),
          priority: 'low',
          category: 'personal',
          completed: false,
        },
      ],
    },
    {
      id: '2',
      title: 'Intensive Focus',
      description: 'Concentrated study blocks with shorter breaks',
      tasks: [
        {
          id: 'task3',
          title: 'Deep Work: Project Implementation',
          startTime: new Date(new Date().setHours(9, 0)),
          endTime: new Date(new Date().setHours(11, 0)),
          priority: 'high',
          category: 'academic',
          completed: false,
        },
        {
          id: 'task4',
          title: 'Quick Break',
          startTime: new Date(new Date().setHours(11, 0)),
          endTime: new Date(new Date().setHours(11, 15)),
          priority: 'low',
          category: 'personal',
          completed: false,
        },
      ],
    },
    {
      id: '3',
      title: 'Flexible Arrangement',
      description: 'Adaptable schedule with buffer time',
      tasks: [
        {
          id: 'task5',
          title: 'Review Session',
          startTime: new Date(new Date().setHours(9, 30)),
          endTime: new Date(new Date().setHours(10, 30)),
          priority: 'medium',
          category: 'academic',
          completed: false,
        },
        {
          id: 'task6',
          title: 'Group Discussion',
          startTime: new Date(new Date().setHours(11, 0)),
          endTime: new Date(new Date().setHours(12, 0)),
          priority: 'medium',
          category: 'academic',
          completed: false,
        },
      ],
    },
  ];
};

const AIInput: React.FC<Props> = ({ onAICommand }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scheduleOptions, setScheduleOptions] = useState<Array<{
    id: string;
    title: string;
    description: string;
    tasks: Task[];
  }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Generate schedule options
      const options = generateScheduleOptions(input);
      setScheduleOptions(options);
      setShowSuggestions(true);
      onAICommand(input);
    }
  };

  const handleSelectSchedule = (option: { id: string; title: string; description: string; tasks: Task[] }) => {
    // Here you would typically update the main schedule with the selected option
    console.log('Selected schedule:', option);
    setShowSuggestions(false);
    setInput('');
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 w-96">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">AI Assistant</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI to suggest a schedule..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Try: "Create a study schedule for my database exam", "Plan my day with focus time"
          </div>
        </form>
      </div>

      <AIScheduleSuggestions
        isVisible={showSuggestions}
        options={scheduleOptions}
        onSelect={handleSelectSchedule}
        onClose={() => setShowSuggestions(false)}
      />
    </>
  );
};

export default AIInput;