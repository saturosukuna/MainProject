import React, { useState } from 'react';
import { storeDataInIPFS } from "./utils/ipfs";
import { toast } from 'react-toastify';
const StaffForm = ({ contract, account }) => {
  // Expanded staff information (20+ fields)
  const [staffInfo, setStaffInfo] = useState({
    wallet: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    department: '',
    designation: '',
    dob: '',
    gender: '',
    nationality: '',
    permanentAddress: '',
    currentAddress: '',
    contact: '',
    alternateContact: '',
    email: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    joiningDate: '',
    salary: '',
    highestQualification: '',
    yearsOfExperience: '',
    employeeType: '',
    workLocation: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    remarks: 'Good',
  });

  // Publications state (array of publication objects)
  const [publications, setPublications] = useState([
    { title: '', journal: '', publicationDate: '', doi: '', authors: '' },
  ]);

  // Documents state
  const [documents, setDocuments] = useState({
    photo: null,
    aadhar: null,
    resume: null,
    qualification: null,
    experience: null,
  });

  // Determine input type dynamically
  const getInputType = (key) => {
    if (key.includes('contact') || key === 'emergencyContactNumber') return 'tel';
    if (key === 'email') return 'email';
    if (key === 'dob' || key === 'joiningDate' || key === 'publicationDate') return 'date';
    if (key === 'employeeId' || key === 'salary' || key === 'yearsOfExperience') return 'number';
    if (key === 'remarks' || key === 'department') return 'select';
    return 'text';
  };

  // Get input class based on type
  const getInputClass = (type) => {
    switch (type) {
      case 'email':
        return 'border px-4 py-2 rounded-lg focus:ring-blue-500';
      case 'tel':
        return 'border px-4 py-2 rounded-lg focus:ring-green-500';
      case 'date':
        return 'border px-4 py-2 rounded-lg focus:ring-yellow-500';
      case 'number':
        return 'border px-4 py-2 rounded-lg focus:ring-red-500';
      case 'select':
        return 'border px-4 py-2 rounded-lg focus:ring-purple-500 bg-white';
      default:
        return 'border px-4 py-2 rounded-lg focus:ring-gray-500';
    }
  };

  // Handle staff info changes
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setStaffInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle publication changes
  const handlePublicationChange = (e, index, field) => {
    const { value } = e.target;
    setPublications((prevPublications) => {
      const newPublications = [...prevPublications];
      newPublications[index] = { ...newPublications[index], [field]: value };
      return newPublications;
    });
  };

  // Add a new publication entry
  const addPublication = () => {
    setPublications((prevPublications) => [
      ...prevPublications,
      { title: '', journal: '', publicationDate: '', doi: '', authors: '' },
    ]);
  };

  // Remove a publication entry
  const removePublication = (index) => {
    setPublications((prevPublications) => prevPublications.filter((_, i) => i !== index));
  };

  // Handle file selection for documents
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
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
    console.log('Staff Info:', staffInfo);
    console.log('Publications:', publications);
    console.log('Uploaded Documents:', documents);
    try {
      const infoHash = await storeDataInIPFS(staffInfo);
      const publicHash = await storeDataInIPFS(publications);
      const docHash = await storeDataInIPFS(documents);
      await contract.methods
        .addStaff(staffInfo.wallet, infoHash, publicHash, docHash, staffInfo.employeeId)
        .send({ from: account });
      toast.success("Staff added successfully!");
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff.");
    }
  };

  // Document names mapping
  const documentNames = [
    { label: 'Photo', name: 'photo' },
    { label: 'Aadhar', name: 'aadhar' },
    { label: 'Resume', name: 'resume' },
    { label: 'Qualification Certificate', name: 'qualification' },
    { label: 'Experience Certificate', name: 'experience' },
  ];

  // Dropdown options
  const dropdownOptions = {
    department: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'Administration'],
    remarks: ['Good', 'Bad'],
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-10"
    >
      <h2 className="text-3xl text-center text-green-700 font-bold tracking-tight">
        Staff Information Form
      </h2>

      {/* Staff Info Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Personal and Professional Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(staffInfo).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium mb-1">
                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </label>
              {getInputType(key) === 'select' ? (
                <select
                  name={key}
                  value={staffInfo[key]}
                  onChange={handleInfoChange}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass('select')}`}
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
                  value={staffInfo[key]}
                  onChange={handleInfoChange}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass(getInputType(key))}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Publications Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Publications</h3>
        {publications.map((publication, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {['title', 'journal', 'publicationDate', 'doi', 'authors'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm text-gray-700 font-medium mb-1">
                    {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </label>
                  <input
                    type={getInputType(field)}
                    name={field}
                    value={publication[field]}
                    onChange={(e) => handlePublicationChange(e, index, field)}
                    className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass(getInputType(field))}`}
                  />
                </div>
              ))}
            </div>
            {publications.length > 1 && (
              <button
                type="button"
                onClick={() => removePublication(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove Publication
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPublication}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add Publication
        </button>
      </div>

      {/* Document Upload Grid */}
      <div className="space-y-6">
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

export default StaffForm;