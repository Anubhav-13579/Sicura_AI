import { useEffect, useRef, useState } from 'react';
import { Lock, History, Info as InfoSquare, Link, Send, Paperclip, Globe, Mic, ShieldCheck } from 'lucide-react';
import { fetchAuditLogs, fetchEncryptionTools } from '../api/client';
import { useAnalysis } from '../hooks/useAnalysis';
import { loadSettings } from '../utils/settings';
import SicuraLogo from '../components/SicuraLogo';
import ThreatVerdict from '../components/ThreatVerdict';
import PageShell from '../components/PageShell';

export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [selectedModule, setSelectedModule] = useState(() => loadSettings().defaultModule);
  const [auditLogs, setAuditLogs] = useState([]);
  const [encryptionTools, setEncryptionTools] = useState([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);

  const { analysis, isAnalyzing, error, runAnalysis } = useAnalysis(selectedModule);

  const cryptoSectionRef = useRef(null);
  const auditSectionRef = useRef(null);
  const threatSectionRef = useRef(null);

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

  const handleSend = async () => {
    const result = await runAnalysis(inputText, selectedModule);
    if (result) {
      threatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
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
          <div className="input-prompt">
            <span className="sparkles">✨</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste an email, URL, message, job offer, or anything suspicious..."
              disabled={isAnalyzing}
            />
          </div>
          <div className="input-controls">
            <div className="left-controls">
              <button className="control-btn" type="button"><Paperclip size={18} /></button>
              <button className="control-btn" type="button"><Globe size={18} /></button>
              <select
                className="auto-detect-dropdown module-select"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                disabled={isAnalyzing}
              >
                <option value="auto_detect">Auto Detect</option>
                <option value="email">Email Analyzer</option>
                <option value="url">URL Scanner</option>
                <option value="job">Job Offer</option>
                <option value="message">Message</option>
              </select>
            </div>
            <div className="right-controls">
              <button className="mic-btn" type="button"><Mic size={18} /></button>
              <button
                className="send-btn"
                type="button"
                onClick={handleSend}
                disabled={isAnalyzing || !inputText.trim()}
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
          <span>Your data is <span className="highlight">encrypted</span> • Private • Never stored</span>
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
