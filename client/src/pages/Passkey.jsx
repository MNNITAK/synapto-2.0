// PasskeySetup.jsx
import React from "react";
import "./Passkey.css";
import { useAuth } from "../context/contextapi.jsx"; // Import useAuth hook


const PasskeySetup = () => {


  const{ setPasskey } = useAuth();  
  


  
  return (
    <div className="passkey-container">
      <div className="passkey-card">
        <h1>🔐 Generate  Space Passkey</h1>
        <p>Use Face ID, fingerprint, or device PIN for seamless login.</p>
        <button className="generate-btn" 
        onClick={setPasskey}>
          🚀 Create Passkey
        </button>
      </div>
    </div>
  );
};

export default PasskeySetup;
