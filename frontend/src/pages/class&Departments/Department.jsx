import React, { useState, useEffect } from "react";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    departmentName: "",
  });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (editingDepartment) {
      setEditingDepartment({ ...editingDepartment, [name]: value });
    } else {
      setNewDepartment({ ...newDepartment, [name]: value });
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    const departmentData = editingDepartment || newDepartment;

    if (!departmentData.departmentName.trim()) {
      alert("Department name is required.");
      return;
    }

    try {
      if (editingDepartment) {
        const response = await axios.put(
          `/api/departments/${editingDepartment._id}`,
          departmentData
        );
        setDepartments(
          departments.map((dept) =>
            dept._id === editingDepartment._id ? response.data : dept
          )
        );
        setEditingDepartment(null);
      } else {
        const response = await axios.post("/api/departments", departmentData);
        setDepartments([...departments, response.data]);
      }
      setNewDepartment({ departmentName: "" });
      alert(`Department ${editingDepartment ? 'updated' : 'added'} successfully`);
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${editingDepartment ? 'update' : 'add'} department`;
      alert(message);
      console.error("Department operation failed:", error);
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setNewDepartment({ departmentName: "" });
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

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-8 text-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Departments Management
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleAddDepartment}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="departmentName"
                    value={editingDepartment ? editingDepartment.departmentName : newDepartment.departmentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter department name"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    {editingDepartment ? "Update" : "Add"} Department
                  </button>
                  {editingDepartment && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Departments List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-lg">
                  {error}
                </div>
              ) : departments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No departments available</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {departments.map((dept) => (
                    <div
                      key={dept._id}
                      className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white text-lg">
                          {dept.departmentName}
                        </h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditDepartment(dept)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(dept._id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
