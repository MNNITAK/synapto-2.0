import { useGoogle } from "../context/googleapi.jsx";
import "./SummaryPage.css";
import {Link} from "react-router-dom";


export default function SummaryPage() {
  const { summary, summaryLoading, summaryTitle } = useGoogle();

  return (
    <div className="summary-wrapper"> 
      <div className="summary-header">
        <h2>📄 {summaryTitle} Summary</h2>
        <Link to="/subject-file-manager"><button className="back-btn">⬅ Back</button></Link>
        
      </div>
      <div className="summary-content">
        {summaryLoading ? (
          <div className="loader">Generating Summary...</div>
        ) : (
          <p>{summary}</p>
        )}
      </div>
    </div>
  );
}
