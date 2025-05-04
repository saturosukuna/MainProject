import React, { useState, useEffect } from "react";
import StudentInfoDisplay from "./StudentView";
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";
import { toast } from 'react-toastify';
import StudentUpdateForm from "./studentUpdateForm";
import Log from "./Log";
const AdminStudentPage = ({ contract, account }) => {
    const [rollNo, setRollNo] = useState("");
    const [studentInfo, setStudentInfo] = useState({});
    const [documents, setDocuments] = useState({});
    const [academicMarks, setAcademicMarks] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const checkAdmin = async () => {
        try {
            const adminStatus = await contract.methods.isAdmin(account).call({ from: account });
            setIsAdmin(adminStatus);
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
    };
    useEffect(() => {
        if (contract && account) {

            checkAdmin();
        }
    }, [contract, account]);
    // Fetch student info based on roll number
    const fetchStudent = async () => {
        try {
            const student = await contract.methods.getStudentByRollNo(rollNo).call({ from: account });
            console.log(student.ipfsHash);
            if (student.wallet !== "0x0000000000000000000000000000000000000000") {
                const ipfsHash = await retrieveDataFromIPFS(student.ipfsHash);
                const marksHash = await retrieveDataFromIPFS(student.acadHash);
                const docHash = await retrieveDataFromIPFS(student.docHash);

                setStudentInfo(ipfsHash || {});
                setAcademicMarks(marksHash || {});
                setDocuments(docHash || {});
                console.log(documents);
                toast.success("Student details fetched successfully.");

            } else {
                toast.warning("No student found with this roll number.");
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
            toast.error("Failed to fetch student details.");
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


    // Handle student info update


    return (
        <div>
            <h2 className="text-2xl font-bold text-center">Admin - Student Management</h2>
            <div className="flex justify-center space-x-4 my-4">
                <input
                    type="text"
                    placeholder="Enter Roll No"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <button onClick={fetchStudent} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Fetch Student
                </button>
            </div>

            {Object.keys(studentInfo).length > 0 && (
                <>
                    <StudentUpdateForm contract={contract} account={account} studentInfo={studentInfo} academicMarks={academicMarks} documents={documents} isAdmin={isAdmin} fetchStudent={fetchStudent} />
                    <StudentInfoDisplay studentInfo={studentInfo} academicMarks={academicMarks} documents={documents} />
                    <button onClick={() => fetchLogs(studentInfo.wallet)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2" >
                        Get Logs
                    </button>
                    <Log logs={logs} isOpenModal={isOpenModal} onClose={() => setIsOpenModal(false)} />
                </>
            )}
        </div>
    );
};

export default AdminStudentPage;
