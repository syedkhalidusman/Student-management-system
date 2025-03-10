import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BasicInformationSection } from './sections/BasicInformationSection';
import { ContactInformationSection } from './sections/ContactInformationSection';
import { AcademicInformationSection } from './sections/AcademicInformationSection';

const AddStudentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    roleNumber: '',
    registrationNumber: '',
    age: '',
    fatherIdentityCard: '',
    Country: '',
    fatherName: '',
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
  });
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const newErrors = {};
    
    // CNIC format validation only (no uniqueness check)
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (formData.fatherIdentityCard && !cnicPattern.test(formData.fatherIdentityCard)) {
      newErrors.fatherIdentityCard = 'Invalid CNIC format (XXXXX-XXXXXXX-X)';
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'photo') {
          if (formData[key] instanceof File) {
            formDataToSend.append('photo', formData[key]);
          }
        } else if (key !== 'photoPreview') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post('/api/students', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        navigate('/student/list');
      }
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      console.error('Error details:', err.response?.data?.errors || err.response?.data || err.message);
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        setError(errors);
        
        // Focus the first field with an error
        const firstErrorField = Object.keys(errors)[0];
        document.getElementById(firstErrorField)?.focus();
      } else {
        setError({
          submit: err.response?.data?.message || 'Failed to add student. Please try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto bg-gray-900 text-white p-6 rounded-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Student</h1>
        <Link 
          to="/student/list"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to List
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInformationSection 
          formData={formData}
          setFormData={setFormData}
          error={error}
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
            {isSubmitting ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddStudentForm;
