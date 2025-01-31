import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [studentData, setStudentData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get('/api/students');
        const classRes = await axios.get('/api/classes');
        const teacherRes = await axios.get('/api/teachers');
        setStudentData(studentRes.data);
        setClassData(classRes.data);
        setTeacherData(teacherRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const studentCountByClass = classData.map(cls => ({
    className: cls.className,
    studentCount: studentData.filter(student => student.class === cls._id).length,
  }));

  const studentAgeData = {
    labels: studentData.map(student => student.name),
    datasets: [
      {
        label: 'Age',
        data: studentData.map(student => student.age),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const studentCountData = {
    labels: studentCountByClass.map(item => item.className),
    datasets: [
      {
        label: 'Student Count',
        data: studentCountByClass.map(item => item.studentCount),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const studentGenderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [
          studentData.filter(student => student.gender === 'Male').length,
          studentData.filter(student => student.gender === 'Female').length,
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const teacherCountData = {
    labels: ['Teachers'],
    datasets: [
      {
        label: 'Teacher Count',
        data: [teacherData.length],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div className="w-full mx-auto bg-gray-900 text-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Total Students</h2>
          <p className="text-3xl">{studentData.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Total Classes</h2>
          <p className="text-3xl">{classData.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Total Teachers</h2>
          <p className="text-3xl">{teacherData.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Student Age Distribution</h2>
          <Bar data={studentAgeData} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Student Count by Class</h2>
          <Pie data={studentCountData} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Gender Distribution</h2>
          <Pie data={studentGenderData} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Teacher Count</h2>
          <Bar data={teacherCountData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
