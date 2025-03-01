import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

// Define types
export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'study' | 'work' | 'personal' | 'other';
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getTasks: () => Promise<Task[]>;
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<Task>;
  getTasksByDateRange: (startDate: Date, endDate: Date) => Task[];
}

interface TaskProviderProps {
  children: ReactNode;
}

// Create the task context
const TaskContext = createContext<TaskContextType | null>(null);

// Task provider component
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load tasks when authenticated
  useEffect(() => {
    loadTasks();
  }, [isAuthenticated]);

  // Load tasks from localStorage
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedTasks = localStorage.getItem('tasks');
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        
        // Convert string dates to Date objects
        const formattedTasks = parsedTasks.map((task: any) => ({
          ...task,
          startTime: new Date(task.startTime),
          endTime: new Date(task.endTime)
        }));
        
        setTasks(formattedTasks);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
    }
  };

  // Get all tasks
  const getTasks = async (): Promise<Task[]> => {
    if (loading) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for loading to complete
    }
    return tasks;
  };

  // Add a new task
  const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const newTask = {
        ...task,
        id: uuidv4()
      } as Task;
      
      // Update state and localStorage
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      
      return newTask;
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
      console.error('Error adding task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      // Find the task to update
      const taskToUpdate = tasks.find(task => task.id === id);
      
      if (!taskToUpdate) {
        throw new Error('Task not found');
      }
      
      // Create updated task
      const updatedTask = {
        ...taskToUpdate,
        ...taskData
      };
      
      // Update state and localStorage
      const updatedTasks = tasks.map(task => task.id === id ? updatedTask : task);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      
      return updatedTask;
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Update state and localStorage
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string): Promise<Task> => {
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return updateTask(id, { completed: !task.completed });
  };

  // Get tasks by date range
  const getTasksByDateRange = (startDate: Date, endDate: Date): Task[] => {
    return tasks.filter(task => {
      const taskStart = new Date(task.startTime);
      return taskStart >= startDate && taskStart <= endDate;
    });
  };

  // Context value
  const value: TaskContextType = {
    tasks,
    loading,
    error,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksByDateRange
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use the task context
export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext; 