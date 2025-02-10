import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, studentsResponse] = await Promise.all([
          axios.get(`/api/classes/${id}`),
          axios.get(`/api/students?class=${id}`)
        ]);
        setClassData(classResponse.data);
        setStudents(studentsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch class details", err);
        setError("Failed to load class details. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate("/class/list");
  };

  if (loading) return <div className="text-center p-4 text-white">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DetailItem label="Class Name" value={classData.className} />
        <DetailItem 
          label="Teacher" 
          value={classData.teacher?.name || 'Not Assigned'} 
        />
        <DetailItem 
          label="Department" 
          value={classData.department?.departmentName || 'Not Assigned'} 
        />
        <DetailItem 
          label="Shifts" 
          value={classData.shift.join(', ')} 
        />
        <DetailItem 
          label="Created At" 
          value={new Date(classData.createdAt).toLocaleDateString()} 
        />
        <DetailItem 
          label="Last Updated" 
          value={new Date(classData.updatedAt).toLocaleDateString()} 
        />
      </div>

      {/* Students List Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Enrolled Students ({students.length})</h2>
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2">#</th>
                  <th className="border border-gray-600 p-2">Name</th>
                  <th className="border border-gray-600 p-2">Role Number</th>
                  <th className="border border-gray-600 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {student.name}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {student.roleNumber}
                    </td>
                    <td className="border border-gray-600 p-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        student.status === 'Active' ? 'bg-green-500' :
                        student.status === 'Expelled' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-800 rounded">
            No students enrolled in this class yet.
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <StatCard
          title="Total Students"
          value={students.length}
          bgColor="bg-blue-600"
        />
        <StatCard
          title="Active Students"
          value={students.filter(s => s.status === 'Active').length}
          bgColor="bg-green-600"
        />
        <StatCard
          title="On Leave"
          value={students.filter(s => s.status === 'On Leave').length}
          bgColor="bg-yellow-600"
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back to Class List
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <div className="flex justify-between bg-gray-800 p-4 rounded-lg shadow-md">
      <span className="text-gray-300">{label}</span>
      <span className="text-white">{value || "N/A"}</span>
    </div>
  );
};

const StatCard = ({ title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 text-white`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default ClassDetails;
