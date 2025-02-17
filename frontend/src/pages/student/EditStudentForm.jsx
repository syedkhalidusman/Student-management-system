import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BasicInformationSection } from './sections/BasicInformationSection';
import { ContactInformationSection } from './sections/ContactInformationSection';
import { AcademicInformationSection } from './sections/AcademicInformationSection';
import { StatusSection } from './sections/StatusSection';

const EditStudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    roleNumber: '',
    registrationNumber: '',
    age: '',
    fatherIdentityCard: '',
    Country: '',
    currentAddress: '',
    permanentAddress: '',
    guardianName: '',
    guardianAddress: '',
    guardianPhone: '',
    schoolHistory: '',
    lastSeminary: '',
    dateOfJoining: '',
    dateOfBirth: '',
    emergencyNumber: '',
    qualification: '',
    class: '',
    gender: '',
    department: '', // Changed from subject to department
    status: 'Active',
    leaveRecords: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        const studentData = response.data;

        // Format dates
        if (studentData.dateOfBirth) {
          studentData.dateOfBirth = new Date(studentData.dateOfBirth).toISOString().split('T')[0];
        }
        if (studentData.dateOfJoining) {
          studentData.dateOfJoining = new Date(studentData.dateOfJoining).toISOString().split('T')[0];
        }
        if (studentData.expelledDate) {
          studentData.expelledDate = new Date(studentData.expelledDate).toISOString().split('T')[0];
        }

        // Handle nested objects
        studentData.class = studentData.class?._id || '';
        studentData.department = studentData.department?._id || ''; // Changed from subject to department

        // If there's an existing photo, create the full URL
        if (studentData.photo) {
          studentData.photoUrl = `/api/uploads/students/${studentData.photo}`;
        }

        // Update form data
        setFormData(studentData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load student:', error);
        setError({ load: 'Failed to load student data' });
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData, handling special cases
      Object.keys(formData).forEach(key => {
        if (key === 'photo') {
          if (formData[key] instanceof File) {
            formDataToSend.append('photo', formData[key]);
          }
        } else if (key === 'stipendId') {
          // Handle stipendId specifically
          formDataToSend.append('stipendId', formData[key] || null);
        } else if (key !== 'photoPreview') {
          // Handle all other fields
          if (formData[key] !== undefined && formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      const response = await axios.put(`/api/students/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        navigate('/student/list');
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      setError({
        submit: error.response?.data?.message || 'Failed to update student'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white animate-pulse">Loading student data...</div>
      </div>
    );
  }

  if (error.load) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error.load}</p>
        <button 
          onClick={() => navigate('/student/list')} 
          className="mt-4 bg-gray-700 px-4 py-2 rounded"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto bg-gray-900 text-white p-6 rounded-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Student</h1>
        <div className="space-x-2">
          <Link 
            to={`/student/view/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Details
          </Link>
          <Link 
            to="/student/list"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
        <BasicInformationSection 
          formData={formData}
          setFormData={setFormData}
          error={error}
          isEditing={true}
        />

        <ContactInformationSection 
          formData={formData}
          setFormData={setFormData}
          error={error}
        />

        <AcademicInformationSection 
          formData={formData}
          setFormData={setFormData}
          error={error}
        />

        <StatusSection 
          formData={formData}
          setFormData={setFormData}
          error={error}
        />

        {error.submit && (
          <div className="text-red-500 text-center p-2">
            {error.submit}
          </div>
        )}

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditStudentForm;
