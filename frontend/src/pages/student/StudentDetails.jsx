import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns'; // For formatting dates

const StudentDetails = () => {
  const { id } = useParams(); // Extract the student ID from the URL
  const navigate = useNavigate(); // For navigation
  const [student, setStudent] = useState(null); // Student data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    // Fetch student data by ID
    axios
      .get(`/api/students/${id}`)
      .then((response) => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch student details", err);
        setError("Failed to load student details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate("/student/list"); // Navigate back to the student list
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Student Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Student Name" value={student.name} />
        <DetailItem label="Role Number" value={student.roleNumber} />
        <DetailItem label="Registration Number" value={student.registrationNumber} />
        <DetailItem label="Age" value={student.age} />
        <DetailItem label="Father's ID Number" value={student.fatherIdentityCard} />
        <DetailItem label="Homeland" value={student.homeland} />
        <DetailItem label="Current Address" value={student.currentAddress} />
        <DetailItem label="Permanent Address" value={student.permanentAddress} />
        <DetailItem label="Guardian Name" value={student.guardianName} />
        <DetailItem label="Guardian Address" value={student.guardianAddress} />
        <DetailItem label="Guardian Phone" value={student.guardianPhone} />
        <DetailItem label="School History" value={student.schoolHistory} />
        <DetailItem label="Last Seminary" value={student.lastSeminary} />
        <DetailItem 
          label="Date of Joining" 
          value={student.dateOfJoining ? format(new Date(student.dateOfJoining), 'MM/dd/yyyy') : "N/A"} 
        />
        <DetailItem 
          label="Date of Birth" 
          value={student.dateOfBirth ? format(new Date(student.dateOfBirth), 'MM/dd/yyyy') : "N/A"} 
        />
        <DetailItem label="Emergency Contact Number" value={student.emergencyNumber} />
        <DetailItem label="Qualification" value={student.qualification} />
        <DetailItem label="Class" value={student.class?.className || "N/A"} />
        <DetailItem label="Gender" value={student.gender} />
        <DetailItem label="Subject" value={student.subject?.subjectName || "N/A"} />
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          to={`/student/edit/${student._id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
        > 
          Edit
        </Link>
        <Link
          to="/student/list"
          className="text-blue-400 hover:underline mt-4"
        >
          Back to Student List
        </Link>
      </div>
    </div>
  );
};

// Component to display individual detail items
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-gray-400 font-medium">{label}</p>
    <p className="text-white">{value || "N/A"}</p>
  </div>
);

export default StudentDetails;
