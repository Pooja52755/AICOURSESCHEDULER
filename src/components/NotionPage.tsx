import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Calendar as CalendarIcon, Clock, CheckCircle, BarChart3, BookOpen, Settings, List, Grid, ChevronLeft, ChevronRight, Trash2, Sparkles, Users, Code, Heart, Circle, Menu } from 'lucide-react';
import NotionEditor from './NotionEditor';
import EnhancedAIInput from './EnhancedAIInput';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AnalyticsView from './AnalyticsView';
import AcademicPlanner from './AcademicPlanner';
import SettingsView from './SettingsView';
import type { Task } from '../types';
import { format, parseISO, isToday, isTomorrow, addDays, startOfDay, endOfDay, isSameDay, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import NotionBlock from './NotionBlock';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskForm from './TaskForm';
import { useUserData } from '../context/UserDataContext';
import { useTask } from '../context/TaskContext';
import PomodoroTimer from './PomodoroTimer';
import Sidebar from './Sidebar';

interface Block {
  id: string;
  type: string;
  content: string;
}

interface NotionPageProps {
  pageTitle?: string;
  initialBlocks?: Block[];
  initialTasks?: Task[];
  activePage?: string;
}

const NotionPage: React.FC<NotionPageProps> = ({
  pageTitle = 'Untitled',
  initialBlocks = [{ id: uuidv4(), type: 'text', content: '' }],
  initialTasks = [],
  activePage: initialActivePage = 'schedule'
}) => {
  const [title, setTitle] = useState(pageTitle);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timetable' | 'weekly'>('weekly');
  const [aiMessage, setAIMessage] = useState<string>('How can I help with your schedule today?');
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showPomodoroTimer, setShowPomodoroTimer] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>(initialActivePage);
  const { userData, updateUserData } = useUserData();
  const { getTasks, addTask, updateTask, deleteTask } = useTask();
  
  // Update title when activePage changes
  useEffect(() => {
    setTitle(
      activePage === 'schedule' ? 'My Schedule' : 
      activePage === 'analytics' ? 'Analytics' :
      activePage === 'academic' ? 'Academic Planner' : 
      'Settings'
    );
  }, [activePage]);

  // Load user data and tasks
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          if (parsedUserData.title) {
            setTitle(parsedUserData.title);
          }
          if (parsedUserData.blocks) {
            setBlocks(parsedUserData.blocks);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    const loadTasks = async () => {
      try {
        // Get tasks from TaskContext which now uses localStorage
        const loadedTasks = await getTasks();
        
        // Convert string dates to Date objects if needed
        const formattedTasks = loadedTasks.map(task => ({
          ...task,
          startTime: task.startTime instanceof Date ? task.startTime : new Date(task.startTime),
          endTime: task.endTime instanceof Date ? task.endTime : new Date(task.endTime)
        }));
        
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadUserData();
    loadTasks();
  }, [getTasks]);

  // Save user data to localStorage
  const saveUserData = () => {
    try {
      const userData = {
        title,
        blocks
      };
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Save user data when title or blocks change
  useEffect(() => {
    saveUserData();
  }, [title, blocks]);

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    const taskDate = new Date(task.startTime);
    // Create a date object with just the date part (no time) for comparison
    const taskDay = new Date(
      taskDate.getFullYear(),
      taskDate.getMonth(),
      taskDate.getDate()
    );
    
    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    
    // Compare the dates without time
    return taskDay.getTime() === selectedDay.getTime();
  });

  // Handle task completion toggle
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Replace the handleTitleChange function
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Save title to backend
    try {
      await updateUserData({ pageTitle: newTitle });
    } catch (error) {
      console.error('Error saving page title:', error);
    }
  };

  // Replace the handleBlockChange function
  const handleBlockChange = async (id: string, content: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updatedBlocks);
    
    // Save blocks to backend
    try {
      await updateUserData({ blocks: updatedBlocks });
    } catch (error) {
      console.error('Error saving blocks:', error);
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
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

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-500';
      case 'extracurricular':
        return 'bg-purple-500';
      case 'work':
        return 'bg-orange-500';
      case 'personal':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <BookOpen size={14} className="mr-1" />;
      case 'extracurricular':
        return <Users size={14} className="mr-1" />;
      case 'work':
        return <Code size={14} className="mr-1" />;
      case 'personal':
        return <Heart size={14} className="mr-1" />;
      default:
        return <Circle size={14} className="mr-1" />;
    }
  };

  // Get lighter category color for timetable background
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 text-blue-800';
      case 'extracurricular':
        return 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-800';
      case 'work':
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 text-orange-800';
      case 'personal':
        return 'bg-gradient-to-r from-teal-50 to-teal-100 border-teal-300 text-teal-800';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Generate time slots for the timetable
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      slots.push(`${formattedHour}:00 ${amPm}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Find tasks for a specific time slot
  const getTasksForTimeSlot = (tasks: Task[], timeSlot: string, date: Date) => {
    // Parse the time slot string (e.g., "9:00 AM")
    const [hourStr, minuteStr] = timeSlot.split(':');
    let hour = parseInt(hourStr);
    const amPm = minuteStr.split(' ')[1]; // Extract AM/PM
    
    // Convert to 24-hour format
    if (amPm === 'PM' && hour !== 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    
    // Create Date objects for the start and end of the time slot
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    
    // Filter tasks that overlap with this time slot
    return tasks.filter(task => {
      const taskStart = new Date(task.startTime);
      const taskEnd = new Date(task.endTime);
      
      // Check if the task is on the same day as the provided date
      const sameDay = (
        taskStart.getDate() === date.getDate() &&
        taskStart.getMonth() === date.getMonth() &&
        taskStart.getFullYear() === date.getFullYear()
      );
      
      // Check if the task overlaps with the time slot
      const overlaps = (
        (taskStart < slotEnd && taskEnd > slotStart) || 
        (taskStart.getHours() === hour) ||
        (taskEnd.getHours() === hour + 1)
      );
      
      return sameDay && overlaps;
    });
  };

  // Calculate task position and height in timetable
  const getTaskStyle = (task: Task) => {
    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime);
    
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    
    // Calculate top position (percentage within the hour)
    const topOffset = (startMinutes / 60) * 100;
    
    // Calculate height (duration in hours)
    const durationHours = (endHour - startHour) + (endMinutes - startMinutes) / 60;
    const height = durationHours * 100;
    
    return {
      top: `${topOffset}%`,
      height: `${height}%`,
      width: '95%'
    };
  };

  // Get days of the current week
  const daysOfWeek = eachDayOfInterval({
    start: currentWeek,
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  });

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Filter tasks for a specific day
  const getTasksForDay = (day: Date) => {
    // Create start and end of the day for comparison
    const startOfDayDate = new Date(day);
    startOfDayDate.setHours(0, 0, 0, 0);
    
    const endOfDayDate = new Date(day);
    endOfDayDate.setHours(23, 59, 59, 999);
    
    return tasks.filter(task => {
      const taskStart = new Date(task.startTime);
      
      // Check if the task starts on this day
      return (
        taskStart.getDate() === day.getDate() &&
        taskStart.getMonth() === day.getMonth() &&
        taskStart.getFullYear() === day.getFullYear()
      );
    });
  };

  // Get page title based on active page
  const getPageTitle = () => {
    switch (activePage) {
      case 'schedule':
        return 'Schedule';
      case 'analytics':
        return 'Analytics';
      case 'academic':
        return 'Academic Planner';
      case 'settings':
        return 'Settings';
      default:
        return 'Schedule';
    }
  };

  // Add this new function for handling task editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Handle task update
  const handleTaskUpdate = async (updatedTask: Task) => {
    if (!updatedTask.id) {
      console.error('Task ID is missing');
      return;
    }

    try {
      // Make a copy to avoid reference issues
      const taskToUpdate = { ...updatedTask };
      
      // Format dates if needed
      if (!(taskToUpdate.startTime instanceof Date)) {
        taskToUpdate.startTime = new Date(taskToUpdate.startTime);
      }
      
      if (!(taskToUpdate.endTime instanceof Date)) {
        taskToUpdate.endTime = new Date(taskToUpdate.endTime);
      }

      // Update task using TaskContext
      const result = await updateTask(taskToUpdate.id, taskToUpdate);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === result.id ? result : task)
      );
      
      // Close task modal
      setEditingTask(null);
      
      // Force a re-render of the current view
      setSelectedDate(new Date(selectedDate));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  // Handle saving a new task
  const handleSaveNewTask = async (newTask: Task) => {
    try {
      // Ensure dates are properly formatted
      const startTime = newTask.startTime instanceof Date ? newTask.startTime : new Date(newTask.startTime);
      const endTime = newTask.endTime instanceof Date ? newTask.endTime : new Date(newTask.endTime);
      
      // Create a new task using TaskContext
      const result = await addTask({
        title: newTask.title,
        description: newTask.description,
        startTime: startTime,
        endTime: endTime,
        priority: newTask.priority,
        category: newTask.category,
        completed: newTask.completed
      });
      
      // Update local state
      setTasks(prevTasks => [...prevTasks, result]);
      
      // Close task modal
      setEditingTask(null);
      
      // If the task is for the selected date, update the view
      const taskDate = new Date(result.startTime);
      if (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      ) {
        // Force a re-render
        setSelectedDate(new Date(selectedDate));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  // Handle creating a new task
  const handleCreateTask = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const newTask: Task = {
      id: '', // Will be generated when saved
      title: 'New Task',
      description: '',
      startTime: now,
      endTime: oneHourLater,
      priority: 'medium',
      category: 'study',
      completed: false
    };
    
    setEditingTask(newTask);
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      // Delete task using TaskContext
      await deleteTask(taskId);
      
      // Update local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Add this function for handling task time changes via drag and drop
  const handleDragStart = (task: Task) => {
    setIsDragging(true);
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, timeSlot: string, date: Date) => {
    e.preventDefault();
    if (!draggedTask) return;
    
    const [hourStr, minuteStr] = timeSlot.split(':');
    const [hourNum, amPm] = hourStr.trim().split(' ');
    
    let hour = parseInt(hourNum);
    if (amPm === 'PM' && hour !== 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    
    const newStartTime = new Date(date);
    newStartTime.setHours(hour, 0, 0, 0);
    
    const originalStart = new Date(draggedTask.startTime);
    const originalEnd = new Date(draggedTask.endTime);
    const duration = originalEnd.getTime() - originalStart.getTime();
    
    const newEndTime = new Date(newStartTime.getTime() + duration);
    
    const updatedTask = {
      ...draggedTask,
      startTime: newStartTime,
      endTime: newEndTime
    };
    
    handleTaskUpdate(updatedTask);
    setIsDragging(false);
    setDraggedTask(null);
  };

  // Toggle Pomodoro Timer
  const togglePomodoroTimer = () => {
    setShowPomodoroTimer(!showPomodoroTimer);
  };

  // Render different content based on active page
  const renderPageContent = () => {
    switch (activePage) {
      case 'schedule':
        return (
          <>
            {/* Schedule Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{getPageTitle()}</h2>
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex border border-gray-200 rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center px-2 sm:px-3 py-1.5 ${
                        viewMode === 'list' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <List size={16} className="sm:mr-1" />
                      <span className="hidden sm:inline text-sm">List</span>
                    </button>
                    <button
                      onClick={() => setViewMode('timetable')}
                      className={`flex items-center px-2 sm:px-3 py-1.5 ${
                        viewMode === 'timetable' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Grid size={16} className="sm:mr-1" />
                      <span className="hidden sm:inline text-sm">Day</span>
                    </button>
                    <button
                      onClick={() => setViewMode('weekly')}
                      className={`flex items-center px-2 sm:px-3 py-1.5 ${
                        viewMode === 'weekly' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CalendarIcon size={16} className="sm:mr-1" />
                      <span className="hidden sm:inline text-sm">Week</span>
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center space-x-1 px-3 py-1 border rounded-md hover:bg-gray-50"
                    >
                      <CalendarIcon size={16} />
                      <span>{format(selectedDate, 'MMM d, yyyy')}</span>
                    </button>
                    {showDatePicker && (
                      <div className="absolute right-0 mt-1 z-10">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date: Date) => {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                          }}
                          inline
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Weekly View - Simplified */}
              {viewMode === 'weekly' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-blue-50">
                    <button 
                      onClick={goToPreviousWeek}
                      className="p-1 rounded hover:bg-blue-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="font-medium text-sm sm:text-base">
                      <span className="hidden sm:inline">
                        {format(currentWeek, 'MMMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMMM d, yyyy')}
                      </span>
                      <span className="sm:hidden">
                        {format(currentWeek, 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')}
                      </span>
                    </h3>
                    <button 
                      onClick={goToNextWeek}
                      className="p-1 rounded hover:bg-blue-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 bg-gray-50">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="p-2 text-center font-medium text-sm">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7">
                    {daysOfWeek.map((day, index) => (
                      <div 
                        key={index} 
                        className={`border p-1 sm:p-2 ${
                          isToday(day) ? 'bg-blue-50' : ''
                        } hover:bg-gray-50 cursor-pointer`}
                        onClick={() => {
                          // Create a new Date object to avoid reference issues
                          const newSelectedDate = new Date(
                            day.getFullYear(),
                            day.getMonth(),
                            day.getDate()
                          );
                          setSelectedDate(newSelectedDate);
                          setViewMode('timetable');
                        }}
                      >
                        <div className="flex justify-between items-center mb-1 sm:mb-2">
                          <span className={`flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full ${
                            isToday(day) ? 'bg-blue-600 text-white' : ''
                          } text-xs sm:text-sm font-medium`}>
                            {format(day, 'd')}
                          </span>
                          {getTasksForDay(day).length > 0 && (
                            <span className="text-xs px-1 sm:px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                              {getTasksForDay(day).length}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {getTasksForDay(day)
                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                            .slice(0, 2) // Show only first 2 tasks
                            .map(task => (
                              <div 
                                key={task.id} 
                                className={`p-1 sm:p-1.5 text-xs rounded border-l-2 ${
                                  task.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
                                  task.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
                                  'border-l-green-500 bg-green-50'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTask(task);
                                }}
                              >
                                <div className="font-medium truncate text-xs">
                                  {task.title}
                                </div>
                                <div className="text-xs mt-0.5 text-gray-500 hidden sm:block">
                                  {formatTime(new Date(task.startTime))}
                                </div>
                              </div>
                            ))}
                          
                          {getTasksForDay(day).length > 2 && (
                            <div className="text-xs text-center bg-gray-100 rounded p-1 text-gray-600 hover:bg-gray-200">
                              +{getTasksForDay(day).length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Display - Simplified List View */}
              {viewMode === 'list' && (
                <div>
                  {tasksForSelectedDate.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-3 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
                        <h3 className="font-medium text-center text-lg text-blue-800">
                          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <button 
                          onClick={handleCreateTask}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                        >
                          <span className="mr-1">+</span> Add Task
                        </button>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {tasksForSelectedDate
                          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                          .map((task) => (
                            <div
                              key={task.id}
                              className="p-2 sm:p-3 hover:bg-gray-50"
                            >
                              <div className="flex items-start">
                                <div className={`w-1 h-full mr-2 sm:mr-3 self-stretch rounded-full ${
                                  task.priority === 'high' ? 'bg-red-500' : 
                                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start flex-wrap">
                                    <h3 className="font-medium text-gray-900 flex items-center text-sm sm:text-base">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTaskCompletion(task.id);
                                        }}
                                        className="mr-2"
                                      >
                                        {task.completed ? 
                                          <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500" /> : 
                                          <Circle size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                                        }
                                      </button>
                                      <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                        {task.title}
                                      </span>
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                                      <div className="text-xs sm:text-sm text-gray-500">
                                        {formatTime(new Date(task.startTime))} - {formatTime(new Date(task.endTime))}
                                      </div>
                                      <div className="flex space-x-1">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditTask(task);
                                          }}
                                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                                          </svg>
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTask(task.id);
                                          }}
                                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mt-1 ml-6">{task.description}</p>
                                  )}
                                  <div className="flex items-center mt-2 ml-6">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                        task.category === 'academic' ? 'bg-blue-100 text-blue-800' : 
                                        task.category === 'work' ? 'bg-orange-100 text-orange-800' :
                                        task.category === 'personal' ? 'bg-teal-100 text-teal-800' :
                                        'bg-purple-100 text-purple-800'
                                      }`}
                                    >
                                      {getCategoryIcon(task.category)}
                                      {task.category}
                                    </span>
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs ml-2 ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}
                                    >
                                      {task.priority} priority
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500 mb-3">No tasks scheduled for this date</p>
                      <div className="flex justify-center space-x-3">
                        <button 
                          onClick={handleCreateTask}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add Task Manually
                        </button>
                        <button 
                          onClick={() => document.querySelector('.ai-input textarea')?.focus()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Generate with AI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tasks Display - Simplified Timetable View */}
              {viewMode === 'timetable' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-3 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
                    <h3 className="font-medium text-center text-lg text-blue-800">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <button 
                      onClick={handleCreateTask}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                    >
                      <span className="mr-1">+</span> Add Task
                    </button>
                  </div>
                  
                  {tasksForSelectedDate.length > 0 ? (
                    <div className="timetable">
                      {timeSlots.map((timeSlot) => {
                        const tasksInSlot = getTasksForTimeSlot(tasksForSelectedDate, timeSlot, selectedDate);
                        
                        return (
                          <div key={timeSlot} className="relative">
                            <div 
                              className="flex border-b border-gray-100"
                              onDragOver={(e) => handleDragOver(e, timeSlot)}
                              onDrop={(e) => handleDrop(e, timeSlot, selectedDate)}
                            >
                              <div className="w-12 sm:w-16 py-2 px-1 sm:px-2 text-xs sm:text-sm font-medium border-r border-gray-100 bg-gray-50">
                                {timeSlot}
                              </div>
                              <div className="flex-1 min-h-[50px] sm:min-h-[60px] relative hover:bg-gray-50">
                                {tasksInSlot.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`absolute left-0 p-1 sm:p-2 rounded border ${
                                      task.priority === 'high' ? 'border-red-300 bg-red-50' : 
                                      task.priority === 'medium' ? 'border-yellow-300 bg-yellow-50' : 
                                      'border-green-300 bg-green-50'
                                    } overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                                    style={getTaskStyle(task)}
                                    onClick={() => handleEditTask(task)}
                                    draggable
                                    onDragStart={() => handleDragStart(task)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-medium text-xs sm:text-sm">
                                        {task.title}
                                      </h4>
                                      <div className="flex space-x-1">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTaskCompletion(task.id);
                                          }}
                                          className="text-gray-500 hover:text-gray-700"
                                        >
                                          {task.completed ? 
                                            <CheckCircle size={12} className="sm:w-4 sm:h-4 text-green-500" /> : 
                                            <Circle size={12} className="sm:w-4 sm:h-4" />
                                          }
                                        </button>
                                      </div>
                                    </div>
                                    <div className="text-xs mt-1 text-gray-600 hidden sm:block">
                                      {formatTime(new Date(task.startTime))} - {formatTime(new Date(task.endTime))}
                                    </div>
                                    {task.description && (
                                      <p className="text-xs mt-1 line-clamp-1 text-gray-700 hidden sm:block">{task.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50">
                      <p className="text-gray-500 mb-3">No tasks scheduled for this date</p>
                      <div className="flex justify-center space-x-3">
                        <button 
                          onClick={handleCreateTask}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add Task Manually
                        </button>
                        <button 
                          onClick={() => document.querySelector('.ai-input textarea')?.focus()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Generate with AI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* AI Assistant Section */}
            <div className="mt-6 sm:mt-8 bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">AI Schedule Assistant</h3>
                <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg text-indigo-700 mb-3 sm:mb-4 text-sm sm:text-base">
                  <p>{aiMessage}</p>
                </div>
              </div>
              
              <EnhancedAIInput 
                onAddTasks={(newTasks) => {
                  // Add the new tasks to the existing tasks
                  const updatedTasks = [...tasks, ...newTasks];
                  setTasks(updatedTasks);
                }}
                existingTasks={tasks}
                onUpdateMessage={setAIMessage}
              />
            </div>
          </>
        );
      case 'analytics':
        return <AnalyticsView tasks={tasks} />;
      case 'academic':
        return <AcademicPlanner />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:min-h-screen border-r border-gray-200`}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={(newPage) => {
            setActivePage(newPage);
            setShowSidebar(false);
          }} 
          closeSidebar={() => setShowSidebar(false)}
          openPomodoroTimer={togglePomodoroTimer}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-indigo-600">AI Course Scheduler</h1>
            <div className="w-6"></div> {/* Empty div for flex spacing */}
          </div>
          
          {/* Page Title */}
          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-bold w-full border-none focus:outline-none focus:ring-0 bg-transparent"
              placeholder="Untitled"
            />
          </div>
          
          {/* Page Content */}
          {renderPageContent()}
        </div>
      </div>
      
      {/* Pomodoro Timer Modal */}
      {showPomodoroTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <PomodoroTimer onClose={togglePomodoroTimer} />
          </div>
        </div>
      )}
      
      {/* Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <TaskForm
              task={editingTask}
              onSave={editingTask.id ? handleTaskUpdate : handleSaveNewTask}
              onCancel={() => setEditingTask(null)}
              onDelete={editingTask.id ? handleDeleteTask : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotionPage; 