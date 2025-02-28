import React, { useState } from 'react';
import { Clock, Brain, Zap, TrendingUp, Plus, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import styles
import type { ScheduleInsight, Task } from '../types';

const insights: ScheduleInsight[] = [
  {
    title: 'Peak Productivity',
    description: 'You are most productive between 8-11 AM',
    icon: 'Brain',
  },
  {
    title: 'Study Streak',
    description: '5 days consistent study schedule',
    icon: 'Zap',
  },
  {
    title: 'Time Management',
    description: '85% schedule adherence this week',
    icon: 'TrendingUp',
  },
];

const upcomingTasks: Task[] = [
  {
    id: '1',
    title: 'Database Systems Lecture',
    startTime: new Date('2024-03-20T09:00:00'),
    endTime: new Date('2024-03-20T10:30:00'),
    priority: 'high',
    category: 'academic',
    completed: false,
  },
  {
    id: '2',
    title: 'Study Group Meeting',
    startTime: new Date('2024-03-20T14:00:00'),
    endTime: new Date('2024-03-20T15:30:00'),
    priority: 'medium',
    category: 'academic',
    completed: false,
  },
];

const Dashboard = () => {
  const [showCalendar, setShowCalendar] = useState(false); // To toggle calendar view

  const toggleCalendarView = () => {
    setShowCalendar(!showCalendar); // Toggle the calendar view when clicked
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Notion-like Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-bold text-gray-900">📅 My Schedule</h1>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={toggleCalendarView} // Toggle calendar on button click
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>View Calendar</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Today</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Academic</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Personal</span>
          </div>
        </div>

        {/* Notion-like Task List */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View Calendar</button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-indigo-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        {task.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {task.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight) => (
            <div key={insight.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
                </div>
                {insight.icon === 'Brain' && <Brain className="w-6 h-6 text-indigo-600" />}
                {insight.icon === 'Zap' && <Zap className="w-6 h-6 text-indigo-600" />}
                {insight.icon === 'TrendingUp' && <TrendingUp className="w-6 h-6 text-indigo-600" />}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
              <div className="flex flex-col items-center">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-sm">Add Task</span>
              </div>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
              <div className="flex flex-col items-center">
                <Clock className="w-6 h-6 mb-2" />
                <span className="text-sm">Set Timer</span>
              </div>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
              <div className="flex flex-col items-center">
                <Brain className="w-6 h-6 mb-2" />
                <span className="text-sm">Focus Mode</span>
              </div>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
              <div className="flex flex-col items-center">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-sm">Analytics</span>
              </div>
            </button>
          </div>
        </div>

        {/* Display the Calendar View */}
        {showCalendar && (
          <div className="mt-8">
            <Calendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
