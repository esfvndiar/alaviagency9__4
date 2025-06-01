import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../utils/analytics';

interface AnalyticsData {
  events: Array<{
    name: string;
    count: number;
    lastSeen: string;
  }>;
  metrics: Array<{
    name: string;
    value: number;
    rating: string;
    timestamp: string;
  }>;
  errors: Array<{
    message: string;
    count: number;
    lastSeen: string;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    events: [],
    metrics: [],
    errors: []
  });
  const [isVisible, setIsVisible] = useState(false);
  const analytics = useAnalytics();

  // Mock data for demonstration (in production, this would fetch from your analytics API)
  useEffect(() => {
    const mockData: AnalyticsData = {
      events: [
        { name: 'page_view', count: 156, lastSeen: '2 minutes ago' },
        { name: 'user_interaction', count: 89, lastSeen: '5 minutes ago' },
        { name: 'form_submission', count: 12, lastSeen: '1 hour ago' },
        { name: 'feature_usage', count: 34, lastSeen: '30 minutes ago' },
      ],
      metrics: [
        { name: 'LCP', value: 2.1, rating: 'good', timestamp: '2 minutes ago' },
        { name: 'FID', value: 85, rating: 'good', timestamp: '3 minutes ago' },
        { name: 'CLS', value: 0.08, rating: 'good', timestamp: '1 minute ago' },
        { name: 'TTFB', value: 650, rating: 'good', timestamp: '4 minutes ago' },
      ],
      errors: [
        { message: 'Network request failed', count: 3, lastSeen: '1 hour ago' },
        { message: 'Component render error', count: 1, lastSeen: '2 hours ago' },
      ]
    };
    setData(mockData);
  }, []);

  // Keyboard shortcut to toggle dashboard (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsVisible(!isVisible);
        analytics.track('analytics_dashboard_toggled', { visible: !isVisible });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, analytics]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
          title="Open Analytics Dashboard (Ctrl+Shift+A)"
        >
          📊 Analytics
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Events */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📈 Events
              </h3>
              <div className="space-y-3">
                {data.events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {event.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.lastSeen}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {event.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚡ Performance
              </h3>
              <div className="space-y-3">
                {data.metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {metric.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {metric.timestamp}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {metric.name === 'CLS' ? metric.value.toFixed(3) : 
                         metric.name.includes('FID') || metric.name.includes('LCP') || metric.name.includes('TTFB') ? 
                         `${metric.value}ms` : metric.value}
                      </div>
                      <div className={`text-xs font-medium ${
                        metric.rating === 'good' ? 'text-green-600' :
                        metric.rating === 'needs-improvement' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metric.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🚨 Errors
              </h3>
              <div className="space-y-3">
                {data.errors.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No errors reported 🎉
                  </div>
                ) : (
                  data.errors.map((error, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {error.message}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {error.lastSeen}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-red-600 dark:text-red-400 ml-2">
                        {error.count}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📋 How to Monitor Analytics
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• <strong>Vercel Functions:</strong> Check function logs in Vercel dashboard</p>
              <p>• <strong>Real-time:</strong> Use <code>vercel logs --follow</code> in terminal</p>
              <p>• <strong>Google Analytics:</strong> Set GA_MEASUREMENT_ID and GA_API_SECRET env vars</p>
              <p>• <strong>PostHog:</strong> Set POSTHOG_API_KEY env var</p>
              <p>• <strong>Webhooks:</strong> Set ERROR_WEBHOOK_URL for Slack/Discord notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 