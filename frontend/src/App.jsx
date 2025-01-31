import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Welcome from "./components/Welcome";
import Dashboard from "./pages/Dashboard";
import StudentForm from "./pages/student/StudentForm";
import StudentList from "./pages/student/StudentList";
import StudentDetails from "./pages/student/StudentDetails";
import TeacherForm from "./pages/teacher/TeacherForm";
import TeacherList from "./pages/teacher/TeacherList";
import TeacherDetails from "./pages/teacher/TeacherDetails";
import StudentAttendanceForm from "./pages/student/StudentAttendanceForm";
// import AddClass from "./pages/class/add-class";
import ClassList from "./pages/class/ClassList";
import Department from "./pages/Department/Department";
import ClassForm from "./pages/class/ClassForm";
import ClassDetails from "./pages/class/ClassDetails";
import Subjects from "./pages/Department/Subject";
import StudentAttendanceList from "./pages/student/StudentAttendanceList";
// import TeacherAttendanceForm from "./pages/teacher/TeacherAttendanceForm";
// import TeacherAttendanceList from "./pages/teacher/TeacherAttendanceList";
import AttendanceCalendar from './pages/student/AttendanceCalendar';
 
const App = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Main Layout with Nested Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Welcome />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Student Routes */}
        <Route path="student/add" element={<StudentForm />} />
        <Route path="student/list" element={<StudentList />} />
        <Route path="student-attendance-form" element={<StudentAttendanceForm/>} />
        <Route path="student-attendance-List" element={<StudentAttendanceList />} />
        <Route path="/attendance-calendar" element={<AttendanceCalendar />} />
        <Route path="student/edit/:id" element={<StudentForm />} />
        <Route path="student/view/:id" element={<StudentDetails />} />
        
        {/* Teacher Routes */}
        <Route path="teacher/add" element={<TeacherForm />} />
        <Route path="teacher/list" element={<TeacherList />} />
        {/* <Route path="teacher-attendance-form" element={<TeacherAttendanceForm />} />
        <Route path="teacher-attendance-list" element={<TeacherAttendanceList />} /> */}
        <Route path="teacher/edit/:id" element={<TeacherForm />} />
        <Route path="teacher/view/:id" element={<TeacherDetails />} />

        {/* Class Routes */}
        <Route path="class/add" element={<ClassForm />} />
        <Route path="class/list" element={<ClassList />} />
        <Route path="class/edit/:id" element={<ClassForm />} />
        <Route path="class/view/:id" element={<ClassDetails />} />

        {/* Department Route */}
        <Route path="add-department" element={<Department />} />

        {/* Subject Route */}
        <Route path="add-subject" element={<Subjects />} />
      </Route>

      {/* Fallback Route for Undefined Paths */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default App;
