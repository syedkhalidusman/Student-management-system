import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

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
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    axios.get('/api/classes')
      .then(response => setClasses(response.data))
      .catch(() => setError('Failed to fetch classes'));
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedStudent('');
    setEvents([]);

    if (classId) {
      try {
        const response = await axios.get(`/api/students?class=${classId}`);
        setStudents(response.data);
      } catch {
        setError('Failed to fetch students');
      }
    } else {
      setStudents([]);
    }
  };

  const formatEventTitle = (record) => {
    const date = new Date(record.date);
    const dayName = format(date, 'EEEE');
    const formattedDate = format(date, 'dd/MM/yyyy');
    return `${record.status} - ${dayName} ${formattedDate}`;
  };

  const fetchAttendance = async () => {
    if (!selectedClass || !selectedStudent) {
      setError('Please select both class and student');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the first day of previous month
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      
      // Get the last day of next month
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2, 0);

      const response = await axios.get('/api/studentAttendance/by-date-range', {
        params: {
          classId: selectedClass,
          studentId: selectedStudent,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      const calendarEvents = response.data.map(record => ({
        id: record._id,
        title: formatEventTitle(record),
        start: new Date(record.date),
        end: new Date(record.date),
        allDay: true,
        resource: record.status,
      }));

      setEvents(calendarEvents);
    } catch (error) {
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
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

  // Custom toolbar to show month and year
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

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>&lt;</button>
          <button type="button" onClick={goToCurrent}>Today</button>
          <button type="button" onClick={goToNext}>&gt;</button>
        </span>
        <span className="rbc-toolbar-label">
          {format(toolbar.date, 'MMMM yyyy')}
        </span>
        <span className="rbc-btn-group">
          {toolbar.views.map(view => (
            <button
              key={view}
              type="button"
              className={view === toolbar.view ? 'rbc-active' : ''}
              onClick={() => toolbar.onView(view)}
            >
              {view}
            </button>
          ))}
        </span>
      </div>
    );
  };

  // Custom event component to show more details
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

  // Add this new function to handle double click
  const handleDoubleClick = (event) => {
    setEditingEvent({
      id: event.id,
      status: event.resource,
      date: event.start
    });
  };

  // Add this new function to handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(`/api/studentAttendance/${editingEvent.id}`, {
        status: newStatus
      });
      
      // Refresh the calendar data
      fetchAttendance();
      setEditingEvent(null);
    } catch (error) {
      setError('Failed to update attendance status');
    }
  };

  // Add this new component for the edit modal
  const EditModal = () => {
    if (!editingEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl mb-4">Update Attendance Status</h3>
          <p className="mb-4">Date: {format(editingEvent.date, 'EEEE, MMMM dd, yyyy')}</p>
          <div className="grid grid-cols-2 gap-2">
            {['Present', 'Absent', 'Unhealthy', 'Leave'].map((status) => (
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
      <h1 className="text-2xl font-bold mb-6 text-center">Attendance Calendar</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Dropdown
          label="Class"
          options={classes.map(cls => ({ label: cls.className, value: cls._id }))} 
          value={selectedClass}
          onChange={handleClassChange}
        />
        <Dropdown
          label="Student"
          options={students.map(student => ({ label: student.name, value: student._id }))}
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        />
      </div>

      <button
        onClick={fetchAttendance}
        className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 mb-6"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Calendar'}
      </button>

      <div className="bg-white rounded-lg p-4" style={{ height: '600px' }}>
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
          tooltipAccessor={event => `Double click to edit\n${event.resource} - ${format(event.start, 'EEEE dd/MM/yyyy')}`}
        />
      </div>
      <EditModal />
    </div>
  );
};

export default AttendanceCalendar;
