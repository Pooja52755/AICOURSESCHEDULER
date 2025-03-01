import { taskService } from './apiService';

// Convert frontend Task format to backend format
const convertToBackendTask = (task) => {
  return {
    title: task.title,
    description: task.description || '',
    startTime: new Date(task.startTime),
    endTime: new Date(task.endTime),
    priority: task.priority || 'medium',
    category: task.category || 'personal',
    completed: task.completed || false
  };
};

// Convert backend task format to frontend format
const convertToFrontendTask = (task) => {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    startTime: new Date(task.startTime),
    endTime: new Date(task.endTime),
    priority: task.priority,
    category: task.category,
    completed: task.completed
  };
};

export const scheduleService = {
  // Save a schedule (array of tasks)
  saveSchedule: async (tasks) => {
    try {
      // Delete existing tasks first (optional, depends on your use case)
      const existingTasks = await taskService.getTasks();
      for (const task of existingTasks) {
        await taskService.deleteTask(task._id);
      }

      // Create new tasks
      const savedTasks = [];
      for (const task of tasks) {
        const backendTask = convertToBackendTask(task);
        const savedTask = await taskService.createTask(backendTask);
        savedTasks.push(convertToFrontendTask(savedTask));
      }
      
      return savedTasks;
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  },

  // Get the user's schedule
  getSchedule: async () => {
    try {
      const tasks = await taskService.getTasks();
      return tasks.map(task => convertToFrontendTask(task));
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  // Get tasks for a specific date range
  getTasksByDateRange: async (startDate, endDate) => {
    try {
      const tasks = await taskService.getTasksByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      );
      return tasks.map(task => convertToFrontendTask(task));
    } catch (error) {
      console.error('Error fetching tasks by date range:', error);
      throw error;
    }
  },

  // Create a single task
  createTask: async (task) => {
    try {
      const backendTask = convertToBackendTask(task);
      const savedTask = await taskService.createTask(backendTask);
      return convertToFrontendTask(savedTask);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    try {
      const backendTask = convertToBackendTask(taskData);
      const updatedTask = await taskService.updateTask(taskId, backendTask);
      return convertToFrontendTask(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}; 