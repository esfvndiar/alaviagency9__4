import React, { useState, useRef, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [answerHeights, setAnswerHeights] = useState<number[]>([]);
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
          Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, 
          while a complex web application could take 2-3 months. During our initial consultation, 
          we'll provide a detailed timeline specific to your project needs.
        </p>
      )
    },
    {
      question: "Do you offer ongoing maintenance and support?",
      answer: (
        <p>
          Yes, we offer various maintenance packages to keep your digital products secure, 
          up-to-date, and performing optimally. Our support team is available to address any 
          issues and implement updates as needed.
        </p>
      )
    },
    {
      question: "How do you handle project pricing?",
      answer: (
        <div className="space-y-2">
          <p>
            We offer flexible pricing models tailored to your project needs:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fixed Price:</strong> Predetermined cost for well-defined projects.</li>
            <li><strong>Time & Materials:</strong> Hourly or daily rates for projects with evolving requirements.</li>
            <li><strong>Retainer:</strong> Monthly fee for ongoing services and support.</li>
          </ul>
          <p>
            We provide detailed quotes after understanding your specific requirements during the initial consultation.
          </p>
        </div>
      )
    },
    {
      question: "What makes ALAVI different from other agencies?",
      answer: (
        <div className="space-y-2">
          <p>
            ALAVI stands out through our:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Strategic Approach:</strong> We focus on business outcomes, not just aesthetics.</li>
            <li><strong>Technical Excellence:</strong> Our team stays at the forefront of technology trends.</li>
            <li><strong>Collaborative Process:</strong> We involve clients throughout the entire journey.</li>
            <li><strong>Ongoing Partnership:</strong> We build lasting relationships beyond project completion.</li>
            <li><strong>Results-Driven Solutions:</strong> We measure success by the impact on your business.</li>
          </ul>
        </div>
      )
    }
  ];

  // Update heights when window resizes or content changes
  const updateHeights = useCallback(() => {
    const newHeights = answerRefs.current.map(ref => ref?.scrollHeight || 0);
    setAnswerHeights(newHeights);
  }, []);

  // Initialize heights and set up resize observer
  useEffect(() => {
    // Initialize heights
    updateHeights();

    // Set up resize observer to update heights when content changes
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(updateHeights);
      
      answerRefs.current.forEach(ref => {
        if (ref) {
          resizeObserverRef.current?.observe(ref);
        }
      });
    }

    // Update heights on window resize
    window.addEventListener('resize', updateHeights);

    return () => {
      // Clean up
      window.removeEventListener('resize', updateHeights);
      
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
      </div>
    </section>
  );
};

export default FAQSection;
