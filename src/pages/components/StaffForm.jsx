import React, { useState } from 'react';
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";

const StaffForm = ({ contract, account }) => {
  // Array for staff basic personal and professional info (10 details)
  const [staffInfo, setStaffInfo] = useState({
    wallet: '',
    name: '',
    employeeId: '',
    department: '',
    designation: '',
    dob: '',
    address: '',
    contact: '',
    email: '',
    fatherName: '',
    motherName: '',
    fatherOcc: '',
    motherOcc: '',
    joiningDate: '',
    salary: '',
    remarks: '',
  });

  // Array for storing staff document PDFs
  const [documents, setDocuments] = useState({
    photo: null,
    aadhar: null,
    resume: null,
    qualification: null,
    experience: null,
  });

  // Determine input type dynamically
  const getInputType = (key) => {
    if (key === "contact") return "tel";
    if (key === "email") return "email";
    if (key === "dob" || key === "joiningDate") return "date";
    if (key === "employeeId" || key === "Salary") return "number";
    if (key === "remarks") return "checkbox";
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

  // Handle input change for staff info
  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStaffInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox"
        ? name === "remarks" // For hostelRequired
          ? checked ? "bad" : "good"
          : checked // For other checkboxes, default to yes/no
        : value,
    }));
  };

  // Handle file selection for documents
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
    console.log('Staff Info:', staffInfo);
    console.log('Uploaded Documents:', documents);
    try {
      const ipfsHash = await storeDataInIPFS(staffInfo);
      const docHash = await storeDataInIPFS(documents);
      await contract.methods
        .addStaff(staffInfo.wallet, ipfsHash, docHash, staffInfo.employeeId)
        .send({ from: account });
      alert("Staff added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  const documentNames = [
    { label: 'Photo', name: 'photo' },
    { label: 'Aadhar', name: 'aadhar' },
    { label: 'Resume', name: 'resume' },
    { label: 'Qualification Certificate', name: 'qualification' },
    { label: 'Experience Certificate', name: 'experience' },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-full mx-auto p-6 border rounded-lg shadow-lg space-y-6 bg-white">
        <h2 className="text-2xl text-green-700 text-center text-green font-bold">Staff Information Form</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Staff Info */}
          {Object.keys(staffInfo).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
              <input
                type={getInputType(key)}
                name={key}
                value={
                  typeof staffInfo[key] === "boolean" ? undefined : staffInfo[key]
                }
                checked={typeof staffInfo[key] === "boolean" ? staffInfo[key] : undefined}
                onChange={handleInfoChange}
                className={getInputClass(getInputType(key))}

              />
            </div>
          ))}
        </div>

        {/* Document Upload */}
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
              {documents[doc.name] && <p className="mt-2 text-sm text-gray-600">{documents[doc.name].name}</p>}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </form>

    </>
  );
};

export default StaffForm;
