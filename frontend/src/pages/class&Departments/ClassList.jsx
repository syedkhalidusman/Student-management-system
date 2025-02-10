import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState(""); // Search state
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("/api/classes");
        if (Array.isArray(response.data)) {
          // Map through classes and ensure teacher and department details are added correctly
          setClasses(
            response.data.map((classItem) => ({
              ...classItem,
              teacherName: classItem.teacher ? classItem.teacher.name : "No teacher assigned",
              departmentName: classItem.department ? classItem.department.departmentName : "No department assigned",
            }))
          );
        } else {
          setErrorMessage("Received invalid data from the server.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch classes. Please try again.");
      }
    };
    fetchClasses();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(`/api/classes/${id}`);
        setClasses(classes.filter((classItem) => classItem._id !== id));
      } catch {
        setErrorMessage("Failed to delete class. Please try again.");
      }
    }
  };

  // Filtered classes based on search input
  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(search.toLowerCase()) ||
      classItem.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      classItem.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">Class List</h1>

      {/* Display error message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          {errorMessage}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by class name, teacher, or department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 text-white outline-none rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Class Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-900">
              <th className="border border-gray-600 p-2">#</th>
              <th className="border border-gray-600 p-2">Class Name</th>
              <th className="border border-gray-600 p-2">Teacher</th>
              <th className="border border-gray-600 p-2">Department</th>
              <th className="border border-gray-600 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem, index) => (
                <tr key={classItem._id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-600 p-2">{classItem.className}</td>
                  <td className="border border-gray-600 p-2">{classItem.teacherName}</td>
                  <td className="border border-gray-600 p-2">{classItem.departmentName}</td>
                  <td className="border border-gray-600 p-2 text-center">
                    <button
                      onClick={() => handleDelete(classItem._id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border border-gray-600 p-4 text-center">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassList;
