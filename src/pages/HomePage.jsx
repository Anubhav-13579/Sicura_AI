import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, History, Info as InfoSquare, Link, Send, Paperclip, Globe, Mic, ShieldCheck, ChevronDown, Plus, Image, Headphones, FileQuestion, Camera, Network, ChevronRight, FileText, X } from 'lucide-react';
import { fetchAuditLogs, fetchEncryptionTools } from '../api/client';
import { useAnalysis } from '../hooks/useAnalysis';
import { loadSettings } from '../utils/settings';
import SicuraLogo from '../components/SicuraLogo';
import ThreatVerdict from '../components/ThreatVerdict';
import PageShell from '../components/PageShell';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [selectedModule, setSelectedModule] = useState(() => loadSettings().defaultModule);
  const [auditLogs, setAuditLogs] = useState([]);
  const [encryptionTools, setEncryptionTools] = useState([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const { analysis, isAnalyzing, error, runAnalysis } = useAnalysis(selectedModule);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const cryptoSectionRef = useRef(null);
  const auditSectionRef = useRef(null);
  const threatSectionRef = useRef(null);
  const inputFieldRef = useRef(null);

  // States and refs for plus popup menu
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const plusMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      attachedFiles.forEach(file => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [attachedFiles]);

  const handlePlusClick = () => {
    setShowPlusMenu(!showPlusMenu);
  };

  const handleFileClick = () => {
    setShowPlusMenu(false);
    fileInputRef.current?.click();
  };

  const createAttachedFileObject = (file) => {
    const name = file.name;
    const extension = name.split('.').pop().toLowerCase();
    const isImage = file.type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension);
    
    let iconType = 'generic';
    let displayType = 'File';
    
    if (['ppt', 'pptx'].includes(extension)) {
      iconType = 'ppt';
      displayType = 'PowerPoint';
    } else if (extension === 'pdf') {
      iconType = 'pdf';
      displayType = 'PDF Document';
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      iconType = 'word';
      displayType = extension === 'txt' ? 'Text Document' : 'Word Document';
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      iconType = 'excel';
      displayType = 'Excel Spreadsheet';
    }
    
    return {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name,
      isImage,
      url: isImage ? URL.createObjectURL(file) : null,
      iconType,
      displayType,
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFileObj = createAttachedFileObject(file);
      setAttachedFiles((prev) => [...prev, newFileObj]);
    }
  };

  const removeAttachedFile = (id) => {
    setAttachedFiles((prev) => {
      const toRemove = prev.find((f) => f.id === id);
      if (toRemove && toRemove.url) {
        URL.revokeObjectURL(toRemove.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  };


  useEffect(() => {
    let cancelled = false;

    async function loadStaticData() {
      try {
        const [logsRes, toolsRes] = await Promise.all([
          fetchAuditLogs(),
          fetchEncryptionTools(),
        ]);
        if (!cancelled) {
          setAuditLogs(logsRes.logs ?? []);
          setEncryptionTools(toolsRes.tools ?? []);
        }
      } catch {
        if (!cancelled) {
          setAuditLogs([]);
          setEncryptionTools([]);
        }
      } finally {
        if (!cancelled) setIsLoadingSections(false);
      }
    }

    loadStaticData();
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const handleSend = async () => {
    let finalPrompt = inputText;
    if (attachedFiles.length > 0) {
      const fileLabels = attachedFiles.map(f => `[Attached File: ${f.name}]`).join('\n');
      finalPrompt = (finalPrompt ? finalPrompt + '\n' : '') + fileLabels;
    }
    const result = await runAnalysis(finalPrompt, selectedModule);
    if (result) {
      threatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setAttachedFiles([]);
    }
  };
  const handleMicClick = () => {
    console.log('mic clicked');
    if (!recognitionRef.current) {
      console.log('recognitionRef is null - not supported');
      alert('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        try {
        recognitionRef.current.start();
        setIsListening(true);
        inputFieldRef.current?.focus();
        console.log('recognition started');
      } catch (err) {
        console.log('start error:', err.message);
      }
        setIsListening(true);
        console.log('recognition started');
      } catch (err) {
        console.log('start error:', err.message);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageShell>
      <div className="center-content">
        <div className="main-logo-container page-animate-in">
          <div className="glowing-shield">
            <SicuraLogo size={150} />
          </div>
          <h1 className="main-title">Sicura <span className="logo-ai">AI</span></h1>
        </div>

        <div className="input-container page-animate-in" style={{ animationDelay: '0.1s' }}>
          {attachedFiles.length > 0 && (
            <div className="file-previews-container">
              {attachedFiles.map((file) => (
                <div key={file.id} className="file-preview-item">
                  {file.isImage ? (
                    <div className="image-preview-wrapper">
                      <img src={file.url} alt={file.name} className="image-preview-thumb" />
                      <button 
                        type="button" 
                        className="remove-file-btn" 
                        onClick={() => removeAttachedFile(file.id)}
                        title="Remove file"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="doc-preview-wrapper">
                      <div className="doc-preview-icon">
                        {['ppt', 'pdf', 'word', 'excel'].includes(file.iconType) ? (
                          <div className={`doc-icon-badge ${file.iconType}`}>
                            {file.iconType === 'ppt' ? 'P' : file.iconType === 'pdf' ? 'PDF' : file.iconType === 'word' ? 'W' : 'E'}
                          </div>
                        ) : (
                          <div className="doc-icon-badge generic">
                            <FileText size={16} />
                          </div>
                        )}
                      </div>
                      <div className="doc-preview-info">
                        <span className="doc-name" title={file.name}>{file.name}</span>
                        <span className="doc-type">{file.displayType}</span>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn doc-remove" 
                        onClick={() => removeAttachedFile(file.id)}
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="input-prompt">
            <span className="sparkles">✨</span>
            <textarea
              ref={inputFieldRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste an email, URL, message, job offer, or anything suspicious..."
              disabled={isAnalyzing}
              className="home-textarea"
              rows={4}
            />
          </div>
          <div className="input-controls">
            <div className="left-controls" ref={plusMenuRef}>
              <div className="plus-menu-container">
                <button 
                  className={`plus-trigger-btn ${showPlusMenu ? 'active' : ''}`} 
                  type="button"
                  onClick={handlePlusClick}
                  title="More actions"
                >
                  <Plus size={18} />
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />

                {showPlusMenu && (
                  <div className="plus-popup-menu">
                    <button className="plus-menu-item" type="button" onClick={handleFileClick}>
                      <Paperclip size={16} />
                      <span>Add images or files</span>
                    </button>
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); navigate('/document'); }}>
                      <FileText size={16} />
                      <span>Document Analyzer</span>
                    </button>
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); setInputText((prev) => (prev ? prev + '\n' : '') + '[Generate Image: ]'); }}>
                      <Image size={16} />
                      <span>Generate image</span>
                    </button>
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); setInputText((prev) => (prev ? prev + '\n' : '') + '[Deep Research: ]'); }}>
                      <Globe size={16} />
                      <span>Start deep research</span>
                      <span className="plus-badge">5 remaining</span>
                    </button>
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); alert('Create podcast feature clicked!'); }}>
                      <Headphones size={16} />
                      <span>Create a podcast</span>
                      <span className="plus-badge">3 remaining</span>
                    </button>
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); alert('Take quiz clicked!'); }}>
                      <FileQuestion size={16} />
                      <span>Take a quiz</span>
                    </button>
                    <div className="plus-menu-divider" />
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); alert('Screenshot action triggered!'); }}>
                      <Camera size={16} />
                      <span>Take screenshot</span>
                    </button>
                    <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); alert('Use connectors clicked!'); }}>
                      <Network size={16} />
                      <span>Use connectors</span>
                      <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                    </button>
                  </div>
                )}
              </div>

              <select
                className="auto-detect-dropdown module-select"
                value={selectedModule}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'document') {
                    navigate('/document');
                  } else {
                    setSelectedModule(val);
                  }
                }}
                disabled={isAnalyzing}
              >
                <option value="auto_detect">Auto Detect</option>
                <option value="email">Email Analyzer</option>
                <option value="url">URL Scanner</option>
                <option value="job">Job Offer</option>
                <option value="message">Message</option>
                <option value="document">Document Analyzer</option>
              </select>
            </div>
            <div className="right-controls">
              <button
                className={`mic-btn ${isListening ? 'mic-active' : ''}`}
                type="button"
                onClick={handleMicClick}
                title={isListening ? 'Stop listening' : 'Speak'}
              >
                <Mic size={18} />
              </button>
              <button
                className="send-btn"
                type="button"
                onClick={handleSend}
                disabled={isAnalyzing || (!inputText.trim() && attachedFiles.length === 0)}
                title="Analyze"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {error && <p className="analysis-error">{error}</p>}

        <div className="privacy-notice page-animate-in" style={{ animationDelay: '0.15s' }}>
          <Lock size={12} />
          <span>Your data is <span className="encrypted">encrypted</span> • <span className="private">Private</span> • <span className="never-stored">Never stored</span></span>
        </div>

        <div 
          className="scroll-indicator-container page-animate-in" 
          style={{ animationDelay: '0.2s' }}
          onClick={() => cryptoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <ChevronDown size={16} className="scroll-arrow" />
        </div>
      </div>

      <section className="crypto-section" ref={cryptoSectionRef} id="crypto">
        <div className="section-heading">
          <Lock size={28} className="section-heading-icon" />
          <h2>Crypto Bound Encryption</h2>
        </div>
        <div className="crypto-window">
          {isLoadingSections ? (
            <p className="placeholder-text">Loading encryption tools…</p>
          ) : encryptionTools.length === 0 ? (
            <p className="placeholder-text">Encryption tools will appear here once connected to the backend.</p>
          ) : (
            <div className="crypto-tools-grid">
              {encryptionTools.map((tool, i) => (
                <div className="crypto-tool-card page-animate-in" key={tool.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="crypto-tool-header">
                    <ShieldCheck size={18} />
                    <span className="crypto-tool-status">{tool.status}</span>
                  </div>
                  <h3 className="crypto-tool-name">{tool.name}</h3>
                  <p className="crypto-tool-desc">{tool.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="audit-section" ref={auditSectionRef} id="audit">
        <div className="section-heading">
          <History size={28} className="section-heading-icon" />
          <h2>Recent Audit Logs</h2>
        </div>
        <div className="audit-grid">
          {isLoadingSections ? (
            Array.from({ length: 6 }, (_, i) => (
              <div className="audit-card audit-card-skeleton" key={i} />
            ))
          ) : auditLogs.length === 0 ? (
            <p className="placeholder-text audit-empty">No audit logs yet.</p>
          ) : (
            auditLogs.map((log, i) => (
              <div className="audit-card page-animate-in" key={log.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`audit-card-label ${log.risk_class}`}>
                  <span>{log.status} · {log.risk_score}</span>
                </div>
                <div className="audit-card-body">
                  <span className="audit-type">{log.module}</span>
                  <p className="audit-content">{log.content_preview}</p>
                  <span className="audit-time">{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="threat-section" ref={threatSectionRef} id="threat">
        <div className="section-heading">
          <InfoSquare size={28} className="section-heading-icon" />
          <h2>Threat Analysis Verdict</h2>
        </div>
        <ThreatVerdict analysis={analysis} isAnalyzing={isAnalyzing} />
      </section>
    </PageShell>
  );
}
