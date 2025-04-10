/**
 * Strongly-typed API client for making requests to backend services
 * Improves type safety and provides consistent error handling
 */

// Common response type for all API requests
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  statusCode?: number;
}

// Contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  token?: string;
}

// Site configuration type
export interface SiteConfigType {
  name: string;
  description: string;
  url: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  features: {
    darkMode: boolean;
    animations: boolean;
    newsletter: boolean;
  };
}

// Error types
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Base fetch function with improved error handling and typing
 */
async function fetchWithErrorHandling<T>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status
      );
    }
    
    return {
      data: data.data || data,
      success: true,
      statusCode: response.status
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError();
    } else {
      throw new ApiError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
}

/**
 * API client with typed methods for different endpoints
 */
export const apiClient = {
  /**
   * Submit contact form data
   */
  submitContactForm: async (formData: ContactFormData): Promise<ApiResponse<void>> => {
    try {
      return await fetchWithErrorHandling<void>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        return {
          success: false,
          message: error.message,
          statusCode: error instanceof ApiError ? error.statusCode : 0
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred',
        statusCode: 500
      };
    }
  },
  
  /**
   * Get site configuration
   * This is a placeholder for future API endpoints
   */
  getSiteConfig: async (): Promise<ApiResponse<SiteConfigType>> => {
    try {
      return await fetchWithErrorHandling<SiteConfigType>('/api/config');
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        return {
          success: false,
          message: error.message,
          statusCode: error instanceof ApiError ? error.statusCode : 0
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred',
        statusCode: 500
      };
    }
  }
};

export default apiClient;
