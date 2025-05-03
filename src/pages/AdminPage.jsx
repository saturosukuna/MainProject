import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StaffForm from './components/StaffForm';
import AdminStaffPage from './components/AdminStaffPage';
import AdminStudentPage from './components/AdminStudentPage';

const AdminPage = ({ contract, account }) => {
    const [selectedMenu, setSelectedMenu] = useState("registerStudent");

    // Load the saved menu from localStorage on component mount
    useEffect(() => {
        const savedMenu = localStorage.getItem("selectedMenu");
        if (savedMenu) {
            setSelectedMenu(savedMenu);
        }
    }, []);

    // Save the selected menu to localStorage whenever it changes
    useEffect(() => {
        if (selectedMenu) {
            localStorage.setItem("selectedMenu", selectedMenu);
        }
    }, [selectedMenu]);

    // Function to determine active button styling
    const getButtonClass = (menu) => {
        return `px-4 py-2 rounded transition duration-300 ${selectedMenu === menu
                ? "bg-yellow-500 text-black font-bold"  // Active button style
                : "bg-gray-500 text-white hover:bg-yellow-400" // Default and hover style
            }`;
    };

    return (
        <div className="p-4 mt-24">
            <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>

            {/* Menu */}
            <div className="flex space-x-4 justify-center mb-6">
                <button className={getButtonClass("registerStudent")} onClick={() => setSelectedMenu("registerStudent")}>
                    Register Student
                </button>
                <button className={getButtonClass("registerStaff")} onClick={() => setSelectedMenu("registerStaff")}>
                    Register Staff
                </button>
                <button className={getButtonClass("studentDetails")} onClick={() => setSelectedMenu("studentDetails")}>
                    View Students
                </button>
                <button className={getButtonClass("staffDetails")} onClick={() => setSelectedMenu("staffDetails")}>
                    View Staffs
                </button>
            </div>

            {/* Dynamic Content */}
            {selectedMenu === "registerStudent" && <StudentForm contract={contract} account={account} />}
            {selectedMenu === "registerStaff" && <StaffForm contract={contract} account={account} />}
            {selectedMenu === "studentDetails" && <AdminStudentPage contract={contract} account={account} />}
            {selectedMenu === "staffDetails" && <AdminStaffPage contract={contract} account={account} />}
        </div>
    );
};

export default AdminPage;
