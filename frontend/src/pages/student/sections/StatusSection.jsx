import React from 'react';
import { motion } from 'framer-motion';
import { renderSelect, renderInput } from '../../../components/student/shared/FormFields';

export const StatusSection = ({ formData, setFormData, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLeaveRecord = (index, field, value) => {
    const updatedLeaveRecords = [...(formData.leaveRecords || [])];
    if (!updatedLeaveRecords[index]) {
      updatedLeaveRecords[index] = {};
    }
    updatedLeaveRecords[index][field] = value;
    setFormData(prev => ({ ...prev, leaveRecords: updatedLeaveRecords }));
  };

  const LeaveRecords = () => (
    <div className="space-y-4">
      {(formData.leaveRecords || []).map((record, index) => (
        <div key={index} className="flex space-x-4 items-center">
          <input
            type="date"
            value={record.fromDate ? new Date(record.fromDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleLeaveRecord(index, 'fromDate', new Date(e.target.value))}
            className="p-2 border border-gray-600 bg-gray-800 rounded w-full focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="date"
            value={record.toDate ? new Date(record.toDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleLeaveRecord(index, 'toDate', new Date(e.target.value))}
            className="p-2 border border-gray-600 bg-gray-800 rounded w-full focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => {
              const updatedRecords = formData.leaveRecords.filter((_, i) => i !== index);
              setFormData(prev => ({ ...prev, leaveRecords: updatedRecords }));
            }}
            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          setFormData(prev => ({
            ...prev,
            leaveRecords: [...(prev.leaveRecords || []), { fromDate: null, toDate: null }]
          }));
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Leave Record
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Status Information</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Status</label>
          {renderSelect(
            'status',
            'Status',
            [
              { value: 'Active', label: 'Active' },
              { value: 'Expelled', label: 'Expelled' },
              { value: 'On Leave', label: 'On Leave' }
            ],
            formData.status,
            handleChange,
            null,
            error.status
          )}
        </div>

        {formData.status === 'Expelled' && (
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Expelled Date</label>
            {renderInput(
              'date',
              'expelledDate',
              '',
              formData.expelledDate ? new Date(formData.expelledDate).toISOString().split('T')[0] : '',
              handleChange,
              null,
              error.expelledDate
            )}
          </div>
        )}

        {formData.status === 'On Leave' && (
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Leave Records</label>
            <LeaveRecords />
            {error.leaveRecords && (
              <p className="text-red-500 mt-1">{error.leaveRecords}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatusSection;
