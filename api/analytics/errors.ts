import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ErrorReport {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  componentStack?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const errorReport: ErrorReport = req.body;
    
    // Validate required fields
    if (!errorReport.message) {
      return res.status(400).json({ error: 'Error message is required' });
    }

    // Add server timestamp and metadata
    const enrichedError = {
      ...errorReport,
      serverTimestamp: new Date().toISOString(),
      serverUserAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      referer: req.headers.referer,
    };

    // Log to console (in production, you'd send to your error tracking service)
    console.error('Error Report:', JSON.stringify(enrichedError, null, 2));

    // Here you would typically send to your error tracking service:
    // - Sentry
    // - Bugsnag
    // - Rollbar
    // - LogRocket
    // - Custom error tracking

    // Example: Send to Sentry (if you have Sentry DSN)
    if (process.env.SENTRY_DSN) {
      try {
        // This is a simplified example - in practice you'd use the Sentry SDK
        await fetch(`${process.env.SENTRY_DSN}/api/store/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${process.env.SENTRY_KEY}`,
          },
          body: JSON.stringify({
            message: errorReport.message,
            level: 'error',
            platform: 'javascript',
            timestamp: errorReport.timestamp / 1000,
            exception: {
              values: [{
                type: 'Error',
                value: errorReport.message,
                stacktrace: errorReport.stack ? {
                  frames: errorReport.stack.split('\n').map(line => ({
                    filename: errorReport.filename,
                    function: line.trim(),
                    lineno: errorReport.lineno,
                    colno: errorReport.colno,
                  }))
                } : undefined
              }]
            },
            user: {
              id: errorReport.userId,
              ip_address: enrichedError.ip,
            },
            tags: {
              session_id: errorReport.sessionId,
              component_stack: errorReport.componentStack,
            },
            extra: {
              url: errorReport.url,
              userAgent: errorReport.userAgent,
              referer: enrichedError.referer,
            }
          })
        });
      } catch (error) {
        console.error('Failed to send to Sentry:', error);
      }
    }

    // Example: Send to a webhook (Slack, Discord, etc.)
    if (process.env.ERROR_WEBHOOK_URL) {
      try {
        const severity = errorReport.stack ? '🔴 Critical' : '🟡 Warning';
        const message = `${severity} Error Report\n\n` +
          `**Message:** ${errorReport.message}\n` +
          `**URL:** ${errorReport.url}\n` +
          `**User Agent:** ${errorReport.userAgent}\n` +
          `**Session:** ${errorReport.sessionId}\n` +
          `**Timestamp:** ${new Date(errorReport.timestamp).toISOString()}\n` +
          (errorReport.stack ? `**Stack:** \`\`\`${errorReport.stack.substring(0, 500)}\`\`\`` : '');

        await fetch(process.env.ERROR_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: message,
            username: 'Error Reporter',
            icon_emoji: ':warning:',
          })
        });
      } catch (error) {
        console.error('Failed to send to webhook:', error);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error reporting error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 