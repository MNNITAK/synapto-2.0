import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PasskeySetup from "./pages/Passkey";
import PrivateRoute from "./components/PrivateRoute";
import Attendance from "./pages/Attendance";
import ChatBot from "./pages/ChatBot";
import SubjectFileManager from "./pages/Sub-Files.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import Quiz from  "./pages/Quiz.jsx"
import ChatPage from "./pages/ChatPage";
import Notes from './pages/Notes';
import Professors from './pages/Professors';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import WhatsAppAlertSender from "./pages/whatsappAlert.jsx"
import AIZonePage from "./pages/AIZonePage.jsx";
import MassBunkPage from "./pages/MassBunk.jsx";
import ImposterPage from "./pages/Imposter.jsx";
import Bunk from "./pages/Bunk.jsx"
import DeadlineManager from './pages/Deadline.jsx';
import VideoSummarizer from "./pages/VideoSummarizer.jsx";

function App() {
  return (
    <Routes>
      
      {/* <Route path="/video-summary" element={<VideoSummarizer/>} /> */}
      <Route path="/transcriber" element={<VideoSummarizer/>} />
       <Route path="/deadline" element={<DeadlineManager/>} />
 <Route path="/dashboard" element={<HomePage/>} />
      <Route path="/bunk" element={<Bunk/>} />
       <Route path="/imposter" element={<ImposterPage/>} />
       <Route path="/mass-bunk" element={<MassBunkPage/>} />
      <Route path="/AIZonePage" element={<AIZonePage/>} />
  <Route path="/wtsp-alert" element={< WhatsAppAlertSender/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/passkey" element={<PasskeySetup />} />
        <Route path="/subject-file-manager" element={<SubjectFileManager />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/professors" element={<Professors />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;