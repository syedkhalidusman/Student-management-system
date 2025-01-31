import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const TeacherDetails = () => {
  const { id } = useParams(); // Get teacher ID from the URL
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`/api/teachers/${id}`);
        setTeacher(response.data);
      } catch {
        setError("Failed to fetch teacher details.");
      }
    };
    fetchTeacher();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!teacher) return <p>Loading...</p>;

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Details</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div><strong>Name:</strong> {teacher.name}</div>
        <div><strong>Age:</strong> {teacher.age}</div>
        <div><strong>Father's Name:</strong> {teacher.fatherName}</div>
        <div><strong>Subject:</strong> {teacher.subject.subjectName}</div>
        <div><strong>Qualification:</strong> {teacher.qualification}</div>
        <div><strong>Experience:</strong> {teacher.experience} years</div>
        <div><strong>Contact:</strong> {teacher.contactNumber}</div>
        <div><strong>Email:</strong> {teacher.email}</div>
        <div><strong>Address:</strong> {teacher.address}</div>
        <div><strong>Married Status:</strong> {teacher.marriedStatus}</div>
        <div><strong>Emergency Number:</strong> {teacher.emergencyNumber}</div>
        <div><strong>Identity Card No:</strong> {teacher.identityCardNo}</div>
        <div><strong>Date of Birth:</strong> {new Date(teacher.dateOfBirth).toLocaleDateString()}</div>
        <div><strong>Date of Joining:</strong> {new Date(teacher.dateOfJoining).toLocaleDateString()}</div>
        <div><strong>Status:</strong> {teacher.status}</div>
        <div><strong>Salary:</strong> ${teacher.salary}</div>
        <div><strong>Period of Service:</strong> {teacher.periodOfService}</div>
        <div><strong>Salary Increment:</strong> ${teacher.increased}</div>
        <div><strong>Total Monthly Salary After Increment:</strong> ${teacher.totalMonthlySalaryAfterIncrement}</div>
        <div><strong>Resident Status:</strong> {teacher.residentStatus}</div>
        <div><strong>Teacher ID:</strong> {teacher.teacherId}</div>
      </div>
      <div className="mt-6 flex justify-between">
        <Link
          to={`/teacher/edit/${teacher._id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
        >
          Edit
        </Link>
        <Link
          to="/teacher/list"
          className="text-blue-400 hover:underline mt-4"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default TeacherDetails;
