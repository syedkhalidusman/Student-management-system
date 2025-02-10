import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { renderInput, renderSelect } from '../../../components/student/shared/FormFields';

export const AcademicInformationSection = ({ formData, setFormData, error }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          axios.get('/api/classes'),
          axios.get('/api/subjects')
        ]);
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
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
          <label className="text-gray-300 mb-2">Subject</label>
          {renderSelect(
            'subject',
            'Subject',
            subjects.map(subj => ({
              value: subj._id,
              label: subj.subjectName
            })),
            renderFormData.subject || '',
            handleChange,
            null,
            error?.subject
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
      </div>
    </motion.div>
  );
};

export default AcademicInformationSection;
