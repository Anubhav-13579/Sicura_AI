const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(detail || `Request failed (${res.status})`);
  }

  return res.json();
}

export function fetchAuditLogs() {
  return request('/audit-logs');
}

export function fetchEncryptionTools() {
  return request('/encryption-tools');
}

export function analyzeContent(content, module = 'auto_detect') {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ content, module }),
  });
}

export function checkHealth() {
  return request('/health');
}
