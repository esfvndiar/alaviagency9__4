# Analytics Monitoring Guide

## Overview

Your application now has a comprehensive analytics system that tracks:
- **User Events**: Page views, interactions, form submissions, feature usage
- **Performance Metrics**: Core Web Vitals (LCP, FID, CLS, TTFB, etc.)
- **Error Reports**: JavaScript errors, component crashes, network failures

## Where to Monitor Analytics Data

### 1. Vercel Function Logs (Primary Method)

#### Real-time Monitoring
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Login to your Vercel account
vercel login

# Follow logs in real-time
vercel logs --follow
```

#### Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Functions** tab
4. Click on any function (`/api/analytics/events`, `/api/analytics/metrics`, `/api/analytics/errors`)
5. View **Logs** section for real-time data

### 2. Built-in Analytics Dashboard

#### Development Mode
- The analytics dashboard is automatically available in development
- Look for the "📊 Analytics" button in the bottom-right corner
- Or press `Ctrl+Shift+A` to toggle the dashboard

#### Production Mode
- Add `<AnalyticsDashboard />` to your App.tsx for production access
- Or create a protected admin route

### 3. Third-Party Analytics Services

#### Google Analytics 4 (Recommended)
1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID and API Secret
3. Add environment variables in Vercel:
   ```
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   GA_API_SECRET=your_api_secret
   ```

#### PostHog (Open Source Alternative)
1. Sign up at [posthog.com](https://posthog.com)
2. Get your API key
3. Add environment variable:
   ```
   POSTHOG_API_KEY=your_api_key
   ```

#### DataDog (Enterprise Monitoring)
1. Sign up at [datadoghq.com](https://datadoghq.com)
2. Get your API key
3. Add environment variable:
   ```
   DATADOG_API_KEY=your_api_key
   ```

### 4. Error Notifications

#### Slack/Discord Webhooks
1. Create a webhook URL in Slack or Discord
2. Add environment variable:
   ```
   ERROR_WEBHOOK_URL=your_webhook_url
   ```
3. Get instant notifications for critical errors

#### Sentry (Error Tracking)
1. Sign up at [sentry.io](https://sentry.io)
2. Get your DSN and API key
3. Add environment variables:
   ```
   SENTRY_DSN=your_dsn
   SENTRY_KEY=your_api_key
   ```

## Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables based on your chosen services:

```bash
# Google Analytics 4
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your_ga4_api_secret

# PostHog
POSTHOG_API_KEY=phc_your_posthog_key

# DataDog
DATADOG_API_KEY=your_datadog_key

# Error Notifications
ERROR_WEBHOOK_URL=https://hooks.slack.com/services/...
SENTRY_DSN=https://your_sentry_dsn
SENTRY_KEY=your_sentry_key
```

## Analytics Data Structure

### Events
```json
{
  "name": "page_view",
  "properties": {
    "path": "/about",
    "title": "About Us",
    "referrer": "https://google.com"
  },
  "timestamp": 1640995200000,
  "sessionId": "session_123",
  "userId": "user_456"
}
```

### Performance Metrics
```json
{
  "name": "LCP",
  "value": 2100,
  "rating": "good",
  "delta": 50,
  "navigationType": "navigate",
  "sessionId": "session_123"
}
```

### Error Reports
```json
{
  "message": "Network request failed",
  "stack": "Error: Network request failed\n    at fetch...",
  "url": "https://yoursite.com/contact",
  "userAgent": "Mozilla/5.0...",
  "timestamp": 1640995200000,
  "sessionId": "session_123"
}
```

## Monitoring Commands

### View Recent Logs
```bash
# View last 100 log entries
vercel logs

# View logs for specific function
vercel logs --function=api/analytics/events

# View logs with timestamps
vercel logs --since=1h
```

### Filter Logs
```bash
# Filter by log level
vercel logs --level=error

# Filter by time range
vercel logs --since=2023-01-01 --until=2023-01-02
```

## Performance Monitoring

### Core Web Vitals Thresholds
- **LCP (Largest Contentful Paint)**: Good < 2.5s, Poor > 4s
- **FID (First Input Delay)**: Good < 100ms, Poor > 300ms
- **CLS (Cumulative Layout Shift)**: Good < 0.1, Poor > 0.25
- **TTFB (Time to First Byte)**: Good < 800ms, Poor > 1.8s

### Setting Up Alerts
1. Use your chosen analytics service's alerting features
2. Set up alerts for:
   - Error rate > 1%
   - LCP > 4 seconds
   - High bounce rate
   - Server errors

## Troubleshooting

### No Data Appearing
1. Check Vercel function logs for errors
2. Verify environment variables are set correctly
3. Ensure analytics is enabled in production
4. Check browser console for client-side errors

### High Error Rates
1. Check error logs in Vercel dashboard
2. Review error webhook notifications
3. Monitor Sentry for detailed error tracking
4. Check network connectivity issues

### Performance Issues
1. Monitor Core Web Vitals in real-time
2. Use browser DevTools Performance tab
3. Check Vercel function execution times
4. Review image optimization and caching

## Best Practices

1. **Privacy Compliance**: Ensure GDPR/CCPA compliance with cookie consent
2. **Data Retention**: Set appropriate data retention policies
3. **Sampling**: Use sampling for high-traffic sites to reduce costs
4. **Security**: Never log sensitive user data (passwords, PII)
5. **Performance**: Monitor analytics overhead on page performance

## Support

For issues with:
- **Vercel Functions**: Check [Vercel Documentation](https://vercel.com/docs/functions)
- **Analytics Setup**: Review this guide or check service-specific docs
- **Performance**: Use browser DevTools and Core Web Vitals reports

---

**Quick Start**: Deploy your changes to Vercel, then run `vercel logs --follow` to see analytics data in real-time! 