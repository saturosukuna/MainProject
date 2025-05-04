import React, { useState, useEffect } from "react";
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";
import { toast } from 'react-toastify';
const StudentUpdateForm = ({ contract, account, studentInfo, academicMarks, documents, isAdmin , fetchStudent}) => {
  const [updatedStudentInfo, setUpdatedStudentInfo] = useState({});
  const [updatedAcademicMarks, setUpdatedAcademicMarks] = useState({});
  const [updatedDocuments, setUpdatedDocuments] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Determine input type dynamically
  const getInputType = (key) => {
    if (key.includes("contact") || key === "emergencyContactNumber") return "tel";
    if (key === "email") return "email";
    if (key === "dob" || key === "admissionDate") return "date";
    if (key === "rollNo" || key === "yearOfStudy" || key === "previousSchoolPercentage" || key === "annualFamilyIncome") return "number";
    if (key === "hostelRequired" || key === "scholarship" || key === "remarks" || key === "department" || key === "yearInRoman" || key === "semester" || key === "bloodGroup" ) return "select";
    return "text";
  };

  // Get input class based on type
  const getInputClass = (type) => {
    switch (type) {
      case "email":
        return "border px-4 py-2 rounded-lg focus:ring-blue-500";
      case "tel":
        return "border px-4 py-2 rounded-lg focus:ring-green-500";
      case "date":
        return "border px-4 py-2 rounded-lg focus:ring-yellow-500";
      case "number":
        return "border px-4 py-2 rounded-lg focus:ring-red-500";
      case "select":
        return "border px-4 py-2 rounded-lg focus:ring-purple-500 bg-white";
      default:
        return "border px-4 py-2 rounded-lg focus:ring-gray-500";
    }
  };

  // Initialize state with props
  useEffect(() => {
    setUpdatedStudentInfo(studentInfo || {});
    setUpdatedAcademicMarks(academicMarks || {});
    setUpdatedDocuments(documents || {});
  }, [studentInfo, academicMarks, documents]);

  // Handle student info changes
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle academic marks changes
  const handleMarksChange = (e, semester, field) => {
    const { value } = e.target;
    setUpdatedAcademicMarks((prevMarks) => ({
      ...prevMarks,
      [semester]: {
        ...prevMarks[semester],
        [field]: value,
      },
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setUpdatedDocuments((prev) => ({
          ...prev,
          [name]: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Log changes
  const addLogs = async () => {
    const logMessages = [];
  
    // Check for changes in student info
    if (studentInfo && typeof studentInfo === "object" && Object.keys(studentInfo).length > 0) {
      Object.keys(studentInfo).forEach((key) => {
        if (updatedStudentInfo[key] !== studentInfo[key]) {
          logMessages.push({
            field: key,
            oldValue: studentInfo[key] ?? "N/A",
            newValue: updatedStudentInfo[key] ?? "N/A",
          });
        }
      });
    }
  
    // Check for changes in academic marks
    if (academicMarks && typeof academicMarks === "object" && Object.keys(academicMarks).length > 0) {
      Object.keys(academicMarks).forEach((semester) => {
        if (updatedAcademicMarks[semester] && academicMarks[semester]) {
          ["cgpa", "ogpa", "percentage"].forEach((field) => {
            if (updatedAcademicMarks[semester][field] !== academicMarks[semester][field]) {
              logMessages.push({
                field: `${semester}_${field}`,
                oldValue: academicMarks[semester][field] ?? "N/A",
                newValue: updatedAcademicMarks[semester][field] ?? "N/A",
              });
            }
          });
        }
      });
    }
  
    // Check for changes in documents
    if (documents && typeof documents === "object" && Object.keys(documents).length > 0) {
      Object.keys(documents).forEach((key) => {
        const oldFile = documents[key];
        const newFile = updatedDocuments[key];
        if (newFile && (!oldFile || newFile !== oldFile)) {
          logMessages.push({
            field: key,
            oldValue: oldFile ? "File" : "None",
            newValue: "File",
          });
        }
      });
    }
  
    // Store logs if there are any changes
    if (logMessages.length > 0) {
      const logHash = await storeDataInIPFS(logMessages);
      await contract.methods.addLog(updatedStudentInfo.wallet, logHash).send({ from: account });
      console.log("Logged Changes:", logMessages);
    } else {
      console.log("No changes detected to log.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const student = await contract.methods.getStudent(updatedStudentInfo.wallet).call({ from: account });
      const infoHash = await updateDataInIPFS(student.ipfsHash, updatedStudentInfo);
      const marksHash = isAdmin ? await updateDataInIPFS(student.acadHash, updatedAcademicMarks):student.acadHash;;
      const docHash = isAdmin ? await updateDataInIPFS(student.docHash, updatedDocuments) : student.docHash;

      await contract.methods
        .updateStudent(updatedStudentInfo.wallet, infoHash, marksHash, docHash, updatedStudentInfo.rollNo)
        .send({ from: account });

      await addLogs();
      toast.success("Student details updated successfully!");
      setIsFormVisible(false);
      fetchStudent();
    } catch (error) {
      console.error("Error updating student details:", error);
      toast.error("Failed to update student details or logs.");
    }
  };

  // Document names mapping
  const documentNames = [
    { label: "Photo", name: "photo" },
    { label: "Aadhar", name: "aadhar" },
    { label: "PAN", name: "pan" },
    { label: "10th Certificate", name: "tenthCert" },
    { label: "12th Certificate", name: "twelfthCert" },
    { label: "Transfer Certificate", name: "tc" },
    { label: "Income Certificate", name: "income" },
    { label: "Community Certificate", name: "community" },
    { label: "Native Certificate", name: "native" },
    { label: "Medical Certificate", name: "medicalCert" },
  ];

  // Options for dropdowns
  const dropdownOptions = {
    department: ["CSE", "ECE", "EEE", "ME", "CE"],
    hostelRequired: ["Yes", "No"],
    scholarship: ["Yes", "No"],
    remarks: ["Good", "Bad"],
    yearInRoman: ["Ist Year","II nd Year","III rd Year","IV th Year"],
    semester: ["1","2","3","4","5","6","7","8"],
    bloodGroup: ["NA","A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  };

  return (
    <div>
      {/* Trigger Button */}
      <div className="mt-6 mx-auto p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={() => setIsFormVisible(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition hover:bg-green-700"
        >
          Edit Form
        </button>
      </div>

      {/* Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white max-w-7xl w-full mx-4 p-8 rounded-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsFormVisible(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>

            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-3xl text-center text-green-700 font-bold mb-4">
                Update Student Information
              </h2>

              {/* Student Info Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(updatedStudentInfo).map((key) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-sm text-gray-700 font-medium mb-1">
                        {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </label>
                      {getInputType(key) === "select" ? (
                        <select
                          name={key}
                          value={updatedStudentInfo[key]}
                          onChange={handleInfoChange}
                          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass("select")}`}
                          disabled={!isAdmin && key === "previousSchoolPercentage"}
                        >
                          {dropdownOptions[key].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={getInputType(key)}
                          name={key}
                          value={updatedStudentInfo[key]}
                          onChange={handleInfoChange}
                          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass(getInputType(key))}`}
                          disabled={!isAdmin && key === "previousSchoolPercentage"}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Marks Section */}
              {isAdmin && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Academic Marks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(updatedAcademicMarks).map((semester) => (
                    <div key={semester} className="flex flex-col space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">{`Semester ${semester.replace("sem", "")}`}</h4>
                      {["cgpa", "ogpa", "percentage"].map((field) => (
                        <div key={field} className="flex flex-col">
                          <label className="text-sm text-gray-700 font-medium mb-1">
                            {field.toUpperCase()}
                          </label>
                          <input
                            type="number"
                            name={`${semester}-${field}`}
                            value={updatedAcademicMarks[semester][field]}
                            onChange={(e) => handleMarksChange(e, semester, field)}
                            className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass("number")}`}
                            step="0.01"
                            min="0"
                            max={field === "percentage" ? "100" : "10"}
                            disabled={!isAdmin}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Documents Section */}
              {isAdmin && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Update Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentNames.map((doc) => (
                      <div key={doc.name} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Upload {doc.label} (PDF)
                        </label>
                        <input
                          type="file"
                          name={doc.name}
                          onChange={handleFileChange}
                          accept=".pdf"
                          className="border border-gray-300 px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {updatedDocuments[doc.name] && (
                          <p className="mt-1 text-sm text-gray-500 truncate">File uploaded</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition duration-300 shadow-md hover:shadow-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentUpdateForm;