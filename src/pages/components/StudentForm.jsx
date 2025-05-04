import React, { useState } from "react";
import { storeDataInIPFS } from "./utils/ipfs";
import { toast } from 'react-toastify';
const StudentForm = ({ contract, account }) => {
  // Expanded Student information state
  const [studentInfo, setStudentInfo] = useState({
    wallet: "",
    firstName: "",
    lastName: "",
    rollNo: "",
    class: "",
    collegeName: "",
    yearInRoman:"",
    semester:"",
    yearOfStudy: "",
    department: "IT",
    dob: "",
    gender: "",
    nationality: "",
    religion: "",
    caste: "",
    category: "",
    bloodGroup: "",
    aadharNo: "",
    panNo: "",
    communityCertNo: "",
    nativeCertNo: "",
    passportNo: "",
    permanentAddress: "",
    currentAddress: "",
    contact: "",
    alternateContact: "",
    email: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactNumber: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    annualFamilyIncome: "",
    admissionDate: "",
    admissionType: "",
    previousSchool: "",
    previousSchoolBoard: "",
    previousSchoolPercentage: "",
    hostelRequired: "No",
    scholarship: "No",
    medicalHistory: "",
    allergies: "",
    extracurricularActivities: "",
    remarks: "Good",
  });

  // Academic Marks state (8 semesters)
  const [academicMarks, setAcademicMarks] = useState({
    sem1: { cgpa: "", ogpa: "", percentage: "" },
    sem2: { cgpa: "", ogpa: "", percentage: "" },
    sem3: { cgpa: "", ogpa: "", percentage: "" },
    sem4: { cgpa: "", ogpa: "", percentage: "" },
    sem5: { cgpa: "", ogpa: "", percentage: "" },
    sem6: { cgpa: "", ogpa: "", percentage: "" },
    sem7: { cgpa: "", ogpa: "", percentage: "" },
    sem8: { cgpa: "", ogpa: "", percentage: "" },
  });

  // Student documents state
  const [documents, setDocuments] = useState({
    photo: null,
    aadhar: null,
    pan: null,
    tenthCert: null,
    twelfthCert: null,
    tc: null,
    income: null,
    community: null,
    native: null,
    medicalCert: null,
  });

  // Determine input type dynamically
  const getInputType = (key) => {
    if (key.includes("contact") || key === "emergencyContactNumber") return "tel";
    if (key === "email") return "email";
    if (key === "dob" || key === "admissionDate") return "date";
    if (key === "rollNo" || key === "yearOfStudy" || key === "previousSchoolPercentage" || key === "annualFamilyIncome") return "number";
    if (key === "hostelRequired" || key === "scholarship" || key === "remarks" || key === "department" || key === "yearInRoman" || key === "semester" || key === "bloodGroup") return "select";
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

  // Handle student info changes
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle academic marks changes
  const handleMarksChange = (e, semester, field) => {
    const { value } = e.target;
    setAcademicMarks((prevMarks) => ({
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
        setDocuments((prev) => ({
          ...prev,
          [name]: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Student Info:", studentInfo);
    console.log("Academic Marks:", academicMarks);
    console.log("Uploaded Documents:", documents);
    try {
      const infoHash = await storeDataInIPFS(studentInfo);
      const marksHash = await storeDataInIPFS(academicMarks);
      const docHash = await storeDataInIPFS(documents);

      await contract.methods
        .addStudent(studentInfo.wallet, infoHash, marksHash, docHash, studentInfo.rollNo)
        .send({ from: account });
      toast.success("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student.");
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
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-8 border border-gray-200 rounded-2xl shadow-xl space-y-8 bg-white"
    >
      <h2 className="text-3xl text-center text-green-700 font-bold">Student Information Form</h2>

      {/* Student Info Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(studentInfo).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>
              {getInputType(key) === "select" ? (
                <select
                  name={key}
                  value={studentInfo[key]}
                  onChange={handleInfoChange}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass("select")}`}
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
                  value={studentInfo[key]}
                  onChange={handleInfoChange}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass(getInputType(key))}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic Marks Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Academic Marks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(academicMarks).map((semester) => (
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
                    value={academicMarks[semester][field]}
                    onChange={(e) => handleMarksChange(e, semester, field)}
                    className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass("number")}`}
                    step="0.01"
                    min="0"
                    max={field === "percentage" ? "100" : "10"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Upload Documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentNames.map((doc) => (
            <div key={doc.name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Upload {doc.label} (PDF)</label>
              <input
                type="file"
                name={doc.name}
                onChange={handleFileChange}
                accept=".pdf"
                className="border border-gray-300 px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {documents[doc.name] && (
                <p className="mt-1 text-sm text-gray-500 truncate">File uploaded</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition duration-300 shadow-md hover:shadow-lg"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default StudentForm;