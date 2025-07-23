import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/contextapi.jsx"; 

const Signup = () => {
  const{handleGoogleSuccessRegister,handleSubmitRegister}=useAuth();

     
//   const [localuser, setLocalUser] = useState(() => {
//   const userString = localStorag
// e.getItem("login");
//   const userObj = userString ? JSON.parse(userString) : null;
//   return userObj?.user || null;
// });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "http://localhost:5050/api/auth/signup",
//         formData
//       );
//       console.log("Signup Success:", res.data);
//       localStorage.setItem("synapto", res.data);

//       setLocalUser(res.data);
      
//       alert("User registered successfully!");
//     } catch (err) {
//       console.error("Signup Error:", err.response?.data || err.message);
//       alert("Signup failed.");
//     }
//   };

//   const navigate = useNavigate();

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const { credential } = credentialResponse;
//       const res = await axios.post("http://localhost:5050/api/auth/google-login", {
//         credential,
//       });

//       localStorage.setItem("synapto", res.data);


//       setLocalUser(res.data);


//       alert("Signed up with Google!");
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Google signup error:", error.response?.data || error.message);
//       alert("Google signup failed");
//     }
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      <form
       onSubmit={(e) => handleSubmitRegister(e, formData)}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#111111]/80 border-2 border-cyan-500"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400 drop-shadow-md">
          Sign up to Synapto
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            autoComplete="username"
            value={formData.name}
            onChange={(e) => {
                  handleChange(e);
                }}
            className="w-full px-4 py-2 rounded-lg bg-[#1d1d1d] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
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
            placeholder="Create Password"
            autoComplete="current-password"
            value={formData.password}
                 onChange={(e) => {
                  handleChange(e);
                }}
            className="w-full px-4 py-2 rounded-lg bg-[#1d1d1d] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
        >
          Sign Up
        </button>

        <p className="text-sm mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 underline hover:text-cyan-300">
            Log in
          </a>
        </p>
        <div className="mt-6 text-center text-gray-400">or</div>

        <div className="mt-4 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccessRegister}
          onError={() => console.log("Google Signup Failed")}
        />
        </div>

      </form>
    </div>
  );
  
};

export default Signup;
