import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Info, Sparkles, Calendar, Clock } from 'lucide-react';
import { generateScheduleWithGemini } from '../services/geminiService';
import AIScheduleSuggestions from './AIScheduleSuggestions';
import type { Task } from '../types';

interface EnhancedAIInputProps {
  onAddTasks: (tasks: Task[]) => void;
  existingTasks: Task[];
  onUpdateMessage: (message: string) => void;
}

const EnhancedAIInput: React.FC<EnhancedAIInputProps> = ({
  onAddTasks,
  existingTasks,
  onUpdateMessage
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleOptions, setScheduleOptions] = useState<Task[][]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('weekly');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize the textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError('');
    setScheduleOptions([]);
    
    try {
      console.log("Submitting prompt:", input);
      onUpdateMessage(`Generating ${scheduleType} schedule based on: "${input}"`);
      
      // Check if the input is specific enough
      if (input.length < 10) {
        setError('Please provide a more detailed prompt for better results.');
        setIsLoading(false);
        onUpdateMessage('Your prompt is too short. Please provide more details about the schedule you need.');
        return;
      }
      
      // Generate schedule with options
      const enhancedPrompt = `Create a ${scheduleType} schedule for: ${input}. 
IMPORTANT: Make sure to distribute different types of activities (gym, coding, project work, etc.) across ALL days of the week. 
Do NOT group all activities of the same type on a single day. 
For example, if the user wants to do gym, coding, and project work:
1. Include gym activities on at least 3-4 different days of the week, not just on a single day
2. Include coding sessions on multiple different days, not just on a single day
3. Include project work on multiple different days, not just on a single day
4. Each day should have a MIX of different activity types (e.g., some gym, some coding, some project work)
5. NEVER make an entire day dedicated to just one type of activity
6. When "weekend" is mentioned, ALWAYS interpret this as Saturday and Sunday only`;
      
      const result = await generateScheduleWithGemini(enhancedPrompt, existingTasks, true);
      console.log("Generated schedule result:", result);
      
      if (Array.isArray(result) && result.length > 0) {
        if (Array.isArray(result[0])) {
          // We have multiple schedule options
          setScheduleOptions(result as Task[][]);
          setShowSuggestions(true);
          onUpdateMessage(`Here are some ${scheduleType} schedule options based on your request. Choose the one that works best for you!`);
        } else {
          // We have a single schedule
          onAddTasks(result as Task[]);
          onUpdateMessage(`Your ${scheduleType} schedule has been created! Check the calendar view to see your tasks.`);
        }
      } else {
        setError('Failed to generate schedule. Please try again with a different prompt.');
        onUpdateMessage('I had trouble understanding your request. Could you try rephrasing it? For example: "Create a study schedule for calculus" or "Make a workout plan for next week"');
      }
    } catch (err) {
      console.error('Error generating schedule:', err);
      setError('An error occurred while generating your schedule. Please try again.');
      onUpdateMessage('Sorry, I encountered an error. Please try again with a more specific prompt like "Create a study schedule for my math exam" or "Plan a workout routine for the week"');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSchedule = (tasks: Task[]) => {
    onAddTasks(tasks);
    setShowSuggestions(false);
    onUpdateMessage(`I've added ${tasks.length} tasks to your ${scheduleType} schedule.`);
  };

  const examplePrompts = [
    "I have college classes from 9am to 4pm Monday to Friday and want to learn MERN stack",
    "Create a schedule balancing DSA practice, DevOps learning, and college work",
    "Plan a week with morning gym, evening coding sessions, and weekend projects",
    "Balance my tech learning with college classes and extracurricular activities"
  ];

  return (
    <div className="ai-input">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-lg text-blue-800 mb-1">Create Your Schedule</h3>
        <p className="text-sm text-blue-600">Describe your schedule needs below and I'll generate a personalized plan</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <button
            type="button"
            onClick={() => setScheduleType('daily')}
            className={`px-3 py-1.5 rounded ${
              scheduleType === 'daily' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setScheduleType('weekly')}
            className={`px-3 py-1.5 rounded ${
              scheduleType === 'weekly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your schedule needs (e.g., 'I have college from 9-4, want to learn MERN stack, and go to gym daily')"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-3 rounded-md h-[80px] w-[60px] flex items-center justify-center ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 rounded-md">
            <AlertCircle size={16} className="inline mr-1" />
            {error}
          </div>
        )}
        
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Schedule Suggestions Modal */}
      {showSuggestions && scheduleOptions.length > 0 && (
        <AIScheduleSuggestions
          options={scheduleOptions}
          onSelect={handleSelectSchedule}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default EnhancedAIInput; 