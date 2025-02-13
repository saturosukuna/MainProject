
import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (

    <section className=" min-h-screen bg-gradient-to-br from-white-300 to-white-400 py-20 px-6 md:px-12 lg:px-20">
        
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        {/* Heading */}
        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-green-900 mb-12 text-center"
        >
          About Department Profile
        </motion.h2>

        {/* Vision Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl p-8 mb-12 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <h3 className="text-2xl font-bold text-green-600 mb-6">Vision</h3>
          <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-green-200 pl-4">
            &ldquo;To produce globally competent, quality technocrats, to inculcate values of leadership and
            research qualities and to play a vital role in the socio-economic progress of the nation.&rdquo;
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <div className="col-span-full">
            <h3 className="text-2xl font-bold text-green-600 mb-8">Mission</h3>
          </div>
          
          {[
            "Partner with University community to understand IT needs of faculty, staff and students",
            "Develop dynamic IT professionals with globally competitive learning experience through high-class education",
            "Involve graduates in need-based Research activities and develop entrepreneurial skills"
          ].map((mission, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 p-6 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="flex items-start mb-4">
                <span className="text-green-600 text-2xl mr-3">✓</span>
                <p className="text-gray-800 leading-relaxed">{mission}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Conclusion */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto bg-green-100 rounded-lg p-8"
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            Information Technology paves a vital role in technological advancement on human life,
            culminating huge demand for education in this field. IT bestows knowledge through learning
            to meet the needs of consumers in organizational and societal contexts.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
       

        {/* Overview Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl p-8 my-12 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <h3 className="text-2xl font-bold text-green-600 mb-6">Overview</h3>
          <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-green-200 pl-4">
            The curriculum and syllabus are continually upgraded based on feedback from stakeholders, including industry professionals, academicians, and alumni. This ensures students are trained in evolving technologies to enhance their potential skills.
          </p>
        </motion.div>

        {/* Salient Features */}
        <motion.div 
          variants={itemVariants}
          className="bg-green-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow mb-12"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-6">Salient Features</h3>
          <ul className="text-gray-800 space-y-3 pl-4 list-disc">
            {[
              "State-of-the-art infrastructure facilities.",
              "Choice-Based Credit System (CBCS).",
              "AICTE Approved, NBA-based curriculum.",
              "Well-experienced faculty.",
              "Regular technical workshops, conferences, and deliberations.",
              "IBM – The Great Mind Challenge Program.",
              "Microsoft Student Partner Program.",
              "Scholarships available as per government norms."
            ].map((feature, index) => (
              <motion.li 
                key={index} 
                variants={itemVariants} 
                className="hover:text-green-900 transition-colors"
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Department Initiatives */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow mb-12"
        >
          <h3 className="text-2xl font-bold text-green-600 mb-6">Department Initiatives</h3>
          <p className="text-gray-700 leading-relaxed border-l-4 border-green-200 pl-4">
            The Information Technology Association organizes guest lectures, training sessions, and technical events. It focuses on student-centric learning through counseling, mentoring, and induction programs while monitoring student performance.
          </p>
        </motion.div>

        {/* Short-Term & Long-Term Goals */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            variants={itemVariants}
            className="bg-green-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-green-700 mb-4">Short-Term Goals</h3>
            <ul className="text-gray-800 space-y-3 pl-4 list-disc">
              {[
                "Encourage faculty for societal research.",
                "Provide an ideal academic environment.",
                "Develop e-learning content and resources.",
                "Establish training centers for open-source software.",
                "Strengthen industry interactions.",
                "Conduct computer literacy programs in rural areas."
              ].map((goal, index) => (
                <motion.li key={index} variants={itemVariants}>
                  {goal}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-green-700 mb-4">Long-Term Goals</h3>
            <ul className="text-gray-800 space-y-3 pl-4 list-disc">
              {[
                "Excel in research and development activities with industries and research organizations.",
                "Organize international conferences on Computational Intelligence.",
                "Launch certificate programs in collaboration with foreign universities."
              ].map((goal, index) => (
                <motion.li key={index} variants={itemVariants}>
                  {goal}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto bg-green-100 rounded-lg p-8"
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            Information Technology plays a vital role in technological advancements that impact human lives.
            Our department aims to bridge the gap between knowledge and innovation, ensuring our students are
            well-equipped to meet global demands.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutPage;