import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
  sessionId?: string;
  userId?: string;
  timestamp?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metric: PerformanceMetric = req.body;
    
    // Validate required fields
    if (!metric.name || typeof metric.value !== 'number') {
      return res.status(400).json({ error: 'Metric name and value are required' });
    }

    // Add server timestamp and metadata
    const enrichedMetric = {
      ...metric,
      serverTimestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      referer: req.headers.referer,
    };

    // Log to console (in production, you'd send to your monitoring service)
    console.log('Performance Metric:', JSON.stringify(enrichedMetric, null, 2));

    // Here you would typically send to your monitoring service:
    // - Google Analytics 4 (for Core Web Vitals)
    // - DataDog
    // - New Relic
    // - Sentry Performance
    // - Custom monitoring solution

    // Example: Send Core Web Vitals to Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      const coreWebVitals = ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'];
      
      if (coreWebVitals.includes(metric.name)) {
        try {
          await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
            method: 'POST',
            body: JSON.stringify({
              client_id: metric.sessionId || 'anonymous',
              events: [{
                name: 'web_vitals',
                parameters: {
                  metric_name: metric.name,
                  metric_value: metric.value,
                  metric_rating: metric.rating,
                  metric_delta: metric.delta,
                  navigation_type: metric.navigationType,
                }
              }]
            })
          });
        } catch (error) {
          console.error('Failed to send Core Web Vitals to GA4:', error);
        }
      }
    }

    // Example: Send to DataDog (if you have DataDog setup)
    if (process.env.DATADOG_API_KEY) {
      try {
        await fetch('https://api.datadoghq.com/api/v1/series', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'DD-API-KEY': process.env.DATADOG_API_KEY,
          },
          body: JSON.stringify({
            series: [{
              metric: `web.performance.${metric.name.toLowerCase()}`,
              points: [[Math.floor(Date.now() / 1000), metric.value]],
              tags: [
                `rating:${metric.rating}`,
                `navigation_type:${metric.navigationType || 'unknown'}`,
                `user_agent:${req.headers['user-agent']?.split(' ')[0] || 'unknown'}`,
              ],
            }]
          })
        });
      } catch (error) {
        console.error('Failed to send to DataDog:', error);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Performance metric error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 