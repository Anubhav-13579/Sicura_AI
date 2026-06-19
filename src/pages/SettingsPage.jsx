import { useState, useEffect } from 'react';
import {
  Settings, Bell, Zap, Layout, Shield, Trash2, Check,
} from 'lucide-react';
import PageShell from '../components/PageShell';
import { loadSettings, saveSettings } from '../utils/settings';
import { clearHistory, loadHistory } from '../utils/history';

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="settings-toggle">
      <div className="settings-toggle-text">
        <span className="settings-toggle-label">{label}</span>
        {description && <span className="settings-toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-track ${checked ? 'toggle-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(loadHistory().length);
    document.documentElement.classList.toggle('no-animations', !settings.animations);
  }, [settings.animations]);

  const update = (partial) => {
    const next = saveSettings(partial);
    setSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistoryCount(0);
  };

  return (
    <PageShell className="page-shell-tool">
      <div className="settings-page">
        <div className="settings-hero page-animate-in">
          <div className="settings-hero-glow" />
          <div className="settings-hero-icon">
            <Settings size={36} />
          </div>
          <h1>Settings</h1>
          <p>Customize how Sicura AI works for you.</p>
          {saved && (
            <span className="settings-saved-badge page-animate-in">
              <Check size={14} /> Saved
            </span>
          )}
        </div>

        <div className="settings-grid">
          <section className="settings-card page-animate-in" style={{ animationDelay: '0.06s' }}>
            <div className="settings-card-header">
              <Zap size={20} />
              <h2>Experience</h2>
            </div>
            <Toggle
              checked={settings.animations}
              onChange={(v) => update({ animations: v })}
              label="UI Animations"
              description="Smooth page transitions and card reveals"
            />
            <Toggle
              checked={settings.compactMode}
              onChange={(v) => update({ compactMode: v })}
              label="Compact Mode"
              description="Reduce spacing for smaller screens"
            />
          </section>

          <section className="settings-card page-animate-in" style={{ animationDelay: '0.1s' }}>
            <div className="settings-card-header">
              <Layout size={20} />
              <h2>Analysis Defaults</h2>
            </div>
            <label className="settings-select-row">
              <span className="settings-toggle-label">Default Module</span>
              <select
                className="settings-select"
                value={settings.defaultModule}
                onChange={(e) => update({ defaultModule: e.target.value })}
              >
                <option value="auto_detect">Auto Detect</option>
                <option value="email">Email Analyzer</option>
                <option value="url">URL Scanner</option>
                <option value="job">Job Offer</option>
                <option value="message">Message</option>
                <option value="document">Document</option>
              </select>
            </label>
          </section>

          <section className="settings-card page-animate-in" style={{ animationDelay: '0.14s' }}>
            <div className="settings-card-header">
              <Bell size={20} />
              <h2>Notifications</h2>
            </div>
            <Toggle
              checked={settings.highRiskAlerts}
              onChange={(v) => update({ highRiskAlerts: v })}
              label="High-Risk Alerts"
              description="Notify when risk score exceeds 80"
            />
          </section>

          <section className="settings-card page-animate-in" style={{ animationDelay: '0.18s' }}>
            <div className="settings-card-header">
              <Shield size={20} />
              <h2>Privacy & Data</h2>
            </div>
            <div className="settings-privacy-block">
              <p>Your scans are encrypted in transit. Plaintext is never stored on our servers.</p>
              <div className="settings-stat-row">
                <span>Local history entries</span>
                <strong>{historyCount}</strong>
              </div>
              <button type="button" className="settings-danger-btn" onClick={handleClearHistory}>
                <Trash2 size={16} /> Clear Local History
              </button>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
