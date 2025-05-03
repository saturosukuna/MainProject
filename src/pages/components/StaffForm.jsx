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
<form
  onSubmit={handleSubmit}
  className="max-w-6xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-10"
>
  <h2 className="text-3xl text-center text-green-700 font-bold tracking-tight">
    Staff Information Form
  </h2>

  {/* Staff Info Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Object.keys(staffInfo).map((key) => (
      <div key={key} className="flex flex-col">
        <label className="text-sm text-gray-700 font-medium mb-1">
          {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
        </label>
        <input
          type={getInputType(key)}
          name={key}
          value={typeof staffInfo[key] === 'boolean' ? undefined : staffInfo[key]}
          checked={typeof staffInfo[key] === 'boolean' ? staffInfo[key] : undefined}
          onChange={handleInfoChange}
          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${getInputClass(getInputType(key))}`}
        />
      </div>
    ))}
  </div>

  {/* Document Upload Grid */}
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800">Upload Documents</h3>
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
          {documents[doc.name] && (
            <p className="mt-1 text-sm text-gray-500 truncate">{documents[doc.name].name}</p>
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


    </>
  );
};

export default StaffForm;
