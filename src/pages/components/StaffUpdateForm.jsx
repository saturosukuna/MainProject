import React, { useState, useEffect } from "react";
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";

const StaffUpdateForm = ({ contract, account, staffInfo, documents, isAdmin }) => {
  const [updatedStaffInfo, setUpdatedStaffInfo] = useState({});
  const [updatedDocuments, setUpdatedDocuments] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

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
  useEffect(() => {
    setUpdatedStaffInfo(staffInfo);
    setUpdatedDocuments(documents);
  }, [staffInfo, documents]);

  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedStaffInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox"
        ? name === "remarks" // For hostelRequired
          ? checked ? "bad" : "good"
          : checked // For other checkboxes, default to yes/no
        : value,
    }));
  };

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
        setUpdatedDocuments((prev) => ({
          ...prev,
          [name]: base64, // Store the base64 string in the state
        }));
      };

      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    }
  };


  const addLogs = async () => {
    const changedInfo = {};
    const changedDocs = {};


    // Identify changed fields in student info
    Object.keys(staffInfo).forEach((key) => {
      if (updatedStaffInfo[key] !== staffInfo[key]) {
        changedInfo[staffInfo[key]] = updatedStaffInfo[key]; // { oldValue: newValue }
      }
    });

    // Identify changed documents
    Object.keys(documents).forEach((key) => {
      if (updatedDocuments[key] && (!documents[key] || updatedDocuments[key].name !== documents[key].name)) {
        changedDocs[documents[key] ? documents[key].name : "N/A"] = updatedDocuments[key].name; // { oldFile: newFile }
      }
    });

    const isEmpty = (obj) => Object.keys(obj).length === 0;
    if (!isEmpty(changedInfo)) {
      const cDataHash = await storeDataInIPFS(changedInfo);
      await contract.methods.addLog(updatedStaffInfo.wallet, cDataHash).send({ from: account });
      console.log("Changed Student Info:", changedInfo);
    }

    if (!isEmpty(changedDocs)) {
      console.log("Changed Documents:", changedDocs);
      const cDocHash = await storeDataInIPFS(changedDocs);
      await contract.methods.addLog(updatedStaffInfo.wallet, cDocHash).send({ from: account });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(isAdmin);
      const staff = await contract.methods.getStaff(updatedStaffInfo.wallet).call({ from: account });
      const ipfsHash = await updateDataInIPFS(staff.ipfsHash, updatedStaffInfo);
      const docHash = isAdmin ? await updateDataInIPFS(staff.docHash, updatedDocuments) : "";

      await contract.methods
        .updateStaff(updatedStaffInfo.wallet, ipfsHash, docHash, updatedStaffInfo.employeeId)
        .send({ from: account });

      alert("Staff details updated successfully!");

      addLogs();

    } catch (error) {
      console.error("Error updating staff details:", error);
      alert("Failed to update staff details.");
    }
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
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => setIsFormVisible(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl text-green-700 text-center font-bold">Update Staff Information</h2>

          {Object.entries(updatedStaffInfo).map(([key, value]) => (
            <div key={key} className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-green-700">
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>
              <input
                type={getInputType(key)}
                name={key}
                value={typeof updatedStaffInfo[key] === "boolean" ? undefined : updatedStaffInfo[key]}
                checked={["good"].includes(updatedStaffInfo[key])}
                onChange={handleInfoChange}
                className={getInputClass(getInputType(key))}
                disabled={!isAdmin && key === "salary"}
              />
            </div>
          ))}

          {isAdmin && (
            <>
              <h3 className="text-lg font-semibold text-green-700 mt-4">Update Documents</h3>
              {Object.keys(updatedDocuments).map((doc) => (
                <div key={doc} className="flex flex-col">
                  <label className="text-sm font-medium text-green-700">
                    Upload {doc.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="file"
                    name={doc}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="border px-2 py-1 rounded"
                  />
                </div>
              ))}
            </>
          )}

          <div className="flex justify-center">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
}

export default StaffUpdateForm;
