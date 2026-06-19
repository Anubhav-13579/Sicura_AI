const SETTINGS_KEY = 'sicura_settings';

const DEFAULTS = {
  animations: true,
  defaultModule: 'auto_detect',
  highRiskAlerts: true,
  compactMode: false,
};

export function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(partial) {
  const next = { ...loadSettings(), ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}
