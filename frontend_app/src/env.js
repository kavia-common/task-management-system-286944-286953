 // PUBLIC_INTERFACE
export function parseFeatureFlags(raw) {
  /** Parse REACT_APP_FEATURE_FLAGS provided as CSV or JSON and return a Set of flags */
  if (!raw) return new Set();
  try {
    // Try JSON array: '["useApi","beta"]'
    const maybeJson = JSON.parse(raw);
    if (Array.isArray(maybeJson)) {
      return new Set(maybeJson.map((x) => String(x).trim()).filter(Boolean));
    }
  } catch {
    // Not JSON, fall back to CSV
  }
  return new Set(
    String(raw)
      .split(/[,\s]+/)
      .map((x) => x.trim())
      .filter(Boolean)
  );
}

// PUBLIC_INTERFACE
export function getEnv() {
  /** Resolve environment values and derived runtime mode */
  const featureFlags = parseFeatureFlags(process.env.REACT_APP_FEATURE_FLAGS);
  const apiBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    '';
  const useApi = featureFlags.has('useApi') && !!apiBase;

  const env = {
    featureFlags,
    apiBase,
    useApi,
    nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV,
    frontendUrl: process.env.REACT_APP_FRONTEND_URL,
    wsUrl: process.env.REACT_APP_WS_URL,
    enableSourceMaps: process.env.REACT_APP_ENABLE_SOURCE_MAPS,
    port: process.env.REACT_APP_PORT,
    trustProxy: process.env.REACT_APP_TRUST_PROXY,
    logLevel: process.env.REACT_APP_LOG_LEVEL,
    healthcheckPath: process.env.REACT_APP_HEALTHCHECK_PATH,
    experimentsEnabled: process.env.REACT_APP_EXPERIMENTS_ENABLED,
  };

  if ((env.nodeEnv || '').toLowerCase() === 'development') {
    // Dev banner
    const mode = useApi ? 'API mode' : 'Local Storage mode';
    // eslint-disable-next-line no-console
    console.info(`[ToDo] Running in ${mode}${useApi ? ` (API: ${apiBase})` : ''}`);
  }

  return env;
}
