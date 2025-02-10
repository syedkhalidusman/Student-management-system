import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

const ClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    teacher: '',
    department: '',
    shift: []
  });
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
      setErrors({ api: 'Failed to fetch required data' });
    }
  };

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(`/api/classes/${id}`);
      setFormData(response.data);
    } catch (error) {
      setErrors({ api: 'Failed to fetch class details' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
    }
    if (!formData.teacher) {
      newErrors.teacher = 'Teacher is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (formData.shift.length === 0) {
      newErrors.shift = 'At least one shift must be selected';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (id) {
        await axios.put(`/api/classes/${id}`, formData);
        setSuccessMessage('Class updated successfully!');
      } else {
        await axios.post('/api/classes', formData);
        setSuccessMessage('Class created successfully!');
      }
      setTimeout(() => navigate('/class/list'), 1500);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to save class'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleShiftChange = (shift) => {
    setFormData(prev => ({
      ...prev,
      shift: prev.shift.includes(shift)
        ? prev.shift.filter(s => s !== shift)
        : [...prev.shift, shift]
    }));
    if (errors.shift) {
      setErrors(prev => ({ ...prev, shift: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {id ? 'Edit Class' : 'Add New Class'}
        </h2>
        <button
          onClick={() => navigate('/class/list')}
          className="text-gray-400 hover:text-white"
        >
          <FaTimes size={24} />
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-600 text-white px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-600 text-white px-4 py-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Class Name</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            className={`w-full bg-gray-800 text-white rounded p-3 border ${
              errors.className ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:border-blue-500`}
            placeholder="Enter class name"
          />
          {errors.className && (
            <p className="text-red-500 text-sm mt-1">{errors.className}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Teacher</label>
          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className={`w-full bg-gray-800 text-white rounded p-3 border ${
              errors.teacher ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:border-blue-500`}
          >
            <option value="">Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacher && (
            <p className="text-red-500 text-sm mt-1">{errors.teacher}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full bg-gray-800 text-white rounded p-3 border ${
              errors.department ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:border-blue-500`}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Shifts</label>
          <div className="grid grid-cols-2 gap-4">
            {shifts.map(shift => (
              <label key={shift} className="flex items-center space-x-3 text-white">
                <input
                  type="checkbox"
                  checked={formData.shift.includes(shift)}
                  onChange={() => handleShiftChange(shift)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>{shift}</span>
              </label>
            ))}
          </div>
          {errors.shift && (
            <p className="text-red-500 text-sm mt-1">{errors.shift}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            to="/class/list"
            className="flex items-center justify-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaSave className="mr-2" />
            {isSubmitting ? 'Saving...' : id ? 'Update Class' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
