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
import ScrollToTop from "./pages/components/ScrollToTop";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState(null); // Use null to handle loading state
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected. Please install MetaMask!");
  
      const web3Instance = new Web3(window.ethereum);
  
      // Ensure permissions are requested
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
  
      const accounts = await web3Instance.eth.requestAccounts();
      if (!accounts.length) throw new Error("No accounts found. Please unlock your wallet.");
  
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = UniversityManagement.networks[networkId];
  
      if (!deployedNetwork) throw new Error("Contract not deployed on this network.");
  
      const instance = new web3Instance.eth.Contract(UniversityManagement.abi, deployedNetwork.address);
  
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(instance);
      setIsConnected(true);
  
      // Check user role
      let userRole = "unregistered";
      const adminAddress = await instance.methods.admin().call();
      if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
        userRole = "admin";
      } else if (await instance.methods.isStaff(accounts[0]).call()) {
        userRole = "staff";
      } else if (await instance.methods.isStudent(accounts[0]).call()) {
        userRole = "student";
      }
  
      setRole(userRole);
      localStorage.setItem("account", accounts[0]);
      localStorage.setItem("role", userRole);
      localStorage.setItem("isConnected", "true");
  
    } catch (error) {
      console.error("Connection error:", error);
      alert(error.message);
    }
  };
  

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount("");
    setContract(null);
    setRole(null);
    setIsConnected(false);
  
    // Clear stored session data
    localStorage.removeItem("account");
    localStorage.removeItem("role");
    localStorage.removeItem("isConnected");
  
    console.log("Wallet Disconnected");
  };
  
  // Restore session data on page load
  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    const storedRole = localStorage.getItem("role");
    const storedConnected = localStorage.getItem("isConnected");
  
    if (storedAccount && storedRole && storedConnected === "true") {
      setAccount(storedAccount);
      setRole(storedRole);
      setIsConnected(true);
  
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
  
      // Ensure contract initialization
      const initContract = async () => {
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = UniversityManagement.networks[networkId];
  
        if (deployedNetwork) {
          const instance = new web3Instance.eth.Contract(UniversityManagement.abi, deployedNetwork.address);
          setContract(instance);
        } else {
          console.error("Contract not deployed on this network.");
        }
      };
  
      initContract();
    }
  
    setLoading(false);
  }, []);
  

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>; // Show a loading indicator
  }

  return (
    <div className="mt-20">
      <Router>
        <ScrollToTop />
        <Header isConnected={isConnected} connectWallet={connectWallet} disconnectWallet={disconnectWallet} role={role} />


        <Routes>
          <Route path="/" element={<Navigate to="/index" replace />} /> 
          <Route path="/index" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/department" element={<DepartmentPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/home/:param" element={<HomePage isConnected={isConnected} connectWallet={connectWallet} role={role} account={account} />} />

          {/* Ensure role is loaded before rendering role-based routes */}
          <Route path="/admin" element={role === "admin" ? <AdminPage contract={contract} account={account} /> : <Navigate to="/" />} />
          <Route path="/staff" element={role === "staff" ? <StaffPage contract={contract} account={account} /> : <Navigate to="/" />} />
          <Route path="/student" element={role === "student" ? <StudentPage contract={contract} account={account} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/index" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
