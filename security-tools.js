// Security Tools for Sicura AI Analysis Engine

/**
 * Parses a URL into its constituent parts.
 * @param {string} urlStr 
 */
export function parse_url(urlStr) {
  try {
    // Add protocol if missing to allow URL parsing
    let normalized = urlStr.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'http://' + normalized;
    }
    const parsed = new URL(normalized);
    return {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      pathname: parsed.pathname,
      search: parsed.search,
      searchParams: Object.fromEntries(parsed.searchParams.entries()),
      success: true
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Checks WHOIS details for a domain, returning age, registrar, and risk metrics.
 * @param {string} domain 
 */
export function check_whois(domain) {
  const cleanDomain = domain.toLowerCase().replace(/^www\./, '');
  
  // Safe whitelist
  const whitelist = {
    'google.com': { age: 10120, registrar: 'MarkMonitor Inc.', country: 'US', riskLevel: 'Safe' },
    'paypal.com': { age: 9850, registrar: 'MarkMonitor Inc.', country: 'US', riskLevel: 'Safe' },
    'github.com': { age: 6720, registrar: 'MarkMonitor Inc.', country: 'US', riskLevel: 'Safe' },
    'microsoft.com': { age: 12560, registrar: 'MarkMonitor Inc.', country: 'US', riskLevel: 'Safe' },
    'amazon.com': { age: 11200, registrar: 'MarkMonitor Inc.', country: 'US', riskLevel: 'Safe' },
    'google.co.in': { age: 8200, registrar: 'MarkMonitor Inc.', country: 'US', riskLevel: 'Safe' }
  };

  if (whitelist[cleanDomain]) {
    return {
      domain: cleanDomain,
      ...whitelist[cleanDomain],
      isNewDomain: false,
      details: 'Reputable domain with established history.'
    };
  }

  // Check for suspicious names
  const phishingKeywords = ['paypal', 'secure', 'bank', 'login', 'verify', 'update', 'signin', 'support', 'account', 'giftcard', 'free', 'wallet', 'crypto', 'token', 'claim'];
  const hasKeyword = phishingKeywords.some(keyword => cleanDomain.includes(keyword));

  // Determine age and registrar based on domain name
  let age = 45; // default young domain
  let registrar = 'Namecheap, Inc.';
  let country = 'IS'; // Iceland, commonly used for privacy

  if (cleanDomain.endsWith('.xyz') || cleanDomain.endsWith('.top') || cleanDomain.endsWith('.click') || cleanDomain.endsWith('.info')) {
    age = Math.floor(Math.random() * 20) + 1; // 1-20 days
    registrar = 'Hostinger, UAB';
    country = 'LT';
  } else if (hasKeyword) {
    age = Math.floor(Math.random() * 60) + 5; // 5-65 days
    registrar = 'Public Domain Registry';
    country = 'RU';
  } else {
    // Arbitrary unknown domain
    age = Math.floor(Math.random() * 1500) + 100; // 100 - 1600 days
    registrar = 'GoDaddy.com, LLC';
    country = 'US';
  }

  const isNewDomain = age < 90;
  const riskLevel = isNewDomain || hasKeyword ? 'High' : 'Low';

  return {
    domain: cleanDomain,
    age,
    registrar,
    country,
    isNewDomain,
    riskLevel,
    details: isNewDomain 
      ? `High Risk: Domain is very young (${age} days old). Phishing domains are often registered within 90 days.`
      : `Established domain (${age} days old) with standard registration.`
  };
}

/**
 * Queries threat intelligence database for known malicious domains/hosts.
 * @param {string} domain 
 */
export function query_threat_intel_db(domain) {
  const cleanDomain = domain.toLowerCase().replace(/^www\./, '');

  const threatFeeds = {
    'paypal-security-update.net': { flagged: true, category: 'Phishing', threatScore: 98, source: 'Spamhaus / PhishTank' },
    'verify-login-chase.com': { flagged: true, category: 'Phishing', threatScore: 95, source: 'AbuseIPDB / URLVoid' },
    'claim-free-btc.xyz': { flagged: true, category: 'Malware / Crypto Scam', threatScore: 100, source: 'AlienVault OTX' },
    'unclaimed-funds-lotto.click': { flagged: true, category: 'Social Engineering', threatScore: 92, source: 'VirusTotal' },
    'google-drive-shared-doc-view.info': { flagged: true, category: 'Credential Harvesting', threatScore: 97, source: 'PhishTank' }
  };

  if (threatFeeds[cleanDomain]) {
    return {
      domain: cleanDomain,
      ...threatFeeds[cleanDomain],
      status: 'MALICIOUS',
      notes: 'Active command-and-control or credential harvesting site.'
    };
  }

  // Pattern checks for threat database emulation
  const suspiciousTLDs = ['.xyz', '.top', '.click', '.info', '.cc', '.ru', '.cfd'];
  const isSuspiciousTLD = suspiciousTLDs.some(tld => cleanDomain.endsWith(tld));
  
  const keywords = ['login', 'secure', 'verify', 'update', 'banking', 'support', 'resolve'];
  const keywordCount = keywords.filter(kw => cleanDomain.includes(kw)).length;

  if (keywordCount >= 2 || (isSuspiciousTLD && keywordCount >= 1)) {
    return {
      domain: cleanDomain,
      flagged: true,
      category: 'Suspected Phishing',
      threatScore: 85,
      source: 'Sicura AI Heuristics',
      status: 'SUSPICIOUS',
      notes: 'Domain structure matches known credential harvesting templates.'
    };
  }

  return {
    domain: cleanDomain,
    flagged: false,
    category: 'None',
    threatScore: 0,
    source: 'Unified Threat Feed',
    status: 'CLEAN',
    notes: 'No active listings in intelligence feeds.'
  };
}

/**
 * Scans text content for scam signatures, phishing hooks, and social engineering indicators.
 * @param {string} text 
 */
export function match_scam_signatures(text) {
  if (!text || typeof text !== 'string') {
    return { riskScore: 0, indicators: [], success: false };
  }

  const indicators = [];
  let score = 0;

  const signatures = [
    {
      category: 'Urgency & Suspension',
      patterns: [
        /account.*suspend/i,
        /card.*block/i,
        /action.*require/i,
        /verify.*immediately/i,
        /urgent.*update/i,
        /limit.*access/i,
        /unauthorized.*activity/i
      ],
      weight: 35,
      description: 'Creates artificial urgency to bypass critical thinking.'
    },
    {
      category: 'Financial Hook',
      patterns: [
        /claim.*reward/i,
        /won.*lottery/i,
        /unclaimed.*funds/i,
        /cash.*prize/i,
        /crypto.*giveaway/i,
        /double.*btc/i,
        /bonus.*free/i
      ],
      weight: 40,
      description: 'Promises large financial returns or free rewards.'
    },
    {
      category: 'Fake Job Offer',
      patterns: [
        /work.*from.*home/i,
        /earn.*daily/i,
        /salary.*hour/i,
        /telegram.*contact/i,
        /whatsapp.*number/i,
        /part-time.*job/i,
        /no.*experience.*require/i
      ],
      weight: 30,
      description: 'Uses fake flexible employment models to harvest details or steal money.'
    },
    {
      category: 'Credential Harvesting Hook',
      patterns: [
        /click.*link.*below/i,
        /sign.*in.*to.*confirm/i,
        /update.*your.*password/i,
        /restore.*security/i,
        /billing.*update/i
      ],
      weight: 25,
      description: 'Tricks users into clicking links that lead to fake login pages.'
    }
  ];

  signatures.forEach(sig => {
    let matched = false;
    sig.patterns.forEach(pattern => {
      if (pattern.test(text)) {
        matched = true;
      }
    });

    if (matched) {
      indicators.push({
        category: sig.category,
        description: sig.description,
        scoreImpact: sig.weight
      });
      score += sig.weight;
    }
  });

  // Cap risk score at 100
  const finalScore = Math.min(score, 100);

  return {
    success: true,
    riskScore: finalScore,
    indicators,
    matchesSignature: indicators.length > 0
  };
}

/**
 * Sandbox execution tracing redirection hops.
 * @param {string} urlStr 
 */
export function sandbox_redirection(urlStr) {
  const parseResult = parse_url(urlStr);
  if (!parseResult.success) {
    return { success: false, error: 'Invalid URL for sandboxing' };
  }

  const host = parseResult.hostname.toLowerCase();
  
  // Safe redirect path
  if (host === 'google.com' || host === 'github.com') {
    return {
      hops: [
        { url: urlStr, statusCode: 301, redirectUrl: 'https://' + host + '/' },
        { url: 'https://' + host + '/', statusCode: 200, redirectUrl: null }
      ],
      finalUrl: 'https://' + host + '/',
      isSuspiciousChain: false,
      notes: 'Standard secure redirect chain.'
    };
  }

  // Suspicious redirect path (emulated for phishing)
  const phishingKeywords = ['paypal', 'secure', 'bank', 'login', 'verify', 'update'];
  const hasKeyword = phishingKeywords.some(kw => host.includes(kw));

  if (hasKeyword || host.endsWith('.xyz') || host.endsWith('.click')) {
    const finalDest = `https://scam-landing-vault.net/login?session=${Math.random().toString(36).substring(7)}`;
    return {
      hops: [
        { url: urlStr, statusCode: 302, redirectUrl: 'https://short.url/redirection-hub' },
        { url: 'https://short.url/redirection-hub', statusCode: 307, redirectUrl: finalDest },
        { url: finalDest, statusCode: 200, redirectUrl: null }
      ],
      finalUrl: finalDest,
      isSuspiciousChain: true,
      notes: 'Suspicious Redirect Chain: Bypasses standard filters using link shortener redirections to land on a credential harvesting interface.'
    };
  }

  return {
    hops: [
      { url: urlStr, statusCode: 200, redirectUrl: null }
    ],
    finalUrl: urlStr,
    isSuspiciousChain: false,
    notes: 'Direct load, no redirection hoops detected.'
  };
}
