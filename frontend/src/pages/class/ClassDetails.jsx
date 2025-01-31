import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ClassDetails = () => {
  const { id } = useParams(); // Get class ID from the URL
  const [classData, setClassData] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`/api/classes/${id}`);
        setClassData(response.data);
  
        // Fix: Ensure that the teacher ID is correct
        const teacherResponse = await axios.get(`/api/teachers/${response.data.teacher._id}`);
        setTeacherDetails(teacherResponse.data);
  
        // Fetch Department Details
        const departmentResponse = await axios.get(`:5000/api/departments/${response.data.department}`);
        setDepartmentDetails(departmentResponse.data);
      } catch {
        setError("Failed to fetch class details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassDetails();
  }, [id]);
  

  if (loading) return <p>Loading...</p>; // Show loading message while fetching
  if (error) return <p className="text-red-500">{error}</p>; // Show error message

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">Class Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><strong>Class Name:</strong> {classData.className}</div>
        <div><strong>Teacher:</strong> {teacherDetails ? teacherDetails.name : 'Loading teacher data...'}</div>
        <div><strong>Department:</strong> {departmentDetails ? departmentDetails.name : 'Loading department data...'}</div>
      </div>
      <div className="mt-6 flex justify-between">
        <Link
          to={`/class/edit/${classData._id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
        >
          Edit
        </Link>
        <Link
          to="/class/list"
          className="text-blue-400 hover:underline mt-4"
        >
          Back to Class List
        </Link>
      </div>
    </div>
  );
};

export default ClassDetails;
