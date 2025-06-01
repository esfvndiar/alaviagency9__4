import React, { useState, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

// Define performance variables outside component to prevent recreation
const ANIMATION_DURATION = 120; // optimized for 120fps (8.33ms per frame, ~14-15 frames)

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Pre-defined array of FAQs for better performance
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
      ),
    },
    {
      question: "How does your design process work?",
      answer: (
        <div className="space-y-2">
          <p>Our design process follows these key steps:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              <strong>Discovery:</strong> We learn about your business, goals,
              and target audience.
            </li>
            <li>
              <strong>Strategy:</strong> We develop a tailored approach to meet
              your specific needs.
            </li>
            <li>
              <strong>Design:</strong> We create visual concepts and prototypes
              for your review.
            </li>
            <li>
              <strong>Development:</strong> We build your solution with clean,
              efficient code.
            </li>
            <li>
              <strong>Testing:</strong> We ensure everything works flawlessly
              across all devices.
            </li>
            <li>
              <strong>Launch:</strong> We deploy your project and provide
              ongoing support.
            </li>
          </ol>
        </div>
      ),
    },
    {
      question: "What is your typical project timeline?",
      answer: (
        <p>
          Project timelines vary based on scope and complexity. A simple website
          might take 2-4 weeks, while a complex web application could take 2-3
          months. During our initial consultation, we'll provide a detailed
          timeline specific to your project needs.
        </p>
      ),
    },
    {
      question: "Do you offer ongoing maintenance and support?",
      answer: (
        <p>
          Yes, we offer various maintenance packages to keep your digital
          products secure, up-to-date, and performing optimally. Our support
          team is available to address any issues and implement updates as
          needed.
        </p>
      ),
    },
    {
      question: "How do you handle project pricing?",
      answer: (
        <div className="space-y-2">
          <p>
            We offer flexible pricing models tailored to your project needs:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Fixed Price:</strong> Predetermined cost for well-defined
              projects.
            </li>
            <li>
              <strong>Time & Materials:</strong> Hourly or daily rates for
              projects with evolving requirements.
            </li>
            <li>
              <strong>Retainer:</strong> Monthly fee for ongoing services and
              support.
            </li>
          </ul>
          <p>
            We provide detailed quotes after understanding your specific
            requirements during the initial consultation.
          </p>
        </div>
      ),
    },
    {
      question: "What makes ALAVI different from other agencies?",
      answer: (
        <div className="space-y-2">
          <p>ALAVI stands out through our:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Strategic Approach:</strong> We focus on business
              outcomes, not just aesthetics.
            </li>
            <li>
              <strong>Technical Excellence:</strong> Our team stays at the
              forefront of technology trends.
            </li>
            <li>
              <strong>Collaborative Process:</strong> We involve clients
              throughout the entire journey.
            </li>
            <li>
              <strong>Ongoing Partnership:</strong> We build lasting
              relationships beyond project completion.
            </li>
            <li>
              <strong>Results-Driven Solutions:</strong> We measure success by
              the impact on your business.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
      className="py-20 md:py-32 relative bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800"
    >
      <div className="container mx-auto px-5 md:px-10 max-w-7xl">
        {/* Header section with horizontal layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-8 mb-16">
          <ScrollReveal className="lg:col-span-1">
            <div className="lg:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-zinc-900 dark:text-white">
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
                    className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm hover:shadow-gpu transition-all duration-120fps transform-gpu"
                    style={{
                      transform: "translate3d(0,0,0)",
                      boxShadow:
                        openIndex === index ? "var(--tw-shadow)" : "none",
                    }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center p-5 text-left bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-120fps"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <h3
                        id={`faq-question-${index}`}
                        className="text-lg font-medium text-zinc-900 dark:text-white"
                      >
                        {faq.question}
                      </h3>
                      <span
                        className="text-primary ml-4 flex-shrink-0 transform transition-120fps will-change-transform"
                        style={{
                          transform:
                            openIndex === index
                              ? "translate3d(0,0,0) rotate(180deg)"
                              : "translate3d(0,0,0) rotate(0deg)",
                          transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.2, 0, 0.2, 1)`,
                        }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </button>
                    <div
                      className="overflow-hidden bg-white dark:bg-zinc-800 will-change-transform will-change-opacity transform-gpu"
                      style={{
                        height: openIndex === index ? "auto" : "0px",
                        opacity: openIndex === index ? 1 : 0,
                        transform: "translate3d(0,0,0)",
                        transition: `all ${ANIMATION_DURATION}ms cubic-bezier(0.2, 0, 0.2, 1)`,
                      }}
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <div
                        className="p-5 text-zinc-600 dark:text-zinc-300 border-t border-zinc-100 dark:border-zinc-700"
                        style={{
                          transform:
                            openIndex === index
                              ? "translate3d(0,0,0)"
                              : "translate3d(0,-10px,0)",
                          transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.2, 0, 0.2, 1)`,
                        }}
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

export default React.memo(FAQSection);
