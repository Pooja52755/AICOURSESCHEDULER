import React from 'react';
import { Calendar, CheckCircle2, X } from 'lucide-react';
import type { Task } from '../types';

interface ScheduleOption {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

interface Props {
  isVisible: boolean;
  options: ScheduleOption[];
  onSelect: (option: ScheduleOption) => void;
  onClose: () => void;
}

const AIScheduleSuggestions: React.FC<Props> = ({ isVisible, options, onSelect, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 m-4 shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold">AI Schedule Suggestions</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <div
              key={option.id}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(option)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                {option.tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-sm text-gray-500">
                        {task.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIScheduleSuggestions;