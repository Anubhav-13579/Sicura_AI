import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Mail, Link, Briefcase, MessageSquare, FileText, 
  ShieldAlert, History, Settings, Info, Diamond, 
  Menu, Lock, FileClock, Info as InfoSquare,
  Paperclip, Globe, Mic, Send, ChevronDown
} from 'lucide-react';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const cryptoSectionRef = useRef(null);
  const auditSectionRef = useRef(null);
  const threatSectionRef = useRef(null);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const scrollToHome = () => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCrypto = () => {
    cryptoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToAudit = () => {
    auditSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToThreat = () => {
    threatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-container">
      {/* Global background effect — fixed, covers entire viewport */}
      <div className="background-effect"></div>

      {/* Floating menu button - shows only when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          className="floating-menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
            <Menu size={20} />
          </div>
          <div className="logo-container">
            <ShieldAlert size={24} className="logo-icon" />
            <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-item active">
            <Home size={20} />
            <span>Home</span>
          </div>

          <div className="nav-item">
            <Mail size={20} />
            <div className="nav-item-text">
              <span className="title">Email Analyzer</span>
              <span className="subtitle">Detect email scams</span>
            </div>
          </div>

          <div className="nav-item">
            <Link size={20} />
            <div className="nav-item-text">
              <span className="title">URL Scanner</span>
              <span className="subtitle">Check website safety</span>
            </div>
          </div>

          <div className="nav-item">
            <Briefcase size={20} />
            <div className="nav-item-text">
              <span className="title">Job Offer Analyzer</span>
              <span className="subtitle">Analyze job offers</span>
            </div>
          </div>

          <div className="nav-item">
            <MessageSquare size={20} />
            <div className="nav-item-text">
              <span className="title">Message Analyzer</span>
              <span className="subtitle">Scan suspicious messages</span>
            </div>
          </div>

          <div className="nav-item">
            <FileText size={20} />
            <div className="nav-item-text">
              <span className="title">Document Analyzer</span>
              <span className="subtitle">Analyze documents</span>
            </div>
          </div>

          <div className="nav-item">
            <ShieldAlert size={20} />
            <div className="nav-item-text">
              <span className="title">Breach Checker</span>
              <span className="subtitle">Check data breaches</span>
            </div>
          </div>

          <div className="nav-divider"></div>

          <div className="nav-item">
            <History size={20} />
            <div className="nav-item-text">
              <span className="title">History</span>
              <span className="subtitle">View past analyses</span>
            </div>
          </div>

          <div className="nav-item">
            <Settings size={20} />
            <div className="nav-item-text">
              <span className="title">Settings</span>
              <span className="subtitle">Customize preferences</span>
            </div>
          </div>

          <div className="nav-item">
            <Info size={20} />
            <div className="nav-item-text">
              <span className="title">About Sicura AI</span>
              <span className="subtitle">Learn more about us</span>
            </div>
          </div>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content" ref={mainContentRef}>

        {/* Updated Glassmorphism Header */}
        <header className={`top-header ${isSidebarOpen ? 'header-shifted' : ''}`}>
          <div className="header-logo" onClick={scrollToHome} style={{ cursor: 'pointer' }}>
            <ShieldAlert size={22} className="logo-icon" />
            <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
          </div>
          <div className="header-actions">
            <button className="action-btn" title="Encryption" onClick={scrollToCrypto}>
              <Lock size={18} />
            </button>
            <button className="action-btn" title="Recents" onClick={scrollToAudit}>
              <History size={18} />
            </button>
            <button className="action-btn" title="Threat Analysis" onClick={scrollToThreat}>
              <InfoSquare size={18} />
            </button>
            <button
              className="action-btn armoriq-btn"
              title="ArmorIQ"
              onClick={() => window.open('https://docs.armoriq.ai/platform', '_blank')}
            >
              <Link size={18} />
            </button>
          </div>
        </header>

        <div className="center-content">
          <div className="main-logo-container">
            <div className="glowing-shield">
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <ShieldAlert size={100} strokeWidth={1} />
            </div>
            <h1 className="main-title">Sicura <span className="logo-ai">AI</span></h1>
          </div>

          <div className="input-container">
            <div className="input-prompt">
              <span className="sparkles">✨</span>
              <input type="text" placeholder="Paste an email, URL, message, job offer, or anything suspicious..." />
            </div>
            <div className="input-controls">
              <div className="left-controls">
                <button className="control-btn"><Paperclip size={18} /></button>
                <button className="control-btn"><Globe size={18} /></button>
                <div className="auto-detect-dropdown">
                  <span>Auto Detect</span>
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="right-controls">
                <button className="mic-btn"><Mic size={18} /></button>
                <button className="send-btn"><Send size={18} /></button>
              </div>
            </div>
          </div>

          <div className="privacy-notice">
            <Lock size={12} />
            <span>Your data is <span className="highlight">encrypted</span> • Private • Never stored</span>
          </div>
        </div>

        {/* Crypto Bound Encryption Section */}
        <section className="crypto-section" ref={cryptoSectionRef}>
          <div className="section-heading">
            <Lock size={28} className="section-heading-icon" />
            <h2>Crypto Bound Encryption</h2>
          </div>
          <div className="crypto-window">
            <p className="placeholder-text">
              Encryption tools will appear here once connected to the backend.
            </p>
          </div>
        </section>

        {/* Recent Audit Logs Section */}
        <section className="audit-section" ref={auditSectionRef}>
          <div className="section-heading">
            <History size={28} className="section-heading-icon" />
            <h2>Recent Audit Logs</h2>
          </div>

          <div className="audit-grid">
            {[
              'risk-high',
              'risk-medium',
              'risk-low',
              'risk-danger',
              'risk-safe',
              'risk-low',
            ].map((riskClass, i) => (
              <div className="audit-card" key={i}>
                <div className={`audit-card-label ${riskClass}`} />
                <div className="audit-card-body" />
              </div>
            ))}
          </div>
        </section>

        {/* Threat Analysis Verdict Section */}
        <section className="threat-section" ref={threatSectionRef}>
          <div className="section-heading">
            <InfoSquare size={28} className="section-heading-icon" />
            <h2>Threat Analysis Verdict</h2>
          </div>

          <div className="threat-card">
            {/* Left side */}
            <div className="threat-left">
              {/* URL / input box */}
              <div className="threat-input-box">
                <span className="threat-input-placeholder">Paste URL, email, or message here...</span>
              </div>

              {/* LLM message response box */}
              <div className="threat-message-box">
                <span className="threat-message-placeholder">Analysis result will appear here...</span>
              </div>
            </div>

            {/* Right side — Risk Score circle */}
            <div className="threat-right">
              <div className="risk-circle-wrapper">
                <svg className="risk-circle-svg" viewBox="0 0 120 120">
                  {/* Background ring */}
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                  />
                  {/* Foreground ring — empty for now, backend will set strokeDashoffset */}
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="10"
                    strokeDasharray="314"
                    strokeDashoffset="314"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                {/* Score label inside circle */}
                <div className="risk-circle-label">
                  <span className="risk-score-value">--</span>
                  <span className="risk-score-unit">Risk Score</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`site-footer ${isSidebarOpen ? 'footer-shifted' : ''}`}>
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <ShieldAlert size={44} className="logo-icon" />
                <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
              </div>
              <p className="footer-tagline">TRUSTED. INTELLIGENT. AWARE.</p>
            </div>

            <div className="footer-columns">
              <div className="footer-col">
                <h4>Tools</h4>
                <ul>
                  <li>Email Analyzer</li>
                  <li>URL Scanner</li>
                  <li>Job Offer Analyzer</li>
                  <li>Message Analyzer</li>
                  <li>Document Analyzer</li>
                  <li>Breach Checker</li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Platform</h4>
                <ul>
                  <li>Crypto Bound Encryption</li>
                  <li>Recent Audit Logs</li>
                  <li>Threat Analysis Verdict</li>
                  <li>History</li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Resources</h4>
                <ul>
                  <li>ArmorIQ Docs</li>
                  <li>API Reference</li>
                  <li>Settings</li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li>About Sicura AI</li>
                  <li>Upgrade to Pro</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Sicura AI. All rights reserved.</span>
            <span className="footer-encrypted">
              <Lock size={12} /> Your data is encrypted • Private • Never stored
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;