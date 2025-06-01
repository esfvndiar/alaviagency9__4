import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event: AnalyticsEvent = req.body;
    
    // Validate required fields
    if (!event.name) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    // Add server timestamp
    const enrichedEvent = {
      ...event,
      serverTimestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      referer: req.headers.referer,
    };

    // Log to console (in production, you'd send to your analytics service)
    console.log('Analytics Event:', JSON.stringify(enrichedEvent, null, 2));

    // Here you would typically send to your analytics service:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    // - Custom database
    
    // Example: Send to Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      try {
        await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
          method: 'POST',
          body: JSON.stringify({
            client_id: event.sessionId || 'anonymous',
            events: [{
              name: event.name.replace(/[^a-zA-Z0-9_]/g, '_'), // GA4 event name format
              parameters: event.properties || {}
            }]
          })
        });
      } catch (error) {
        console.error('Failed to send to GA4:', error);
      }
    }

    // Example: Send to PostHog
    if (process.env.POSTHOG_API_KEY) {
      try {
        await fetch('https://app.posthog.com/capture/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: process.env.POSTHOG_API_KEY,
            event: event.name,
            properties: {
              ...event.properties,
              distinct_id: event.userId || event.sessionId || 'anonymous',
              $ip: enrichedEvent.ip,
              $user_agent: enrichedEvent.userAgent,
            },
            timestamp: event.timestamp ? new Date(event.timestamp).toISOString() : undefined,
          })
        });
      } catch (error) {
        console.error('Failed to send to PostHog:', error);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 