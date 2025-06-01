import React, { useState, useEffect } from "react";
import { AlertCircle, X, CheckCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800 dark:text-green-300";
      case "error":
        return "text-red-800 dark:text-red-300";
      case "info":
      default:
        return "text-blue-800 dark:text-blue-300";
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md rounded-lg shadow-lg border p-4 ${getBgColor()} transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getTextColor()}`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
