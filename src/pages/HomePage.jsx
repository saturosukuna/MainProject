import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ isConnected, connectWallet, role, account }) => {
  const navigate = useNavigate();

  // Redirect after rendering
  useEffect(() => {
    if (isConnected) {
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "staff":
          navigate("/staff");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          break; // Stay on home page for unregistered users
      }
    }
  }, [isConnected, role, navigate]); // Only runs when these dependencies change

  return (
    <div className="border-2 border-black">
      
      {/* Navbar */}
      {/* Home Content */}
      <div id="connectWallet">
        <h2>Welcome</h2>
        {!isConnected && (
          <button
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}

        {isConnected && role === "unregistered" && (
          <div>
            <p>Connected account: {account}</p>
            <p>This wallet is not registered in the system</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
