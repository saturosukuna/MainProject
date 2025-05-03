import React, { useState, useEffect } from "react";
import StaffInfoDisplay from "./Staffview";
import { storeDataInIPFS, retrieveDataFromIPFS, updateDataInIPFS } from "./utils/ipfs";
import StaffUpdateForm from "./StaffUpdateForm";
import Log from "./Log";
const AdminStaffPage = ({ contract, account }) => {
    const [employeeID, setEmployeeId] = useState("");
    const [staffInfo, setStaffInfo] = useState(null);
    const [documents, setDocuments] = useState({});
    const [logs, setLogs] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
    // Fetch staff data using employee ID
    const fetchStaff = async () => {
        try {
            console.log(employeeID);
            const staff = await contract.methods.getStaffByEmployeeID(employeeID).call({ from: account });
            if (staff.wallet !== "0x0000000000000000000000000000000000000000") {
                const ipfsHash = await retrieveDataFromIPFS(staff.ipfsHash);
                const docHash = await retrieveDataFromIPFS(staff.docHash);

                setStaffInfo(ipfsHash || {});
                setDocuments(docHash || {});
            } else {
                alert("No staff found with this Employee ID.");
                setStaffInfo(null);
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
            alert("Failed to fetch staff details.");
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
        <>
            <h2 className="text-2xl font-bold text-center">Admin - Staff Management</h2>
            <div className="flex justify-center space-x-4 my-4">
                <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={employeeID}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <button onClick={fetchStaff} className="bg-blue-500 text-white px-4 py-2 rounded">Fetch Staff</button>
            </div>

            {staffInfo && (
                <>
                    <StaffUpdateForm contract={contract} account={account} staffInfo={staffInfo} documents={documents} isAdmin={isAdmin} />
                    <StaffInfoDisplay staffInfo={staffInfo} documents={documents} />
                    <button onClick={() => fetchLogs(staffInfo.wallet)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2" >
                        Get Logs
                    </button>
                    <Log logs={logs} isOpenModal={isOpenModal} onClose={() => setIsOpenModal(false)} />
                </>
            )}

        </>
    );
};

export default AdminStaffPage;
