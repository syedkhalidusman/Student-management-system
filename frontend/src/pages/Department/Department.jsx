import React, { useState, useEffect } from "react";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    departmentName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/departments");
        setDepartments(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch departments. Please try again.");
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartment.departmentName.trim()) {
      alert("Department name is required.");
      return;
    }
    if (!newDepartment.description.trim()) {
      alert("Description is required.");
      return;
    }
    try {
      const response = await axios.post("/api/departments", newDepartment);
      setDepartments([...departments, response.data]);
      setNewDepartment({ departmentName: "", description: "" });
      alert("Department added successfully");
    } catch (error) {
      console.error("Failed to add department:", error);
      alert("Failed to add department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await axios.delete(`/api/departments/${id}`);
      setDepartments(departments.filter((dept) => dept._id !== id));
      alert("Department deleted successfully");
    } catch (error) {
      console.error("Failed to delete department:", error);
      alert("Failed to delete department. Please try again.");
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <div
      className={
        darkMode
          ? "dark bg-gray-900 text-gray-200 min-h-screen transition-all duration-300"
          : "bg-gray-100 text-gray-900 min-h-screen transition-all duration-300"
      }
    >
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Departments</h1>
          <button
            onClick={toggleDarkMode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        {/* Add Department Form */}
        <section className="mb-8">
          <form
            onSubmit={handleAddDepartment}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Department</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Department Name</label>
              <input
                type="text"
                name="departmentName"
                value={newDepartment.departmentName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={newDepartment.description}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Add Department
            </button>
          </form>
        </section>

        {/* Departments List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Existing Departments</h2>
          {loading ? (
            <p>Loading departments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : departments.length === 0 ? (
            <p className="text-gray-500">No departments available.</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {departments.map((dept) => (
                <li
                  key={dept._id}
                  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-lg font-bold">{dept.departmentName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{dept.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDepartment(dept._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Departments;
