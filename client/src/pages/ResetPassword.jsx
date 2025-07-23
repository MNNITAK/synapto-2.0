import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const { state } = useLocation(); // contains email & otp
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/auth/reset-password", {
        email: state.email,
        otp: state.otp,
        newPassword,
      });
      setStatus("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to reset.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleReset} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded bg-gray-700 mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-semibold">
          Reset Password
        </button>
        <p className="mt-4 text-sm text-center text-green-400">{status}</p>
      </form>
    </div>
  );
};

export default ResetPassword;