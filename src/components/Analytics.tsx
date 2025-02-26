import React from 'react';
import { PieChart, Clock, Calendar, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const stats = [
    {
      title: 'Study Hours',
      value: '28.5',
      change: '+12%',
      period: 'vs last week',
      icon: Clock,
    },
    {
      title: 'Tasks Completed',
      value: '42',
      change: '+8%',
      period: 'vs last week',
      icon: Calendar,
    },
    {
      title: 'Productivity Score',
      value: '85',
      change: '+5%',
      period: 'vs last week',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  <span className="text-gray-500 text-sm ml-1">{stat.period}</span>
                </div>
              </div>
              <stat.icon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Time Distribution</h2>
          <div className="flex items-center justify-center h-64">
            <PieChart className="w-48 h-48 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
          <div className="space-y-4">
            {['Study', 'Exercise', 'Work', 'Social'].map((activity) => (
              <div key={activity}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{activity}</span>
                  <span className="text-sm text-gray-600">
                    {Math.floor(Math.random() * 40 + 60)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2"
                    style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;