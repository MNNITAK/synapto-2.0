import { createContext, useCallback, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";



const Googlecontext = createContext();
export const GoogleProvider = ({ children }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const[summaryTitle, setSummaryTitle] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const[quizloading, setQuizLoading] = useState(false);
  const[quizData,setQuizData]=useState([]);

  const SummaryGenerator = useCallback(async (fileId) => {
    
    setSummaryLoading(true);
   
    try {
      if(!fileId) {
        console.error("File ID is required to generate summary");
        return; 
      }

       navigate("/summary");
      const res = await axios.post(
        "http://localhost:5050/api/pdf/summary",
        {fileId}
      );
      setSummary(res.data.summary);
      console.log("Summary generated:", res.data.summary);
      setSummaryTitle(res.data.title);
      
    } catch (error) {
      console.error("Error generating summary:", error);
      // Optionally, set an error state here
    } finally {
      setSummaryLoading(false);
    }
  }, []);


const quizGenerator = useCallback(async (fileId) => {
  setQuizLoading(true);
  
  try {
    if (!fileId) {
      console.error("File ID is required to generate quiz");
      return;
    }
    navigate("/quiz");
    const res = await axios.post("http://localhost:5050/api/pdf/quiz", { fileId });
    const { quiz } = res.data;
    setQuizData(quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Optionally, set an error state here
  } finally {
    setQuizLoading(false);
  }
}, []);


  return (
    <Googlecontext.Provider
      value={{
        quizGenerator,
        quizData,
        quizloading,
        SummaryGenerator,
        summary,
        summaryLoading,
        summaryTitle, // Added summaryTitle to the context
      }}
    >
      {children}
    </Googlecontext.Provider>
  );
};

export const useGoogle = () => {
  return useContext(Googlecontext);
};
