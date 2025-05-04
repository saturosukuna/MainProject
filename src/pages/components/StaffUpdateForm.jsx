import React, { useState, useEffect } from "react";
import { storeDataInIPFS,updateDataInIPFS } from "./utils/ipfs";
import { toast } from 'react-toastify';
const StaffUpdateForm = ({ contract, account, staffInfo, publications, documents, isAdmin, fetchStaff }) => {
  const [updatedStaffInfo, setUpdatedStaffInfo] = useState({});
  const [updatedPublications, setUpdatedPublications] = useState([]);
  const [updatedDocuments, setUpdatedDocuments] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Initialize state with props
  useEffect(() => {
    setUpdatedStaffInfo(staffInfo || {});
    // Handle publications as object with numeric keys or array
    if (publications && typeof publications === 'object') {
      if (Array.isArray(publications)) {
        setUpdatedPublications(publications.map(pub => ({ ...pub })));
      } else {
        // Convert object with numeric keys to array
        const pubsArray = Object.keys(publications)
          .filter(key => !isNaN(key))
          .sort((a, b) => Number(a) - Number(b))
          .map(key => ({ ...publications[key] }));
        setUpdatedPublications(pubsArray);
      }
    } else {
      setUpdatedPublications([]);
    }
    setUpdatedDocuments(documents || {});
    console.log("Initialized Publications:", updatedPublications);
  }, [staffInfo, publications, documents]);

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
    setUpdatedStaffInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle publication changes
  const handlePublicationChange = (e, index, field) => {
    const { value } = e.target;
    setUpdatedPublications((prevPublications) => {
      const newPublications = [...prevPublications];
      if (!newPublications[index]) {
        newPublications[index] = { title: '', journal: '', publicationDate: '', doi: '', authors: '' };
      }
      newPublications[index] = { ...newPublications[index], [field]: value };
      console.log("Updated Publication at index", index, ":", newPublications[index]);
      console.log("Full Publications Array:", newPublications);
      return newPublications;
    });
  };

  // Add a new publication entry
  const addPublication = () => {
    setUpdatedPublications((prevPublications) => {
      const newPublications = [
        ...prevPublications,
        { title: '', journal: '', publicationDate: '', doi: '', authors: '' },
      ];
      console.log("Added New Publication. Full Array:", newPublications);
      return newPublications;
    });
  };

  // Remove a publication entry
  const removePublication = (index) => {
    setUpdatedPublications((prevPublications) => {
      const newPublications = prevPublications.filter((_, i) => i !== index);
      console.log("Removed Publication at index", index, ". Full Array:", newPublications);
      return newPublications;
    });
  };

  // Handle file selection for documents
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
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

    // Log staff info changes
    if (staffInfo && typeof staffInfo === "object") {
      Object.keys(staffInfo).forEach((key) => {
        if (updatedStaffInfo[key] !== staffInfo[key]) {
          logMessages.push({
            field: key,
            oldValue: staffInfo[key] ?? "N/A",
            newValue: updatedStaffInfo[key] ?? "N/A",
          });
        }
      });
    }

    // Log publication changes
    const maxLength = Math.max(
      Array.isArray(publications) ? publications.length : 0,
      updatedPublications.length
    );
    for (let i = 0; i < maxLength; i++) {
      const oldPub = publications && publications[i] ? publications[i] : {};
      const newPub = updatedPublications[i] || {};
      ['title', 'journal', 'publicationDate', 'doi', 'authors'].forEach((field) => {
        if (newPub[field] !== oldPub[field]) {
          logMessages.push({
            field: `publication_${i + 1}_${field}`,
            oldValue: oldPub[field] ?? "N/A",
            newValue: newPub[field] ?? "N/A",
          });
        }
      });
    }

    // Log document changes
    if (documents && typeof documents === "object") {
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
      await contract.methods.addLog(updatedStaffInfo.wallet, logHash).send({ from: account });
      console.log("Logged Changes:", logMessages);
    } else {
      console.log("No changes detected to log.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staff = await contract.methods.getStaff(updatedStaffInfo.wallet).call({ from: account });
      console.log("Current Staff Data:", staff);

      // Update staff info
      const infoHash = await updateDataInIPFS( staff.ipfsHash,updatedStaffInfo);
      console.log("New infoHash:", infoHash);

      // Update publications
      console.log("Submitting Publications:", updatedPublications);
      const publicHash = await updateDataInIPFS( staff.publicHash,updatedPublications);
      console.log("New publicHash:", publicHash);

      // Update documents (admin only)
      const docHash = isAdmin
        ? await updateDataInIPFS(staff.docHash,updatedDocuments)
        : staff.docHash;
      console.log("New docHash:", docHash);

      // Update staff on blockchain
      const tx = await contract.methods
        .updateStaff(updatedStaffInfo.wallet, infoHash, publicHash, docHash, updatedStaffInfo.employeeId)
        .send({ from: account });
      console.log("Transaction:", tx);

      await addLogs();
      toast.success("Staff details updated successfully!");
      setIsFormVisible(false);
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff details:", error);
      toast.error("Failed in updateform or updating log: " + error.message);
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
    <div>
      <div className="max-w-full mx-auto p-6 mt-4 bg-white rounded-lg shadow-lg">
        <button
          onClick={() => setIsFormVisible(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition hover:bg-green-700"
        >
          Edit Form
        </button>
      </div>

      {/* Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-7xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-xl relative animate-fade-in">
            <button
              onClick={() => setIsFormVisible(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-3xl text-center text-green-700 font-bold">Update Staff Information</h2>

              {/* Staff Info Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Personal and Professional Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(updatedStaffInfo).map((key) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-sm text-gray-700 font-medium mb-1">
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      </label>
                      {getInputType(key) === 'select' ? (
                        <select
                          name={key}
                          value={updatedStaffInfo[key] || ''}
                          onChange={handleInfoChange}
                          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass('select')}`}
                          disabled={!isAdmin && key === 'salary'}
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
                          value={updatedStaffInfo[key] || ''}
                          onChange={handleInfoChange}
                          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass(getInputType(key))}`}
                          disabled={!isAdmin && key === 'salary'}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Publications</h3>
                {updatedPublications.length > 0 ? (
                  updatedPublications.map((publication, index) => (
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
                              value={publication[field] || ''}
                              onChange={(e) => handlePublicationChange(e, index, field)}
                              className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getInputClass(getInputType(field))}`}
                              // disabled={!isAdmin}
                            />
                          </div>
                        ))}
                      </div>
                      {updatedPublications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePublication(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove Publication
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">No publications available. Add one below.</p>
                )}
                <button
                  type="button"
                  onClick={addPublication}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Add Publication
                </button>
              </div>

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

export default StaffUpdateForm;