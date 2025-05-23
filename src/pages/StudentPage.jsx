import React, { useState, useEffect } from "react";
import StudentInfoDisplay from "./components/StudentView";
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";
import StudentUpdateForm from "./components/studentUpdateForm";
import Log from "./components/Log";
import { toast } from "react-toastify";
const StudentPage = ({ contract, account }) => {
  const [studentInfo, setStudentInfo] = useState({});
  const [documents, setDocuments] = useState({});
  const [academicMarks, setAcademicMarks] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    if (contract && account) {
      fetchStudent();
      checkAdmin();
    }
  }, [contract, account]);

 
  const fetchStudent = async () => {
    try {
      const student = await contract.methods.getStudent(account).call({ from: account });
      const studentData = await retrieveDataFromIPFS(student.ipfsHash);
      const marksData = student.acadHash ? await retrieveDataFromIPFS(student.acadHash) : {};
      const docData = student.docHash ? await retrieveDataFromIPFS(student.docHash) : {};
      setStudentInfo(studentData);
      setAcademicMarks(marksData);
      setDocuments(docData);
      toast.success("Student details fetched successfully.");
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch student details.");
    }
  };

  const checkAdmin = async () => {
    try {
      const adminStatus = await contract.methods.isAdmin(account).call({ from: account });
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchLogs = async (victimAddress) => {
    try {
        const logs = await contract.methods.getLogs(victimAddress).call();
        setLogs(logs);
        setIsOpenModal(true);
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
};


  return (
    <div className="mt-24">
      <StudentUpdateForm contract={contract} account={account} studentInfo={studentInfo} academicMarks={academicMarks} documents={documents} isAdmin={isAdmin} fetchStudent={fetchStudent} />
      <StudentInfoDisplay studentInfo={studentInfo} academicMarks={academicMarks} documents={documents} />
      <button onClick={() => fetchLogs(studentInfo.wallet)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2" >
                      Get Logs
      </button>
      
      <Log logs={logs} isOpenModal={isOpenModal} onClose={() => setIsOpenModal(false)} />      
    </div>
  );
};

export default StudentPage;
