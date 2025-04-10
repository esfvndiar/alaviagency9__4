// Server-side implementation for the contact form API
// This would be used in a Next.js API route or similar server-side environment

import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { serialize } from 'cookie';

// Rate limiting with Redis (pseudocode)
// In a real implementation, you would use a Redis client
const rateLimitCheck = async (ip: string): Promise<boolean> => {
  const MAX_REQUESTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  
  // Pseudocode for Redis implementation
  // const count = await redis.incr(`ratelimit:${ip}`);
  // if (count === 1) {
  //   await redis.expire(`ratelimit:${ip}`, Math.floor(WINDOW_MS / 1000));
  // }
  // return count > MAX_REQUESTS;
  
  // Placeholder implementation
  return false;
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Generate CSRF token and set as HTTP-only cookie
const generateCsrfToken = (res: NextApiResponse): string => {
  const token = uuidv4();
  
  // Set HTTP-only cookie
  res.setHeader('Set-Cookie', serialize('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  }));
  
  return token;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Get client IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';
    const clientIP = Array.isArray(ip) ? ip[0] : ip;
    
    // Check rate limiting
    const isRateLimited = await rateLimitCheck(clientIP);
    if (isRateLimited) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    
    // Get data from request body
    const { name, email, subject, message, token } = req.body;
    
    // Verify CSRF token
    const csrfToken = req.cookies.csrf_token;
    if (!csrfToken || csrfToken !== token) {
      return res.status(403).json({
        success: false,
        message: 'Invalid security token. Please refresh the page and try again.'
      });
    }
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 100 characters'
      });
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 5000 characters'
      });
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: subject ? sanitizeInput(subject) : '',
      message: sanitizeInput(message)
    };
    
    // In a real implementation, you would send an email or store in database
    // For example:
    // await sendEmail(sanitizedData);
    // or
    // await db.contacts.create(sanitizedData);
    
    // Generate new CSRF token for next request
    generateCsrfToken(res);
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Generic error message to avoid exposing implementation details
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
}
