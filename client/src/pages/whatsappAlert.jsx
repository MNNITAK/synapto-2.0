// components/WhatsAppAlertSender.jsx
import React, { useState } from 'react';
import './whatsappAlert.css';
import { usetwilio } from '../context/twilio';
import { useAuth } from '../context/contextapi';

const WhatsAppAlertSender = () => {
  const{handleSend,alertloading,response}=usetwilio();
  const{localuser}=useAuth();
  const [message, setMessage] = useState('');
  
  



  return (
    <div className="alert-card">
      <h1>📲 WhatsApp Alert Panel</h1>
      <p className="subtext">Send an important message to selected users.</p>
      <textarea
        placeholder="Type your alert here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={(e) => handleSend(message)
         
        }
        className={alertloading ? 'loading' : ''}
      >
        {alertloading ? 'Sending...' : '🚀 Send Alert'}
      </button>
      {response && <div className="alert-response">{response}</div>}
    </div>
  );
};

export default WhatsAppAlertSender;
