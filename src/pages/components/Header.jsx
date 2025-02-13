import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Header = ({ role, isConnected, connectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="p-5 bg-gradient-to-r from-green-600 to-green-900 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* University Name */}
        <div className="flex items-center space-x-3">
          <img src="/images/au.png" className="logo w-20 h-15" />
          <h1 className="text-2xl font-bold text-white">Annamalai University</h1>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-white text-lg">
          {[
            { name: "Home", path: "/index",icon:<iconify-icon icon="codicon:home" width="20px"  noobserver></iconify-icon>},
            { name: "About", path: "/about",icon:<iconify-icon icon="codicon:feedback" width="20px" noobserver></iconify-icon> },
            { name: "Dept Info", path: "/department" ,icon:<iconify-icon icon="codicon:info" width="20px" noobserver></iconify-icon>},
            { name: "Contact", path: "/contact",icon:<iconify-icon icon="codicon:call-incoming" width="20px" noobserver></iconify-icon> },
          ].map(({ name, path,icon }, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300 ${isActive ? "underline font-semibold text-yellow-300" : ""}`
              }
            >
              <span>{icon}</span>
              <span>{name}</span>
            </NavLink>
          ))}

          {/* Role-based Navigation */}
          {isConnected && role === "admin" && (
            <NavLink to="/admin" className="hover:text-yellow-300 transition-colors duration-300">
             <span><iconify-icon icon="codicon:home" width="20px"  noobserver></iconify-icon></span> 
             <span>Admin</span>
            </NavLink>
          )}
          {isConnected && role === "staff" && (
            <NavLink to="/staff" className="hover:text-yellow-300 transition-colors duration-300">
              <span><iconify-icon icon="codicon:home" width="20px"  noobserver></iconify-icon></span> 
              <span>Staff</span>
            </NavLink>
          )}
          {isConnected && role === "student" && (
            <NavLink to="/student" className="hover:text-yellow-300 transition-colors duration-300">
              <span><iconify-icon icon="codicon:home" width="20px"  noobserver></iconify-icon></span> 
              <span>Student</span>
            </NavLink>
          )}

          {/* Wallet Connection Button */}
          {!isConnected ? (
            <button
              className="bg-blue-600 px-4  rounded-lg hover:bg-blue-500 transition duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <span className="text-yellow-300">Wallet Connected</span>
          )}
        </nav>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden p-3 text-white bg-transparent border-2 border-white rounded-full focus:outline-none hover:bg-white hover:text-green-700 transition-all duration-300"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg text-center">
          {[
            { name: "Home", path: "/index" },
            { name: "About", path: "/about" },
            { name: "Dept Info", path: "/department" },
            { name: "Contact", path: "/contact" },
          ].map(({ name, path }, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `block text-lg px-6 py-3 text-gray-800 hover:bg-gray-200 transition-colors duration-300 ${isActive ? "underline font-semibold text-green-700" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </NavLink>
          ))}

          {/* Role-based Navigation for Mobile */}
          {isConnected && role === "admin" && (
            <NavLink to="/admin" className="block text-lg px-6 py-3 text-gray-800 hover:bg-gray-200">
              Admin
            </NavLink>
          )}
          {isConnected && role === "staff" && (
            <NavLink to="/staff" className="block text-lg px-6 py-3 text-gray-800 hover:bg-gray-200">
              Staff
            </NavLink>
          )}
          {isConnected && role === "student" && (
            <NavLink to="/student" className="block text-lg px-6 py-3 text-gray-800 hover:bg-gray-200">
              Student
            </NavLink>
          )}

          {/* Wallet Connection Button for Mobile */}
          {!isConnected ? (
            <button
              className="w-full bg-blue-600 px-4 py-2  hover:bg-blue-500 transition duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <span className="block py-3 text-yellow-300">Wallet Connected</span>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
