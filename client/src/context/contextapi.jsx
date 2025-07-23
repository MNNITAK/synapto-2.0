import { createContext, useCallback, useContext, useState,useEffect } from "react";

// import { baseUrl } from "../utils/services.js"; 
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";
import { startRegistration,startAuthentication } from '@simplewebauthn/browser';
import axios from "axios";



const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

   const navigate = useNavigate()


 const [localuser, setLocalUser] = useState(null);


useEffect(() => {
  const stored = localStorage.getItem("synapto");
  if (stored) {
    const parsed = JSON.parse(stored);
    setLocalUser(parsed?.user || parsed); // Handles both { user } and direct user obj
  }
}, []);


//its for signup
const handleSubmitRegister = useCallback(async (e,formData) => {
    e.preventDefault();
    try {
        const res = await axios.post(
            "http://localhost:5050/api/auth/signup",
            formData
        );
        console.log("Signup Success:", res.data);
        localStorage.setItem("synapto", JSON.stringify(res.data));

        setLocalUser(res.data);
        alert("User registered successfully!");
        navigate("/passkey")
    } catch (err) {
        console.error("Signup Error:", err.response?.data || err.message);
        alert("Signup failed.");
    }
}, []);


const handleSubmitLogin = useCallback(async (e, formData) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5050/api/auth/login",
        formData
      );
      console.log("Login Success:", res.data);
      localStorage.setItem("synapto", JSON.stringify(res.data));
        setLocalUser(res.data);
        alert("hello",res.data);

     const response = await axios.post("http://localhost:5050/api/auth/passkey-login", { userId: res.data.id, userName: res.data.name });


      alert("Logged in successfully!");
      // In real app: store token, redirect to dashboard
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert("Login failed. Check your credentials.");
    }
  }, []);


const handleGoogleSuccessRegister = useCallback(async (credentialResponse) => {
    try {
        const { credential } = credentialResponse;
        const res = await axios.post("http://localhost:5050/api/auth/google-login", {
            credential,
        });

         localStorage.setItem("synapto", JSON.stringify(res.data));

        setLocalUser(res.data);

        alert("Signed up with Google!");
        navigate("/passkey")
        // navigate("/dashboard");
    } catch (error) {
        console.error("Google signup error:", error.response?.data || error.message);
        alert("Google signup failed");
    }
}, [navigate]);

const handleGoogleSuccessLogin = useCallback(async (credentialResponse) => {
    try {
        console.log("Google Response:", credentialResponse);
        const { credential } = credentialResponse;
        const res = await axios.post("http://localhost:5050/api/auth/google-login", {
            credential,
        });
        // Save token and user info
        localStorage.setItem("synapto",JSON.stringify(res.data));
        localStorage.setItem("synapto_token", res.data.token);
        setLocalUser(res.data);
        const response = await axios.post("http://localhost:5050/api/auth/passkey-login", { userId: res.data.id, userName: res.data.name });
      
      console.log("passkey response from login got", response);
      const ChallengeResult= response.data;
     
      const{options}= ChallengeResult;
      const authenticationResult = await startAuthentication({...options});
      console.log("authenticationResult", authenticationResult);
      //now saving this authentication result in model schema


      if(authenticationResult.error){
        return console.error("Error verifying passkey(login):", authenticationResult.error);
      }


        // const response2 = await axios.post("http://localhost:5050/api/auth/passkey-verify-login",{userId: res.data.id, credential: authenticationResult});
        // if(response2.data.error){
        //     console.error("Error verifying passkey(login):", response2.data.error); 
        // }

        
        alert("Passkey verified successfully! && logged in with Google!");

        navigate("/dashboard"); 
    } catch (error) {
        console.error("Google login error:", error.response?.data || error.message);
        alert("Google login failed");
    }
}, [navigate]);

const logout = useCallback(() => {
  localStorage.removeItem("synapto");
  localStorage.removeItem("synapto_token");
  setLocalUser(null);
  navigate("/dashboard");
}, [navigate]);






//setting the passkey after registring(first time user)....
  const setPasskey = useCallback(async () => {
    try {
      // Call the backend API to set the passkey
      console.log("localuser/passkey", localuser);
      console.log("data to be sent to passkey",{userId: localuser.id, username: localuser.name});
      const response = await axios.post(`http://localhost:5050/api/auth/passkey`, { 
        userId: localuser.id, 
        userName: localuser.name 
      }); // Pass userId and username directly
      console.log("passkey response got", response);
      const ChallengeResult= response.data;
      console.log("challenge got from backend");
      const{options}= ChallengeResult;
      const authenticationResult = await startRegistration({...options});
      console.log("authenticationResult", authenticationResult);
      //now saving this authentication result in model schema


      const response2 = await axios.post("http://localhost:5050/api/auth/passkey-verify",{userId: localuser.id, cred: authenticationResult});

      if(response2.data.error){
        console.error("Error verifying passkey:", response2.data.error);
        return;
      }
      alert("Passkey verified successfully!");

      navigate("/dashboard"); 

      // Handle success, e.g., navigate to another page or show a success message
    } catch (error) {
      console.error("Error setting passkey:", error);
      // Handle error, e.g., show an error message
    }
  })
  
  return (
    <AuthContext.Provider
      value={{
        setPasskey,
        handleSubmitRegister,
        handleGoogleSuccessRegister,
        handleGoogleSuccessLogin,
        handleSubmitLogin,
        localuser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};