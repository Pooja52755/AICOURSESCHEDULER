import React, { useState, useEffect } from 'react';
import { sendImageToGemini } from '../services/geminiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const Academics = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [newActivity, setNewActivity] = useState({
    day: '',
    time: '',
    activity: '',
    isEdit: false,
    editDay: '',
    editTime: '',
    replace: false,
    status: 'pending', // Status for custom activities
  });
  const [currentTime, setCurrentTime] = useState(new Date());  // Used for checking if a task is overdue

  const periodTimes = [
    'I (9:10 - 10:10 AM)',
    'II (10:10 - 11:10 AM)',
    'III (11:15 AM - 12:15 PM)',
    'IV (1:00 - 2:00 PM)',
    'V (2:00 - 3:00 PM)',
    'VI (3:05 - 4:05 PM)',
  ];

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const parseTimetable = (responseText) => {
    const timetable = {
      monday: ['', '', '', '', '', ''],
      tuesday: ['', '', '', '', '', ''],
      wednesday: ['', '', '', '', '', ''],
      thursday: ['', '', '', '', '', ''],
      friday: ['', '', '', '', '', ''],
      saturday: ['', '', '', '', '', ''],
      sunday: ['', '', '', '', '', ''],
    };

    const lines = responseText.split('\n').map(line => line.trim());
    const dayRegex = /(\*\*?)(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)(\*\*?)\s*\|/gi;
    const periodRegex = /\|([^|]+)/g;

    let dayMatch;
    while ((dayMatch = dayRegex.exec(responseText)) !== null) {
      const day = dayMatch[2].toLowerCase();
      let periodMatch;
      let periodIndex = 0;
      let lineStartIndex = dayMatch.index + dayMatch[0].length;
      let lineEndIndex = responseText.indexOf('\n', lineStartIndex);
      if (lineEndIndex === -1) {
        lineEndIndex = responseText.length;
      }
      let periodLine = responseText.substring(lineStartIndex, lineEndIndex);

      while ((periodMatch = periodRegex.exec(periodLine)) !== null && periodIndex < 6) {
        const period = periodMatch[1].trim().replace(/<br>/g, ' ').replace(/<\/?[^>]+(>|$)/g, "");
        timetable[day][periodIndex] = period;
        periodIndex++;
      }
    }

    return timetable;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        try {
          setLoading(true);
          const timetableData = await sendImageToGemini(base64Image);
          if (typeof timetableData === 'string') {
            const parsedTimetable = parseTimetable(timetableData);
            setSchedule(parsedTimetable);
          } else {
            console.error('Error: Invalid API response structure', timetableData);
            alert('Error processing timetable. Please check the Gemini API response.');
          }
        } catch (error) {
          console.error('Failed to process timetable:', error);
          alert('Error processing timetable. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddActivity = () => {
    if (newActivity.day && newActivity.time && newActivity.activity) {
      const newSchedule = { ...schedule };
      const timeIndex = periodTimes.indexOf(newActivity.time);
      
      if (newSchedule[newActivity.day][timeIndex] && !newActivity.replace) {
        const confirmReplace = window.confirm(
          `There's already an activity at this time. Do you want to replace it with your new activity?`
        );
        if (!confirmReplace) {
          return;
        }
      }

      if (!newSchedule[newActivity.day]) {
        newSchedule[newActivity.day] = [];
      }
      if (!newSchedule[newActivity.day][timeIndex]) {
        newSchedule[newActivity.day][timeIndex] = newActivity.activity;
      } else {
        newSchedule[newActivity.day][timeIndex] = newActivity.activity;
      }

      setSchedule(newSchedule);
      setNewActivity({
        day: '',
        time: '',
        activity: '',
        isEdit: false,
        editDay: '',
        editTime: '',
        replace: false,
        status: 'pending',
      });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleEditActivity = (day, time) => {
    const activity = schedule[day][periodTimes.indexOf(time)];
    setNewActivity({
      day: day,
      time: time,
      activity: activity,
      isEdit: true,
      editDay: day,
      editTime: time,
      replace: true,
      status: 'pending', // Default status for editing
    });
  };

  const handleActivityStatusChange = (day, time) => {
    const newSchedule = { ...schedule };
    const timeIndex = periodTimes.indexOf(time);
    newSchedule[day][timeIndex] = { activity: newSchedule[day][timeIndex], status: 'completed' }; // Changing the status to 'completed'
    setSchedule(newSchedule);
  };

  const getActivityStyle = (day, timeIndex) => {
    const activity = schedule[day] && schedule[day][timeIndex];
    if (!activity) {
      return { backgroundColor: 'green' }; // Free Slot (Green)
    } else {
      const activityTime = new Date();
      const taskTime = new Date();
      const timeParts = periodTimes[timeIndex].match(/\d{1,2}:\d{2}/g);
      const startTime = timeParts ? timeParts[0] : '';
      const endTime = timeParts ? timeParts[1] : '';

      taskTime.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]));
      if (activity.status === 'pending') {
        return { backgroundColor: 'yellow' }; // Pending Activity
      } else if (activity.status === 'completed') {
        return { backgroundColor: 'lightblue' }; // Completed Activity
      } else if (taskTime.getTime() < currentTime.getTime()) {
        return { backgroundColor: 'red' }; // Overdue Activity
      } else {
        return { backgroundColor: 'lightgreen' }; // Normal Activity
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Academic Dashboard</h1>
      <div className="d-flex justify-content-center mb-4">
        <div className="text-center">
          <h3>Upload Your Timetable Image</h3>
          <div className="my-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded Preview" className="img-fluid rounded" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            ) : (
              <div className="w-150 h-150 bg-light d-flex align-items-center justify-content-center rounded-circle">
                <span>No Image</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-3 form-control-file" />
          </div>
        </div>
      </div>
      {loading && (
        <div className="d-flex justify-content-center mb-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {Object.keys(schedule).length > 0 && !loading && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Your Timetable</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Period</th>
                    {daysOfWeek.slice(0, 5).map((day) => (
                      <th key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periodTimes.map((time, periodIndex) => (
                    <tr key={periodIndex}>
                      <td>{time}</td>
                      {daysOfWeek.slice(0, 5).map((day) => (
                        <td key={day} style={getActivityStyle(day, periodIndex)}>
                          <div>
                            {schedule[day] && schedule[day][periodIndex] ? (
                              <span onClick={() => handleEditActivity(day, time)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                {schedule[day][periodIndex]}
                              </span>
                            ) : (
                              'Free'
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4">
        <h3>{newActivity.isEdit ? 'Edit Activity' : 'Add Activity'}</h3>
        <div className="mb-3">
          <label className="form-label">Day:</label>
          <select className="form-select" value={newActivity.day} onChange={(e) => setNewActivity({ ...newActivity, day: e.target.value })}>
            <option value="">Select Day</option>
            {daysOfWeek.slice(0, 6).map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Time:</label>
          <select className="form-select" value={newActivity.time} onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}>
            <option value="">Select Time</option>
            {periodTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Activity:</label>
          <input type="text" className="form-control" value={newActivity.activity} onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })} />
        </div>
        <button className="btn btn-primary" onClick={handleAddActivity}>
          {newActivity.isEdit ? 'Update Activity' : 'Add Activity'}
        </button>
      </div>
    </div>
  );
};

export default Academics;
