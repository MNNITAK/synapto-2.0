import { createContext, useCallback, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

const Twiliocontext = createContext();
export const TwilioProvider = ({ children }) => {
  const [response, setResponse] = useState();
  const [alertloading, setAlertLoading] = useState(false);

const handleSend = useCallback(
  
    async (message) => {
        if (!message.trim()) {
            setResponse("⚠️ Please type a message first.");
            return;
        }

        setAlertLoading(true);

        try {
            const res = await axios.post("http://localhost:5050/api/alert/admin", { message });

            if (res && res.data && res.data.message) {
                setResponse(res.data.message);
            } else {
                setResponse("✅ Message sent successfully!");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(`❌ ${err.response.data.message}`);
            } else if (err.message) {
                setResponse(`❌ ${err.message}`);
            } else {
                setResponse("❌ Failed to send message.");
            }
        } finally {
            setAlertLoading(false);
        }
    },
    []
);

  return (
    <Twiliocontext.Provider
      value={{
        handleSend,
        response,
        alertloading,
      }}
    >
      {children}
    </Twiliocontext.Provider>
  );
};

export const usetwilio = () => {
  return useContext(Twiliocontext);
};
