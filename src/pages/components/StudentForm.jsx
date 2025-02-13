import React, { useState } from "react";
import { storeDataInIPFS } from "./utils/ipfs";

const StudentForm = ({ contract, account }) => {
  // Student information state
  const [studentInfo, setStudentInfo] = useState({
    wallet: "",
    name: "",
    rollNo: "",
    class: "",
    school: "",
    yearOfStudy: "",
    major: "",
    department: "",
    dob: "",
    address: "",
    contact: "",
    email: "",
    fatherName: "",
    motherName: "",
    fatherOcc: "",
    motherOcc: "",
    parentContact: "",
    admissionDate: "",
    previousSchool: "",
    percentage: "",
    hostelRequired: "",
    scholarship: "",
    remarks: "",
  });

  // Student documents state
  const [documents, setDocuments] = useState({
    photo: null,
    aadhar: null,
    tenthCert: null,
    twelfthCert: null,
    tc: null,
    income: null,
    community: null,
    native: null,
  });

  // Determine input type dynamically
  const getInputType = (key) => {
    if (key === "contact" || key === "parentContact") return "tel";
    if (key === "email") return "email";
    if (key === "dob" || key === "admissionDate") return "date";
    if (key === "rollNo" || key === "yearOfStudy") return "number";
    if (key === "percentage") return "number";
    if (key === "hostelRequired" || key === "scholarship" || key === "remarks") return "checkbox";
    return "text"; // Default to text
  };



  const getInputClass = (type) => {
    switch (type) {
      case "email":
        return "border px-2 py-1 rounded focus:border-blue-500";
      case "tel":
        return "border px-2 py-1 rounded focus:border-green-500";
      case "date":
        return "border px-2 py-1 rounded focus:border-yellow-500";
      case "number":
        return "border px-2 py-1 rounded focus:border-red-500";
      case "checkbox":
        return "w-5 h-5 text-blue-500";
      default:
        return "border px-2 py-1 rounded focus:border-gray-500";
    }
  };

  // Handle input changes
  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox"
        ? name === "hostelRequired" // For hostelRequired
          ? checked ? "Hostel" : "DayScholar"
          : name === "scholarship" // For scholarship
            ? checked ? "Yes" : "No"
            : name === "remarks" // For hostelRequired
              ? checked ? "bad" : "good"
              : checked // For other checkboxes, default to yes/no
        : value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // Check if the file exists
    if (file) {
      const reader = new FileReader();

      // When the file is read successfully
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]; // Extract the base64 string

        // Update the state with the base64 string
        setDocuments((prev) => ({
          ...prev,
          [name]: base64, // Store the base64 string in the state
        }));
      };

      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Student Info:", studentInfo);
    console.log("Uploaded Documents:", documents);
    try {
      const ipfsHash = await storeDataInIPFS(studentInfo);
      const docHash = await storeDataInIPFS(documents);

      await contract.methods
        .addStudent(studentInfo.wallet, ipfsHash, docHash, studentInfo.rollNo)
        .send({ from: account });
      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  // Document names mapping
  const documentNames = [
    { label: "Photo", name: "photo" },
    { label: "Aadhar", name: "aadhar" },
    { label: "10th Certificate", name: "tenthCert" },
    { label: "12th Certificate", name: "twelfthCert" },
    { label: "Transfer Certificate", name: "tc" },
    { label: "Income Certificate", name: "income" },
    { label: "Community Certificate", name: "community" },
    { label: "Native Certificate", name: "native" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto p-6 border rounded-lg shadow-lg space-y-6 bg-white"
    >
      <h2 className="text-2xl text-green-700 text-center font-bold">Student Information Form</h2>

      {/* Student Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(studentInfo).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm  font-medium">
              {key.replace(/([A-Z])/g, " $1").toUpperCase()}
            </label>
            <input
              type={getInputType(key)}
              name={key}
              value={
                typeof studentInfo[key] === "boolean" ? undefined : studentInfo[key]
              }
              checked={typeof studentInfo[key] === "boolean" ? studentInfo[key] : undefined}
              onChange={handleInfoChange}
              className={getInputClass(getInputType(key))}

            />
          </div>
        ))}
      </div>

      {/* Document Upload Grid */}
      <h3 className="text-lg font-semibold mt-4">Upload Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentNames.map((doc) => (
          <div key={doc.name} className="flex flex-col">
            <label className="text-sm font-medium">Upload {doc.label} (PDF)</label>
            <input
              type="file"
              name={doc.name}
              onChange={handleFileChange}
              accept=".pdf"
              className="border px-2 py-1 rounded"
            />
            {documents[doc.name] && (
              <p className="mt-2 text-sm text-gray-600">{documents[doc.name].name}</p>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
