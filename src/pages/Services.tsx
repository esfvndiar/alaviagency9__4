import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp, ArrowUpRight, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import ScrollReveal from '../components/ScrollReveal';

interface Feature {
  id: number;
  title: string;
  description: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: Feature[];
  color: string;
  image?: string;
}

const SERVICES: Service[] = [
  {
    id: 1,
    title: "Digital Strategy",
    description: "We help businesses define their digital roadmap and transformation journey with data-driven insights and industry expertise.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: [
      { id: 1, title: "Digital Transformation Roadmap", description: "Comprehensive planning for your organization's digital evolution." },
      { id: 2, title: "Competitive Analysis", description: "In-depth research on market trends and competitor strategies." },
      { id: 3, title: "Technology Stack Recommendations", description: "Expert guidance on selecting the right technologies for your goals." },
      { id: 4, title: "ROI Forecasting", description: "Data-driven predictions on investment returns for digital initiatives." }
    ],
    color: "blue",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "UX/UI Design",
    description: "We create intuitive, engaging, and accessible user experiences that delight users and drive business outcomes.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    features: [
      { id: 1, title: "User Research & Testing", description: "Gathering insights directly from your target audience." },
      { id: 2, title: "Wireframing & Prototyping", description: "Creating interactive models to visualize and test concepts." },
      { id: 3, title: "Visual Design", description: "Crafting beautiful interfaces that align with your brand identity." },
      { id: 4, title: "Accessibility Compliance", description: "Ensuring your digital products are usable by everyone." }
    ],
    color: "purple",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Web Development",
    description: "We build high-performance, scalable web applications using cutting-edge technologies and best practices.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    features: [
      { id: 1, title: "Frontend Development", description: "Creating responsive, interactive user interfaces with modern frameworks." },
      { id: 2, title: "Backend Development", description: "Building robust APIs and server-side applications." },
      { id: 3, title: "E-commerce Solutions", description: "Developing secure, scalable online shopping experiences." },
      { id: 4, title: "CMS Implementation", description: "Setting up content management systems for easy updates." }
    ],
    color: "green",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "We develop native and cross-platform mobile applications that provide seamless experiences across devices.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    features: [
      { id: 1, title: "iOS & Android Development", description: "Building native applications for both major platforms." },
      { id: 2, title: "Cross-Platform Solutions", description: "Developing with React Native or Flutter for multi-platform efficiency." },
      { id: 3, title: "App Store Optimization", description: "Maximizing visibility and downloads in app marketplaces." },
      { id: 4, title: "Mobile UX Design", description: "Creating touch-optimized interfaces for smaller screens." }
    ],
    color: "orange",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "Data Analytics",
    description: "We transform raw data into actionable insights that drive strategic decision-making and business growth.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    features: [
      { id: 1, title: "Business Intelligence", description: "Creating dashboards and reports for data visualization." },
      { id: 2, title: "Predictive Analytics", description: "Using AI and machine learning to forecast trends." },
      { id: 3, title: "Data Integration", description: "Connecting disparate data sources for comprehensive analysis." },
      { id: 4, title: "Custom Analytics Solutions", description: "Building tailored data platforms for specific business needs." }
    ],
    color: "red",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    title: "Digital Marketing",
    description: "We help businesses reach their target audience, build brand awareness, and drive conversions through digital channels.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    features: [
      { id: 1, title: "SEO & Content Strategy", description: "Improving organic visibility and creating valuable content." },
      { id: 2, title: "Paid Advertising", description: "Managing PPC campaigns across search and social platforms." },
      { id: 3, title: "Social Media Marketing", description: "Building brand presence and engagement on social channels." },
      { id: 4, title: "Email Marketing", description: "Designing and executing targeted email campaigns." }
    ],
    color: "yellow",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f5a70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];

