import { toast } from './use-toast';

// Helper functions for toast notifications
export const toastHelpers = {
  success: (message: string) => {
    return toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },
  
  error: (message: string) => {
    return toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  },
  
  info: (message: string) => {
    return toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  }
};
