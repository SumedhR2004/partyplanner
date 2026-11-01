/**
 * @fileoverview Vercel serverless function — Gemini AI ideas proxy.
 *
 * Security guarantees:
 *  - API key is read only from process.env; never returned to the client.
 *  - Request body is validated and sanitised before use.
 *  - Simple in-memory per-IP rate limiting (5 requests / 60 s).
 *  - 10-second hard timeout on the upstream Gemini call.
 *  - AI output is validated against a strict schema before forwarding.
 *  - Generic error messages — no stack traces returned.
 */

const ALLOWED_EVENT_TYPES = new Set(['wedding', 'birthday', 'community']);
const MAX_THEME_LENGTH = 200;
const MAX_CITY_LENGTH = 100;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const GEMINI_TIMEOUT_MS = 10_000;

/** Simple in-memory store: ip → { count, resetAt } */
const rateLimitStore = new Map();

/**
 * Check and update the rate limit for a given IP address.
 * @param {string} ip
 * @returns {boolean} true if the request is allowed, false if rate-limited.
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Validate and sanitise the incoming request body.
 * @param {unknown} body
 * @returns {{ valid: boolean, data?: object, error?: string }}
 */
function validateBody(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.' };
  }

  const { eventType, theme, city, budget, guestCount } = body;

  if (!ALLOWED_EVENT_TYPES.has(eventType)) {
    return { valid: false, error: 'Invalid event type.' };
  }

  if (typeof theme !== 'string' || theme.trim().length === 0 || theme.length > MAX_THEME_LENGTH) {
    return { valid: false, error: 'Theme is invalid or too long.' };
  }

  if (typeof city !== 'string' || city.trim().length === 0 || city.length > MAX_CITY_LENGTH) {
    return { valid: false, error: 'City is invalid or too long.' };
  }

  const budgetNum = Number(budget);
  if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
    return { valid: false, error: 'Budget must be a positive number.' };
  }

  const guestNum = Number(guestCount);
  if (!Number.isInteger(guestNum) || guestNum <= 0) {
    return { valid: false, error: 'Guest count must be a positive integer.' };
  }

  return {
    valid: true,
    data: {
      eventType,
      theme: theme.trim().slice(0, MAX_THEME_LENGTH),
      city: city.trim().slice(0, MAX_CITY_LENGTH),
      budget: budgetNum,
      guestCount: guestNum,
    },
  };
}

/**
 * Classify budget into human-readable tiers for the prompt.
 * @param {number} budget - Total budget in INR.
 * @returns {string} Budget tier label.
 */
function getBudgetTier(budget) {
  if (budget < 100_000) return 'budget-friendly (under ₹1L)';
  if (budget < 500_000) return 'mid-range (₹1L–₹5L)';
  if (budget < 2_000_000) return 'premium (₹5L–₹20L)';
  return 'luxury (above ₹20L)';
}

/**
 * Build the Gemini prompt for idea generation.
 * @param {object} data - Validated request data.
 * @returns {string} Prompt string.
 */
function buildPrompt(data) {
  return (
    `You are a creative event planning assistant helping plan a ${data.eventType} ` +
    `in ${data.city} with a ${getBudgetTier(data.budget)} budget for ${data.guestCount} guests. ` +
    `The requested theme or vibe is: "${data.theme}". ` +
    `Provide exactly 5 ideas across these categories: ` +
    `1) decor, 2) food, 3) activities, 4) budget-saving tips, 5) a unique local experience for ${data.city}. ` +
    `Be specific, actionable, and tailored to the theme and budget tier. Keep each idea under 80 words.`
  );
}

/**
 * Validate the shape of parsed AI response.
 * @param {unknown} parsed
 * @returns {boolean}
 */
function isValidIdeasResponse(parsed) {
  if (!parsed || typeof parsed !== 'object') return false;
  if (!Array.isArray(parsed.ideas)) return false;
  if (parsed.ideas.length !== 5) return false;
  return parsed.ideas.every(
    (idea) =>
      idea &&
      typeof idea.category === 'string' &&
      typeof idea.title === 'string' &&
      typeof idea.description === 'string'
  );
}

/**
 * Fetch ideas from the Gemini API with a hard timeout.
 * @param {object} data - Validated request data.
 * @returns {Promise<object>} Parsed ideas response.
 */
async function fetchGeminiIdeas(data) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemInstruction =
    'You are a JSON-only event planning API. ' +
    'Always respond with ONLY valid JSON matching this exact schema, no markdown, no explanation: ' +
    '{"ideas": [{"category": string, "title": string, "description": string}, ...]} ' +
    'The ideas array must contain exactly 5 objects. ' +
    'Categories must be: "Decor", "Food & Drinks", "Activities", "Budget-Saving Tips", "Local Experience".';

  const requestBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [{ parts: [{ text: buildPrompt(data) }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    // Strip potential markdown code fences before parsing
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!isValidIdeasResponse(parsed)) {
      throw new Error('Invalid response schema from Gemini');
    }

    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Main serverless handler.
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Rate limiting
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  // Validate body
  const validation = validateBody(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const ideas = await fetchGeminiIdeas(validation.data);
    return res.status(200).json(ideas);
  } catch (err) {
    // Log server-side only — never expose to client
    if (process.env.NODE_ENV !== 'test') {
      console.error('[api/ideas] Error:', err.message);
    }

    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out. Please try again.' });
    }

    if (err.message === 'GEMINI_API_KEY not configured') {
      return res.status(503).json({ error: 'AI service not configured.' });
    }

    return res.status(500).json({ error: 'Unable to generate ideas. Please try again.' });
  }
}
