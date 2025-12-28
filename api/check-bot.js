// Vercel serverless function for server-side bot detection
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userAgent, referer, language, platform } = req.body

  // Bot detection patterns (excluding common browser names)
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'scrape',
    'curl', 'wget', 'python-requests', 'java/', 'perl', 'ruby',
    'go-http-client', 'php', 'node-fetch', 'axios/', 'fetch/',
    'googlebot','google', 'bingbot', 'slurp', 'duckduckbot',
    'baiduspider', 'yandexbot', 'sogou', 'exabot',
    'facebot', 'ia_archiver', 'archive.org',
    'semrush', 'ahrefs', 'mj12bot', 'dotbot',
    'megaindex', 'blexbot', 'petalbot', 'applebot',
    'facebookexternalhit', 'twitterbot', 'linkedinbot',
    'whatsapp', 'telegrambot', 'discordbot', 'slackbot',
    'headlesschrome', 'headless', 'phantomjs', 'selenium', 'webdriver',
    'puppeteer', 'playwright', 'lighthouse', 'gtmetrix', 'pingdom', 'uptimerobot',
    'monitor', 'check', 'test', 'validator',
    'w3c_validator', 'css-validator', 'html-validator',
    'feed', 'rss', 'atom', 'syndication',
    'monitoring', 'uptime', 'ping', 'health',
    'analytics', 'tracking', 'stats'
  ]

  // Check user agent from request headers (more reliable)
  const requestUserAgent = req.headers['user-agent'] || userAgent || ''
  const ua = requestUserAgent.toLowerCase()

  // Check against bot patterns
  let isBot = false
  for (const pattern of botPatterns) {
    if (ua.includes(pattern)) {
      isBot = true
      break
    }
  }

  // Additional checks
  if (!isBot) {
    // Check for headless browser indicators (more specific)
    if (ua.includes('headless') || ua.includes('phantom')) {
      isBot = true
    }

    // Check for missing browser indicators
    // Real browsers have 'mozilla' and a browser engine with version
    const hasBrowserIndicators = 
      ua.includes('mozilla') && 
      (ua.includes('chrome/') || ua.includes('safari/') || ua.includes('firefox/') || ua.includes('edge/') || ua.includes('version/'))
    
    // If no browser indicators and very short UA, likely a bot
    if (!hasBrowserIndicators && ua.length < 30) {
      isBot = true
    }

    // Check for suspicious patterns like standalone browser names
    if (ua === 'chromium' || ua === 'chrome' || ua === 'firefox' || ua === 'safari') {
      isBot = true
    }

    // Check for empty or very short user agent
    if (ua.length === 0) {
      isBot = true
    }
  }

  // Set security headers
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')

  return res.status(200).json({ isBot })
}

