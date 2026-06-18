import React from 'react';
import { 
  Home, Mail, Link, Briefcase, MessageSquare, FileText, 
  ShieldAlert, History, Settings, Info, Diamond, 
  Menu, X, Lock, FileClock, Info as InfoSquare,
  Paperclip, Globe, Mic, Send, ChevronDown
} from 'lucide-react';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="menu-btn"><Menu size={20} /></div>
          <div className="logo-container">
            <ShieldAlert size={24} className="logo-icon" />
            <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
          </div>
          <div className="close-btn"><X size={20} /></div>
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

        <div className="upgrade-card">
          <Diamond size={20} className="upgrade-icon" />
          <div className="upgrade-text">
            <span className="title">Upgrade to Pro</span>
            <span className="subtitle">Unlock advanced features and priority scanning</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="background-effect"></div>
        
        <header className="top-header">
          <div className="mobile-menu-btn"><Menu size={20} /></div>
          <div className="header-actions">
            <button className="action-btn"><Lock size={18} /></button>
            <button className="action-btn"><History size={18} /></button>
            <button className="action-btn"><InfoSquare size={18} /></button>
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
      </main>
    </div>
  );
}

export default App;
