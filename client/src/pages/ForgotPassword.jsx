import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/auth/request-otp", { email });
      setStatus("OTP sent to your email.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1000);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleRequestOTP} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full p-3 rounded bg-gray-700 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-semibold">
          Request OTP
        </button>
        <p className="mt-4 text-sm text-center text-green-400">{status}</p>
      </form>
    </div>
  );
};

export default ForgotPassword;