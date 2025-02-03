import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/students");
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          setErrorMessage("Received invalid data from the server.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch students. Please try again.");
      }
    };
    fetchStudents();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`);
        setStudents(students.filter((student) => student._id !== id));
      } catch {
        setErrorMessage("Failed to delete student. Please try again.");
      }
    }
  };

  // Filter students based on search input
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(search.toLowerCase()) ||
      student.roleNumber.toLowerCase().includes(search.toLowerCase()) // Added roleNumber filter
  );

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">Student List</h1>

      {errorMessage && (
        <div className="bg-red-700 text-red-100 p-4 mb-4 rounded">{errorMessage}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by student or guardian name or role number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-800 border-2 border-gray-600 text-white outline-none rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-600">
          <thead><tr className="bg-gray-700"><th className="border border-gray-600 p-2">#</th><th className="border border-gray-600 p-2">Student Name</th><th className="border border-gray-600 p-2">Guardian Name</th><th className="border border-gray-600 p-2">Role Number</th><th className="border border-gray-600 p-2">Actions</th></tr></thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-700"><td className="border border-gray-600 p-2 text-center">{index + 1}</td><td className="border border-gray-600 p-2">{student.name}</td><td className="border border-gray-600 p-2">{student.guardianName}</td><td className="border border-gray-600 p-2">{student.roleNumber}</td><td className="border border-gray-600 p-2 text-center"><Link to={`/student/view/${student._id}`} className="text-green-400 hover:underline mr-4">View</Link><Link to={`/student/edit/${student._id}`} className="text-blue-400 hover:underline mr-4">Edit</Link><button onClick={() => handleDelete(student._id)} className="text-red-400 hover:underline">Delete</button></td></tr>
              ))
            ) : (
              <tr><td colSpan="5" className="border border-gray-600 p-4 text-center">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
