import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { renderInput, renderSelect } from './FormFields';

export const AcademicInformationSection = ({ formData, setFormData, error }) => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stipends, setStipends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, departmentsRes, stipendsRes] = await Promise.all([
          axios.get('/api/classes'),
          axios.get('/api/departments'),
          axios.get('/api/stipends')
        ]);
        setClasses(classesRes.data);
        setDepartments(departmentsRes.data);
        setStipends(stipendsRes.data);
      } catch (err) {
        console.error('Failed to load academic data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStipendEnable = (e) => {
    setFormData(prev => ({
      ...prev,
      hasStipend: e.target.checked,
      stipendId: e.target.checked ? prev.stipendId : null
    }));
  };

  const renderFormData = formData || {};

  if (loading) {
    return <div className="text-gray-400">Loading academic information...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Academic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing academic fields */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Class</label>
          {renderSelect(
            'class',
            'Class',
            classes.map(cls => ({
              value: cls._id,
              label: cls.className
            })),
            renderFormData.class || '',
            handleChange,
            null,
            error?.class
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Department</label>
          {renderSelect(
            'department',
            'Department',
            departments.map(dept => ({
              value: dept._id,
              label: dept.departmentName
            })),
            renderFormData.department || '',
            handleChange,
            null,
            error?.department
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Qualification</label>
          {renderInput(
            'text',
            'qualification',
            'Enter qualification',
            renderFormData.qualification || '',
            handleChange,
            null,
            error?.qualification
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Date of Joining</label>
          {renderInput(
            'date',
            'dateOfJoining',
            '',
            renderFormData.dateOfJoining ? new Date(renderFormData.dateOfJoining).toISOString().split('T')[0] : '',
            handleChange,
            null,
            error?.dateOfJoining
          )}
        </div>

        {/* Stipend Section */}
        <div className="col-span-full"></div>
          <div className="border-t border-gray-700 my-4 pt-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="hasStipend"
                checked={formData.hasStipend || false}
                onChange={handleStipendEnable}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasStipend" className="ml-2 text-gray-300">
                Enable Stipend
              </label>
            </div>

            {formData.hasStipend && (
              <div className="flex flex-col">
                <label className="text-gray-300 mb-2">Select Stipend Type</label>
                <select
                  name="stipendId"
                  value={formData.stipendId || ''}
                  onChange={handleChange}
                  className="p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Stipend</option>
                  {stipends.map(stipend => (
                    <option key={stipend._id} value={stipend._id}>
                      {stipend.stipendName}
                    </option>
                  ))}
                </select>
                {error?.stipendId && (
                  <p className="text-red-500 mt-1 text-sm">{error.stipendId}</p>
                )}
              </div>
            )}
          </div>
        </div>
      {/* </div> */}
    </motion.div>
  );
};

export default AcademicInformationSection;
