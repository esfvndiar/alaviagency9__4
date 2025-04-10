import React, { useState, useRef, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '../config/site-config';
import { apiClient, ContactFormData } from '../utils/api-client';
import ErrorBoundary from './ErrorBoundary';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout>();

  // Clear any existing timeouts on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const { validation, messages } = siteConfig.forms.contact;
    
    if (!formData.name.trim() || 
        formData.name.length < validation.name.minLength || 
        formData.name.length > validation.name.maxLength) {
      errors.name = messages.validation.name;
    }

    if (!formData.email.trim() || !validation.email.pattern.test(formData.email)) {
      errors.email = messages.validation.email;
    }

    if (formData.subject && formData.subject.length > validation.subject.maxLength) {
      errors.subject = `Subject must be less than ${validation.subject.maxLength} characters`;
    }

    if (!formData.message.trim() || 
        formData.message.length < validation.message.minLength || 
        formData.message.length > validation.message.maxLength) {
      errors.message = messages.validation.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const response = await apiClient.submitContactForm(formData);
      
      if (response.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        
        setSubmitStatus('success');
        setFieldErrors({});
        setErrorMessage('');
        
        if (formRef.current) {
          formRef.current.reset();
        }
        
        // Reset form after success message display
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        throw new Error(response.message || siteConfig.forms.contact.messages.error);
      }
    } catch (error: unknown) {
      setSubmitStatus('error');
      
      // Type guard for ValidationError
      if (
        typeof error === 'object' && 
        error !== null && 
        'name' in error && 
        error.name === 'ValidationError' &&
        'fieldErrors' in error
      ) {
        // Now TypeScript knows error has fields and message properties
        setFieldErrors(error.fieldErrors as Record<string, string>);
        setErrorMessage((error as { message: string }).message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(siteConfig.forms.contact.messages.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetErrors = () => {
    setFieldErrors({});
    setErrorMessage('');
  };

  return (
    <ErrorBoundary componentName="ContactSection">
      <section id="contact-us" className="py-20 md:py-32 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-medium mb-4 text-zinc-900 dark:text-white">
                Get in <span className="text-gradient">Touch</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                Have a project in mind or want to learn more about our services? We'd love to hear from you.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal animation="fade-right">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 md:p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Send className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                            Message sent successfully!
                          </h3>
                          <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                            {siteConfig.forms.contact.messages.success}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Send className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                            There was an error sending your message
                          </h3>
                          <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                            {errorMessage || siteConfig.forms.contact.messages.error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        placeholder="Your name"
                        required
                        minLength={siteConfig.forms.contact.validation.name.minLength}
                        maxLength={siteConfig.forms.contact.validation.name.maxLength}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="What's this about?"
                      maxLength={siteConfig.forms.contact.validation.subject.maxLength}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                      placeholder="Tell us about your project or inquiry"
                      required
                      minLength={siteConfig.forms.contact.validation.message.minLength}
                      maxLength={siteConfig.forms.contact.validation.message.maxLength}
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyberblue to-mintgreen text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 md:p-8 h-full">
                <h3 className="text-xl font-display font-medium mb-6 text-zinc-900 dark:text-white">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-cyberblue" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Email</h4>
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-zinc-600 dark:text-zinc-300 hover:text-cyberblue dark:hover:text-cyberblue transition-colors">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-cyberblue" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Phone</h4>
                      <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="text-zinc-600 dark:text-zinc-300 hover:text-cyberblue dark:hover:text-cyberblue transition-colors">
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-cyberblue" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Address</h4>
                      <p className="text-zinc-600 dark:text-zinc-300">
                        {siteConfig.contact.address.street}<br />
                        {siteConfig.contact.address.city}<br />
                        {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-display font-medium mb-4 text-zinc-900 dark:text-white">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a href={siteConfig.social.x} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors block transform transition-transform duration-200 ease-in-out hover:scale-110">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors block transform transition-transform duration-200 ease-in-out hover:scale-110">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors block transform transition-transform duration-200 ease-in-out hover:scale-110">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ContactSection;
