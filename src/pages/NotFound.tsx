import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { logError } from '@/lib/error-logging';

const NotFound: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Log error to error tracking service instead of console
    logError({
      type: '404_error',
      message: 'User attempted to access non-existent route',
      data: {
        path: location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    });
  }, [location.pathname]);

  return (
    <Layout>
      <section className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-space-grotesk text-9xl font-medium mb-6 text-zinc-900">404</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mb-10"></div>
          <h2 className="text-3xl font-medium mb-6">Page Not Found</h2>
          <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Return to Homepage
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
