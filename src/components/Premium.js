import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
  const { userData, updatePremiumStatus, hasPremiumAccess, hasPremiumFeature } = useUserData();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({
    aiSuggestions: false,
    advancedAnalytics: false,
    unlimitedTasks: false,
    customThemes: false
  });

  useEffect(() => {
    // Initialize selected features from user data
    if (userData && userData.premiumFeatures) {
      setSelectedFeatures({
        aiSuggestions: userData.premiumFeatures.aiSuggestions || false,
        advancedAnalytics: userData.premiumFeatures.advancedAnalytics || false,
        unlimitedTasks: userData.premiumFeatures.unlimitedTasks || false,
        customThemes: userData.premiumFeatures.customThemes || false
      });
    }
  }, [userData]);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      features: ['Limited tasks', 'Basic scheduling', 'Standard themes'],
      premiumFeatures: {
        aiSuggestions: false,
        advancedAnalytics: false,
        unlimitedTasks: false,
        customThemes: false
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99/month',
      features: ['Unlimited tasks', 'AI scheduling suggestions', 'Advanced analytics', 'Custom themes'],
      premiumFeatures: {
        aiSuggestions: true,
        advancedAnalytics: true,
        unlimitedTasks: true,
        customThemes: true
      }
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Custom pricing',
      features: ['Choose your features', 'Pay for what you need'],
      premiumFeatures: null // Will be set based on user selection
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (plan.id !== 'custom') {
      setSelectedFeatures(plan.premiumFeatures);
    }
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures({
      ...selectedFeatures,
      [feature]: !selectedFeatures[feature]
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const isPremium = selectedPlan && selectedPlan.id !== 'basic';
      const premiumFeatures = selectedPlan && selectedPlan.id === 'custom' 
        ? selectedFeatures 
        : selectedPlan?.premiumFeatures || {};

      await updatePremiumStatus({
        isPremium,
        premiumFeatures
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update premium status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Premium Features</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Premium status updated successfully! Redirecting...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan && selectedPlan.id === plan.id 
                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => handlePlanSelect(plan)}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-2xl font-bold text-indigo-600 mb-4">{plan.price}</p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && selectedPlan.id === 'custom' && (
        <div className="border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Customize Your Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="aiSuggestions"
                checked={selectedFeatures.aiSuggestions}
                onChange={() => handleFeatureToggle('aiSuggestions')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="aiSuggestions" className="ml-2 block text-sm text-gray-900">
                AI Scheduling Suggestions ($4.99/month)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="advancedAnalytics"
                checked={selectedFeatures.advancedAnalytics}
                onChange={() => handleFeatureToggle('advancedAnalytics')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="advancedAnalytics" className="ml-2 block text-sm text-gray-900">
                Advanced Analytics ($3.99/month)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="unlimitedTasks"
                checked={selectedFeatures.unlimitedTasks}
                onChange={() => handleFeatureToggle('unlimitedTasks')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="unlimitedTasks" className="ml-2 block text-sm text-gray-900">
                Unlimited Tasks ($2.99/month)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="customThemes"
                checked={selectedFeatures.customThemes}
                onChange={() => handleFeatureToggle('customThemes')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="customThemes" className="ml-2 block text-sm text-gray-900">
                Custom Themes ($1.99/month)
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedPlan || loading}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            !selectedPlan || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Subscription'}
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Status</h3>
        <p className="mb-2">
          <span className="font-medium">Premium Access:</span>{' '}
          {hasPremiumAccess() ? (
            <span className="text-green-600">Active</span>
          ) : (
            <span className="text-gray-600">Inactive</span>
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p>
            <span className="font-medium">AI Suggestions:</span>{' '}
            {hasPremiumFeature('aiSuggestions') ? (
              <span className="text-green-600">Enabled</span>
            ) : (
              <span className="text-gray-600">Disabled</span>
            )}
          </p>
          <p>
            <span className="font-medium">Advanced Analytics:</span>{' '}
            {hasPremiumFeature('advancedAnalytics') ? (
              <span className="text-green-600">Enabled</span>
            ) : (
              <span className="text-gray-600">Disabled</span>
            )}
          </p>
          <p>
            <span className="font-medium">Unlimited Tasks:</span>{' '}
            {hasPremiumFeature('unlimitedTasks') ? (
              <span className="text-green-600">Enabled</span>
            ) : (
              <span className="text-gray-600">Disabled</span>
            )}
          </p>
          <p>
            <span className="font-medium">Custom Themes:</span>{' '}
            {hasPremiumFeature('customThemes') ? (
              <span className="text-green-600">Enabled</span>
            ) : (
              <span className="text-gray-600">Disabled</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium; 