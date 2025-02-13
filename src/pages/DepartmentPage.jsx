import React from "react";
import { motion } from "framer-motion";

const staffDetails = [ 
  {
    name: "Dr. V. Srinivasan",
    designation: "professor",
    dept: "Information Technology",
    qualification: " B.E., M.E., M.Tech.,Ph.D.,",
    dateOfJoin:"1986-07-22",
    dob:"1986-11-21",
    address:"1224, Mahavir Nagar,Chidambaram - 608 001",
    photo: "https://annamalaiuniversity.ac.in/assets/staff_photos/00649.jpg",
    contact: "vscseau@gmail.com",
    phone: "+91 9486802102",
  },{
    name: "Dr. J. Jothilakshmi",
    designation: "professor",
    dept: "Information Technology",
    qualification: " B.E.,M.E.,Ph.D.,",
    dateOfJoin:"1999-11-29",
    dob:"1973-03-10",
    address:"21/5, K.K.C Pillai Street,Chidambaram - 608 001",
    photo: "https://annamalaiuniversity.ac.in/assets/staff_photos/04430.jpg",
    contact: "jothi.sekar@gmail.com",
    phone: "+91 9894693493",
  },
  {
    name: "Dr. J. Sasikala",
    designation: "professor",
    dept: "Information Technology",
    qualification: " B.E.,M.E.,Ph.D.,",
    dateOfJoin:"1999-12-15",
    dob:"1971-06-15",
    address:"No:16, Murali's Park Avenue,Annamalai Nagar,Chidambaram - 608 002",
    photo: "https://annamalaiuniversity.ac.in/assets/staff_photos/04062.jpg",
    contact: "sasikala.au@gmail.com",
    phone: "+91 9944481791",
  }
  
];
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    // If birth month and day are ahead of today, reduce age by 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };
  
const DepartmentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          Department of Information Technology
        </h1>
        <p className="text-lg text-justify text-gray-700">
          Annamalai University’s Faculty of Engineering and Technology is one of
          the premier engineering institutions in Tamil Nadu, known for its rich
          academic heritage and commitment to technical excellence.
        </p>
      </motion.div>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {staffDetails.map((staff, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={staff.photo}
              alt={staff.name}
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{staff.name}</h2>
            <p className="text-gray-600">{staff.dept}</p>
            <p className="text-gray-600">{staff.qualification}</p>
            <p className="text-gray-600">Experience: {calculateAge(staff.dateOfJoin)} years</p>
            <p className="text-gray-600">{staff.contact}</p>
            <p className="text-gray-600">{staff.phone}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DepartmentPage;
