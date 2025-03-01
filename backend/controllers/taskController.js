const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, startTime, endTime, priority, category } = req.body;

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide title, start time, and end time' });
    }

    // Create task
    const task = await Task.create({
      userId: req.user.id,
      title,
      description: description || '',
      startTime,
      endTime,
      priority: priority || 'medium',
      category: category || 'other',
      completed: false
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if the task belongs to the user
  if (task.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, priority, category, completed } = req.body;

    // Find task
    let task = await Task.findById(id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startTime,
        endTime,
        priority,
        category,
        completed
      },
      { new: true }
    );

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findById(id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    res.status(200).json({ id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tasks for a specific date range
// @route   GET /api/tasks/range
// @access  Private
const getTasksByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide start and end dates');
  }

  const tasks = await Task.find({
    userId: req.user.id,
    startTime: { $gte: new Date(startDate) },
    endTime: { $lte: new Date(endDate) },
  });

  res.json(tasks);
});

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByDateRange,
}; 