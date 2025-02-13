import React from "react";
import AboutPage from "./AboutPage";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      <div className="bg-green-900 text-white mt-20 min-h-screen">
        {/* Hero Section */}
        <motion.section
          className="text-center py-10 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold">Providing Best Education For Brighter Future</h1>
          <p className="mt-4 text-lg max-w-full text-center mx-auto">
            We are committed to excellence in education, research, and innovation. Explore our diverse engineering programs, state-of-the-art facilities, and a vibrant learning environment that prepares you for a successful future. Join us in shaping the next generation of engineers and technologists!
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-green-900 font-semibold rounded-full shadow-md hover:bg-gray-200">
            <NavLink to="/about" className="block w-full h-full text-center">
              Learn More
            </NavLink>
          </button>
        </motion.section>

        {/* Statistics Section */}
        <motion.section
          className="flex justify-center gap-8 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {[{ name: 'Students', count: "400+" }, { name: 'Staffs', count: "20+" }, { name: 'Library', count: "2" }, { name: 'Subjects', count: "60+" }].map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-3xl font-bold">{item.count}</span>
              <p>{item.name}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Categories Section */}
        <motion.section
          className="bg-white text-black py-10 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
         <h1 className="text-4xl text-center text-green p-4 ">Department Of Information Technology</h1>
          <h2 className="text-center text-3xl font-bold mb-6">Our Best Categories, that we teach our student about basic Technologies</h2>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/about')}
              className="px-6 py-3 bg-green-900 text-white rounded-full shadow-md hover:bg-green-700"
            >
              Know More
            </button>
          </div>
          <div className="max-w-full mx-auto p-6 rounded-lg shadow-lg space-y-6 bg-white">
            <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto">
              {[
                { name: "Python", icon: <iconify-icon icon="logos:python" width="42" height="42" noobserver></iconify-icon> },
                { name: "C", icon: <iconify-icon icon="mdi:language-c" width="42" height="42" noobserver></iconify-icon> },
                { name: "C++", icon: <iconify-icon icon="logos:c-plusplus" width="42" height="42" noobserver></iconify-icon> },
                { name: "MATLAB", icon: <iconify-icon icon="devicon:matlab" width="42" height="42" noobserver></iconify-icon> },
                { name: "Java", icon: <iconify-icon icon="logos:java" width="42" height="42" noobserver></iconify-icon> },
                { name: "HTML", icon: <iconify-icon icon="logos:html-5" width="42" height="42" noobserver></iconify-icon> },
                { name: "CSS", icon: <iconify-icon icon="logos:css-3" width="42" height="42" noobserver></iconify-icon> },
                { name: "JavaScript", icon: <iconify-icon icon="logos:javascript" width="42" height="42" noobserver></iconify-icon> },
                { name: "R", icon: <iconify-icon icon="logos:r-lang" width="42" height="42" noobserver></iconify-icon> },
                { name: "Shell", icon: <iconify-icon icon="devicon:powershell" width="42" height="42" noobserver></iconify-icon> },
                { name: "SQL", icon: <iconify-icon icon="logos:mysql-icon" width="42" height="42" noobserver></iconify-icon> },
                { name: "Assembly", icon: <iconify-icon icon="file-icons:assembly-intel" width="42" height="42" noobserver></iconify-icon> },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg text-center shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <h3 className="text-xl font-semibold">{category.icon}</h3>
                  <p className="text-gray-700">{category.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
      <AboutPage />
    </>
  );
};

export default Home;
