import React, { useState, useRef, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [answerHeights, setAnswerHeights] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What services does ALAVI offer?",
      answer: (
        <div className="space-y-2">
          <p>We offer a comprehensive range of digital services including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Web Design & Development</li>
            <li>UI/UX Design</li>
            <li>Brand Identity</li>
            <li>Digital Marketing</li>
            <li>Mobile App Development</li>
            <li>E-commerce Solutions</li>
          </ul>
        </div>
      )
    },
    {
      question: "How does your design process work?",
      answer: (
        <div className="space-y-2">
          <p>Our design process follows these key steps:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Discovery:</strong> We learn about your business, goals, and target audience.</li>
            <li><strong>Strategy:</strong> We develop a tailored approach to meet your specific needs.</li>
            <li><strong>Design:</strong> We create visual concepts and prototypes for your review.</li>
            <li><strong>Development:</strong> We build your solution with clean, efficient code.</li>
            <li><strong>Testing:</strong> We ensure everything works flawlessly across all devices.</li>
            <li><strong>Launch:</strong> We deploy your project and provide ongoing support.</li>
          </ol>
        </div>
      )
    },
    {
      question: "What is your typical project timeline?",
      answer: (
        <p>
          Project timelines vary based on scope and complexity. A typical website redesign takes 6-8 weeks, 
          while more complex applications can take 3-6 months. During our initial consultation, 
          we'll provide a detailed timeline tailored to your specific project needs.
        </p>
      )
    },
    {
      question: "Do you work with clients remotely?",
      answer: (
        <p>
          Yes! We work with clients globally and have established efficient remote collaboration processes. 
          We use tools like Figma, Slack, and Zoom to maintain clear communication throughout your project, 
          regardless of location.
        </p>
      )
    },
    {
      question: "How do you handle project pricing?",
      answer: (
        <p>
          We offer both fixed-price and hourly rate options depending on your project needs. 
          For most client projects, we provide a detailed proposal with a fixed price based on your requirements. 
          For ongoing work or projects with evolving scopes, we offer competitive hourly rates. 
          Contact us for a customized quote.
        </p>
      )
    },
    {
      question: "What happens after my project launches?",
      answer: (
        <div className="space-y-2">
          <p>We don't disappear after launch! We offer several post-launch options:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Maintenance Plans:</strong> Regular updates, security patches, and technical support.</li>
            <li><strong>Growth Partnerships:</strong> Ongoing design and development as your business evolves.</li>
            <li><strong>Analytics & Optimization:</strong> Data-driven improvements to enhance performance.</li>
            <li><strong>Training:</strong> We can train your team to manage content and basic site functions.</li>
          </ul>
        </div>
      )
    }
  ];

  // Measure the height of each answer when component mounts and when window resizes
  const updateHeights = useCallback(() => {
    const heights = answerRefs.current.map(ref => ref?.scrollHeight || 0);
    setAnswerHeights(heights);
  }, []);

  useEffect(() => {
    // Initialize the refs array with the correct length
    answerRefs.current = answerRefs.current.slice(0, faqs.length);
    
    // Measure heights after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(updateHeights, 100);
    
    // Set up resize observer for more responsive height calculations
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(updateHeights);
      
      // Observe each answer element
      answerRefs.current.forEach(ref => {
        if (ref) resizeObserverRef.current?.observe(ref);
      });
    }
    
    // Also update heights on window resize as a fallback
    window.addEventListener('resize', updateHeights);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHeights);
      
      // Disconnect the resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [faqs.length, updateHeights]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-32 relative bg-gradient-to-b from-white to-zinc-50">
      <div className="container mx-auto px-5 md:px-10 max-w-6xl">
        {/* Header section with horizontal layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-8 mb-16">
          <ScrollReveal className="lg:col-span-1">
            <div className="lg:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight">
                <span className="inline-block md:inline">Frequently</span>
                <span className="inline-block md:inline"> Asked </span>
                <span className="text-gradient inline-block">Questions</span>
              </h2>
            </div>
          </ScrollReveal>
          
          {/* FAQ accordion section */}
          <div className="lg:col-span-2">
            <ScrollReveal animation="fade-up">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-zinc-50 transition-colors"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <h3 id={`faq-question-${index}`} className="text-lg font-medium text-zinc-900">{faq.question}</h3>
                      <span className={`text-primary ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </button>
                    <div 
                      className={`transition-all duration-300 ease-in-out bg-white overflow-hidden`}
                      style={{ 
                        maxHeight: openIndex === index ? `${answerHeights[index]}px` : '0',
                        opacity: openIndex === index ? 1 : 0
                      }}
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <div 
                        ref={el => answerRefs.current[index] = el} 
                        className="p-5 text-zinc-600 border-t border-zinc-100"
                      >
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-32 mb-24 overflow-hidden">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
              <div className="lg:col-span-7 text-left">
                <h2 className="text-9xl md:text-[12rem] xl:text-[16rem] font-display font-bold tracking-tight leading-[0.8] -ml-2 md:-ml-4">
                  <span className="text-lava">HEY!</span>
                </h2>
              </div>
              <div className="lg:col-span-5 text-left lg:pl-0">
                <p className="text-xl md:text-2xl font-medium text-zinc-800 mb-8 max-w-md">
                  <span className="wave-text">
                    {"What are you waiting for? Let's create something big together.".split(' ').map((word, index) => (
                      <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                        {word}
                      </span>
                    ))}
                  </span>
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-primary to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-primary transition-all duration-500 shadow-md hover:shadow-lg hover:-translate-y-1 btn-animated btn-pulse"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="mr-2">Reach Out</span>
                  <ArrowRight className={`transition-transform duration-300 ease-in-out ${isHovered ? 'translate-x-2' : ''}`} />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
