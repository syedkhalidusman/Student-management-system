import React, { useState } from "react";
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaUserPlus,
  FaTachometerAlt,
  FaDesktop,
  FaSignInAlt,
  FaUserEdit,
} from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { FaBuildingUser, FaPeopleRoof } from "react-icons/fa6";
import { MdMoreTime } from "react-icons/md";
import { BsBuildingFill, BsBuildingFillAdd } from "react-icons/bs";
import { HiIdentification } from "react-icons/hi";
import SidebarMenu from "./SidebarMenu";

const Sidebar = ({ isOpen }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const handleMenuClick = (index) => {
    setOpenMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const menuData = [

    { name: "Dashboard", url: "/dashboard", icon: FaTachometerAlt },

    {
      name: "Student",
      icon: FaUsers,
      submenu: [
        { 
          name: "Add Student", 
          url: "/student/add", 
          icon: FaUserPlus,
          component: Link 
        },
        {
          name: "Student List",
          url: "/student/list",
          icon: FaUsers,
          component: Link
        },
      ],
    },

    {
      name: "Teacher",
      icon: FaUsers,
      submenu: [
        { name: "Add Teacher", url: "/teacher/add", icon: FaUserPlus },
        { name: "Teacher List", url: "/teacher/list", icon: FaUsers },
        {
          name: "Teacher Attendance Form",
          url: "/teacher-attendance-form", // Corrected path
          icon: FaUsers,
        },
        {
          name: "Teacher Attendance List",
          url: "/teacher-attendance-list",
          icon: FaUsers,
        },
      ],
    },

    {
      name: "Employee",
      icon: HiIdentification,
      submenu: [
        { name: "Add Employee", url: "/employee/create", icon: FaUserPlus },
        { name: "List Of Employee", url: "/employee/list", icon: FaPeopleRoof },
      ],
    },
    {
      name: "Class", // Changed "class" to "Class"
      icon: HiIdentification,
      submenu: [
        { name: "Add Class", url: "/class/add", icon: FaUserPlus }, // Corrected path
        { name: "Class List", url: "/class/list", icon: BsBuildingFill }, // Corrected path
      ],
    },
    {
      name: "other", // Changed "class" to "Class"
      icon: HiIdentification,
      submenu: [
        { name: "Department", url: "/department", icon: BsBuildingFillAdd, },
        { name: "Subject", url: "/subject", icon: BsBuildingFill }, // Corrected path
        { name: "Stipend", url: "/Stipend", icon: BsBuildingFill }, // Corrected path
      ],
    },

    {
      name: "Attendance",
      icon: FaBuildingUser,
      submenu: [
        {
          name: "Student Attendance Form",
          url: "/student-attendance-form", // Corrected path
          icon: FaUsers,
        },
        {
          name: "attendance calendar",
          url: "/attendance-calendar",
          icon: FaUsers,
        },
      ],
    },
    { name: "Login", url: "/signin", icon: FaSignInAlt }, // Corrected URL
    { name: "Register", url: "/signup", icon: FaUserEdit }, // Corrected URL
  ];

  return (
    <div
      className={`fixed overflow-y-auto h-full hideprint pb-16 bg-transparent ${
        isOpen ? "max-w-[20vw] min-w-[20vw]" : "max-w-[0vw] min-w-[0vw]"
      } transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <nav className="flex flex-col gap-y-1">
        {menuData.map((menu, index) => (
          <SidebarMenu
            key={index}
            menu={menu}
            isOpen={index === openMenuIndex}
            onClick={() => handleMenuClick(index)}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
