import React from 'react';

export const renderInput = (type, id, placeholder, value, onChange, onBlur, error, readOnly = false) => {
  return (
    <div className="flex flex-col">
      <input
        type={type}
        id={id}
        name={id}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        className={`p-2 border ${error ? 'border-red-500' : 'border-gray-600'} bg-gray-800 rounded focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
        placeholder={placeholder}
        readOnly={readOnly}
        required
      />
      {error && (
        <p className="text-red-500 mt-1 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export const renderSelect = (id, label, options, value, onChange, onBlur, error) => {
  return (
    <div className="flex flex-col">
      <select
        id={id}
        name={id}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};
