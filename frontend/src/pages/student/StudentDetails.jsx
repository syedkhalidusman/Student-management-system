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

  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        const studentData = response.data;
        
        // If student has a stipend, fetch the stipend details
        if (studentData.hasStipend && studentData.stipendId) {
          try {
            const stipendResponse = await axios.get(`/api/stipends/${studentData.stipendId}`);
            studentData.stipendDetails = stipendResponse.data;
          } catch (stipendError) {
            console.error("Failed to fetch stipend details:", stipendError);
            // Don't fail the whole component if stipend fetch fails
            studentData.stipendDetails = null;
          }
        }
        
        setStudent(studentData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch student details", err);
        setError("Failed to load student details. Please try again.");
        setLoading(false);
      }
    };

    fetchStudentDetails();
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

  const formatDepartmentInfo = (departmentData) => {
    if (!departmentData) return "N/A";
    return (
      <div>
        <p className="text-white">{departmentData.departmentName}</p>
        <p className="text-sm text-gray-400">{departmentData.description}</p>
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

  const renderDocument = (document, label) => {
    if (!document) return null;
    
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(document);
    const documentUrl = `${API_URL}/uploads/students/documents/${document}`;

    return (
      <div className="col-span-full bg-gray-800 p-4 rounded-lg mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{label}</h3>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Open in New Tab
          </a>
        </div>
        
        {isImage && (
          <div className="relative w-full max-w-md mx-auto mt-4">
            <img
              src={documentUrl}
              alt={label}
              className="w-full rounded-lg shadow-lg cursor-pointer"
              onClick={() => window.open(documentUrl, '_blank')}
              onError={(e) => {
                console.log(`Failed to load ${label}:`, e);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {!isImage && (
          <div className="bg-gray-700 p-3 rounded">
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{document}</span>
            </div>
          </div>
        )}
      </div>
    );
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

      {student?.photo && (
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700">
            <img
              src={`${API_URL}/uploads/students/${student.photo}`}
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log("Image load failed:", e.target.src);
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = '/placeholder-avatar.png';
              }}
            />
          </div>
        </div>
      )}

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
        <DetailItem 
          label="Department" 
          value={student.department?.departmentName || "N/A"} 
        />

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
                        <span className="text-white">{formatDate(record.fromDate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">To: </span>
                        <span className="text-white">{formatDate(record.toDate)}</span>
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

        <div className="col-span-full mt-6">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          {student.birthCertificate && renderDocument(student.birthCertificate, 'Birth Certificate')}
          {student.bForm && renderDocument(student.bForm, 'B-Form')}
          {!student.birthCertificate && !student.bForm && (
            <p className="text-gray-400 text-center">No documents uploaded</p>
          )}
        </div>

      </div>

      {student?.hasStipend && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-semibold mb-3">Stipend Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem 
              label="Stipend Status" 
              value={student.hasStipend ? "Enabled" : "Disabled"} 
            />
            {student.stipendDetails && (
              <>
                <DetailItem 
                  label="Stipend name" 
                  value={student.stipendDetails.stipendName} 
                />
                <DetailItem 
                  label="Stipend Amount" 
                  value={`RS:${student.stipendDetails.amount}`} 
                />
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back to Student List
        </button>
        <Link
          to={`/student/edit/${student._id}`}
          className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Edit Student
        </Link>
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
