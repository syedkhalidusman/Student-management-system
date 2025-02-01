import React, { useEffect, useState } from "react";
import axios from "axios";

// Reusable Dropdown Component
const Dropdown = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded bg-gray-800"
    >
      <option value=""> Select {label} </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const StudentAttendanceList = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState("single");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios
      .get("/api/classes")
      .then((response) => setClasses(response.data))
      .catch(() => setError("Failed to fetch classes."));
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedStudent("");
    setAttendance([]);

    if (classId) {
      try {
        const response = await axios.get(`/api/students?class=${classId}`);
        setStudents(response.data);
      } catch {
        setError("Failed to fetch students.");
      }
    } else {
      setStudents([]);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedClass || (!selectedStudent && (viewType === "single" || viewType === "studentRange"))) {
      setError("Please select all required filters.");
      return;
    }

    if ((viewType === "range" || viewType === "studentRange") && (!dateRangeStart || !dateRangeEnd)) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (viewType === "single") {
        const response = await axios.get('/api/studentAttendance/by-student-class-date', {
          params: {
            classId: selectedClass,
            studentId: selectedStudent,
            date: selectedDate,
          },
        });
        setAttendance(response.data ? [response.data] : []);
      } else if (viewType === "range" || viewType === "studentRange") {
        const response = await axios.get('/api/studentAttendance/by-date-range', {
          params: {
            classId: selectedClass,
            studentId: viewType === "studentRange" ? selectedStudent : undefined,
            startDate: dateRangeStart,
            endDate: dateRangeEnd,
          },
        });
        setAttendance(response.data || []);
      }
    } catch (error) {
      setError("Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (recordId, newStatus) => {
    try {
      await axios.put(`/api/studentAttendance/${recordId}`, {
        status: newStatus
      });
      
      // Refresh the attendance data
      fetchAttendance();
      setEditingId(null);
    } catch (error) {
      setError("Failed to update attendance.");
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      await axios.delete(`/api/studentAttendance/${recordId}`);
      // Refresh the attendance data
      fetchAttendance();
    } catch (error) {
      setError("Failed to delete attendance.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'text-green-500';
      case 'Absent':
        return 'text-red-500';
      case 'Unhealthy':
        return 'text-yellow-500';
      case 'Leave':
        return 'text-blue-500';
      default:
        return 'text-white';
    }
  };

  // Add this function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">View Student Attendance</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <label className="block text-sm mb-2">View Type</label>
        <select
          value={viewType}
          onChange={(e) => {
            setViewType(e.target.value);
            setAttendance([]);
          }}
          className="w-full p-2 rounded bg-gray-800"
        >
          <option value="single">Single Day</option>
          <option value="studentRange">Student Date Range</option>
          <option value="range">Class Date Range</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Dropdown
          label="Class"
          options={classes.map((cls) => ({ label: cls.className, value: cls._id }))}
          value={selectedClass}
          onChange={handleClassChange}
        />
        {(viewType === "single" || viewType === "studentRange") && (
          <Dropdown
            label="Student"
            options={students.map((student) => ({ label: student.name, value: student._id }))}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          />
        )}
      </div>

      {viewType === "single" ? (
        <div className="mb-6">
          <label className="block text-sm mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Start Date</label>
            <input
              type="date"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className="w-full p-2 rounded bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">End Date</label>
            <input
              type="date"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-2 rounded bg-gray-800"
            />
          </div>
        </div>
      )}

      <button
        onClick={fetchAttendance}
        className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Attendance"}
      </button>

      {attendance.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Attendance Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{record.student?.name}</td>
                    <td className="px-4 py-2">{formatDate(record.date)}</td>
                    <td className="px-4 py-2">
                      {editingId === record._id ? (
                        <select
                          className="bg-gray-700 rounded p-1"
                          defaultValue={record.status}
                          onBlur={(e) => handleEdit(record._id, e.target.value)}
                        >
                          <option value="Present" className="text-green-500">Present</option>
                          <option value="Absent" className="text-red-500">Absent</option>
                          <option value="Unhealthy" className="text-yellow-500">Unhealthy</option>
                          <option value="Leave" className="text-blue-500">Leave</option>
                          <option value="Holiday" className="text-purple-500">Holiday</option>
                        </select>
                      ) : (
                        <span className={getStatusColor(record.status)}>
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setEditingId(record._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && attendance.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No attendance records found.</p>
      )}
    </div>
  );
};

export default StudentAttendanceList;
