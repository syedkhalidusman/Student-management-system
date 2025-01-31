// src/components/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
// import Footer from './Footer';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen min-w-[100vw] max-w-[100vw] overflow-x-hidden bg-bkcolor-secondary text-bkcolor-secondarytext">
      {/* Navbar */}
      <header className="min-h-[7vh] max-h-[7vh] hideprint border-b border-black">
        <Navbar toggleSidebar={toggleSidebar} />
      </header>

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-grow min-h-[93vh]">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 border-r border-black hideprint select-none overflow-hidden ${
            isSidebarOpen ? 'w-[20vw]' : 'w-[0vw]'
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </aside>

        {/* Main Content Area */}
        <section
          className={`flex-grow flex flex-col justify-between bg-bkcolor-primary text-bkcolor-primarytext transition-all duration-300 ${
            isSidebarOpen ? 'w-[80vw]' : 'w-[100vw]'
          }`}
        >
          {/* Main Content */}
          <div className="flex-grow overflow-y-auto">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="hideprint">
            {/* <Footer /> */}
          </footer>
        </section>
      </div>
    </div>
  );
};

export default MainLayout;
