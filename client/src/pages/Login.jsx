import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/contextapi.jsx"; 

const Login = () => {
  
  const { handleGoogleSuccessLogin, handleSubmitLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5050/api/auth/login",
  //       formData
  //     );
  //     console.log("Login Success:", res.data);
  //     localStorage.setItem("synapto", res.data);
  //     alert("Logged in successfully!");
  //     // In real app: store token, redirect to dashboard
  //   } catch (err) {
  //     console.error("Login Error:", err.response?.data || err.message);
  //     alert("Login failed. Check your credentials.");
  //   }
  // };



  const navigate = useNavigate();

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     console.log("Google Response:", credentialResponse);
  //     const { credential } = credentialResponse;
  //     const res = await axios.post("http://localhost:5050/api/auth/google-login", {
  //       credential,
  //     });
  //     // Save token and user info
  //     localStorage.setItem("synapto_token", res.data.token);
  //     alert("Logged in with Google!");
  //     navigate("/dashboard"); 
  //   } catch (error) {
  //     console.error("Google login error:", error.response?.data || error.message);
  //     alert("Google login failed");
  //   }
  // };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      <form
        onSubmit={(e) => handleSubmitLogin(e, formData)}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#111111]/80 border-2 border-cyan-500"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400 drop-shadow-md">
          Login to Synapto
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="username"
            value={formData.email}
           onChange={(e) => {
                  handleChange(e);
                }}
            className="w-full px-4 py-2 rounded-lg bg-[#1d1d1d] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
           onChange={(e) => {
                  handleChange(e);
                }}
            className="w-full px-4 py-2 rounded-lg bg-[#1d1d1d] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <p className="text-right mt-2 text-sm text-cyan-400 hover:underline">
            <a href="/forgot-password">Forgot Password?</a>
          </p>

        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
        >
          Log In
        </button>

        <p className="text-sm mt-4 text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-cyan-400 underline hover:text-cyan-300">
            Sign Up
          </a>
        </p>
        <div className="mt-6 text-center text-gray-400">or</div>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccessLogin}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
