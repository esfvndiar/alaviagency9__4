/**
 * Centralized site configuration
 * This file contains all site-wide configuration values to avoid hardcoding
 * and make updates easier to manage
 */

export const siteConfig = {
  name: 'ALAVI',
  description: 'Digital design and development agency',
  url: 'https://alavi.com',
  
  // Contact information
  contact: {
    email: 'hello@alavi.com',
    phone: '+1 (234) 567-890',
    address: {
      street: '123 Design Street',
      city: 'Creative District',
      state: 'CA',
      zip: '94103',
      country: 'San Francisco'
    }
  },
  
  // Social media links
  social: {
    x: 'https://twitter.com/alaviagency',
    facebook: 'https://facebook.com/alaviagency',
    instagram: 'https://instagram.com/alaviagency',
    github: 'https://github.com/alaviagency',
    linkedin: 'https://linkedin.com/company/alaviagency'
  },
  
  // Navigation links
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Work', href: '/work' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' }
    ],
    footer: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Work', href: '/work' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Legal', href: '/legal' }
    ]
  },
  
  // Theme configuration
  theme: {
    // Custom colors defined in tailwind.config.js
    colors: {
      primary: 'cyberblue',
      secondary: 'mintgreen',
      accent: 'lava'
    },
    // Default dark mode setting
    defaultDarkMode: false
  },
  
  // Form configuration
  forms: {
    contact: {
      // Validation rules
      validation: {
        name: {
          required: true,
          minLength: 2,
          maxLength: 100
        },
        email: {
          required: true,
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        subject: {
          required: false,
          maxLength: 200
        },
        message: {
          required: true,
          minLength: 10,
          maxLength: 5000
        }
      },
      // Success and error messages
      messages: {
        success: 'Thank you for your message! We will get back to you soon.',
        error: 'An error occurred while sending your message. Please try again later.',
        validation: {
          name: 'Please enter a valid name (2-100 characters)',
          email: 'Please enter a valid email address',
          message: 'Please enter a message (10-5000 characters)'
        }
      }
    }
  },
  
  // Service worker configuration
  serviceWorker: {
    enabled: true,
    cacheName: 'alavi-cache-v1',
    offlineUrl: '/offline.html',
    // Assets to cache immediately on service worker install
    precacheAssets: [
      '/',
      '/index.html',
      '/offline.html',
      '/favicon.ico',
      '/assets/images/logo.svg',
      '/assets/images/logo-dark.svg',
      '/assets/fonts/inter-var.woff2',
    ]
  }
};

export default siteConfig;
