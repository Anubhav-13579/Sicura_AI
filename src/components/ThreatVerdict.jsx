import { RISK_CIRCLE_LENGTH, riskOffset, riskStrokeColor } from '../utils/risk';

export default function ThreatVerdict({ analysis, isAnalyzing, compact = false }) {
  const riskScore = analysis?.risk_score ?? null;
  const offset = riskScore != null ? riskOffset(riskScore) : RISK_CIRCLE_LENGTH;

  return (
    <div className={`threat-card ${compact ? 'threat-card-compact' : ''}`}>
      <div className="threat-left">
        <div className="threat-input-box">
          {analysis?.content_preview ? (
            <span className="threat-input-value">{analysis.content_preview}</span>
          ) : (
            <span className="threat-input-placeholder">Analyzed content will appear here…</span>
          )}
        </div>

        <div className="threat-message-box">
          {isAnalyzing ? (
            <span className="threat-message-placeholder">Analyzing with ArmorIQ + AI…</span>
          ) : analysis ? (
            <div className="threat-result">
              <p className="threat-explanation">{analysis.explanation}</p>
              <p className="threat-next-step">
                <strong>Next step:</strong> {analysis.next_step}
              </p>
              <div className="threat-meta">
                <span className={`threat-badge ${analysis.risk_class}`}>{analysis.status}</span>
                <span className="threat-module">{analysis.module.replace(/_/g, ' ')}</span>
                <span className="threat-armoriq">ArmorIQ: {analysis.armoriq_status}</span>
              </div>
            </div>
          ) : (
            <span className="threat-message-placeholder">Analysis result will appear here…</span>
          )}
        </div>
      </div>

      <div className="threat-right">
        <div className="risk-circle-wrapper">
          <svg className="risk-circle-svg" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={riskScore != null ? riskStrokeColor(riskScore) : 'rgba(59,130,246,0.3)'}
              strokeWidth="10"
              strokeDasharray={RISK_CIRCLE_LENGTH}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="risk-ring-progress"
            />
          </svg>
          <div className="risk-circle-label">
            <span className="risk-score-value">{isAnalyzing ? '…' : riskScore ?? '--'}</span>
            <span className="risk-score-unit">Risk Score</span>
          </div>
        </div>
      </div>
    </div>
  );
}
