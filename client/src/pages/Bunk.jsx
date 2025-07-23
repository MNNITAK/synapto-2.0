import React from 'react';
import { Bot, FileText, Video, Users, AlertTriangle } from 'lucide-react';
import './Bunk.css';
import { Link } from 'react-router-dom';

const Bunk = () => {
  return (
    <div className="ai-home-scroll-wrapper">
      <div className="ai-zone-container">
        {/* Mass Bunk (Poll) */}
        <div className="ai-card mass-bunk-card">
          <div className="icon">
            <Users size={24} color="#000000" />
          </div>
          <h3>Mass Bunk Poll</h3>
          <p>Start or vote on mass bunk polls with your classmates. Admins can control the flow.</p>
          <div className="tech-tags">
            <span>Poll System</span>
           
          </div>
          <div className="buttons">
            <Link to="/mass-bunk">
              <button className="btn">Go</button>
            </Link>
          </div>
        </div>

        {/* Imposter List */}
        <div className="ai-card imposter-card">
          <div className="icon">
            <AlertTriangle size={24} color="#000000" />
          </div>
          <h3>Imposter Tracker</h3>
          <p>Track students who didn’t follow the mass bunk plan. Admins can mark imposters.</p>
          <div className="tech-tags">
            <span>Trust Score</span>
            <span>Ranking</span>
         
          </div>
          <div className="buttons">
            <Link to="/imposter">
              <button className="btn">Check</button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Bunk;
