import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface PomodoroTimerProps {
  onClose?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose }) => {
  // Timer states
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycles, setCycles] = useState<number>(0);
  
  // Settings
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [pomodoroTime, setPomodoroTime] = useState<number>(25);
  const [shortBreakTime, setShortBreakTime] = useState<number>(5);
  const [longBreakTime, setLongBreakTime] = useState<number>(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState<boolean>(false);
  
  // Sound
  const alarmSound = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(50);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Initialize audio
  useEffect(() => {
    alarmSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    alarmSound.current.volume = volume / 100;
    
    return () => {
      if (alarmSound.current) {
        alarmSound.current.pause();
        alarmSound.current = null;
      }
    };
  }, []);
  
  // Update volume when changed
  useEffect(() => {
    if (alarmSound.current) {
      alarmSound.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      if (soundEnabled && alarmSound.current) {
        alarmSound.current.play();
      }
      
      // Handle cycle completion
      if (mode === 'pomodoro') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        
        if (newCycles % 4 === 0) {
          // After 4 pomodoros, take a long break
          setMode('longBreak');
          setTimeLeft(longBreakTime * 60);
          if (autoStartBreaks) {
            setIsRunning(true);
          } else {
            setIsRunning(false);
          }
        } else {
          // Take a short break
          setMode('shortBreak');
          setTimeLeft(shortBreakTime * 60);
          if (autoStartBreaks) {
            setIsRunning(true);
          } else {
            setIsRunning(false);
          }
        }
      } else {
        // Break completed, start next pomodoro
        setMode('pomodoro');
        setTimeLeft(pomodoroTime * 60);
        if (autoStartPomodoros) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, mode, cycles, pomodoroTime, shortBreakTime, longBreakTime, autoStartBreaks, autoStartPomodoros, soundEnabled]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle mode change
  const handleModeChange = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    
    switch (newMode) {
      case 'pomodoro':
        setTimeLeft(pomodoroTime * 60);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeLeft(longBreakTime * 60);
        break;
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(pomodoroTime * 60);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeLeft(longBreakTime * 60);
        break;
    }
  };
  
  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      pomodoroTime,
      shortBreakTime,
      longBreakTime,
      autoStartBreaks,
      autoStartPomodoros,
      volume,
      soundEnabled
    };
    
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    setShowSettings(false);
    
    // Update current timer based on new settings
    if (mode === 'pomodoro') {
      setTimeLeft(pomodoroTime * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPomodoroTime(settings.pomodoroTime || 25);
      setShortBreakTime(settings.shortBreakTime || 5);
      setLongBreakTime(settings.longBreakTime || 15);
      setAutoStartBreaks(settings.autoStartBreaks || false);
      setAutoStartPomodoros(settings.autoStartPomodoros || false);
      setVolume(settings.volume || 50);
      setSoundEnabled(settings.soundEnabled !== undefined ? settings.soundEnabled : true);
    }
  }, []);
  
  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    let totalTime;
    switch (mode) {
      case 'pomodoro':
        totalTime = pomodoroTime * 60;
        break;
      case 'shortBreak':
        totalTime = shortBreakTime * 60;
        break;
      case 'longBreak':
        totalTime = longBreakTime * 60;
        break;
      default:
        totalTime = pomodoroTime * 60;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pomodoro Timer</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-gray-600">&times;</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Mode Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === 'pomodoro' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleModeChange('pomodoro')}
          >
            Pomodoro
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === 'shortBreak' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleModeChange('shortBreak')}
          >
            Short Break
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === 'longBreak' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleModeChange('longBreak')}
          >
            Long Break
          </button>
        </div>
      </div>
      
      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="w-64 h-64 mx-auto rounded-full flex items-center justify-center bg-gray-50 border-8 border-indigo-100">
          <div className="text-5xl font-bold text-gray-800">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress Circle */}
        <svg className="absolute top-0 left-1/2 transform -translate-x-1/2" width="280" height="280">
          <circle
            cx="140"
            cy="140"
            r="130"
            fill="none"
            stroke="#e0e7ff"
            strokeWidth="8"
          />
          <circle
            cx="140"
            cy="140"
            r="130"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - getProgressPercentage() / 100)}`}
            transform="rotate(-90 140 140)"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-md focus:outline-none"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-4 shadow-md focus:outline-none"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
      
      {/* Cycles */}
      <div className="text-center text-gray-600">
        <p>Completed: {cycles} cycles</p>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Timer Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pomodoro (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroTime}
                  onChange={(e) => setPomodoroTime(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakTime}
                  onChange={(e) => setShortBreakTime(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakTime}
                  onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoStartBreaks"
                  checked={autoStartBreaks}
                  onChange={(e) => setAutoStartBreaks(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="autoStartBreaks" className="ml-2 text-sm text-gray-700">
                  Auto-start breaks
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoStartPomodoros"
                  checked={autoStartPomodoros}
                  onChange={(e) => setAutoStartPomodoros(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="autoStartPomodoros" className="ml-2 text-sm text-gray-700">
                  Auto-start pomodoros
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sound Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="soundEnabled" className="ml-2 text-sm text-gray-700">
                  Enable sound
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer; 