import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { renderInput, renderSelect } from '../../../components/student/shared/FormFields';

const API_URL = import.meta.env.VITE_API_URL;


export const BasicInformationSection = ({ formData, setFormData, error, isEditing }) => {
  const fileRefs = {
    photo: useRef(null),
    birthCertificate: useRef(null),
    bForm: useRef(null)
  };

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

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
        [`${fieldName}Preview`]: fieldName === 'photo' ? URL.createObjectURL(file) : file.name
      }));
    }
  };

  const getImageUrl = () => {
    if (formData.photoPreview) {
      return formData.photoPreview;
    }
    if (formData.photo) {
      return `${API_URL}/uploads/students/${formData.photo}`;
    }
    return '/placeholder-avatar.png';
  };

  const renderFileUpload = (fieldName, label, accept) => (
    <div className="flex flex-col space-y-2">
      <label className="text-gray-300">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => fileRefs[fieldName].current?.click()}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          {formData[fieldName] ? 'Change File' : 'Upload File'}
        </button>
        {formData[fieldName] && (
          <span className="text-sm text-gray-400">
            {formData[`${fieldName}Preview`] || formData[fieldName]}
          </span>
        )}
        <input
          type="file"
          ref={fileRefs[fieldName]}
          className="hidden"
          accept={accept}
          onChange={(e) => handleFileChange(e, fieldName)}
        />
      </div>
      {error[fieldName] && (
        <span className="text-red-500 text-sm">{error[fieldName]}</span>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Basic Information</h2>
      
      {/* Update photo upload section */}
      <div className="mb-6 flex justify-center">
        <div className="w-32 h-32 relative group">
          <div 
            className="w-full h-full rounded-full border-2 border-gray-300 overflow-hidden cursor-pointer"
            onClick={() => fileRefs.photo.current?.click()}
          >
            <img 
              src={getImageUrl()}
              alt="Student"
              className="w-full h-full object-cover transition-opacity duration-200"
              onError={(e) => {
                console.log("Image load failed, using placeholder");
                e.target.src = '/placeholder-avatar.png';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <span className="text-white text-sm">
                {isEditing ? 'Change Photo' : 'Add Photo'}
              </span>
            </div>
          </div>
          <input
            type="file"
            ref={fileRefs.photo}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photo')}
          />
        </div>
      </div>

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
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFileUpload('birthCertificate', 'Birth Certificate', '.pdf,.jpg,.jpeg,.png')}
            {renderFileUpload('bForm', 'B-Form', '.pdf,.jpg,.jpeg,.png')}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
