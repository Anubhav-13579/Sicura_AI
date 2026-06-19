import { Send, Lock } from 'lucide-react';
import { useState } from 'react';
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
  const [input, setInput] = useState('');
  const { analysis, isAnalyzing, error, runAnalysis } = useAnalysis(module);

  const handleSubmit = () => runAnalysis(input, module);

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
          <span className="tool-privacy">
            <Lock size={12} /> Encrypted • Private • Never stored
          </span>
          <button
            type="button"
            className="tool-submit-btn"
            onClick={handleSubmit}
            disabled={isAnalyzing || !input.trim()}
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
