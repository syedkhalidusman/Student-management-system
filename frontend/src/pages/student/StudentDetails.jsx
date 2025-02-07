import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns'; 
import { FaCalendarAlt } from 'react-icons/fa'; 

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    navigate("/student/list");
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Expelled':
        return 'bg-red-500';
      case 'On Leave':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), 'MM/dd/yyyy') : "N/A";
  };

  const formatClassInfo = (classData) => {
    if (!classData) return "N/A";
    return (
      <div>
        <p className="text-white">{classData.className}</p>
        <p className="text-sm text-gray-400">Shifts: {classData.shift.join(", ")}</p>
      </div>
    );
  };

  const formatSubjectInfo = (subjectData) => {
    if (!subjectData) return "N/A";
    return (
      <div>
        <p className="text-white">{subjectData.subjectName}</p>
        <p className="text-sm text-gray-400">{subjectData.description}</p>
      </div>
    );
  };

  const handleViewAttendance = () => {
    navigate('/attendance-calendar', { 
      state: { 
        studentId: student._id,
        classId: student.class?._id,
        studentName: student.name 
      } 
    });
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Details</h1>
        {student?.status && (
          <span className={`px-4 py-1 rounded-full text-white ${getStatusBadgeColor(student.status)}`}>
            {student.status}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Student Name" value={student.name} />
        <DetailItem label="Role Number" value={student.roleNumber} />
        <DetailItem label="Registration Number" value={student.registrationNumber} />
        <DetailItem label="Age" value={student.age} />
        <DetailItem label="Father's ID Number" value={student.fatherIdentityCard} />
        <DetailItem label="Homeland" value={student.Country} />
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

        <div className="col-span-full flex justify-center mb-4">
          <button
            onClick={handleViewAttendance}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaCalendarAlt className="w-5 h-5 mr-2" />
            View Attendance Calendar
          </button>
        </div>

        {student?.status && (
          <div className="col-span-full bg-gray-800 p-4 rounded-lg mt-4">
            <h2 className="text-xl font-semibold mb-3">Status Information</h2>
            <DetailItem label="Current Status" value={student.status} />
            
            {student.status === 'Expelled' && (
              <DetailItem 
                label="Expelled Date" 
                value={formatDate(student.expelledDate)} 
              />
            )}

            {student.status === 'On Leave' && student.leaveRecords?.length > 0 && (
              <div className="col-span-full bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Leave Records</h2>
                <div className="grid gap-2">
                  {student.leaveRecords.map((record, index) => (
                    <div key={record._id || index} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                      <div>
                        <span className="text-gray-300">From: </span>
                        <span className="text-white">{formatDateString(record.fromDate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">To: </span>
                        <span className="text-white">{formatDateString(record.toDate)}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        ({Math.ceil((new Date(record.toDate) - new Date(record.fromDate)) / (1000 * 60 * 60 * 24))} days)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {student?.hasStipend && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-semibold mb-3">Stipend Information</h2>
          <DetailItem label="Stipend Status" value={student.hasStipend ? "Yes" : "No"} />
          <DetailItem label="Stipend Amount" value={student.stipendAmount} />
          {student.stipendHistory && student.stipendHistory.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-3">Stipend History</h3>
              <table className="w-full table-auto border-collapse border border-gray-600">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-gray-600 p-2">Amount</th>
                    <th className="border border-gray-600 p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {student.stipendHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="border border-gray-600 p-2">{record.amount}</td>
                      <td className="border border-gray-600 p-2">{formatDate(record.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      
      <div className="mt-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back to Student List
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <div className="flex justify-between bg-gray-800 p-4 rounded-lg shadow-md mb-3">
      <span className="text-gray-300">{label}</span>
      <span className="text-white">{value || "N/A"}</span>
    </div>
  );
};

export default StudentDetails;
