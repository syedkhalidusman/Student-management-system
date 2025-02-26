import React from 'react';
import { motion } from 'framer-motion';
import { renderInput } from './FormFields';

export const ContactInformationSection = ({ formData, setFormData, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Current Address</label>
          {renderInput('text', 'currentAddress', 'Enter current address', formData.currentAddress, handleChange, null, error.currentAddress)}
        </div>

        {/* New fields */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Permanent Address</label>
          {renderInput('text', 'permanentAddress', 'Enter permanent address', formData.permanentAddress, handleChange, null, error.permanentAddress)}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Guardian Name</label>
          {renderInput('text', 'guardianName', 'Enter guardian name', formData.guardianName, handleChange, null, error.guardianName)}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Guardian Address</label>
          {renderInput('text', 'guardianAddress', 'Enter guardian address', formData.guardianAddress, handleChange, null, error.guardianAddress)}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Father's CNIC</label>
          {renderInput('text', 'fatherIdentityCard', '12345-1234567-1', formData.fatherIdentityCard, handleChange, null, error.fatherIdentityCard)}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Country</label>
          {renderInput('text', 'Country', 'Enter country', formData.Country, handleChange, null, error.Country)}
        </div>

        {/* Existing fields */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Guardian Phone</label>
          {renderInput('text', 'guardianPhone', 'Enter guardian phone', formData.guardianPhone, handleChange, null, error.guardianPhone)}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Emergency Number</label>
          {renderInput('text', 'emergencyNumber', 'Enter emergency number', formData.emergencyNumber, handleChange, null, error.emergencyNumber)}
        </div>
      </div>
    </motion.div>
  );
};
