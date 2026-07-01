import { useEffect, useState } from 'react';
import { History, Trash2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { loadHistory, clearHistory } from '../utils/history';
import { fetchAuditLogs } from '../api/client';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function HistoryPage() {
  const [localHistory, setLocalHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLocalHistory(loadHistory());
    fetchAuditLogs()
      .then((res) => setAuditLogs(res.logs ?? []))
      .catch(() => setAuditLogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const handleClear = () => {
    clearHistory();
    setLocalHistory([]);
  };

  const allItems = [
    ...localHistory.map((h) => ({ ...h, source: 'local' })),
    ...auditLogs.map((l) => ({
      id: l.id,
      content_preview: l.content_preview,
      risk_score: l.risk_score,
      risk_class: l.risk_class,
      module: l.module,
      status: l.status,
      savedAt: l.timestamp,
      source: 'audit',
    })),
  ];

  return (
    <PageShell className="page-shell-tool">
      <div className="tool-page history-page">
        <div className="tool-page-header page-animate-in">
          <div className="tool-page-icon">
            <History size={32} />
          </div>
          <div className="history-header-text">
            <h1 className="tool-page-title">History</h1>
            <p className="tool-page-tagline">View past analyses and ArmorIQ audit records.</p>
          </div>
          <div className="history-actions">
            <button type="button" className="history-action-btn" onClick={refresh} title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button type="button" className="history-action-btn danger" onClick={handleClear} title="Clear local history">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="history-skeleton-grid">
            {Array.from({ length: 4 }, (_, i) => (
              <div className="audit-card audit-card-skeleton" key={i} />
            ))}
          </div>
        ) : allItems.length === 0 ? (
          <div className="history-empty page-animate-in">
            <History size={48} strokeWidth={1.2} />
            <p>No analyses yet.</p>
            <Link to="/" className="history-empty-link">Run your first scan →</Link>
          </div>
        ) : (
          <div className="history-grid">
            {allItems.map((item, i) => (
              <div
                className="history-card page-animate-in"
                key={`${item.source}-${item.id}-${i}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className={`audit-card-label ${item.risk_class || 'risk-unknown'}`}>
                  <span>{item.status || 'Analyzed'} · {item.risk_score ?? '--'}</span>
                </div>
                <div className="history-card-body">
                  <span className="audit-type">{item.module?.replace(/_/g, ' ') || 'Scan'}</span>
                  <p className="audit-content">{item.content_preview}</p>
                  <span className="audit-time">
                    {item.source === 'local' ? formatDate(item.savedAt) : item.savedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
