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
  const [viewType, setViewType] = useState("single"); // Add this new state

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
    if (!selectedClass || (!selectedStudent && viewType === "single") || !selectedDate) {
      setError("Please select all required filters.");
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
      } else {
        // Fetch all students' attendance for the class
        const response = await axios.get('/api/studentAttendance/by-class-date', {
          params: {
            classId: selectedClass,
            date: selectedDate,
          },
        });
        setAttendance(response.data || []);
      }
    } catch {
      setError("Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
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
          <option value="single">Single Student</option>
          <option value="class">Entire Class</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Dropdown
          label="Class"
          options={classes.map((cls) => ({ label: cls.className, value: cls._id }))}
          value={selectedClass}
          onChange={handleClassChange}
        />
        {viewType === "single" && (
          <Dropdown
            label="Student"
            options={students.map((student) => ({ label: student.name, value: student._id }))}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          />
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-2">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />
      </div>

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
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{record.student?.name}</td>
                    <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{record.status}</td>
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
