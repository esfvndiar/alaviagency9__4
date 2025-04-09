// This is a mock API implementation for the contact form in a client-side only application

type ContactData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

type ResponseData = {
  success: boolean;
  message: string;
};

/**
 * Mock API handler for contact form submissions
 * In a real application, this would be replaced with an actual API endpoint
 */
export async function submitContactForm(data: ContactData): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Validate input
        if (!data.name || !data.email || !data.message) {
          reject({ 
            success: false, 
            message: 'Missing required fields' 
          });
          return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          reject({ 
            success: false, 
            message: 'Invalid email format' 
          });
          return;
        }

        // Log the submission (in a real app, this would send to a server)
        console.log('Contact form submission:', data);
        
        // Simulate successful submission
        resolve({ 
          success: true, 
          message: 'Thank you for your message! We will get back to you soon.' 
        });
      } catch (error) {
        console.error('Contact form error:', error);
        reject({ 
          success: false, 
          message: 'An error occurred while processing your request. Please try again later.' 
        });
      }
    }, 800); // Simulate network delay
  });
}
