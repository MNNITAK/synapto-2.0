import React from 'react';
import { Bot, FileText, Video } from 'lucide-react';
import './AIZonePage.css';
import { Link } from 'react-router-dom';

const AIZonePage = () => {
  return (
    <div className="ai-home-scroll-wrapper">
      <div className="ai-zone-container">
        {/* Chat Bot Card */}
        <Link to="/chatbot" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="ai-card">
            <div className="icon">
              <Bot size={24} color="#000000" />
            </div>
            <h3>Chat Bot</h3>
            <p>Engage in smart conversations powered by AI to assist with queries and guidance.</p>
            <div className="tech-tags">
              <span>OpenAI</span>
              <span>React</span>
              <span>Node.js</span>
            </div>
            <div className="buttons">
              <button className="btn">Launch</button>
            </div>
          </div>
        </Link>

        {/* Summary & Quiz Generator Card */}
        <div className="ai-card">
          <div className="icon">
            <FileText size={24} color="#000000" />
          </div>
          <h3>Summary & Quiz</h3>
          <p>Upload documents and receive smart summaries with generated quiz questions.</p>
          <div className="tech-tags">
            <span>BART</span>
            <span>MongoDB</span>
            <span>Express</span>
          </div>
          <div className="buttons">
            <Link to="/subject-file-manager"> <button className="btn">View</button></Link>
           
            
          </div>
        </div>

        {/* Video Transcripter Card */}
        <div className="ai-card">
          <div className="icon">
            <Video size={24} color="#000000" />
          </div>
          <h3>Video Transcripter</h3>
          <p>Convert spoken content from videos into readable, searchable text transcripts.</p>
          <div className="tech-tags">
            <span>Whisper</span>
            <span>ffmpeg</span>
            <span>React</span>
          </div>

          <div className="buttons">
            <Link to="/video-summary"> <button className="btn">Start</button></Link>
           
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIZonePage;
