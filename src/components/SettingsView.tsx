import React, { useState } from 'react';
import { Save, Bell, Moon, Sun, Clock, Palette, Globe, Lock, User } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailNotifications: false,
    timeFormat: '12h',
    language: 'english',
    colorScheme: 'indigo',
    autoSave: true,
    focusMode: false,
    privacy: {
      shareAnalytics: true,
      publicProfile: false
    },
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      institution: 'University of Technology',
      major: 'Computer Science',
      year: 'Junior'
    }
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleToggle = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const colorSchemes = [
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' }
  ];

  const languages = [
    { name: 'English', value: 'english' },
    { name: 'Spanish', value: 'spanish' },
    { name: 'French', value: 'french' },
    { name: 'German', value: 'german' },
    { name: 'Chinese', value: 'chinese' },
    { name: 'Japanese', value: 'japanese' }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium">Profile Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => handleChange('profile', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution
            </label>
            <input
              type="text"
              value={settings.profile.institution}
              onChange={(e) => handleChange('profile', 'institution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            <input
              type="text"
              value={settings.profile.major}
              onChange={(e) => handleChange('profile', 'major', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={settings.profile.year}
              onChange={(e) => handleChange('profile', 'year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <Palette className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium">Appearance</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSettings({ ...settings, theme: 'light' })}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.theme === 'light'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Sun size={16} className="mr-2" />
                Light
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.theme === 'dark'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Moon size={16} className="mr-2" />
                Dark
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: 'system' })}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.theme === 'system'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                System
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Scheme
            </label>
            <div className="flex flex-wrap gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => setSettings({ ...settings, colorScheme: scheme.value })}
                  className={`w-8 h-8 rounded-full ${scheme.class} ${
                    settings.colorScheme === scheme.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                  }`}
                  title={scheme.name}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Time Format
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSettings({ ...settings, timeFormat: '12h' })}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.timeFormat === '12h'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Clock size={16} className="mr-2" />
                12-hour
              </button>
              <button
                onClick={() => setSettings({ ...settings, timeFormat: '24h' })}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.timeFormat === '24h'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Clock size={16} className="mr-2" />
                24-hour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">In-app Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications within the app</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Focus Mode</h3>
              <p className="text-sm text-gray-500">Disable notifications during study sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.focusMode}
                onChange={() => handleToggle('focusMode')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <Lock className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium">Privacy</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Share Analytics</h3>
              <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.shareAnalytics}
                onChange={() => handleChange('privacy', 'shareAnalytics', !settings.privacy.shareAnalytics)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Public Profile</h3>
              <p className="text-sm text-gray-500">Allow others to see your profile and progress</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.publicProfile}
                onChange={() => handleChange('privacy', 'publicProfile', !settings.privacy.publicProfile)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Save size={16} className="mr-2" />
          Save Settings
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md">
          Settings saved successfully!
        </div>
      )}
    </div>
  );
};

export default SettingsView; 