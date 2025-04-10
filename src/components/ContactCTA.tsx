import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Button } from './ui/button'; // Assuming Button component is available
import { ArrowRight } from 'lucide-react';

interface ContactCTAProps {
  className?: string;
}

const ContactCTA: React.FC<ContactCTAProps> = ({
  className = '',
}) => {
  return (
    <section className={`py-16 md:py-24 bg-zinc-100 dark:bg-zinc-800 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
        <ScrollReveal animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Ready to start your project?
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 mb-8">
            Let's discuss how we can help you achieve your goals.
          </p>
          <Button asChild size="lg" className="group">
            <a href="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactCTA; 