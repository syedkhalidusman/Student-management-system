import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TeacherForm = () => {
  const { id } = useParams(); // Get the teacher ID from the URL
  const navigate = useNavigate(); // For navigation
  const isEditing = Boolean(id); // Determine if it's an edit or create
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    identityCardNo: "",
    age: "",
    qualification: "",
    subject: "",
    experience: "",
    contactNumber: "",
    email: "",
    address: "",
    fatherName: "",
    marriedStatus: "",
    emergencyNumber: "",
    dateOfBirth: "",
    dateOfJoining: "",
    status: "",
    salary: "",
    periodOfService: "",
    increased: "",
    totalMonthlySalaryAfterIncrement: "",
    residentStatus: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [subjects, setSubjects] = useState([]); // To store subject options

  useEffect(() => {
    if (isEditing) {
      // Fetch the teacher data
      setLoading(true);
      axios
        .get(`/api/teachers/${id}`)
        .then((response) => {
          setFormData(response.data); // Populate formData with the fetched teacher data
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch teacher data", err);
          setError((prev) => ({ ...prev, general: "Failed to fetch teacher data. Please try again." }));
          setLoading(false);
        });
    }

    // Fetch subjects data for the select dropdown
    axios
      .get("/api/subjects") // Assuming your API endpoint for fetching subjects
      .then((response) => {
        setSubjects(response.data); // Set the subject options
      })
      .catch((err) => {
        console.error("Failed to fetch subjects", err);
        setError((prev) => ({ ...prev, subject: "Failed to fetch subject data." }));
      });
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError((prev) => ({ ...prev, [name]: "" }));
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
    if (["teacherId", "identityCardNo", "email"].includes(name) && value.trim() !== "") {
      await checkUnique(name, value);
    }
  };

  const checkUnique = async (field, value) => {
    try {
      const response = await axios.post("/api/teachers/check-unique", { field, value });
      if (!response.data.isUnique) {
        setError((prev) => ({ ...prev, [field]: "This value is already taken." }));
      } else {
        setError((prev) => ({ ...prev, [field]: "" })); // Remove any existing error if unique
      }
    } catch (err) {
      console.error("Failed to check uniqueness", err);
    }
  };

  const validateForm = async () => {
    const newErrors = {};

    // Validation rules
    if (!formData.name.trim()) newErrors.name = "Teacher Name is required.";
    if (!formData.teacherId.trim()) newErrors.teacherId = "Teacher ID is required.";
    if (!formData.identityCardNo.trim()) newErrors.identityCardNo = "Identity Card Number is required.";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0) newErrors.age = "Valid age is required.";
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required.";
    if (!formData.subject) newErrors.subject = "Subject is required.";
    if (!formData.experience || isNaN(formData.experience) || formData.experience < 0) newErrors.experience = "Valid experience is required.";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's Name is required.";
    if (!formData.marriedStatus.trim()) newErrors.marriedStatus = "Married Status is required.";
    if (!formData.emergencyNumber.trim()) newErrors.emergencyNumber = "Emergency Contact Number is required.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required.";
    if (!formData.status.trim()) newErrors.status = "Status is required.";
    if (!formData.salary || isNaN(formData.salary) || formData.salary <= 0) newErrors.salary = "Valid salary is required.";
    if (!formData.periodOfService.trim()) newErrors.periodOfService = "Period of Service is required.";
    if (!formData.increased || isNaN(formData.increased) || formData.increased < 0) newErrors.increased = "Valid increment is required.";
    if (!formData.totalMonthlySalaryAfterIncrement || isNaN(formData.totalMonthlySalaryAfterIncrement) || formData.totalMonthlySalaryAfterIncrement <= 0) newErrors.totalMonthlySalaryAfterIncrement = "Valid total monthly salary after increment is required.";
    if (!formData.residentStatus.trim()) newErrors.residentStatus = "Resident Status is required.";

    // Check uniqueness for teacherId, identityCardNo, email
    await checkUnique("teacherId", formData.teacherId);
    await checkUnique("identityCardNo", formData.identityCardNo);
    await checkUnique("email", formData.email);

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
        ? `/api/teachers/${id}`
        : "/api/teachers";
      const method = isEditing ? axios.put : axios.post;

      const response = await method(endpoint, formData);

      if (response.status === (isEditing ? 200 : 201)) {
        alert(isEditing ? "Teacher updated successfully!" : "Teacher added successfully!");
        navigate("/teacher/list"); // Redirect to the teacher list page
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to save teacher. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the teacher list page
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error.general) return <p className="text-red-500">{error.general}</p>;

  const fields = [
    { label: "Teacher Name", id: "name", type: "text", placeholder: "Enter teacher name" },
    { label: "Teacher ID", id: "teacherId", type: "text", placeholder: "Enter teacher ID" },
    { label: "Identity Card Number", id: "identityCardNo", type: "text", placeholder: "12345-1234567-1" },
    { label: "Age", id: "age", type: "number", readOnly: true, placeholder: "Calculated automatically" },
    { label: "Qualification", id: "qualification", type: "text", placeholder: "Enter qualification" },
    { label: "Subject", id: "subject", type: "select" },
    { label: "Experience", id: "experience", type: "number", placeholder: "Enter experience in years" },
    { label: "Contact Number", id: "contactNumber", type: "text", placeholder: "Enter contact number" },
    { label: "Email", id: "email", type: "email", placeholder: "Enter email" },
    { label: "Address", id: "address", type: "text", placeholder: "Enter address" },
    { label: "Father's Name", id: "fatherName", type: "text", placeholder: "Enter father's name" },
    { label: "Married Status", id: "marriedStatus", type: "text", placeholder: "Enter married status" },
    { label: "Emergency Contact Number", id: "emergencyNumber", type: "text", placeholder: "Enter emergency contact number" },
    { label: "Date of Birth", id: "dateOfBirth", type: "date" },
    { label: "Date of Joining", id: "dateOfJoining", type: "date" },
    { label: "Status", id: "status", type: "text", placeholder: "Enter status" },
    { label: "Salary", id: "salary", type: "number", placeholder: "Enter salary" },
    { label: "Period of Service", id: "periodOfService", type: "text", placeholder: "Enter period of service" },
    { label: "Salary Increment", id: "increased", type: "number", placeholder: "Enter salary increment" },
    { label: "Total Monthly Salary After Increment", id: "totalMonthlySalaryAfterIncrement", type: "number", placeholder: "Enter total monthly salary after increment" },
    { label: "Resident Status", id: "residentStatus", type: "text", placeholder: "Enter resident status" },
  ];

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Teacher" : "Add New Teacher"}</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {fields.map(({ label, id, type, readOnly, placeholder }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="block text-gray-300 font-medium mb-2">
              {label}
            </label>
            {type === "select" ? (
              <select
                id={id}
                name={id}
                value={formData[id] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            ) : type === "date" ? (
              <DatePicker
                selected={formData[id] ? new Date(formData[id]) : null}
                onChange={(date) => handleDateChange(date, id)}
                dateFormat="yyyy-MM-dd"
                className="p-2 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
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
            {loading ? "Submitting..." : isEditing ? "Update Teacher" : "Add Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;
