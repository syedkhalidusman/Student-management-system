import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Welcome from "./components/Welcome";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/student/StudentList";
import StudentDetails from "./pages/student/StudentDetails";
import TeacherForm from "./pages/teacher/TeacherForm";
import TeacherList from "./pages/teacher/TeacherList";
import TeacherDetails from "./pages/teacher/TeacherDetails";
import StudentAttendanceForm from "./pages/student/StudentAttendanceForm";
import ClassList from "./pages/class/ClassList";
import ClassForm from "./pages/class/ClassForm";
import ClassDetails from "./pages/class/ClassDetails";
import Department from "./pages/other/Department";
import Subject from "./pages/other/Subject"; // Changed from Department
import AttendanceCalendar from './pages/student/AttendanceCalendar';
import AddStudentForm from "./pages/student/AddStudentForm";
import EditStudentForm from "./pages/student/EditStudentForm";
import ErrorBoundary from './components/ErrorBoundary';
import Stipend from "./pages/other/Stipend"; // Fix the import path

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Main Layout with Nested Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Welcome />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Student Routes - Updated */}
          <Route path="student/add" element={<AddStudentForm />} />
          <Route path="student/edit/:id" element={<EditStudentForm />} />
          <Route path="student/list" element={<StudentList />} />
          <Route path="student-attendance-form" element={<StudentAttendanceForm/>} />
          <Route path="/attendance-calendar" element={<AttendanceCalendar />} />
          <Route path="student/view/:id" element={<StudentDetails />} />
          
          {/* Teacher Routes */}
          <Route path="teacher/add" element={<TeacherForm />} />
          <Route path="teacher/list" element={<TeacherList />} />
          <Route path="teacher/edit/:id" element={<TeacherForm />} />
          <Route path="teacher/view/:id" element={<TeacherDetails />} />

          {/* Class Routes */}
          <Route path="class/add" element={<ClassForm />} />
          <Route path="class/list" element={<ClassList />} />
          <Route path="class/edit/:id" element={<ClassForm />} />
          <Route path="class/view/:id" element={<ClassDetails />} />

          {/* Department Route */}
          <Route path="department" element={<Department />} />

          {/* Subject Route */}
          <Route path="/subject" element={<Subject />} />
          
          {/* Stipend Route - Updated import path */}
          <Route path="/stipend" element={<Stipend />} />
        </Route>

        {/* Fallback Route for Undefined Paths */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
