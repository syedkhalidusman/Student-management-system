import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign } from 'react-icons/fi';

export const StipendSection = ({ formData, setFormData, error }) => {
  const [stipendAmount, setStipendAmount] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleStipendChange = (e) => {
    setStipendAmount(e.target.value);
  };

  const handleStipendStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      hasStipend: e.target.checked
    }));
  };

  const validateStipendAmount = (amount) => {
    if (!amount) return "Stipend amount is required";
    if (isNaN(amount) || amount <= 0) return "Please enter a valid amount";
    return "";
  };

  const updateStipend = () => {
    const validationError = validateStipendAmount(stipendAmount);
    if (validationError) {
      return;
    }

    const newStipendRecord = {
      amount: parseFloat(stipendAmount),
      date: new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      stipendAmount: stipendAmount,
      stipendHistory: [...(prev.stipendHistory || []), newStipendRecord]
    }));

    setStipendAmount('');
    setLastUpdated(new Date());
  };

  if (!formData?.hasStipend) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasStipend"
            checked={formData?.hasStipend || false}
            onChange={handleStipendStatusChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasStipend" className="ml-2 text-gray-300">
            Enable Stipend
          </label>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200">
          <FiDollarSign className="inline-block mr-2" />
          Stipend Information
        </h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasStipend"
            checked={formData.hasStipend}
            onChange={handleStipendStatusChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasStipend" className="ml-2 text-gray-300">
            Enable Stipend
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Stipend Amount</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={stipendAmount}
              onChange={handleStipendChange}
              className="p-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Enter amount"
            />
            <button
              type="button"
              onClick={updateStipend}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>

        {formData.stipendHistory?.length > 0 && (
          <div className="col-span-full mt-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Stipend History</h3>
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.stipendHistory.map((record, index) => (
                    <tr key={index} className="border-t border-gray-600">
                      <td className="px-4 py-2">${record.amount}</td>
                      <td className="px-4 py-2">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lastUpdated && (
              <p className="text-sm text-gray-400 mt-2">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StipendSection;
