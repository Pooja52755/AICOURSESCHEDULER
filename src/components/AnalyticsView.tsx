import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Calendar, CheckCircle, AlertTriangle, BookOpen, Briefcase, Heart, User } from 'lucide-react';
import type { Task } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const [timeSpentByCategory, setTimeSpentByCategory] = useState<any[]>([]);
  const [tasksByPriority, setTasksByPriority] = useState<any[]>([]);
  const [completionRate, setCompletionRate] = useState<number>(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Task[]>([]);
  const [productiveHours, setProductiveHours] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (tasks.length === 0) return;

    // Calculate time spent by category
    const categoryMap = new Map<string, number>();
    tasks.forEach(task => {
      const duration = new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
      const hours = duration / (1000 * 60 * 60);
      const category = task.category || 'uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + hours);
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(1))
    }));
    setTimeSpentByCategory(categoryData);

    // Calculate tasks by priority
    const priorityMap = new Map<string, number>();
    tasks.forEach(task => {
      const priority = task.priority || 'medium';
      priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
    });

    const priorityData = Array.from(priorityMap.entries()).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count
    }));
    setTasksByPriority(priorityData);

    // Calculate completion rate
    const completedTasks = tasks.filter(task => task.completed).length;
    setCompletionRate(Math.round((completedTasks / tasks.length) * 100));

    // Get upcoming deadlines (tasks in the next 3 days)
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const upcoming = tasks
      .filter(task => {
        const taskDate = new Date(task.endTime);
        return !task.completed && taskDate >= now && taskDate <= threeDaysFromNow;
      })
      .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
    
    setUpcomingDeadlines(upcoming);

    // Calculate productive hours
    const hourMap = new Map<number, number>();
    tasks.forEach(task => {
      const startHour = new Date(task.startTime).getHours();
      const endHour = new Date(task.endTime).getHours();
      
      for (let hour = startHour; hour <= endHour; hour++) {
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      }
    });

    const hourData = Array.from(Array(24).keys()).map(hour => ({
      hour: hour,
      tasks: hourMap.get(hour) || 0
    }));
    setProductiveHours(hourData);

  }, [tasks]);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <BookOpen size={16} className="text-blue-500" />;
      case 'work':
        return <Briefcase size={16} className="text-orange-500" />;
      case 'personal':
        return <User size={16} className="text-teal-500" />;
      case 'extracurricular':
        return <Heart size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <Calendar size={18} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{tasks.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{completionRate}%</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">High Priority</h3>
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {tasks.filter(task => task.priority === 'high').length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Study Hours</h3>
            <Clock size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {timeSpentByCategory.reduce((acc, curr) => acc + curr.value, 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Spent by Category */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Time Spent by Category (hours)</h3>
          <div className="h-64">
            {timeSpentByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeSpentByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}h`}
                  >
                    {timeSpentByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Productive Hours */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Most Productive Hours</h3>
          <div className="h-64">
            {productiveHours.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productiveHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} tasks`, 'Activity']}
                    labelFormatter={(hour) => `${hour}:00`}
                  />
                  <Bar dataKey="tasks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Upcoming Deadlines</h3>
        {upcomingDeadlines.length > 0 ? (
          <div className="space-y-3">
            {upcomingDeadlines.map(task => (
              <div key={task.id} className="flex items-start p-3 border border-gray-200 rounded-md">
                <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(task.priority)}`} />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(new Date(task.endTime))}</span>
                      <span className="mx-1">•</span>
                      <Clock size={14} className="mr-1" />
                      <span>{formatTime(new Date(task.endTime))}</span>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center mt-2">
                    {getCategoryIcon(task.category)}
                    <span className="text-xs ml-1 text-gray-600">{task.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming deadlines in the next 3 days
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView; 