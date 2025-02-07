import React from 'react';
import { motion } from 'framer-motion';
import { renderInput, renderSelect } from '../../../components/student/shared/FormFields';

export const BasicInformationSection = ({ formData, setFormData, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dateOfBirth') {
      // Calculate age when date of birth changes
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        age: age // Update the age automatically
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Student Name</label>
          {renderInput('text', 'name', 'Enter student name', formData.name, handleChange, null, error.name)}
        </div>
        {/* Remove the age input field since it's now calculated */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Father's Name</label>
          {renderInput('text', 'fatherName', 'Enter fathers name', formData.fatherName, handleChange, null, error.fatherName)}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Role Number</label>
          {renderInput('text', 'roleNumber', 'Enter role number', formData.roleNumber, handleChange, null, error.roleNumber)}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Registration Number</label>
          {renderInput('text', 'registrationNumber', 'Enter registration number', formData.registrationNumber, handleChange, null, error.registrationNumber)}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Gender</label>
          {renderSelect(
            'gender',
            'Gender',
            [
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' }
            ],
            formData.gender || '',
            handleChange,
            null,
            error?.gender
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Date of Birth</label>
          {renderInput(
            'date',
            'dateOfBirth',
            '',
            formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : '',
            handleChange,
            null,
            error?.dateOfBirth
          )}
          {formData.age && (
            <span className="text-sm text-gray-400 mt-1">
              Age: {formData.age} years
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">School History</label>
          {renderInput('text', 'schoolHistory', 'Enter school history', formData.schoolHistory, handleChange, null, error.schoolHistory)}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Last Seminary</label>
          {renderInput('text', 'lastSeminary', 'Enter last seminary', formData.lastSeminary, handleChange, null, error.lastSeminary)}
        </div>
      </div>
    </motion.div>
  );
};
