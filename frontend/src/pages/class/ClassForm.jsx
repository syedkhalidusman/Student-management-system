import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassForm = () => {
  const { id } = useParams();  // Get class ID from URL if editing
  const navigate = useNavigate();  // For navigation
  const isEditing = Boolean(id);  // Check if it's edit mode or add mode

  const [formData, setFormData] = useState({
    className: '',
    teacher: '',
    department: '',
    shift: [],
  });

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherRes = await axios.get('/api/teachers');
        const departmentRes = await axios.get('/api/departments');
        setTeachers(teacherRes.data || []);
        setDepartments(departmentRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    if (isEditing) {
      // Fetch class data for editing
      axios
        .get(`/api/classes/${id}`)
        .then((response) => {
          setFormData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch class data', err);
          setError('Failed to fetch class data. Please try again.');
          setLoading(false);
        });
    } else {
      fetchData();  // Only fetch teacher and department data on add mode
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShiftChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, shift: [...formData.shift, value] });
    } else {
      setFormData({ ...formData, shift: formData.shift.filter(s => s !== value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isEditing
        ? `/api/classes/${id}`
        : '/api/classes';
      const method = isEditing ? axios.put : axios.post;

      const response = await method(endpoint, formData);

      if (response.status === (isEditing ? 200 : 201)) {
        alert(isEditing ? 'Class updated successfully!' : 'Class added successfully!');
        navigate('/class/list');
      }
    } catch (err) {
      alert('Failed to save class. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/class/list');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Class' : 'Add New Class'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class Name */}
        <div>
          <label className="block text-gray-300 mb-2">Class Name</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Teacher */}
        <div>
          <label className="block text-gray-300 mb-2">Teacher</label>
          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-300 mb-2">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Shifts */}
        <div>
          <label className="block text-gray-300 mb-2">Shifts</label>
          <div className="space-x-4">
            {['Morning', 'Evening', 'Night', 'Late Night'].map((shift) => (
              <label key={shift} className="flex items-center">
                <input
                  type="checkbox"
                  name="shift"
                  value={shift}
                  checked={formData.shift.includes(shift)}
                  onChange={handleShiftChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2">{shift}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={handleBack} className="bg-gray-600 text-white p-2 rounded">
            Back
          </button>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            {isEditing ? 'Update Class' : 'Add Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
