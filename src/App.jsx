import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Web3 from "web3";
import UniversityManagement from "./UniversityManagement.json";
import AdminPage from "./pages/AdminPage";
import StaffPage from "./pages/StaffPage";
import StudentPage from "./pages/StudentPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DepartmentPage from "./pages/DepartmentPage";
import ContactPage from "./pages/ContactPage";
import Header from "./pages/components/Header";
import Home from "./pages/Home";
import "./index.css";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected. Please install MetaMask!");

      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.requestAccounts();
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = UniversityManagement.networks[networkId];

      if (!deployedNetwork) throw new Error("Contract not deployed on this network.");

      const instance = new web3Instance.eth.Contract(
        UniversityManagement.abi,
        deployedNetwork.address
      );

      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(instance);
      setIsConnected(true);

      const adminAddress = await instance.methods.admin().call();
      if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
        setRole("admin");
      } else if (await instance.methods.isStaff(accounts[0]).call()) {
        setRole("staff");
      } else if (await instance.methods.isStudent(accounts[0]).call()) {
        setRole("student");
      } else {
        setRole("unregistered");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="mt-20">
    <Router>
      <Header isConnected={isConnected} connectWallet={connectWallet} role={role} />

      <Routes>
        <Route path="/" element={<Navigate to="/index" />} />  {/* Default route */}
        <Route path="/index" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/department" element={<DepartmentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/home/:param" element={<HomePage isConnected={isConnected} connectWallet={connectWallet} role={role} account={account} />} />
        <Route path="/admin" element={role === "admin" && contract ? <AdminPage contract={contract} account={account} /> : <Navigate to="/" />} />
        <Route path="/staff" element={role === "staff" && contract ? <StaffPage contract={contract} account={account} /> : <Navigate to="/" />} />
        <Route path="/student" element={role === "student" && contract ? <StudentPage contract={contract} account={account} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
