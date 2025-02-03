import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentForm = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const navigate = useNavigate(); // For navigation
  const isEditing = Boolean(id); // Determine if it's an edit or create
  const [formData, setFormData] = useState({
    name: "",
    roleNumber: "",
    registrationNumber: "",
    age: "",
    fatherIdentityCard: "",
    homeland: "",
    currentAddress: "",
    permanentAddress: "",
    guardianName: "",
    guardianAddress: "",
    guardianPhone: "",
    schoolHistory: "",
    lastSeminary: "",
    dateOfJoining: "",
    dateOfBirth: "",
    emergencyNumber: "",
    qualification: "",
    class: "",
    gender: "",
    subject: "",
    status: "Active",
    expelledDate: null,
    leaveRecords: [] // Array of {fromDate, toDate}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [classes, setClasses] = useState([]); // To store class options
  const [subjects, setSubjects] = useState([]); // To store subject options
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load options first
        const [classesRes, subjectsRes] = await Promise.all([
          axios.get("/api/classes"),
          axios.get("/api/subjects")
        ]);
        
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
        setOptionsLoaded(true);

        // If editing, load student data
        if (isEditing && id) {
          const studentRes = await axios.get(`/api/students/${id}`);
          const studentData = studentRes.data;
          
          // Ensure dates are properly formatted
          if (studentData.dateOfBirth) {
            studentData.dateOfBirth = new Date(studentData.dateOfBirth);
          }
          if (studentData.dateOfJoining) {
            studentData.dateOfJoining = new Date(studentData.dateOfJoining);
          }
          
          // Update the class and subject IDs to match the populated data
          studentData.class = studentData.class?._id;
          studentData.subject = studentData.subject?._id;
          
          setFormData(studentData);
          setIsDataLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError((prev) => ({
          ...prev,
          general: "Failed to load form data"
        }));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);

  // Add new function to format CNIC
  const formatCNIC = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format the string with hyphens
    let formattedValue = '';
    if (digits.length <= 5) {
      formattedValue = digits;
    } else if (digits.length <= 12) {
      formattedValue = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      formattedValue = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }

    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fatherIdentityCard') {
      const formattedValue = formatCNIC(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
    if (name === "dateOfBirth") {
      calculateAge(date);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setFormData((prev) => ({ ...prev, age: age.toString() }));
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (["roleNumber", "registrationNumber", "fatherIdentityCard"].includes(name) && value.trim() !== "") {
      await checkUnique(name, value);
    }
  };

  const checkUnique = async (field, value) => {
    try {
      const response = await axios.post("/api/students/check-unique", { field, value });
      if (!response.data.isUnique) {
        setError((prev) => ({ ...prev, [field]: "This value is already taken." }));
      } else {
        setError((prev) => ({ ...prev, [field]: "" })); // Remove any existing error if unique
      }
    } catch (err) {
      console.error("Failed to check uniqueness", err);
    }
  };

  const handleLeaveRecord = (index, field, value) => {
    const updatedLeaveRecords = [...formData.leaveRecords];
    if (!updatedLeaveRecords[index]) {
      updatedLeaveRecords[index] = {};
    }
    updatedLeaveRecords[index][field] = value;
    setFormData(prev => ({ ...prev, leaveRecords: updatedLeaveRecords }));
  };

  const validateForm = async () => {
    const newErrors = {};

    // Validation rules
    if (!formData.name.trim()) newErrors.name = "Student Name is required.";
    if (!formData.roleNumber.trim()) newErrors.roleNumber = "Role Number is required.";
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration Number is required.";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0) newErrors.age = "Valid age is required.";
    if (!formData.fatherIdentityCard.trim()) newErrors.fatherIdentityCard = "Father's ID Number is required.";
    if (!formData.homeland.trim()) newErrors.homeland = "Homeland (Citizenship) is required.";
    if (!formData.currentAddress.trim()) newErrors.currentAddress = "Current Address is required.";
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = "Permanent Address is required.";
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian Name is required.";
    if (!formData.guardianAddress.trim()) newErrors.guardianAddress = "Guardian Address is required.";
    if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian Phone is required.";
    if (!formData.schoolHistory.trim()) newErrors.schoolHistory = "School History is required.";
    if (!formData.lastSeminary.trim()) newErrors.lastSeminary = "Last Seminary is required.";
    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!formData.emergencyNumber.trim()) newErrors.emergencyNumber = "Emergency Contact Number is required.";
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required.";
    if (!formData.class) newErrors.class = "Class is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.subject) newErrors.subject = "Subject is required.";

    // Add CNIC validation
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.fatherIdentityCard.trim())) {
      newErrors.fatherIdentityCard = "CNIC must be in format: 12345-1234567-1";
    }

    // Check uniqueness for roleNumber, registrationNumber, fatherIdentityCard
    await checkUnique("roleNumber", formData.roleNumber);
    await checkUnique("registrationNumber", formData.registrationNumber);
    await checkUnique("fatherIdentityCard", formData.fatherIdentityCard);

    // Status-related validation
    if (formData.status === "Expelled" && !formData.expelledDate) {
      newErrors.expelledDate = "Expelled date is required when status is Expelled";
    }

    if (formData.status === "On Leave") {
      if (formData.leaveRecords.length === 0) {
        newErrors.leaveRecords = "At least one leave record is required";
      } else {
        formData.leaveRecords.forEach((record, index) => {
          if (!record.fromDate || !record.toDate) {
            newErrors[`leaveRecord${index}`] = "Both from and to dates are required";
          } else if (new Date(record.fromDate) > new Date(record.toDate)) {
            newErrors[`leaveRecord${index}`] = "From date must be before to date";
          }
        });
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) {
      alert("Please correct the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isEditing
        ? `/api/students/${id}`
        : "/api/students";
      const method = isEditing ? axios.put : axios.post;

      const response = await method(endpoint, formData);

      if (response.status === (isEditing ? 200 : 201)) {
        alert(isEditing ? "Student updated successfully!" : "Student added successfully!");
        navigate("/student/list"); // Redirect to the student list page
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to save student. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the student list page
  };

  const generateRandomData = () => {
    // Helper function to pad numbers with leading zeros
    const padNumber = (num, length) => {
      return String(num).padStart(length, '0');
    };

    // Generate CNIC parts with exact lengths
    const part1 = padNumber(Math.floor(Math.random() * 100000), 5);  // 5 digits
    const part2 = padNumber(Math.floor(Math.random() * 10000000), 7); // 7 digits
    const part3 = padNumber(Math.floor(Math.random() * 10), 1);      // 1 digit

    const randomData = {
      name: `Student ${Math.floor(Math.random() * 1000)}`,
      roleNumber: `R${Math.floor(Math.random() * 10000)}`,
      registrationNumber: `REG${Math.floor(Math.random() * 10000)}`,
      fatherIdentityCard: `${part1}-${part2}-${part3}`, // Will always be format: 12345-1234567-1
      homeland: ["Pakistan", "India", "Bangladesh", "Afghanistan"][Math.floor(Math.random() * 4)],
      currentAddress: `Street ${Math.floor(Math.random() * 100)}, City`,
      permanentAddress: `Street ${Math.floor(Math.random() * 100)}, City`,
      guardianName: `Guardian ${Math.floor(Math.random() * 1000)}`,
      guardianAddress: `Guardian Street ${Math.floor(Math.random() * 100)}, City`,
      guardianPhone: `03${Math.floor(Math.random() * 1000000000)}`,
      schoolHistory: `Previous School ${Math.floor(Math.random() * 100)}`,
      lastSeminary: `Seminary ${Math.floor(Math.random() * 100)}`,
      dateOfJoining: new Date(),
      dateOfBirth: new Date(1990 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      emergencyNumber: `03${Math.floor(Math.random() * 1000000000)}`,
      qualification: ["Matric", "Intermediate", "Bachelor"][Math.floor(Math.random() * 3)],
      gender: ["Male", "Female"][Math.floor(Math.random() * 2)],
    };

    // Set random class and subject if available
    if (classes.length > 0) {
      randomData.class = classes[Math.floor(Math.random() * classes.length)]._id;
    }
    if (subjects.length > 0) {
      randomData.subject = subjects[Math.floor(Math.random() * subjects.length)]._id;
    }

    setFormData(randomData);
    calculateAge(randomData.dateOfBirth);
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error.general) return <p className="text-red-500">{error.general}</p>;

  const fields = [
    { label: "Student Name", id: "name", type: "text", placeholder: "Enter student name" },
    { label: "Role Number", id: "roleNumber", type: "text", placeholder: "Enter role number" },
    { label: "Registration Number", id: "registrationNumber", type: "text", placeholder: "Enter registration number" },
    { label: "Age", id: "age", type: "number", readOnly: true, placeholder: "Calculated automatically" },
    { 
      label: "Father's CNIC", 
      id: "fatherIdentityCard", 
      type: "text", 
      placeholder: "12345-1234567-1",
      pattern: "\\d{5}-\\d{7}-\\d{1}"  // HTML5 pattern validation
    },
    { label: "Homeland (Citizenship)", id: "homeland", type: "text", placeholder: "Enter homeland" },
    { label: "Current Address", id: "currentAddress", type: "text", placeholder: "Enter current address" },
    { label: "Permanent Address", id: "permanentAddress", type: "text", placeholder: "Enter permanent address" },
    { label: "Guardian Name", id: "guardianName", type: "text", placeholder: "Enter guardian name" },
    { label: "Guardian Address", id: "guardianAddress", type: "text", placeholder: "Enter guardian address" },
    { label: "Guardian Phone", id: "guardianPhone", type: "text", placeholder: "Enter guardian phone" },
    { label: "School History", id: "schoolHistory", type: "text", placeholder: "Enter school history" },
    { label: "Last Seminary", id: "lastSeminary", type: "text", placeholder: "Enter last seminary" },
    { label: "Date of Joining", id: "dateOfJoining", type: "date" },
    { label: "Date of Birth", id: "dateOfBirth", type: "date" },
    { label: "Emergency Contact Number", id: "emergencyNumber", type: "text", placeholder: "Enter emergency contact number" },
    { label: "Qualification", id: "qualification", type: "text", placeholder: "Enter qualification" },
    { label: "Class", id: "class", type: "select" },
    { label: "Gender", id: "gender", type: "select" },
    { label: "Subject", id: "subject", type: "select" },
    ...(isEditing ? [
      {
        label: "Student Status",
        id: "status",
        type: "select",
        options: [
          { value: "Active", label: "Active" },
          { value: "Expelled", label: "Expelled" },
          { value: "On Leave", label: "On Leave" }
        ]
      },
      ...(formData.status === "Expelled" ? [
        {
          label: "Expelled Date",
          id: "expelledDate",
          type: "date"
        }
      ] : []),
      ...(formData.status === "On Leave" ? [
        {
          label: "Leave Records",
          id: "leaveRecords",
          type: "leaveRecords"
        }
      ] : [])
    ] : [])
  ];

  const LeaveRecords = () => (
    <div className="space-y-4">
      {formData.leaveRecords.map((record, index) => (
        <div key={index} className="flex space-x-4 items-center">
          <input
            type="date"
            value={record.fromDate ? new Date(record.fromDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleLeaveRecord(index, 'fromDate', new Date(e.target.value))}
            className="p-2 border border-gray-600 bg-gray-800 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="date"
            value={record.toDate ? new Date(record.toDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleLeaveRecord(index, 'toDate', new Date(e.target.value))}
            className="p-2 border border-gray-600 bg-gray-800 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            leaveRecords: [...prev.leaveRecords, { fromDate: null, toDate: null }]
          }));
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Leave Record
      </button>
    </div>
  );

  const renderSelect = (id, label, options) => {
    if (!optionsLoaded) return null;

    let selectOptions = [];
    switch (id) {
      case 'class':
        selectOptions = classes.map(cls => ({
          value: cls._id,
          label: cls.className
        }));
        break;
      case 'subject':
        selectOptions = subjects.map(subj => ({
          value: subj._id,
          label: subj.subjectName
        }));
        break;
      case 'gender':
        selectOptions = [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' }
        ];
        break;
      default:
        selectOptions = options || [];
    }

    return (
      <select
        id={id}
        name={id}
        value={formData[id] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select {label}</option>
        {selectOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const renderInput = (type, id, placeholder, pattern, readOnly = false) => {
    if (id === 'fatherIdentityCard') {
      return (
        <input
          type="text"
          id={id}
          name={id}
          value={formData[id] || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={15} // 13 digits + 2 hyphens
          className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          required
        />
      );
    }
    
    return (
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        readOnly={readOnly}
        placeholder={placeholder}
        required
      />
    );
  };

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Student" : "Add New Student"}</h1>
  
        {/* Only show random data button in add mode */}
        {!isEditing && (
          <button
            type="button"
            onClick={generateRandomData}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Generate Random Data
          </button>
        )}
      </div>
  
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {fields.map(({ label, id, type, readOnly, placeholder, options }) => (
          <div key={id} className={`flex flex-col ${type === 'leaveRecords' ? 'col-span-full' : ''}`}>
            <label htmlFor={id} className="block text-gray-300 font-medium mb-2">
              {label}
            </label>
            {type === "select" ? (
              renderSelect(id, label, options)
            ) : type === "date" ? (
              <input
                type="date"
                id={id}
                value={formData[id] ? new Date(formData[id]).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(new Date(e.target.value), id)}
                className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : type === "leaveRecords" ? (
              <LeaveRecords />
            ) : (
              renderInput(type, id, placeholder, null, readOnly)
            )}
            {error[id] && <p className="text-red-500 mt-1">{error[id]}</p>}
          </div>
        ))}
  
        <div className="col-span-full flex justify-between mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : isEditing ? "Update Student" : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;