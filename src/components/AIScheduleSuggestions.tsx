import React, { useState } from 'react';
import { format } from 'date-fns';
import type { Task } from '../types';
import { X, Calendar, Clock, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface AIScheduleSuggestionsProps {
  options: Task[][];
  onSelect: (option: Task[]) => void;
  onClose: () => void;
}

const AIScheduleSuggestions: React.FC<AIScheduleSuggestionsProps> = ({
  options,
  onSelect,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'extracurricular':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'work':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'personal':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEE, MMM d • h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Get option title based on index
  const getOptionTitle = (index: number) => {
    switch (index) {
      case 0:
        return 'Balanced Schedule';
      case 1:
        return 'Intensive Focus Schedule';
      case 2:
        return 'Flexible Arrangement';
      default:
        return `Option ${index + 1}`;
    }
  };

  // Get option description based on index
  const getOptionDescription = (index: number) => {
    switch (index) {
      case 0:
        return 'Evenly distributed tasks with a good balance of work and breaks';
      case 1:
        return 'Longer focused work blocks for maximum productivity';
      case 2:
        return 'Adaptable time blocks with flexibility for changes';
      default:
        return 'A custom schedule option';
    }
  };

  // Get option icon based on index
  const getOptionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 1:
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 2:
        return <Star className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-900">Choose Your Ideal Schedule</h2>
            <p className="text-indigo-700 mt-1">Select the schedule that best fits your needs and preferences</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-indigo-700" />
          </button>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option, optionIndex) => (
              <div 
                key={optionIndex} 
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedOption === optionIndex 
                    ? 'border-indigo-400 ring-2 ring-indigo-200 shadow-lg transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedOption(optionIndex)}
              >
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                  <div className="flex items-center mb-2">
                    {getOptionIcon(optionIndex)}
                    <h3 className="font-medium text-lg ml-2">{getOptionTitle(optionIndex)}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{getOptionDescription(optionIndex)}</p>
                  <div className="mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{option.length} tasks total</span>
                      <div className="flex -space-x-2">
                        {Array.from(new Set(option.map(task => task.category))).slice(0, 3).map((category, i) => (
                          <div 
                            key={category} 
                            className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                              category === 'academic' ? 'bg-blue-500' :
                              category === 'work' ? 'bg-orange-500' :
                              category === 'personal' ? 'bg-teal-500' :
                              'bg-purple-500'
                            }`}
                            title={category}
                          >
                            <span className="text-[8px] text-white uppercase font-bold">
                              {category.charAt(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                  {option.slice(0, 4).map((task, taskIndex) => (
                    <div key={taskIndex} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                      <div className="text-xs text-gray-500 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(task.startTime)}
                      </div>
                    </div>
                  ))}
                  
                  {option.length > 4 && (
                    <div className="p-3 text-center text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                      +{option.length - 4} more tasks
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(option);
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors ${
                      selectedOption === optionIndex
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {selectedOption === optionIndex ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Apply This Schedule</span>
                      </>
                    ) : (
                      <>
                        <span>Select</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScheduleSuggestions;