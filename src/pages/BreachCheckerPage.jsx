import { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import PageShell from '../components/PageShell';
import { useAnalysis } from '../hooks/useAnalysis';
import ThreatVerdict from '../components/ThreatVerdict';

const DUMMY_BREACHES = [
  { name: 'LinkedIn 2021', records: '700M', severity: 'high' },
  { name: 'Facebook 2019', records: '533M', severity: 'medium' },
  { name: 'Adobe 2013', records: '153M', severity: 'low' },
];

export default function BreachCheckerPage() {
  const [email, setEmail] = useState('');
  const [checked, setChecked] = useState(false);
  const { analysis, isAnalyzing, error, runAnalysis } = useAnalysis('auto_detect');

  const handleCheck = async () => {
    if (!email.trim()) return;
    setChecked(true);
    await runAnalysis(`breach check for email: ${email.trim()}`, 'auto_detect');
  };

  return (
    <PageShell className="page-shell-tool">
      <div className="tool-page">
        <div className="tool-page-header page-animate-in">
          <div className="tool-page-icon breach-icon">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="tool-page-title">Breach Checker</h1>
            <p className="tool-page-tagline">
              Check if an email has appeared in known data breaches — powered by ArmorIQ threat intel.
            </p>
          </div>
        </div>

        <div className="tool-input-card page-animate-in" style={{ animationDelay: '0.08s' }}>
          <div className="breach-input-row">
            <Search size={18} className="breach-search-icon" />
            <input
              type="email"
              className="tool-input breach-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="Enter email address to check…"
              disabled={isAnalyzing}
            />
          </div>
          <div className="tool-input-footer">
            <span className="tool-privacy">Hashed lookup only — email never stored</span>
            <button
              type="button"
              className="tool-submit-btn"
              onClick={handleCheck}
              disabled={isAnalyzing || !email.trim()}
            >
              {isAnalyzing ? 'Checking…' : 'Check Breaches'}
            </button>
          </div>
        </div>

        {error && <p className="analysis-error">{error}</p>}

        {checked && (
          <>
            <div className="breach-results page-animate-in" style={{ animationDelay: '0.12s' }}>
              <h3 className="breach-results-title">Known Breach Database</h3>
              <div className="breach-list">
                {DUMMY_BREACHES.map((b, i) => (
                  <div
                    className={`breach-item breach-${b.severity} page-animate-in`}
                    key={b.name}
                    style={{ animationDelay: `${0.15 + i * 0.06}s` }}
                  >
                    <AlertTriangle size={16} />
                    <div>
                      <span className="breach-name">{b.name}</span>
                      <span className="breach-records">{b.records} records exposed</span>
                    </div>
                    <span className={`breach-severity-badge ${b.severity}`}>{b.severity}</span>
                  </div>
                ))}
              </div>
              <p className="breach-disclaimer">
                <CheckCircle size={14} /> Demo data — full HaveIBeenPwned integration coming soon.
              </p>
            </div>

            <div className="tool-verdict-section page-animate-in" style={{ animationDelay: '0.2s' }}>
              <ThreatVerdict analysis={analysis} isAnalyzing={isAnalyzing} />
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
