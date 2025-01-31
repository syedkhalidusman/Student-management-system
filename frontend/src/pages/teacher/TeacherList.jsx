import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/api/teachers");
        if (Array.isArray(response.data)) {
          setTeachers(response.data);
        } else {
          throw new Error("Invalid data format from the server.");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch teachers. Please try again."
        );
      }
    };
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`/api/teachers/${id}`);
        setTeachers((prev) => prev.filter((teacher) => teacher._id !== id));
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to delete teacher. Please try again."
        );
      }
    }
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.subject.subjectName.toLowerCase().includes(search.toLowerCase())
    );
  }, [teachers, search]);

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">Teacher List</h1>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{errorMessage}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by teacher name or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 text-white outline-none rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-900">
              <th className="border border-gray-600 p-2">#</th>
              <th className="border border-gray-600 p-2">Teacher Name</th>
              <th className="border border-gray-600 p-2">Teacher ID</th>
              <th className="border border-gray-600 p-2">Subject</th>
              <th className="border border-gray-600 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher, index) => (
                <tr key={teacher._id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-2 text-center">{index + 1}</td>
                  <td className="border text-center border-gray-600 p-2">{teacher.name}</td>
                  <td className="border text-center border-gray-600 p-2">{teacher.teacherId}</td>
                  <td className="border text-center border-gray-600 p-2">{teacher.subject.subjectName}</td>
                  <td className="border  border-gray-600 p-2 text-center">
                    <Link
                      to={`/teacher/view/${teacher._id}`}
                      className="text-green-400 hover:underline mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/teacher/edit/${teacher._id}`}
                      className="text-blue-400 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(teacher._id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border border-gray-600 p-4 text-center text-yellow-500">
                  No teachers found. Try adjusting your search or add new teachers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherList;
