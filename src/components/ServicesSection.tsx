import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Web Design',
      description: 'Crafting visually stunning, user-centered interfaces that engage and convert.',
      link: '#contact'
    },
    {
      title: 'Web Development',
      description: 'Building robust, scalable web applications with modern technologies.',
      link: '#contact'
    },
    {
      title: 'Mobile Apps',
      description: 'Creating intuitive, high-performance applications for iOS and Android.',
      link: '#contact'
    },
    {
      title: 'Branding',
      description: 'Developing cohesive brand identities that resonate with your audience.',
      link: '#contact'
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-5 md:px-10 max-w-6xl">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-display font-medium mb-16 tracking-tight">
            <span className="inline-block mr-3">Our</span>
            <span className="text-gradient inline-block">Services</span>
          </h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 md:gap-y-16">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={100 * index} animation="fade-up">
              <div className="group">
                <div className="mb-4 md:mb-6 overflow-hidden">
                  <span className="text-6xl font-display font-medium text-gradient transition-transform duration-500 inline-block group-hover:-translate-y-2">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                
                <h3 className="text-2xl font-display font-medium mb-3 text-zinc-900 dark:text-white">{service.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mb-6">{service.description}</p>
                
                <a 
                  href={service.link} 
                  className="inline-flex items-center text-sm text-zinc-900 dark:text-zinc-100 hover:text-primary dark:hover:text-primary transition-colors line-animation"
                >
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
