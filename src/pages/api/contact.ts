// This is a mock API implementation for the contact form in a client-side only application
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

type ContactData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  token?: string; // CSRF token
};

type ResponseData = {
  success: boolean;
  message: string;
};

// Simple in-memory rate limiting (in a real app, this would use Redis or similar)
const ipRequestCounts: Record<string, { count: number; timestamp: number }> = {};
const MAX_REQUESTS = 5; // Max 5 requests per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

// CSRF token cookie name
const CSRF_TOKEN_COOKIE = 'csrf_token';

// Generate a CSRF token
export function generateCSRFToken(): string {
  const token = uuidv4();
  
  // Store token in an HTTP-only cookie with secure flag when possible
  // In a real production app, this would be set by the server with httpOnly: true
  Cookies.set(CSRF_TOKEN_COOKIE, token, { 
    expires: 1, // 1 day
    sameSite: 'strict',
    secure: window.location.protocol === 'https:',
    // Note: js-cookie can't set httpOnly flag as it's client-side
    // In a real app, this would be set by the server
  });
  
  return token;
}

// Verify CSRF token
function verifyCSRFToken(token: string | undefined): boolean {
  if (!token) return false;
  
  // Check against cookie
  const storedToken = Cookies.get(CSRF_TOKEN_COOKIE);
  return token === storedToken;
}

// Check if the request is rate limited
function isRateLimited(ipAddress: string): boolean {
  const now = Date.now();
  const record = ipRequestCounts[ipAddress];
  
  if (!record) {
    ipRequestCounts[ipAddress] = { count: 1, timestamp: now };
    return false;
  }
  
  // Reset count if window has passed
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    ipRequestCounts[ipAddress] = { count: 1, timestamp: now };
    return false;
  }
  
  // Increment count and check if over limit
  record.count++;
  return record.count > MAX_REQUESTS;
}

// Enhanced email validation
function isValidEmail(email: string): boolean {
  // More comprehensive email regex than the basic one
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Enhanced API handler for contact form submissions with security measures
 * In a real application, this would be replaced with an actual API endpoint
 */
export async function submitContactForm(data: ContactData): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Get client IP (in a real app, this would come from the request)
        const clientIP = '127.0.0.1'; // Placeholder
        
        // Check rate limiting
        if (isRateLimited(clientIP)) {
          reject({ 
            success: false, 
            message: 'Too many requests. Please try again later.' 
          });
          return;
        }
        
        // Verify CSRF token
        if (!verifyCSRFToken(data.token)) {
          reject({ 
            success: false, 
            message: 'Invalid or missing security token. Please refresh the page and try again.' 
          });
          return;
        }
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
          reject({ 
            success: false, 
            message: 'Missing required fields' 
          });
          return;
        }
        
        // Validate name length
        if (data.name.length < 2 || data.name.length > 100) {
          reject({ 
            success: false, 
            message: 'Name must be between 2 and 100 characters' 
          });
          return;
        }
        
        // Enhanced email validation
        if (!isValidEmail(data.email)) {
          reject({ 
            success: false, 
            message: 'Invalid email format' 
          });
          return;
        }
        
        // Validate message length
        if (data.message.length < 10 || data.message.length > 5000) {
          reject({ 
            success: false, 
            message: 'Message must be between 10 and 5000 characters' 
          });
          return;
        }
        
        // Sanitize inputs to prevent XSS
        const sanitizedData = {
          name: sanitizeInput(data.name),
          email: sanitizeInput(data.email),
          subject: data.subject ? sanitizeInput(data.subject) : '',
          message: sanitizeInput(data.message)
        };
        
        // Log the submission (in a real app, this would send to a server)
        console.log('Contact form submission:', sanitizedData);
        
        // Generate a new CSRF token for the next submission
        generateCSRFToken();
        
        // Simulate successful submission
        resolve({ 
          success: true, 
          message: 'Thank you for your message! We will get back to you soon.' 
        });
      } catch (error) {
        // Generic error message to avoid exposing implementation details
        reject({ 
          success: false, 
          message: 'An error occurred while processing your request. Please try again later.' 
        });
      }
    }, 1000);
  });
}
