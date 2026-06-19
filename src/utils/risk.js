export const RISK_CIRCLE_LENGTH = 314;

export function riskStrokeColor(score) {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#ec4899';
  if (score >= 20) return '#10b981';
  return '#3b82f6';
}

export function riskOffset(score) {
  return RISK_CIRCLE_LENGTH - (score / 100) * RISK_CIRCLE_LENGTH;
}
