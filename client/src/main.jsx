import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/contextapi.jsx";
import { GoogleProvider } from "./context/googleapi.jsx"; // Ensure this import is correct
import { BrowserRouter } from "react-router-dom";
import { FileProvider } from "./context/Filecontext.jsx";
import { TwilioProvider } from "./context/twilio.jsx";
import { MassBunkProvider } from "./context/MassBunkContext.jsx";
import { DeadlineProvider } from "./context/DeadlineContext.jsx";

// import {VideoProvider} from "./context/VideoContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <GoogleProvider>
            <FileProvider>
              <TwilioProvider>
                <MassBunkProvider>
                  <DeadlineProvider>
                   
                      <App />
                   
                  </DeadlineProvider>
                </MassBunkProvider>
              </TwilioProvider>
            </FileProvider>
          </GoogleProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
