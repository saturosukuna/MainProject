import React, { useState, useEffect } from "react";
import StaffInfoDisplay from "./components/Staffview";
import {  retrieveDataFromIPFS } from "./utils/ipfs";
import StaffUpdateForm from "./components/StaffUpdateForm";
import Log from "./components/Log";
import { toast } from "react-toastify";
const StaffPage = ({ contract, account }) => {
  const [staffInfo, setStaffInfo] = useState({});
  const [documents, setDocuments] = useState({});
  const [publications, setPublications] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [logs, setLogs] = useState([]);
 

  useEffect(() => {
    if (contract && account) {
      fetchStaff();
      checkAdmin();
    }
  }, [contract, account]);

  
  

  const fetchStaff = async () => {
    try {
      const staff = await contract.methods.getStaff(account).call({ from: account });
      const staffData = await retrieveDataFromIPFS(staff.ipfsHash);
      const publicHash =await retrieveDataFromIPFS(staff.publicHash);
      console.log(publicHash,"publicHashaaaa");
      const docData = staff.docHash ? await retrieveDataFromIPFS(staff.docHash) : {};
      setStaffInfo(staffData);
      setPublications(publicHash);
      setDocuments(docData);
      toast.success("Staff details fetched successfully.");
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff details.");
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
      <StaffUpdateForm contract={contract} account={account} staffInfo={staffInfo} publications={publications} documents={documents} isAdmin={isAdmin} fetchStaff={fetchStaff} />
      <StaffInfoDisplay staffInfo={staffInfo} publications={publications} documents={documents} />
      <button onClick={() => fetchLogs(staffInfo.wallet)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2" >
                      Get Logs
                    </button>
                    <Log logs={logs} isOpenModal={isOpenModal} onClose={() => setIsOpenModal(false)} />
    </div>
  );
};

export default StaffPage;
