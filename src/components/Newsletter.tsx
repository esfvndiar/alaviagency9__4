import React, { useState } from "react";
import { Mail, Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAnalytics } from "../utils/analytics";

interface NewsletterProps {
  variant?: "default" | "compact" | "sidebar";
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
  variant = "default",
  className = "",
  title = "Stay Updated",
  description = "Get the latest insights, tips, and updates delivered straight to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const analytics = useAnalytics();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Email address is required");
      setStatus("error");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Track subscription attempt
      analytics.track("newsletter_subscription_attempted", {
        email: email,
        variant: variant,
        source: "newsletter_component",
      });

      // Simulate API call - replace with your actual newsletter service
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          source: "website",
          variant: variant,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Subscription failed");
      }

      const data = await response.json();

      setStatus("success");
      setEmail("");

      // Track successful subscription
      analytics.track("newsletter_subscribed", {
        email: email,
        variant: variant,
        source: "newsletter_component",
        subscriber_id: data.subscriberId,
      });

      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");

      // Track subscription error
      analytics.track("newsletter_subscription_failed", {
        email: email,
        variant: variant,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      // Reset error state after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return {
          container: "flex items-center gap-2",
          content: "flex-1",
          form: "flex gap-2",
          input: "flex-1 px-3 py-2 text-sm",
          button: "px-4 py-2 text-sm",
        };
      case "sidebar":
        return {
          container: "space-y-4",
          content: "space-y-2",
          form: "space-y-3",
          input: "w-full px-3 py-2 text-sm",
          button: "w-full px-4 py-2 text-sm",
        };
      default:
        return {
          container: "text-center space-y-6",
          content: "space-y-4",
          form: "flex flex-col sm:flex-row gap-3 max-w-md mx-auto",
          input: "flex-1 px-4 py-3",
          button: "px-6 py-3",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Content */}
      <div className={styles.content}>
        {variant !== "compact" && (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {title}
              </h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
          </>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === "loading"}
            className={`${styles.input} border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            aria-label="Email address for newsletter subscription"
          />

          {/* Status Icons */}
          {status === "success" && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
          {status === "error" && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`${styles.button} bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          aria-label="Subscribe to newsletter"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Subscribing...</span>
            </>
          ) : status === "success" ? (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Subscribed!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{buttonText}</span>
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
          <Check className="w-4 h-4" />
          <span>
            Thank you for subscribing! Check your email for confirmation.
          </span>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Privacy Notice */}
      {variant !== "compact" && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      )}
    </div>
  );
};

export default Newsletter;
