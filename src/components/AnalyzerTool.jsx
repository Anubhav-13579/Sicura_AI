import { Send, Lock, Plus, Paperclip, Image, Globe, Headphones, FileQuestion, Camera, Network, ChevronRight, FileText, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis';
import ThreatVerdict from './ThreatVerdict';

export default function AnalyzerTool({
  module,
  title,
  tagline,
  placeholder,
  hints = [],
  inputType = 'textarea',
  icon: Icon,
}) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const { analysis, isAnalyzing, error, runAnalysis } = useAnalysis(module);

  // States and refs for plus popup menu
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
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

  const handleSubmit = () => {
    let finalPrompt = input;
    if (attachedFiles.length > 0) {
      const fileLabels = attachedFiles.map(f => `[Attached File: ${f.name}]`).join('\n');
      finalPrompt = (finalPrompt ? finalPrompt + '\n' : '') + fileLabels;
    }
    runAnalysis(finalPrompt, module);
    setAttachedFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputType === 'text' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const InputTag = inputType === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="tool-page">
      <div className="tool-page-header page-animate-in">
        {Icon && (
          <div className="tool-page-icon">
            <Icon size={32} />
          </div>
        )}
        <div>
          <h1 className="tool-page-title">{title}</h1>
          <p className="tool-page-tagline">{tagline}</p>
        </div>
      </div>

      {hints.length > 0 && (
        <div className="tool-hints page-animate-in" style={{ animationDelay: '0.08s' }}>
          {hints.map((hint) => (
            <span className="tool-hint-chip" key={hint}>{hint}</span>
          ))}
        </div>
      )}

      <div className="tool-input-card page-animate-in" style={{ animationDelay: '0.12s' }}>
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

        <InputTag
          className={`tool-input ${inputType === 'textarea' ? 'tool-textarea' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isAnalyzing}
          rows={inputType === 'textarea' ? 6 : undefined}        
        />

        <div className="tool-input-footer">
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
                  <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); setInput((prev) => (prev ? prev + '\n' : '') + '[Generate Image: ]'); }}>
                    <Image size={16} />
                    <span>Generate image</span>
                  </button>
                  <button className="plus-menu-item" type="button" onClick={() => { setShowPlusMenu(false); setInput((prev) => (prev ? prev + '\n' : '') + '[Deep Research: ]'); }}>
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
              value={module}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'auto_detect') {
                  navigate('/');
                } else {
                  navigate(`/${val}`);
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

            <span className="tool-privacy">
              <Lock size={12} /> Encrypted • Private • Never stored
            </span>
          </div>

          <button
            type="button"
            className="tool-submit-btn"
            onClick={handleSubmit}
            disabled={isAnalyzing || (!input.trim() && attachedFiles.length === 0)}
          >
            <Send size={16} />
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && <p className="analysis-error page-animate-in">{error}</p>}

      <div className="tool-verdict-section page-animate-in" style={{ animationDelay: '0.16s' }}>
        <ThreatVerdict analysis={analysis} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
}
