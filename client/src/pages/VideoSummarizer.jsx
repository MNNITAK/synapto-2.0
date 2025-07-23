import React, { useState, useEffect } from 'react';
import { FileText, Settings, Clock, AlertCircle, Wrench, CheckCircle } from 'lucide-react';

const TranscriberPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate maintenance progress
    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 1);
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const maintenanceItems = [
    { id: 1, task: "Database optimization", status: "completed", duration: "2 hours" },
    { id: 2, task: "Server updates", status: "in-progress", duration: "1 hour" },
    { id: 3, task: "Security patches", status: "pending", duration: "30 minutes" },
    { id: 4, task: "Performance improvements", status: "pending", duration: "45 minutes" },
    { id: 5, task: "UI enhancements", status: "pending", duration: "1.5 hours" }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} style={{ color: '#22c55e' }} />;
      case 'in-progress': return <Settings size={16} style={{ color: '#f59e0b', animation: 'spin 2s linear infinite' }} />;
      case 'pending': return <Clock size={16} style={{ color: '#64748b' }} />;
      default: return <Clock size={16} style={{ color: '#64748b' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#22c55e';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#64748b';
      default: return '#64748b';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'auto'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={28} style={{ color: '#3b82f6' }} />
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TranscribeHub
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px'
            }}>
              <AlertCircle size={16} style={{ color: '#ef4444' }} />
              <span style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: '500' }}>
                Under Maintenance
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        {/* Maintenance Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '50%',
          marginBottom: '2rem',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <Wrench size={48} style={{ color: '#3b82f6' }} />
        </div>

        {/* Main Message */}
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: '0 0 1rem 0',
          background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          We're Under Maintenance
        </h2>

        <p style={{
          fontSize: '1.125rem',
          color: '#94a3b8',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          We're currently performing scheduled maintenance to improve your transcription experience. 
          We'll be back online shortly with enhanced features and better performance.
        </p>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#f1f5f9' }}>
              Overall Progress
            </span>
            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#3b82f6' }}>
              {progress}%
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(51, 65, 85, 0.5)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>

        {/* Maintenance Tasks */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            Current Maintenance Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {maintenanceItems.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                border: `1px solid ${getStatusColor(item.status)}20`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getStatusIcon(item.status)}
                  <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>
                    {item.task}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    {item.duration}
                  </span>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: getStatusColor(item.status) + '20',
                    color: getStatusColor(item.status),
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {item.status.replace('-', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#22c55e',
            margin: '0 0 0.5rem 0'
          }}>
            Estimated Completion Time
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            margin: 0
          }}>
            We expect to be back online within the next 2-3 hours. 
            Thank you for your patience!
          </p>
        </div>

        {/* Additional Content Section */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            What's New in This Update
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                🚀 Enhanced AI Processing
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                Improved accuracy with our new AI models, supporting 95+ languages with better context understanding.
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                ⚡ Faster Processing
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                Up to 3x faster transcription speed with our optimized servers and improved algorithms.
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              <h4 style={{ color: '#a855f7', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                🎨 New User Interface
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                Redesigned dashboard with better organization, dark mode improvements, and mobile optimization.
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <h4 style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                🔒 Enhanced Security
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                Advanced encryption and security measures to protect your audio files and transcriptions.
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            System Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { service: 'Upload Service', status: 'operational', uptime: '99.9%' },
              { service: 'Transcription Engine', status: 'maintenance', uptime: '0%' },
              { service: 'File Storage', status: 'operational', uptime: '99.8%' },
              { service: 'API Gateway', status: 'operational', uptime: '99.7%' },
              { service: 'User Dashboard', status: 'operational', uptime: '99.9%' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                border: `1px solid ${item.status === 'operational' ? '#22c55e' : '#ef4444'}20`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: item.status === 'operational' ? '#22c55e' : '#ef4444'
                  }}></div>
                  <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>
                    {item.service}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    {item.uptime} uptime
                  </span>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: item.status === 'operational' ? '#22c55e20' : '#ef444420',
                    color: item.status === 'operational' ? '#22c55e' : '#ef4444',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {item.status === 'operational' ? 'Operational' : 'Maintenance'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Timeline */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            Maintenance Timeline
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            {[
              { time: '10:00 AM', task: 'Maintenance started', status: 'completed' },
              { time: '10:30 AM', task: 'Database backup completed', status: 'completed' },
              { time: '11:00 AM', task: 'Server updates in progress', status: 'current' },
              { time: '11:30 AM', task: 'Security patches deployment', status: 'upcoming' },
              { time: '12:00 PM', task: 'Performance optimization', status: 'upcoming' },
              { time: '12:30 PM', task: 'Testing and validation', status: 'upcoming' },
              { time: '01:00 PM', task: 'Service restoration', status: 'upcoming' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: item.status === 'current' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                border: item.status === 'current' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(51, 65, 85, 0.3)'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: item.status === 'completed' ? '#22c55e' : 
                            item.status === 'current' ? '#3b82f6' : '#64748b',
                  animation: item.status === 'current' ? 'pulse 2s ease-in-out infinite' : 'none'
                }}></div>
                
                <div style={{ minWidth: '70px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '500' }}>
                    {item.time}
                  </span>
                </div>
                
                <span style={{ 
                  color: item.status === 'current' ? '#3b82f6' : '#e2e8f0', 
                  fontSize: '0.875rem',
                  fontWeight: item.status === 'current' ? '500' : '400'
                }}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '12px'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            margin: '0 0 0.5rem 0'
          }}>
            Need immediate assistance? Contact our support team:
          </p>
          <a href="mailto:support@transcribehub.com" style={{
            color: '#a855f7',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}>
            support@transcribehub.com
          </a>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default TranscriberPage;