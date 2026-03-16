// Simulate a domain age check. Return a random age in days between 1 and 3650
const simulateDomainAge = (domain) => {
  // Simple mock: hash domain string length to some repeatable age for demo consistency
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash * 13) % 4000; 
};

// Check for suspicious patterns like IPs, long subdomains, known phishing keywords
const checkSuspiciousPatterns = (url) => {
  const issues = [];
  
  // IP address pattern in URL
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  if (ipRegex.test(url)) {
    issues.push('URL uses an IP address instead of a domain name (high risk).');
  }

  // Suspicious keywords
  const keywords = ['login', 'verify', 'update', 'secure', 'account', 'banking', 'wallet'];
  const hasSuspiciousKeyword = keywords.some(kw => url.toLowerCase().includes(kw));
  if (hasSuspiciousKeyword) {
    issues.push('URL contains suspicious keywords commonly used in phishing (e.g., login, verify, secure).');
  }

  // Length check
  if (url.length > 75) {
    issues.push('URL is unusually long, which can be a tactic to hide the true destination.');
  }

  // Multiple subdomains
  try {
    const parsedUrl = new URL(url);
    const domainParts = parsedUrl.hostname.split('.');
    if (domainParts.length > 3 && !url.includes('www')) {
         issues.push('URL has multiple subdomains, which can be used to masquerade as legitimate sites.');
    } else if (domainParts.length > 4) {
         issues.push('URL has multiple subdomains, which can be used to masquerade as legitimate sites.');
    }
  } catch(e) {}
  
  return issues;
};
// Check for lookalike domains (e.g. g00gle.com)
const checkLookalikeDomains = (url) => {
  const issues = [];
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Simple homoglyph/typo map for popular domains
    const popularDomains = ['google', 'facebook', 'amazon', 'paypal', 'apple', 'microsoft', 'netflix', 'bank'];
    
    // Remove TLD for comparison
    const domainNameParts = hostname.split('.');
    let domainName = '';
    // get main domain portion (e.g. 'google' from 'www.google.com')
    if (domainNameParts.length > 2) {
      domainName = domainNameParts[domainNameParts.length - 2];
    } else if (domainNameParts.length > 1) {
      domainName = domainNameParts[0];
    } else {
      domainName = hostname;
    }

    // Common substitutions: 0->o, 1->l, 1->i, l->i, i->l, q->g, rn->m
    let normalizedDomain = domainName
      .replace(/0/g, 'o')
      .replace(/1/g, 'l')
      .replace(/q/g, 'g');
      
    // Exact match check on popular domains
    if (popularDomains.includes(normalizedDomain) && domainName !== normalizedDomain) {
      issues.push(`Lookalike domain detected! This URL looks like '${normalizedDomain}' but uses substituting characters (e.g., zeros instead of O's). This is a very common phishing tactic.`);
    }

    // High entropy check (lots of random dashes or numbers)
    const entropyRegex = /[0-9-]{4,}/;
    if (entropyRegex.test(domainName) && domainName.length > 15) {
      issues.push('Domain name contains a suspicious amount of random numbers/dashes, often indicating an auto-generated malicious link.');
    }

  } catch(e) {}
  return issues;
};

const Scan = require('../models/Scan');

exports.scanUrl = async (req, res) => {
  try {
    let { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // prepend http if missing just to allow parsing if user just typed 'google.com'
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let riskScore = 0; // 0 (Safe) to 100 (Maximum Risk)
    let explanations = [];

    // 1. Check HTTPS
    if (parsedUrl.protocol === 'http:') {
      riskScore += 30;
      explanations.push('Connection is not secure (HTTP instead of HTTPS). Data transmitted is unencrypted.');
    } else if (parsedUrl.protocol === 'https:') {
      explanations.push('Uses secure connection (HTTPS).');
    }

    // 2. Suspicious Patterns
    const patternIssues = checkSuspiciousPatterns(url);
    if (patternIssues.length > 0) {
      riskScore += patternIssues.length * 20;
      explanations.push(...patternIssues);
    }

    // 3. Lookalike Check
    const lookalikeIssues = checkLookalikeDomains(url);
    if (lookalikeIssues.length > 0) {
      riskScore += 50; // High penalty for lookalikes
      explanations.push(...lookalikeIssues);
    }

    // 4. Domain Age (Mocked)
    const ageInDays = simulateDomainAge(parsedUrl.hostname);
    if (ageInDays < 30) {
      riskScore += 40;
      explanations.push(`Domain is very new (approx. ${ageInDays} days old). Newly created domains are often used for temporary scams.`);
    } else if (ageInDays < 180) {
      riskScore += 15;
      explanations.push(`Domain is relatively new (approx. ${ageInDays} days old). Proceed with slight caution.`);
    } else {
      explanations.push('Domain age is established and appears trustworthy.');
    }

    // Cap score at 100
    riskScore = Math.min(riskScore, 100);

    if (riskScore === 0 && explanations.length === 1 && explanations[0].includes('HTTPS')) {
        explanations.push('No suspicious signals detected. The link appears safe.');
    }

    // Save scan to database attached to the user
    const newScan = new Scan({
      user: req.user.id,
      url: req.body.url, // save what user originally typed
      riskScore,
      explanations,
    });

    await newScan.save();

    res.status(200).json(newScan);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Scan.find({ user: req.user.id }).sort({ scannedAt: -1 }).limit(50);
    res.status(200).json(history);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Failed to fetch scan history' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalScans = await Scan.countDocuments({ user: userId });
    
    // safe < 30, warning 30-60, danger > 60
    const safeScans = await Scan.countDocuments({ user: userId, riskScore: { $lt: 30 } });
    const warningScans = await Scan.countDocuments({ user: userId, riskScore: { $gte: 30, $lte: 60 } });
    const dangerScans = await Scan.countDocuments({ user: userId, riskScore: { $gt: 60 } });

    res.status(200).json({
      totalScans,
      safeScans,
      warningScans,
      dangerScans
    });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
