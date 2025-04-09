import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Mail, Send, Loader2, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { submitContactForm } from './api/contact';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

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

    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    try {
      // Call our mock API implementation
      const response = await submitContactForm(formData);
      
      if (response.success) {
        setSubmitStatus('success');
        setFormData(initialFormData);
        
        // Scroll to top of form for success message visibility
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        throw new Error(response.message);
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
    
    // This is a placeholder for calendar initialization
    // In a real application, you would initialize your calendar library here
    // For example: new FullCalendar.Calendar(calendarRef.current, {...options})
    
    // For demonstration, we're just adding a class to show it's initialized
    calendarRef.current.classList.add('calendar-initialized');
    
    // Clean up function if needed
    return () => {
      if (calendarRef.current) {
        calendarRef.current.classList.remove('calendar-initialized');
      }
    };
  }, []);

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <section className="pt-32 pb-20 relative">
          {/* Background gradient elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
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
                <p className="text-xl md:text-2xl text-zinc-600">
                  Have a project in mind or want to learn more about our services? We'd love to hear from you.
                </p>
              </ScrollReveal>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact form */}
                <ScrollReveal>
                  <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                    {/* Form status messages */}
                    {submitStatus === 'success' && (
                      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 animate-fade-in z-10">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-2xl font-medium mb-2">Message Sent!</h3>
                        <p className="text-zinc-600 text-center mb-6">Thank you for reaching out. We'll get back to you shortly.</p>
                        <button 
                          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                          onClick={() => setSubmitStatus('idle')}
                        >
                          Send Another Message
                        </button>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-red-800 font-medium">There was an error sending your message</h3>
                            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className="flex items-center mb-6">
                        <Mail className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-medium">Contact Us</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Your Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-1">Subject</label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="How can we help you?"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">Message</label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            placeholder="Tell us about your project or inquiry..."
                          ></textarea>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
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
                    </form>
                  </div>
                </ScrollReveal>

                {/* Calendar Section */}
                <ScrollReveal delay={200}>
                  <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                    <div className="flex items-center mb-6">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      <h2 className="text-2xl font-medium">Schedule a Meeting</h2>
                    </div>
                    
                    <p className="text-zinc-600 mb-6">
                      Select a date and time that works for you, and we'll confirm your appointment via email.
                    </p>
                    
                    {/* Calendar placeholder - to be replaced with actual calendar component */}
                    <div 
                      ref={calendarRef} 
                      className="border border-zinc-200 rounded-lg min-h-[400px] flex flex-col"
                    >
                      {/* This is a placeholder for demonstration - replace with actual calendar component */}
                      <div className="bg-zinc-50 p-4 border-b border-zinc-200">
                        <div className="flex justify-between items-center">
                          <button className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h3 className="font-medium">April 2025</h3>
                          <button className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 mt-2">
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
                          <button key={`prev-${day}`} className="h-10 w-full rounded-full text-zinc-400 hover:bg-zinc-100 transition-colors text-sm">
                            {day}
                          </button>
                        ))}
                        
                        {/* Current month days */}
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                          <button 
                            key={day}
                            className={`h-10 w-full rounded-full text-sm hover:bg-blue-100 transition-colors ${
                              day === 9 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-zinc-100'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-4 border-t border-zinc-200">
                        <h4 className="font-medium mb-2">Available Time Slots</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map(time => (
                            <button 
                              key={time}
                              className="py-2 px-3 border border-zinc-200 rounded-md text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        
                        <button className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Confirm Appointment
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 mt-4">
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
