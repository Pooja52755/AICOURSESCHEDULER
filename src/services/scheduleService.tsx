import axios from 'axios';

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// Set up axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all tasks
const getSchedule = async () => {
  try {
    // Try to get tasks from backend
    const response = await axiosInstance.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule from backend:', error);
    
    // Fallback to localStorage if backend fails
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    
    return [];
  }
};

// Create a new task
const createTask = async (taskData: any) => {
  try {
    const response = await axiosInstance.post('/tasks', taskData);
    
    // Update localStorage as backup
    const savedTasks = localStorage.getItem('tasks');
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    tasks.push(response.data);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task
const updateTask = async (taskId: string, taskData: any) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    
    // Update localStorage as backup
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const updatedTasks = tasks.map((task: any) => 
        task.id === taskId ? { ...task, ...taskData } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
const deleteTask = async (taskId: string) => {
  try {
    await axiosInstance.delete(`/tasks/${taskId}`);
    
    // Update localStorage as backup
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const filteredTasks = tasks.filter((task: any) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Save schedule to localStorage (fallback method)
const saveScheduleToLocalStorage = (tasks: any[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const scheduleService = {
  getSchedule,
  createTask,
  updateTask,
  deleteTask,
  saveScheduleToLocalStorage
};

export default scheduleService; 