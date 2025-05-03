import React, { useState, useEffect } from "react";
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";

const StudentUpdateForm = ({ contract, account, studentInfo, documents, isAdmin }) => {
  const [updatedStudentInfo, setUpdatedStudentInfo] = useState({});
  const [updatedDocuments, setUpdatedDocuments] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

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
  useEffect(() => {
    setUpdatedStudentInfo(studentInfo);
    setUpdatedDocuments(documents);
  }, [studentInfo, documents]);

  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedStudentInfo((prevInfo) => ({
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
    Object.keys(studentInfo).forEach((key) => {
      if (updatedStudentInfo[key] !== studentInfo[key]) {
        changedInfo[studentInfo[key]] = updatedStudentInfo[key]; // { oldValue: newValue }
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
      await contract.methods.addLog(updatedStudentInfo.wallet, cDataHash).send({ from: account });
      console.log("Changed Student Info:", changedInfo);
    }

    if (!isEmpty(changedDocs)) {
      console.log("Changed Documents:", changedDocs);
      const cDocHash = await storeDataInIPFS(changedDocs);
      await contract.methods.addLog(updatedStudentInfo.wallet, cDocHash).send({ from: account });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const student = await contract.methods.getStudent(updatedStudentInfo.wallet).call({ from: account });
      const ipfsHash = await updateDataInIPFS(student.ipfsHash, updatedStudentInfo);
      const docHash = isAdmin ? await updateDataInIPFS(student.docHash, updatedDocuments) : "";

      await contract.methods
        .updateStudent(updatedStudentInfo.wallet, ipfsHash, docHash, updatedStudentInfo.rollNo)
        .send({ from: account });

      alert("Student details updated successfully!");

      addLogs();
    } catch (error) {
      console.error("Error updating student details:", error);
      alert("Failed to update student details.");
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full mx-4 p-6 rounded-lg shadow-xl relative overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setIsFormVisible(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl text-green-700 text-center font-bold mb-4">
            Update Student Information
          </h2>

          {Object.entries(updatedStudentInfo).map(([key]) => (
            <div key={key} className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
              <label className="text-sm text-green-700 font-medium">
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>
              <input
                type={getInputType(key)}
                name={key}
                value={typeof updatedStudentInfo[key] === "boolean" ? undefined : updatedStudentInfo[key]}
                checked={["Yes", "Hostel", "bad"].includes(updatedStudentInfo[key])}
                onChange={handleInfoChange}
                className={getInputClass(getInputType(key))}
                disabled={!isAdmin && key === "percentage"}
              />
            </div>
          ))}

          {isAdmin && (
            <>
              <h3 className="text-xl text-green-700 font-bold mt-4">Update Documents</h3>
              {Object.keys(updatedDocuments).map((doc) => (
                <div key={doc} className="flex flex-col">
                  <label className="text-sm text-green-700 font-medium">
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
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
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

export default StudentUpdateForm;
