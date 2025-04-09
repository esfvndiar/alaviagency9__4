import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowRight, ExternalLink } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  specialty?: string;
}

interface Value {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Emma Alavi",
    role: "Founder & CEO",
    bio: "With over 15 years of experience in digital innovation, Emma leads our company with a vision for transforming how businesses operate in the digital landscape.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    specialty: "Digital Strategy"
  },
  {
    id: 2,
    name: "Alex Chen",
    role: "CTO",
    bio: "Alex brings deep technical expertise in software architecture and emerging technologies, guiding our technical strategy and innovation initiatives.",
    image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },
    specialty: "Architecture"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Design Director",
    bio: "Sarah leads our design team with a passion for creating intuitive, beautiful user experiences that drive engagement and business results.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    specialty: "UX Design"
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    role: "Head of Strategy",
    bio: "Michael combines business acumen with digital expertise to help our clients navigate complex digital transformation challenges.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    social: {
      linkedin: "https://linkedin.com"
    },
    specialty: "Business Strategy"
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Lead Developer",
    bio: "Priya is an expert in modern web technologies, leading our development team in building scalable, high-performance applications.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },
    specialty: "Development"
  },
  {
    id: 6,
    name: "David Kim",
    role: "Marketing Director",
    bio: "David drives our marketing strategy, helping clients build their digital presence and connect with their audiences in meaningful ways.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    specialty: "Marketing"
  }
];

const VALUES: Value[] = [
  {
    id: 1,
    title: "Innovation",
    description: "We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "blue"
  },
  {
    id: 2,
    title: "Excellence",
    description: "We are committed to delivering the highest quality in everything we do, exceeding expectations.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: "purple"
  },
  {
    id: 3,
    title: "Collaboration",
    description: "We believe in the power of teamwork, both within our company and with our clients.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "green"
  },
  {
    id: 4,
    title: "Integrity",
    description: "We operate with transparency, honesty, and ethical practices in all our business dealings.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: "orange"
  }
];

