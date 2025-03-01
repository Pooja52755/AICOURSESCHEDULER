const UserData = require('../models/UserData');
const asyncHandler = require('express-async-handler');

// @desc    Get user data
// @route   GET /api/userdata
// @access  Private
const getUserData = asyncHandler(async (req, res) => {
  let userData = await UserData.findOne({ userId: req.user.id });

  if (!userData) {
    // Create default user data if it doesn't exist
    userData = await UserData.create({
      userId: req.user.id,
      pageTitle: 'My Schedule',
      blocks: [{ id: Date.now().toString(), type: 'text', content: '' }]
    });
  }

  res.json(userData);
});

// @desc    Update user data
// @route   PUT /api/userdata
// @access  Private
const updateUserData = asyncHandler(async (req, res) => {
  const { pageTitle, blocks } = req.body;

  let userData = await UserData.findOne({ userId: req.user.id });

  if (!userData) {
    // Create user data if it doesn't exist
    userData = await UserData.create({
      userId: req.user.id,
      pageTitle: pageTitle || 'My Schedule',
      blocks: blocks || [{ id: Date.now().toString(), type: 'text', content: '' }]
    });
  } else {
    // Update existing user data
    userData.pageTitle = pageTitle || userData.pageTitle;
    
    if (blocks) {
      userData.blocks = blocks;
    }
    
    userData.lastUpdated = Date.now();
    await userData.save();
  }

  res.json(userData);
});

// @desc    Update premium status
// @route   PUT /api/userdata/premium
// @access  Private
const updatePremiumStatus = asyncHandler(async (req, res) => {
  const { isPremium, premiumFeatures } = req.body;

  let userData = await UserData.findOne({ userId: req.user.id });

  if (!userData) {
    // Create user data if it doesn't exist
    userData = await UserData.create({
      userId: req.user.id,
      isPremium: isPremium || false,
      premiumFeatures: premiumFeatures || {
        aiSuggestions: false,
        advancedAnalytics: false,
        unlimitedTasks: false,
        customThemes: false
      }
    });
  } else {
    // Update premium status
    if (isPremium !== undefined) {
      userData.isPremium = isPremium;
    }
    
    if (premiumFeatures) {
      userData.premiumFeatures = {
        ...userData.premiumFeatures,
        ...premiumFeatures
      };
    }
    
    userData.lastUpdated = Date.now();
    await userData.save();
  }

  res.json(userData);
});

module.exports = {
  getUserData,
  updateUserData,
  updatePremiumStatus
}; 