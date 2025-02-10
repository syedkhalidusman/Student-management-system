import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch classes');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/api/classes/${id}`);
        setClasses(classes.filter(cls => cls._id !== id));
      } catch (error) {
        setError('Failed to delete class');
      }
    }
  };

  // Filter classes based on search input
  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(search.toLowerCase()) ||
    (cls.teacher?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (cls.department?.departmentName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6 mt-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Class List</h1>
        <Link 
          to="/class/add" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Class
        </Link>
      </div>

      {error && (
        <div className="bg-red-700 text-red-100 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by class name, teacher, or department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-800 border-2 border-gray-600 text-white outline-none rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 p-2">#</th>
              <th className="border border-gray-600 p-2">Class Name</th>
              <th className="border border-gray-600 p-2">Teacher</th>
              <th className="border border-gray-600 p-2">Department</th>
              <th className="border border-gray-600 p-2">Shifts</th>
              <th className="border border-gray-600 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls, index) => (
                <tr key={cls._id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-600 p-2">{cls.className}</td>
                  <td className="border border-gray-600 p-2">{cls.teacher?.name || 'N/A'}</td>
                  <td className="border border-gray-600 p-2">{cls.department?.departmentName || 'N/A'}</td>
                  <td className="border border-gray-600 p-2">{cls.shift.join(', ')}</td>
                  <td className="border border-gray-600 p-2">
                    <div className="flex gap-2 justify-center">
                      <Link
                        to={`/class/view/${cls._id}`}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        View
                      </Link>
                      <Link
                        to={`/class/edit/${cls._id}`}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border border-gray-600 p-4 text-center">
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