import React from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SidebarMenu = ({ menu, isOpen, onClick }) => {
  return (
    <div >
      {menu.submenu ? (
        <div
          className="flex justify-between items-center py-2 px-4 rounded  cursor-pointer"
          onClick={onClick}
        >
          <div className="flex items-center w-full hover:opacity-50 ">
            {menu.icon && <menu.icon className="mr-2 text-2xl" />}
            <span className="block w-full">{menu.name}</span>
          </div>
          <div>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>
      ) : (
        <Link to={menu.url} className="flex items-center py-2 px-4 rounded  cursor-pointer">
          <div className="flex items-center w-full hover:opacity-50">
            {menu.icon && <menu.icon  className="mr-2 text-2xl " />}
            <span className="block w-full">{menu.name}</span>
          </div>
        </Link>
      )}
      <div
        className={`overflow-hidden transition-all duration-150  ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        {menu.submenu && menu.submenu.map((submenu, index) => (
          <Link
            to={submenu.url}
            key={index}
            className="flex items-center py-2 pl-10  rounded cursor-pointer"
          >
            <div className="flex items-center w-full hover:opacity-50">
               <span className="block w-full">{submenu.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarMenu;
