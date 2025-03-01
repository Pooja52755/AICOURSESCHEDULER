import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, error: authError, loading: authLoading } = useAuth();
  const { userData, hasPremiumAccess } = useUserData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      theme: 'light',
      defaultView: 'weekly'
    }
  });

  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        preferences: {
          theme: user.preferences?.theme || 'light',
          defaultView: user.preferences?.defaultView || 'weekly'
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    setLoading(true);

    // Validate passwords if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Only include password if it's provided
      const updateData = {
        name: formData.name,
        email: formData.email,
        preferences: formData.preferences
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateProfile(updateData);
      setSuccess(true);
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}
      
      {(formError || authError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError || authError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            
            <div className="mb-4">
              <label htmlFor="theme" className="block text-gray-700 text-sm font-bold mb-2">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={formData.preferences.theme}
                onChange={handlePreferenceChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                {hasPremiumAccess() && (
                  <>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="defaultView" className="block text-gray-700 text-sm font-bold mb-2">
                Default View
              </label>
              <select
                id="defaultView"
                name="defaultView"
                value={formData.preferences.defaultView}
                onChange={handlePreferenceChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="weekly">Weekly</option>
                <option value="timetable">Timetable</option>
                <option value="list">List</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading || authLoading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  (loading || authLoading) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {loading || authLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Status</h2>
            <p className="mb-2">
              <span className="font-medium">Name:</span> {user?.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="mb-2">
              <span className="font-medium">Member Since:</span>{' '}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
            <p className="mb-4">
              <span className="font-medium">Subscription:</span>{' '}
              {hasPremiumAccess() ? (
                <span className="text-green-600">Premium</span>
              ) : (
                <span>Free</span>
              )}
            </p>
            
            <button
              onClick={() => navigate('/premium')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {hasPremiumAccess() ? 'Manage Subscription' : 'Upgrade to Premium'}
            </button>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 