const Services: React.FC = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [hoverService, setHoverService] = useState<Service | null>(null);
  const [isInView, setIsInView] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);
  
  const toggleService = (id: number) => {
    setExpandedService(expandedService === id ? null : id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (serviceRef.current) {
      observer.observe(serviceRef.current);
    }

    return () => {
      if (serviceRef.current) {
        observer.unobserve(serviceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector('.snap-x');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollableWidth <= 0) return; // Prevent division by zero
      
      const scrolledPercentage = Math.min(100, Math.max(0, (scrollContainer.scrollLeft / scrollableWidth) * 100));
      
      const progressBar = document.querySelector('.services-progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = `${scrolledPercentage}%`;
      }
    };

    // Initial calculation
    handleScroll();

    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Also recalculate on window resize
    window.addEventListener('resize', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleServiceHover = (entering: boolean, service?: Service) => {
    setIsCursorVisible(entering);
    if (service) {
      setHoverService(service);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
    };
    return colorMap[color] || 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  const getIconColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50',
      red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50',
      yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50'
    };
    return colorMap[color] || 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800';
  };

  const getGradientClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-700',
      purple: 'from-purple-500 to-purple-700',
      green: 'from-green-500 to-green-700',
      orange: 'from-orange-500 to-orange-700',
      red: 'from-red-500 to-red-700',
      yellow: 'from-yellow-500 to-yellow-700'
    };
    return colorMap[color] || 'from-zinc-500 to-zinc-700';
  };

  return (
    <Layout>
      {/* Custom cursor for service hover */}
      {isCursorVisible && hoverService && (
        <div 
          className="fixed pointer-events-none z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
          style={{ 
            left: `${cursorPosition.x}px`, 
            top: `${cursorPosition.y}px`,
            opacity: isCursorVisible ? 1 : 0
          }}
        >
          <div className="bg-zinc-900 dark:bg-zinc-800 text-white rounded-full px-4 py-2 flex items-center text-sm font-medium">
            <span>Explore {hoverService.title}</span>
            <Plus className="ml-1 w-4 h-4" />
          </div>
        </div>
      )}

      <section className="pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto mb-24">
              <h1 className="font-space-grotesk text-6xl md:text-7xl font-medium mb-8 leading-tight text-zinc-900 dark:text-white">
                Innovative <span className="text-gradient">services</span> to transform your digital presence
              </h1>
              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-3xl">
                We offer a comprehensive range of digital solutions designed to help your business thrive in today's competitive landscape.
              </p>
            </div>
          </ScrollReveal>

          {/* Horizontal Scrolling Service Showcase */}
          <div className="relative mb-32" ref={serviceRef}>
            <ScrollReveal>
              <h2 className="text-2xl font-space-grotesk font-medium mb-12 flex items-center text-zinc-900 dark:text-white">
                <span className="w-12 h-[1px] bg-zinc-300 dark:bg-zinc-600 mr-4"></span>
                Our Expertise
              </h2>
            </ScrollReveal>
            
            <div className="relative">
              <div className="flex overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex space-x-6 px-1 min-w-max">
                  {SERVICES.map((service, index) => (
                    <ScrollReveal key={service.id} delay={index * 100} staggered={true}>
                      <div 
                        className="w-[300px] md:w-[350px] flex-shrink-0 snap-center group"
                        onMouseEnter={() => handleServiceHover(true, service)}
                        onMouseLeave={() => handleServiceHover(false)}
                      >
                        <a 
                          href={`#service-${service.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(service.id);
                            const element = document.getElementById(`service-${service.id}`);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="block"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6">
                            {service.image ? (
                              <img 
                                src={service.image} 
                                alt={service.title} 
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(service.color)}`}></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className={`absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center ${getIconColorClass(service.color)}`}>
                              {service.icon}
                            </div>
                          </div>
                          <h3 className="text-2xl font-medium mb-2 group-hover:text-gradient transition-colors duration-300">{service.title}</h3>
                          <p className="text-zinc-600 dark:text-zinc-300 line-clamp-2">{service.description}</p>
                        </a>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="absolute left-0 bottom-0 w-full h-[3px] bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-sm">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 ease-out services-progress-bar"
                  style={{ width: '0%' }}
                ></div>
              </div>

              {/* Add navigation arrows for better UX */}
              <div className="hidden md:flex absolute -left-4 top-1/2 transform -translate-y-1/2">
                <button 
                  onClick={() => {
                    const container = document.querySelector('.snap-x');
                    if (container) {
                      container.scrollBy({ left: -350, behavior: 'smooth' });
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2">
                <button 
                  onClick={() => {
                    const container = document.querySelector('.snap-x');
                    if (container) {
                      container.scrollBy({ left: 350, behavior: 'smooth' });
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-700">
              <div 
                className="h-[3px] bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 ease-in-out"
                style={{ 
                  width: isInView ? '100%' : '0%',
                  opacity: isInView ? 1 : 0
                }}
              ></div>
            </div>
          </div>

          {/* Service Tabs */}
          <div className="mb-12 flex justify-center">
            <ScrollReveal>
              <div className="inline-flex flex-wrap justify-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                {SERVICES.map(service => (
                  <button
                    key={service.id}
                    id={`service-${service.id}`}
                    onClick={() => setActiveTab(service.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      activeTab === service.id 
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Featured Service */}
          {SERVICES.map(service => (
            service.id === activeTab && (
              <div key={service.id} className="max-w-5xl mx-auto mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <ScrollReveal>
                    <div>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${getIconColorClass(service.color)}`}>
                        {service.icon}
                      </div>
                      <h2 className="font-space-grotesk text-3xl md:text-4xl font-medium mb-4 text-zinc-900 dark:text-white">{service.title}</h2>
                      <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-8">{service.description}</p>
                      
                      <ul className="space-y-4 mb-8">
                        {service.features.map(feature => (
                          <li key={feature.id} className="flex items-start">
                            <div className={`mt-1 mr-3 p-1 rounded-full ${getIconColorClass(service.color)}`}>
                              <Check className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-medium">{feature.title}</h3>
                              <p className="text-zinc-600 dark:text-zinc-300">{feature.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <a 
                        href="/contact" 
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-zinc-900 dark:text-zinc-900 dark:bg-zinc-100 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        Get Started <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </div>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={200}>
                    <div className="bg-gradient-to-br from-zinc-100 dark:from-zinc-800 to-zinc-200 dark:to-zinc-700 rounded-3xl p-8 h-full relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getGradientClass(service.color)}`}></div>
                      
                      {/* Service illustration */}
                      <div className="aspect-square rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center overflow-hidden">
                        <img 
                          src={service.image || `https://images.unsplash.com/photo-1581291518633-3f44a563fa4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`} 
                          alt={service.title}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            )
          ))}

          {/* All Services Accordion */}
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="font-space-grotesk text-3xl font-medium mb-12 text-center text-zinc-900 dark:text-white">All Services</h2>
            </ScrollReveal>
            
            <div className="space-y-4">
              {SERVICES.map(service => (
                <ScrollReveal key={service.id} delay={(service.id - 1) * 100} staggered={true}>
                  <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleService(service.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getIconColorClass(service.color)}`}>
                          {service.icon}
                        </div>
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{service.title}</h3>
                      </div>
                      {expandedService === service.id ? (
                        <ChevronUp className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                      )}
                    </button>
                    
                    {expandedService === service.id && (
                      <div className="p-6 pt-0 bg-white dark:bg-zinc-800">
                        <p className="text-zinc-600 dark:text-zinc-300 mb-4">{service.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.features.map(feature => (
                            <div key={feature.id} className={`p-4 rounded-lg border ${getColorClass(service.color)}`}>
                              <h4 className="font-medium mb-1">{feature.title}</h4>
                              <p className="text-sm">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <ScrollReveal>
            <div className="mt-32 max-w-5xl mx-auto text-center">
              <div className="bg-gradient-to-r from-zinc-900 dark:from-zinc-100 to-zinc-800 dark:to-zinc-200 rounded-3xl p-16 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 dark:bg-blue-400 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 dark:bg-purple-400 rounded-full opacity-10 translate-y-1/3 -translate-x-1/3"></div>
                </div>
                
                <div className="relative z-10">
                  <h2 className="font-space-grotesk text-3xl md:text-4xl font-medium mb-4 text-zinc-100 dark:text-zinc-900">Ready to transform your business?</h2>
                  <p className="text-xl text-zinc-300 dark:text-zinc-600 mb-8 max-w-2xl mx-auto">
                    Let's discuss how our services can help you achieve your digital goals and drive growth for your organization.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Start a Conversation
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
