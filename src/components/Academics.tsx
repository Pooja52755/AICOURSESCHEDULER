import React from 'react';
import { BookOpen, Clock, Calendar, GraduationCap, Users, FileText, TrendingUp } from 'lucide-react';

const Academics = () => {
  const courses = [
    {
      id: 1,
      name: 'Database Systems',
      professor: 'Dr. Smith',
      schedule: 'Mon, Wed 9:00 AM',
      progress: 75,
      color: 'bg-blue-600',
    },
    {
      id: 2,
      name: 'Machine Learning',
      professor: 'Dr. Johnson',
      schedule: 'Tue, Thu 2:00 PM',
      progress: 60,
      color: 'bg-purple-600',
    },
    {
      id: 3,
      name: 'Software Engineering',
      professor: 'Prof. Williams',
      schedule: 'Wed, Fri 11:00 AM',
      progress: 85,
      color: 'bg-green-600',
    },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Academic Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current GPA</p>
                  <h3 className="text-2xl font-bold text-gray-900">3.8</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Hours</p>
                  <h3 className="text-2xl font-bold text-gray-900">28.5</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assignments</p>
                  <h3 className="text-2xl font-bold text-gray-900">12</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className={`h-2 ${course.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>{course.professor}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{Math.floor(Math.random() * 20 + 20)} Students</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-indigo-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${course.color} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {Math.floor(Math.random() * 3 + 1)} Assignments Due
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Next Class in {Math.floor(Math.random() * 48)} hours
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Academics;