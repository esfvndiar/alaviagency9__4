interface ErrorData {
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

// This could be replaced with any error tracking service like Sentry, LogRocket, etc.
export function logError(error: ErrorData): void {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Tracking]:", error);
    return;
  }

  // In production, you would send this to your error tracking service
  // Example with Sentry:
  // Sentry.captureException(new Error(error.message), {
  //   tags: { type: error.type },
  //   extra: error.data
  // });
}
