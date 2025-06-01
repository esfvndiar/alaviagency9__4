import { VercelRequest, VercelResponse } from '@vercel/node';

interface SubscriptionRequest {
  email: string;
  source: string;
  variant: string;
  timestamp: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

// Email validation function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Mock newsletter service integration
// In production, replace this with your actual newsletter service (Mailchimp, ConvertKit, etc.)
const subscribeToNewsletter = async (email: string, source: string): Promise<{ success: boolean; subscriberId?: string; error?: string }> => {
  try {
    // Example integration with Mailchimp API
    // const response = await fetch(`https://us1.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //     tags: [source],
    //     merge_fields: {
    //       SOURCE: source,
    //       SIGNUP_DATE: new Date().toISOString()
    //     }
    //   }),
    // });

    // For now, simulate a successful subscription
    const subscriberId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log subscription for analytics
    console.log(`Newsletter subscription: ${email} from ${source} at ${new Date().toISOString()}`);
    
    return { success: true, subscriberId };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const key = ip;
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  current.count++;
  return true;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    } as SubscriptionResponse);
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] as string || req.headers['x-real-ip'] as string || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      } as SubscriptionResponse);
    }

    // Validate request body
    const { email, source, variant, timestamp }: SubscriptionRequest = req.body;

    if (!email || !source) {
      return res.status(400).json({
        success: false,
        message: 'Email and source are required'
      } as SubscriptionResponse);
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      } as SubscriptionResponse);
    }

    // Check for suspicious patterns (basic spam protection)
    const suspiciousPatterns = [
      /test@test\.com/i,
      /example@example\.com/i,
      /admin@/i,
      /noreply@/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      } as SubscriptionResponse);
    }

    // Subscribe to newsletter
    const result = await subscribeToNewsletter(email, source);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Subscription failed'
      } as SubscriptionResponse);
    }

    // Log successful subscription for analytics
    console.log(`Successful newsletter subscription: ${email} from ${source} (${variant}) at ${timestamp}`);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriberId: result.subscriberId
    } as SubscriptionResponse);

  } catch (error) {
    console.error('Newsletter API error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as SubscriptionResponse);
  }
} 