import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    className: '',
    teacher: '',
    department: '',
    shift: []
  });
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  const shifts = ['Morning', 'Evening', 'Night', 'Late Night'];

  useEffect(() => {
    fetchTeachersAndDepartments();
    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  const fetchTeachersAndDepartments = async () => {
    try {
      const [teachersRes, departsRes] = await Promise.all([
        axios.get('/api/teachers'),
        axios.get('/api/departments')
      ]);
      setTeachers(teachersRes.data);
      setDepartments(departsRes.data);
    } catch (error) {
      setError('Failed to fetch data');
    }
  };

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(`/api/classes/${id}`);
      setFormData(response.data);
    } catch (error) {
      setError('Failed to fetch class details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/classes/${id}`, formData);
      } else {
        await axios.post('/api/classes', formData);
      }
      navigate('/class/list');
    } catch (error) {
      setError('Failed to save class');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShiftChange = (shift) => {
    setFormData(prev => ({
      ...prev,
      shift: prev.shift.includes(shift)
        ? prev.shift.filter(s => s !== shift)
        : [...prev.shift, shift]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Edit Class' : 'Add New Class'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Class Name</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Teacher</label>
          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Shifts</label>
          <div className="space-y-2">
            {shifts.map(shift => (
              <label key={shift} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.shift.includes(shift)}
                  onChange={() => handleShiftChange(shift)}
                  className="mr-2"
                />
                {shift}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? 'Update Class' : 'Add Class'}
        </button>
      </form>
    </div>
  );
};

export default ClassForm;
