import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Mail, Send, Loader2, CheckCircle, AlertCircle, Calendar, MapPin, Phone } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { submitContactForm, generateCSRFToken } from './api/contact';
import { isBackgroundSyncSupported, registerSync } from '../utils/backgroundSync/syncUtils';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  token: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  token: ''
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'offline-queued'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isBackgroundSyncAvailable, setIsBackgroundSyncAvailable] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Generate CSRF token on component mount and check background sync support
  useEffect(() => {
    const token = generateCSRFToken();
    setFormData(prev => ({ ...prev, token }));
    
    // Check if background sync is supported
    setIsBackgroundSyncAvailable(isBackgroundSyncSupported());
    
    // Listen for online/offline events to update UI
    const handleOnline = () => {
      if (submitStatus === 'offline-queued') {
        setSubmitStatus('idle');
        setErrorMessage('You are back online. Your message will be sent automatically.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [submitStatus]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Enhanced client-side validation
    if (!formData.name.trim()) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage('Please enter your email');
      return;
    }

    if (!formData.message.trim()) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage('Please enter your message');
      return;
    }

    if (formData.message.trim().length < 10) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage('Your message is too short (minimum 10 characters)');
      return;
    }

    try {
      if (!navigator.onLine) {
        // We're offline, use background sync if available
        if (isBackgroundSyncAvailable) {
          const success = await registerSync({
            url: '/api/contact',
            method: 'POST',
            body: formData,
            tag: 'contact-form-sync',
            callback: () => {
              // This will be called if the request is immediately successful
              setSubmitStatus('success');
              const token = generateCSRFToken();
              setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                token
              });
            }
          });
          
          if (success) {
            setSubmitStatus('offline-queued');
            // We don't reset the form data here as we want to keep it until sync succeeds
          } else {
            throw new Error('Failed to queue form submission for background sync');
          }
        } else {
          // Background sync not supported, show error
          throw new Error('You are currently offline. Please try again when you have an internet connection.');
        }
      } else {
        // Online submission flow
        const response = await submitContactForm(formData);
        
        if (response.success) {
          setSubmitStatus('success');
          // Reset form but keep the new CSRF token
          const token = generateCSRFToken();
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            token
          });
          
          // Scroll to top of form for success message visibility
          if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize calendar after component mounts
  useEffect(() => {
    if (!calendarRef.current) return;
    
    // Store a reference to the current calendar element for cleanup
    const currentCalendarRef = calendarRef.current;
    
    // This is a placeholder for calendar initialization
    // In a real application, you would initialize your calendar library here
    
    // For demonstration, we're just adding a class to show it's initialized
    currentCalendarRef.classList.add('calendar-initialized');
    
    // Clean up function if needed
    return () => {
      if (currentCalendarRef) {
        currentCalendarRef.classList.remove('calendar-initialized');
      }
    };
  }, []);

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <section className="pt-32 pb-20 relative">
          {/* Background gradient elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-500/10 dark:from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-purple-500/10 dark:from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <ScrollReveal>
                <h1 className="font-space-grotesk text-5xl md:text-7xl font-medium mb-6 relative">
                  <span className="inline-block relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent blur-xl opacity-50">Reach Out</span>
                    <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">Reach Out</span>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300">
                  Have a project in mind or want to learn more about our services? We'd love to hear from you.
                </p>
              </ScrollReveal>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact form */}
                <ScrollReveal>
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
                    {/* Form status messages */}
                    {submitStatus === 'success' && (
                      <div className="absolute inset-0 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center p-8 animate-fade-in z-10">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-2xl font-medium mb-2 text-zinc-900 dark:text-white">Message Sent!</h3>
                        <p className="text-zinc-600 dark:text-zinc-300 text-center mb-6">Thank you for reaching out. We'll get back to you shortly.</p>
                        <button 
                          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                          onClick={() => setSubmitStatus('idle')}
                        >
                          Send Another Message
                        </button>
                      </div>
                    )}

                    {submitStatus === 'offline-queued' && (
                      <div className="absolute inset-0 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center p-8 animate-fade-in z-10">
                        <CheckCircle className="w-16 h-16 text-blue-500 mb-4" />
                        <h3 className="text-2xl font-medium mb-2 text-zinc-900 dark:text-white">Message Saved!</h3>
                        <p className="text-zinc-600 dark:text-zinc-300 text-center mb-6">
                          Your message has been saved and will be sent automatically when you're back online.
                        </p>
                        <button 
                          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                          onClick={() => setSubmitStatus('idle')}
                        >
                          Send Another Message
                        </button>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-red-800 dark:text-red-300 font-medium">There was an error sending your message</h3>
                            <p className="text-red-700 dark:text-red-400 text-sm mt-1">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit}>
                      <input type="hidden" name="token" value={formData.token} />
                      <div className="flex items-center mb-6">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <h2 className="text-2xl font-medium text-zinc-900 dark:text-white">Contact Us</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Subject</label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="How can we help you?"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message</label>
                          <textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Tell us about your project or inquiry..."
                          ></textarea>
                        </div>
                        <div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-500 transition-all flex items-center justify-center"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5 mr-2" />
                                Send Message
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </ScrollReveal>

                {/* Calendar Section */}
                <ScrollReveal delay={200}>
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
                    <div className="flex items-center mb-6">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <h2 className="text-2xl font-medium text-zinc-900 dark:text-white">Schedule a Meeting</h2>
                    </div>
                    
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                      Select a date and time that works for you, and we'll confirm your appointment via email.
                    </p>
                    
                    {/* Calendar placeholder - to be replaced with actual calendar component */}
                    <div 
                      ref={calendarRef} 
                      className="border border-zinc-200 dark:border-zinc-600 rounded-lg min-h-[400px] flex flex-col"
                    >
                      {/* This is a placeholder for demonstration - replace with actual calendar component */}
                      <div className="bg-zinc-50 dark:bg-zinc-700 p-4 border-b border-zinc-200 dark:border-zinc-600">
                        <div className="flex justify-between items-center">
                          <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h3 className="font-medium text-zinc-900 dark:text-white">April 2025</h3>
                          <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-2">
                          <div>Sun</div>
                          <div>Mon</div>
                          <div>Tue</div>
                          <div>Wed</div>
                          <div>Thu</div>
                          <div>Fri</div>
                          <div>Sat</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 p-4">
                        {/* Previous month days */}
                        {[28, 29, 30, 31].map(day => (
                          <button key={`prev-${day}`} className="h-10 w-full rounded-full text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors text-sm">
                            {day}
                          </button>
                        ))}
                        
                        {/* Current month days */}
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                          <button 
                            key={day}
                            className={`h-10 w-full rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                              day === 9 ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-600'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-4 border-t border-zinc-200 dark:border-zinc-600">
                        <h4 className="font-medium mb-2 text-zinc-900 dark:text-white">Available Time Slots</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map(time => (
                            <button 
                              key={time}
                              className="py-2 px-3 border border-zinc-200 dark:border-zinc-600 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        
                        <button className="w-full mt-6 bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                          Confirm Appointment
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                      Note: This is a placeholder calendar. In a production environment, you would integrate with a calendar service like Google Calendar, Calendly, or a custom solution.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
