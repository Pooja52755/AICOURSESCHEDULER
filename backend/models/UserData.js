const mongoose = require('mongoose');

const blockSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  }
});

const userDataSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    pageTitle: {
      type: String,
      default: 'My Schedule'
    },
    blocks: [blockSchema],
    isPremium: {
      type: Boolean,
      default: false
    },
    premiumFeatures: {
      aiSuggestions: {
        type: Boolean,
        default: false
      },
      advancedAnalytics: {
        type: Boolean,
        default: false
      },
      unlimitedTasks: {
        type: Boolean,
        default: false
      },
      customThemes: {
        type: Boolean,
        default: false
      }
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData; 