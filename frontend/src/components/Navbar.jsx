// src/components/Navbar.jsx
import React from "react";
import { FaBars, FaSignInAlt, FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="fixed  px-2 py-3 flex justify-between items-center w-full h-[7vh] z-10">
      <div className="flex gap-4 items-center justify-between">


        <Link className=" hover:text-bkcolor-primarytext">
        <FaBars size={20} onClick={toggleSidebar} />
        </Link>

        <Link to="/" className="text-xl font-bold items-center hover:text-bkcolor-primarytext">
        jama masjid saad bin maaz
        </Link>
      
      </div>
      <div className="flex items-center space-x-6">
        
       
        <Link to="/logout" className="flex gap-2 items-center hover:text-bkcolor-primarytext">
          <FaSignInAlt />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
