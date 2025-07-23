import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const { state } = useLocation(); // get email passed from previous page
  const navigate = useNavigate();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/auth/verify-otp", {
        email: state.email,
        otp,
      });
      setStatus("OTP verified. Redirecting to reset password...");
      setTimeout(() => {
        navigate("/reset-password", { state: { email: state.email, otp } });
      }, 1000);
    } catch (err) {
      setStatus(err.response?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleVerifyOTP} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          className="w-full p-3 rounded bg-gray-700 mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-semibold">
          Verify OTP
        </button>
        <p className="mt-4 text-sm text-center text-yellow-400">{status}</p>
      </form>
    </div>
  );
};

export default VerifyOTP;
