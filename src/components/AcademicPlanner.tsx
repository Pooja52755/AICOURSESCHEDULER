import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Clock, Calendar, CheckCircle2, Edit2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  professor: string;
  schedule: string;
  location: string;
  color: string;
  completed: boolean;
}

interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
}

const COLORS = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
  'bg-red-100 border-red-300 text-red-800',
  'bg-teal-100 border-teal-300 text-teal-800',
];

const AcademicPlanner: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Introduction to Computer Science',
      code: 'CS101',
      credits: 3,
      professor: 'Dr. Smith',
      schedule: 'Mon, Wed, Fri 10:00 AM - 11:00 AM',
      location: 'Science Building, Room 301',
      color: COLORS[0],
      completed: false
    },
    {
      id: '2',
      name: 'Calculus I',
      code: 'MATH201',
      credits: 4,
      professor: 'Dr. Johnson',
      schedule: 'Tue, Thu 1:00 PM - 3:00 PM',
      location: 'Math Building, Room 105',
      color: COLORS[1],
      completed: false
    }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      courseId: '1',
      title: 'Programming Assignment 1',
      dueDate: '2023-11-15',
      description: 'Implement a simple calculator in Python',
      completed: false
    },
    {
      id: '2',
      courseId: '2',
      title: 'Problem Set 3',
      dueDate: '2023-11-10',
      description: 'Complete problems 3.1-3.10 in the textbook',
      completed: true
    },
    {
      id: '3',
      courseId: '1',
      title: 'Midterm Exam',
      dueDate: '2023-11-20',
      description: 'Covers chapters 1-5',
      completed: false
    }
  ]);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    code: '',
    credits: 3,
    professor: '',
    schedule: '',
    location: '',
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  });
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    courseId: courses[0]?.id || '',
    title: '',
    dueDate: '',
    description: '',
    completed: false
  });
  const [editingCourse, setEditingCourse] = useState<string | null>(null);

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.code) return;
    
    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      code: newCourse.code,
      credits: newCourse.credits || 3,
      professor: newCourse.professor || '',
      schedule: newCourse.schedule || '',
      location: newCourse.location || '',
      color: newCourse.color || COLORS[0],
      completed: false
    };
    
    setCourses([...courses, course]);
    setNewCourse({
      name: '',
      code: '',
      credits: 3,
      professor: '',
      schedule: '',
      location: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    setShowAddCourse(false);
  };

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.dueDate || !newAssignment.courseId) return;
    
    const assignment: Assignment = {
      id: Date.now().toString(),
      courseId: newAssignment.courseId,
      title: newAssignment.title,
      dueDate: newAssignment.dueDate,
      description: newAssignment.description || '',
      completed: false
    };
    
    setAssignments([...assignments, assignment]);
    setNewAssignment({
      courseId: courses[0]?.id || '',
      title: '',
      dueDate: '',
      description: '',
      completed: false
    });
    setShowAddAssignment(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    setAssignments(assignments.filter(assignment => assignment.courseId !== id));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const toggleCourseCompletion = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, completed: !course.completed } : course
    ));
  };

  const toggleAssignmentCompletion = (id: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, completed: !assignment.completed } : assignment
    ));
  };

  const handleEditCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setEditingCourse(id);
      setNewCourse({ ...course });
      setShowAddCourse(true);
    }
  };

  const handleUpdateCourse = () => {
    if (!newCourse.name || !newCourse.code || !editingCourse) return;
    
    setCourses(courses.map(course => 
      course.id === editingCourse ? {
        ...course,
        name: newCourse.name || course.name,
        code: newCourse.code || course.code,
        credits: newCourse.credits || course.credits,
        professor: newCourse.professor || course.professor,
        schedule: newCourse.schedule || course.schedule,
        location: newCourse.location || course.location,
        color: newCourse.color || course.color
      } : course
    ));
    
    setNewCourse({
      name: '',
      code: '',
      credits: 3,
      professor: '',
      schedule: '',
      location: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    setEditingCourse(null);
    setShowAddCourse(false);
  };

  // Get upcoming assignments (sorted by due date)
  const upcomingAssignments = [...assignments]
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Calculate course statistics
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const completedCredits = courses
    .filter(course => course.completed)
    .reduce((sum, course) => sum + course.credits, 0);
  
  const completionPercentage = courses.length > 0 
    ? Math.round((completedCredits / totalCredits) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
            <BookOpen size={18} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{courses.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Credits</h3>
            <Clock size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalCredits}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Completion</h3>
            <CheckCircle2 size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{completionPercentage}%</p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Courses</h2>
          <button
            onClick={() => {
              setEditingCourse(null);
              setNewCourse({
                name: '',
                code: '',
                credits: 3,
                professor: '',
                schedule: '',
                location: '',
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
              });
              setShowAddCourse(true);
            }}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={16} className="mr-1" />
            Add Course
          </button>
        </div>

        {/* Course List */}
        <div className="space-y-3">
          {courses.map(course => (
            <div 
              key={course.id} 
              className={`p-4 rounded-lg border ${course.color} ${course.completed ? 'opacity-70' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className={`font-medium ${course.completed ? 'line-through' : ''}`}>
                      {course.name}
                    </h3>
                    <span className="ml-2 text-sm font-mono bg-white bg-opacity-50 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {course.professor && (
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-1">Professor:</span>
                        <span>{course.professor}</span>
                      </div>
                    )}
                    {course.schedule && (
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        <span>{course.schedule}</span>
                      </div>
                    )}
                    {course.location && (
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-1">Location:</span>
                        <span>{course.location}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleCourseCompletion(course.id)}
                    className={`p-1.5 rounded-full ${
                      course.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => handleEditCourse(course.id)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No courses added yet
            </div>
          )}
        </div>
      </div>

      {/* Assignments Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Assignments</h2>
          <button
            onClick={() => setShowAddAssignment(true)}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            disabled={courses.length === 0}
          >
            <Plus size={16} className="mr-1" />
            Add Assignment
          </button>
        </div>

        {/* Assignment List */}
        <div className="space-y-3">
          {upcomingAssignments.map(assignment => {
            const course = courses.find(c => c.id === assignment.courseId);
            return (
              <div 
                key={assignment.id} 
                className={`p-4 rounded-lg border border-gray-200 ${assignment.completed ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className={`font-medium ${assignment.completed ? 'line-through text-gray-500' : ''}`}>
                        {assignment.title}
                      </h3>
                      {course && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${course.color}`}>
                          {course.code}
                        </span>
                      )}
                    </div>
                    
                    {assignment.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {assignment.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <span className="text-gray-700">
                        Due: {new Date(assignment.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAssignmentCompletion(assignment.id)}
                      className={`p-1.5 rounded-full ${
                        assignment.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {assignments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No assignments added yet
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={newCourse.name || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Introduction to Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={newCourse.code || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="CS101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  value={newCourse.credits || 3}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max="6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professor
                </label>
                <input
                  type="text"
                  value={newCourse.professor || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, professor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Dr. Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <input
                  type="text"
                  value={newCourse.schedule || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mon, Wed, Fri 10:00 AM - 11:00 AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newCourse.location || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Science Building, Room 301"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setNewCourse({ ...newCourse, color })}
                      className={`w-8 h-8 rounded-full ${color} border-2 ${
                        newCourse.color === color ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddCourse(false);
                  setEditingCourse(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Add New Assignment</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  value={newAssignment.courseId || ''}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title || ''}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Midterm Exam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate || ''}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAssignment.description || ''}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Covers chapters 1-5"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddAssignment(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Add Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicPlanner; 