import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Dropdown = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded bg-gray-800"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const AttendanceCalendar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId, studentName: initialStudentName } = location.state || {};
  
  const [selectedStudent, setSelectedStudent] = useState(studentId || '');
  const [studentName, setStudentName] = useState(initialStudentName || '');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // Redirect if no student is selected
  useEffect(() => {
    if (!studentId) {
      navigate('/student/list');
    }
  }, [studentId, navigate]);

  // Fetch attendance data when component mounts or student changes
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentAttendance(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchStudentAttendance = async (id) => {
    setLoading(true);
    setError('');
    setEvents([]);

    try {
      const response = await axios.get('/api/studentAttendance/student-attendance', {
        params: { studentId: id }
      });

      const { attendance, studentName } = response.data;
      setStudentName(studentName);

      const calendarEvents = attendance.map(record => ({
        id: record._id,
        title: formatEventTitle(record),
        start: new Date(record.date),
        end: new Date(record.date),
        allDay: true,
        resource: record.status,
      }));

      setEvents(calendarEvents);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch attendance records';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(`/student/view/${selectedStudent}`);
  };

  const handleStudentChange = (e) => {
    const id = e.target.value;
    setSelectedStudent(id);
    if (id) {
      fetchStudentAttendance(id);
    } else {
      setEvents([]);
      setStudentName('');
    }
  };

  const formatEventTitle = (record) => {
    const date = new Date(record.date);
    const dayName = format(date, 'EEEE');
    const formattedDate = format(date, 'dd/MM/yyyy');
    return `${record.status} - ${dayName} ${formattedDate}`;
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    switch (event.resource) {
      case 'Present':
        backgroundColor = '#10B981'; // green
        break;
      case 'Absent':
        backgroundColor = '#EF4444'; // red
        break;
      case 'Unhealthy':
        backgroundColor = '#F59E0B'; // yellow
        break;
      case 'Leave':
        backgroundColor = '#3B82F6'; // blue
        break;
      case 'Holiday':
        backgroundColor = '#8B5CF6'; // purple
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };

    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate('current');
    };

    const getDayNames = () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return (
        <div className="grid grid-cols-7 gap-2 mt-2 text-gray-800 text-sm font-medium">
          {days.map((day) => (
            <div key={day} className="text-center py-2 px-2 bg-gray-700 text-white rounded">
              {day}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {format(toolbar.date, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center space-x-4 w-full justify-between bg-gray-800 p-2 rounded">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={goToBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={goToCurrent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              &gt;
            </button>
          </div>

          <div className="flex space-x-2">
            {toolbar.views.map(view => (
              <button
                key={view}
                type="button"
                className={`px-4 py-2 rounded ${
                  view === toolbar.view 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => toolbar.onView(view)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {getDayNames()}
      </div>
    );
  };

  const EventComponent = ({ event }) => (
    <>
      <div className="text-sm p-1 text-center font-semibold">
        <strong>{event.resource}</strong>
      </div>
      <div className="text-center text-3xl font-bold">
        {format(event.start, 'dd')}
      </div>
    </>
  );

  const handleDoubleClick = (event) => {
    setEditingEvent({
      id: event.id,
      status: event.resource,
      date: event.start
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(`/api/studentAttendance/${editingEvent.id}`, {
        status: newStatus
      });

      // Call fetchStudentAttendance instead of fetchAttendance
      if (selectedStudent) {
        fetchStudentAttendance(selectedStudent);
      }
      setEditingEvent(null);
    } catch (error) {
      setError('Failed to update attendance status');
    }
  };

  const EditModal = () => {
    if (!editingEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl mb-4">Update Attendance Status</h3>
          <p className="mb-4">Date: {format(editingEvent.date, 'EEEE, MMMM dd, yyyy')}</p>
          <div className="grid grid-cols-2 gap-2">
            {['Present', 'Absent', 'Unhealthy', 'Leave', 'Holiday'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={`p-2 rounded ${
                  status === editingEvent.status
                    ? 'bg-blue-600'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button
            onClick={() => setEditingEvent(null)}
            className="mt-4 w-full p-2 bg-red-600 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const formats = {
    dateFormat: 'dd',
    dayFormat: (date, culture, localizer) =>
      localizer.format(date, 'EEEE dd/MM', culture),
    monthHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, 'MMMM yyyy', culture),
    dayHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, 'EEEE dd/MM/yyyy', culture),
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'dd/MM/yyyy', culture)} - ${localizer.format(
        end,
        'dd/MM/yyyy',
        culture
      )}`,
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 text-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Student Details
        </button>
        <h1 className="text-2xl font-bold">
          Attendance Calendar
          {studentName && ` - ${studentName}`}
        </h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-center my-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-yellow-400 mb-2">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center my-8">
          <p className="text-blue-400">Loading attendance records...</p>
        </div>
      )}

      {/* Calendar View */}
      {!error && !loading && (
        <div className="bg-white rounded-lg p-4" style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="month"
            onDoubleClickEvent={handleDoubleClick}
            components={{
              toolbar: CustomToolbar,
              event: EventComponent
            }}
            formats={formats}
            popup
            tooltipAccessor={event => 
              `Double click to edit\n${event.resource} - ${format(event.start, 'EEEE dd/MM/yyyy')}`
            }
          />
        </div>
      )}

      {/* Edit Modal */}
      <EditModal />
    </div>
  );
};

export default AttendanceCalendar;
