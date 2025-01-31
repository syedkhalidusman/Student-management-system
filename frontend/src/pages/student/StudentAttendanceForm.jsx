import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentAttendanceForm = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const currentDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    // Fetch all classes
    setLoading(true);
    axios
      .get("/api/classes")
      .then((response) => {
        setClasses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch classes", err);
        setError("Failed to fetch class data.");
        setLoading(false);
      });
  }, []);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setError("");
    setSuccess("");

    if (classId) {
      setLoading(true);
      axios
        .get(`/api/students?class=${classId}`)
        .then((response) => {
          setStudents(response.data);
          setAttendance(
            response.data.reduce((acc, student) => {
              acc[student._id] = "Present";
              return acc;
            }, {})
          );
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch students", err);
          setError("Failed to fetch student data.");
          setLoading(false);
        });
    } else {
      setStudents([]);
      setAttendance({});
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!selectedDate || !selectedClass || Object.keys(attendance).length === 0) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Process one student at a time and handle duplicates
      for (const [studentId, status] of Object.entries(attendance)) {
        try {
          await axios.post("/api/studentAttendance", {
            student: studentId,
            class: selectedClass,
            date: selectedDate,
            status,
          });
        } catch (error) {
          if (error.response?.data?.message?.includes('already exists')) {
            setError(`Attendance already exists for some students on this date. Please select a different date.`);
            setLoading(false);
            return;
          }
          throw error;
        }
      }

      setSuccess("Attendance recorded successfully!");
      setSelectedClass("");
      setStudents([]);
      setAttendance({});
      setSelectedDate("");
    } catch (error) {
      setError("Failed to record attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Record Attendance</h1>
      <p className="text-gray-300 text-center mb-4">Date: {currentDate}</p>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-2 rounded mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="class" className="block text-gray-300 font-medium mb-2">
            Select Class
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full p-3 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-white">Loading students...</p>}
        {!loading && students.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
            <div className="grid grid-cols-2 gap-4">
              {students.map((student) => (
                <div key={student._id} className="flex items-center bg-gray-800 p-3 rounded-lg shadow">
                  <select
                    value={attendance[student._id] || "Present"}
                    onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Unhealthy">Unhealthy</option>
                    <option value="Leave">Leave</option>
                  </select>
                  <label htmlFor={`attendance-${student._id}`} className="ml-3 text-gray-200">
                    {student.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!selectedClass || loading}
          >
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentAttendanceForm;
