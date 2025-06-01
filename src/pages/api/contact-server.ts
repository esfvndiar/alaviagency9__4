// Server-side implementation for the contact form API
// This would be used in a Next.js API route or similar server-side environment

import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { serialize } from "cookie";

// Rate limiting configuration
const MAX_REQUESTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Rate limiting with Redis (pseudocode)
// In a real implementation, you would use a Redis client
const rateLimitCheck = async (ip: string): Promise<boolean> => {
  // Simple in-memory implementation for demonstration
  const requestCounts: Record<string, { count: number; timestamp: number }> =
    {};

  // Clear old entries
  const now = Date.now();
  Object.keys(requestCounts).forEach((key) => {
    if (now - requestCounts[key].timestamp > WINDOW_MS) {
      delete requestCounts[key];
    }
  });

  // Check and update current IP
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, timestamp: now };
    return false;
  }

  requestCounts[ip].count += 1;
  return requestCounts[ip].count > MAX_REQUESTS;
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Generate CSRF token and set as HTTP-only cookie
const generateCsrfToken = (res: NextApiResponse): string => {
  const token = uuidv4();

  // Set HTTP-only cookie
  res.setHeader(
    "Set-Cookie",
    serialize("csrf_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    }),
  );

  return token;
};

// Main handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Get client IP for rate limiting
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

    // Check rate limit
    const isRateLimited = await rateLimitCheck(
      typeof ip === "string" ? ip : "unknown",
    );
    if (isRateLimited) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Verify CSRF token
    const csrfCookie = req.cookies.csrf_token;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({
        success: false,
        message: "CSRF token validation failed",
      });
    }

    // Get form data
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message must be between 10 and 5000 characters",
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      subject: req.body.subject ? sanitizeInput(req.body.subject) : "",
      message: sanitizeInput(req.body.message),
    };

    // In a real implementation, you would send an email or store in database
    // For example:
    // await sendEmail(sanitizedData);
    // or
    // await db.contacts.create(sanitizedData);

    // Log sanitized data for debugging (remove in production)
    console.log("Processing contact form with sanitized data:", {
      name: sanitizedData.name,
      email: sanitizedData.email.substring(0, 3) + "***", // Partially redacted for logs
    });

    // Configure Nodemailer transport (replace with your email service details)

    // Generate new CSRF token for next request
    generateCsrfToken(res);

    // Return success
    return res.status(200).json({
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    // Generic error message to avoid exposing implementation details
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
}