const About: React.FC = () => {
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax effect for team image
  useEffect(() => {
    if (!parallaxRef.current) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const element = parallaxRef.current;
      if (element) {
        element.style.transform = `translateY(${scrollPosition * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
            <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* Hero Section with animated gradient text */}
            <div className="max-w-3xl mx-auto mb-20 text-center">
              <h1 className="font-space-grotesk text-5xl md:text-7xl font-medium mb-6 relative">
                <span className="inline-block relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent blur-xl opacity-50">About Us</span>
                  <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">About Us</span>
                </span>
              </h1>
              <p className="text-xl text-zinc-600 md:text-2xl">
                We're a team of digital innovators passionate about creating exceptional digital experiences that drive business growth.
              </p>
            </div>

            {/* Our Story with parallax effect */}
            <div className="max-w-5xl mx-auto mb-24 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal>
                  <div>
                    <h2 className="font-space-grotesk text-3xl md:text-5xl font-medium mb-6 relative">
                      <span className="inline-block relative">
                        <span className="relative">Our Story</span>
                        <div className="absolute -bottom-2 left-0 h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                      </span>
                    </h2>
                    <p className="text-lg text-zinc-600 mb-6">
                      Founded in 2015, Alavi began with a simple mission: to help businesses navigate the complex digital landscape and harness the power of technology to drive growth and innovation.
                    </p>
                    <p className="text-lg text-zinc-600 mb-6">
                      What started as a small team of passionate digital experts has grown into a full-service digital agency with a global client base. Throughout our journey, we've remained committed to our core values of innovation, excellence, collaboration, and integrity.
                    </p>
                    <p className="text-lg text-zinc-600">
                      Today, we're proud to partner with businesses of all sizes, from startups to Fortune 500 companies, helping them achieve their digital ambitions and stay ahead in an ever-evolving digital world.
                    </p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={200}>
                  <div className="relative">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-70 animate-pulse"></div>
                    <div className="absolute bottom-[10%] -right-10 w-40 h-40 bg-green-100 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div ref={parallaxRef} className="relative z-10">
                      <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="Our team collaborating" 
                        className="w-full h-auto rounded-2xl shadow-xl relative z-10 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Our Values with 3D card effect */}
            <div className="max-w-5xl mx-auto mb-24">
              <ScrollReveal>
                <h2 className="font-space-grotesk text-3xl md:text-5xl font-medium mb-12 text-center relative">
                  <span className="inline-block relative">
                    <span className="relative">Our Values</span>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-purple-600 to-green-600 rounded-full"></div>
                  </span>
                </h2>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {VALUES.map((value, index) => (
                  <ScrollReveal key={value.id} delay={index * 100}>
                    <div 
                      className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 border border-zinc-100 hover:border-zinc-200 transform perspective-1000 hover:-rotate-y-2 hover:rotate-x-2"
                      onMouseEnter={() => setActiveMember(value.id)}
                      onMouseLeave={() => setActiveMember(null)}
                    >
                      <div className={`w-16 h-16 bg-${value.color}-100 rounded-2xl flex items-center justify-center mb-6 text-${value.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                        {value.icon}
                      </div>
                      <h3 className="text-2xl font-medium mb-3 group-hover:text-blue-600 transition-colors duration-300">{value.title}</h3>
                      <p className="text-zinc-600">{value.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Our Team with responsive grid layout */}
            <div className="max-w-6xl mx-auto mb-24">
              <ScrollReveal>
                <h2 className="font-space-grotesk text-3xl md:text-5xl font-medium mb-12 text-center relative">
                  <span className="inline-block relative">
                    <span className="relative">Meet Our Team</span>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
                  </span>
                </h2>
              </ScrollReveal>
              
              <div className="relative">
                <div className="overflow-x-auto pb-8 hide-scrollbar">
                  <div className="flex space-x-6 px-4 max-w-full">
                    {TEAM_MEMBERS.map((member, index) => (
                      <ScrollReveal key={member.id} delay={index * 100}>
                        <div 
                          className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-72 flex-shrink-0 ${activeMember === member.id ? 'ring-2 ring-blue-500' : ''}`}
                          onMouseEnter={() => setActiveMember(member.id)}
                          onMouseLeave={() => setActiveMember(null)}
                        >
                          <div className="relative h-80 overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                              <div className="flex space-x-3 mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                {member.social.linkedin && (
                                  <a 
                                    href={member.social.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                                  >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                  </svg>
                                </a>
                                )}
                                {member.social.twitter && (
                                  <a 
                                    href={member.social.twitter} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                                  >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                  </svg>
                                </a>
                                )}
                                {member.social.github && (
                                  <a 
                                    href={member.social.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                                  >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                  </svg>
                                </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-medium">{member.name}</h3>
                              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{member.specialty}</span>
                            </div>
                            <p className="text-blue-600 mb-4">{member.role}</p>
                            <p className="text-zinc-600 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">{member.bio}</p>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Stats Section with animated counters */}
            <div className="max-w-5xl mx-auto mb-24">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="relative p-12 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ScrollReveal>
                      <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl font-medium mb-2">8+</div>
                        <div className="text-white/80">Years of Experience</div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={100}>
                      <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl font-medium mb-2">200+</div>
                        <div className="text-white/80">Projects Completed</div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={200}>
                      <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl font-medium mb-2">50+</div>
                        <div className="text-white/80">Team Members</div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={300}>
                      <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl font-medium mb-2">15+</div>
                        <div className="text-white/80">Countries Served</div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section with floating elements */}
            <div className="max-w-4xl mx-auto text-center relative">
              <div className="absolute -top-10 left-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-50 animate-float"></div>
              <div className="absolute top-20 right-1/4 w-12 h-12 bg-purple-100 rounded-full opacity-50 animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-10 left-1/3 w-20 h-20 bg-green-100 rounded-full opacity-50 animate-float" style={{animationDelay: '2s'}}></div>
              
              <ScrollReveal>
                <h2 className="font-space-grotesk text-3xl md:text-5xl font-medium mb-6 relative">
                  <span className="inline-block">
                    <span className="relative">Ready to work with us?</span>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  </span>
                </h2>
                <p className="text-xl text-zinc-600 mb-8">
                  We're always looking for new challenges and exciting projects.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href="/contact" 
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    onMouseEnter={() => setActiveMember(999)}
                    onMouseLeave={() => setActiveMember(null)}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative flex items-center">
                      Get in Touch <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </a>
                  <a 
                    href="/work" 
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-zinc-900 bg-white border border-zinc-300 rounded-full hover:border-zinc-400 shadow-sm hover:shadow-md transition-all duration-300"
                    onMouseEnter={() => setActiveMember(998)}
                    onMouseLeave={() => setActiveMember(null)}
                  >
                    <span className="relative flex items-center">
                      View Our Work <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .-rotate-y-2 {
          transform: rotateY(-2deg);
        }
        .rotate-x-2 {
          transform: rotateX(2deg);
        }
      `}</style>
    </Layout>
  );
};

export default About;
