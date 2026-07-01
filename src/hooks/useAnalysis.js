import { useState, useCallback } from 'react';
import { analyzeContent } from '../api/client';
import { saveToHistory } from '../utils/history';
import { loadSettings } from '../utils/settings';

export function useAnalysis(defaultModule = 'auto_detect') {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = useCallback(async (content, module = defaultModule) => {
    const trimmed = content.trim();
    if (!trimmed || isAnalyzing) return null;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeContent(trimmed, module);
      setAnalysis(result);
      saveToHistory(result);

      const settings = loadSettings();
      if (settings.highRiskAlerts && result.risk_score >= 80 && 'Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification('Sicura AI — High Risk Detected', {
              body: `Risk score ${result.risk_score}: ${result.next_step}`,
              icon: '/vite.svg',
            });
          }
        });
      }

      return result;
    } catch (err) {
      setError(err.message || 'Analysis failed. Is the backend running?');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [defaultModule, isAnalyzing]);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, isAnalyzing, error, runAnalysis, reset, setAnalysis };
}
