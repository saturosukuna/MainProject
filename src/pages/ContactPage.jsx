import React from "react";
import { motion } from "framer-motion";

const contactDetails = [
  {
    icon: "mdi:map-marker",
    text: "Annamalai Nagar, Chidambaram, Cuddalore District, Tamil Nadu, 608002, India",
  },
  {
    icon: "mdi:phone",
    text: "04144 2238282",
  },
  {
    icon: "mdi:email",
    text: "contact@college.edu",
  },
  {
    icon: "mdi:fax",
    text: "04144 238080",
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <motion.div
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl font-semibold text-center mb-6">Contact Us</h1>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {contactDetails.map((detail, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <iconify-icon icon={detail.icon} width="32" height="32"></iconify-icon>
              <p className="text-lg text-gray-700">{detail.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
