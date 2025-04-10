import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout';
import { MessageSquare, Users, Lightbulb, Heart, Rocket, Award } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import ContactCTA from '../components/ContactCTA';

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
      <div className="min-h-screen relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 w-screen h-full min-h-full" />
        <div className="absolute -top-20 -left-20 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-cyberblue/10 dark:bg-cyberblue/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-mintgreen/10 dark:bg-mintgreen/20 rounded-full blur-[120px]" />
        <div className="absolute top-3/4 left-1/3 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px]" />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-fluid-3xl font-display font-bold mb-6 text-center relative">
                <span className="inline-block relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent blur-xl opacity-50">About ALAVI</span>
                  <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">About ALAVI</span>
                </span>
              </h1>
              <p className="text-fluid-lg text-zinc-700 dark:text-zinc-300 mb-12 text-center leading-relaxed">
                We're a team of passionate designers and developers creating exceptional digital experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-fluid-2xl font-display font-semibold mb-6 relative">
                  <span className="inline-block relative">
                    <span className="relative">Our Mission</span>
                    <div className="absolute -bottom-2 left-0 h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  </span>
                </h2>
                <p className="text-fluid-base text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                  At ALAVI, we believe in the power of technology to transform businesses and enhance lives. Our mission is to create digital solutions that are not only visually stunning but also intuitive, accessible, and impactful.
                </p>
                <p className="text-fluid-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  We combine strategic thinking with technical expertise to deliver results that exceed expectations. Whether you're a startup looking to make your mark or an established brand seeking digital transformation, we're here to help you succeed.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl -z-10"></div>
                <div className="absolute -top-5 -left-5 w-20 h-20 border-l-4 border-t-4 border-cyberblue opacity-70" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24 bg-zinc-50/80 dark:bg-zinc-800/30 rounded-3xl my-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-fluid-2xl font-display font-semibold mb-6 relative">
                <span className="inline-block relative">
                  <span className="relative">Our Values</span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-purple-600 to-green-600 rounded-full"></div>
                </span>
              </h2>
              <p className="text-fluid-base text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
                These core principles guide everything we do, from how we work with clients to how we build our products.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {VALUES.map((value) => (
                <div 
                  key={value.id} 
                  className="group team-card bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-xl overflow-hidden transition-all duration-500 ease-in-out will-change-transform hover:shadow-2xl hover:-translate-y-2 h-[300px] flex flex-col hover:bg-gradient-to-br hover:from-white hover:via-white hover:to-blue-50 dark:hover:from-zinc-800 dark:hover:via-zinc-800 dark:hover:to-blue-900/20"
                  onMouseEnter={() => setActiveMember(value.id)}
                  onMouseLeave={() => setActiveMember(null)}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-medium mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{value.title}</h3>
                  <p className="team-card-bio text-zinc-600 dark:text-zinc-400 transition-all duration-500 ease-in-out max-h-[4.5rem] group-hover:max-h-[200px] overflow-y-auto pr-1">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-fluid-2xl font-display font-semibold mb-6 relative">
                <span className="inline-block relative">
                  <span className="relative">Meet Our Team</span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </span>
              </h2>
              <p className="text-fluid-base text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
                We're a diverse group of creative thinkers, problem solvers, and digital craftspeople.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-5xl h-[500px] bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-3xl -z-10"></div>
              </div>
              
              <div className="py-12">
                <div className="flex overflow-x-auto pb-8 px-4 scrollbar-hide snap-x snap-mandatory">
                  <div className="flex space-x-6 md:space-x-8">
                    {TEAM_MEMBERS.map((member) => (
                      <div 
                        key={member.id} 
                        className={`team-card bg-white dark:bg-zinc-800 rounded-xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out will-change-transform hover:shadow-2xl hover:-translate-y-2 w-72 h-[500px] flex-shrink-0 flex flex-col group ${activeMember === member.id ? 'ring-2 ring-blue-500' : ''}`}
                        onMouseEnter={() => setActiveMember(member.id)}
                        onMouseLeave={() => setActiveMember(null)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex justify-center space-x-4">
                            {member.social.linkedin && (
                              <a 
                                href={member.social.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300"
                                aria-label={`${member.name}'s LinkedIn`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                            )}
                            {member.social.twitter && (
                              <a 
                                href={member.social.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300"
                                aria-label={`${member.name}'s Twitter`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M23.953 4.57a10 10 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </a>
                            )}
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col transition-all duration-500 ease-in-out group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-medium group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">{member.name}</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors duration-300 ease-in-out">{member.specialty}</span>
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 mb-4 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 ease-in-out">{member.role}</p>
                          <div className="relative overflow-hidden flex-grow">
                            <p className="team-card-bio text-zinc-600 dark:text-zinc-400 transition-all duration-500 ease-in-out max-h-[4.5rem] group-hover:max-h-[200px] overflow-y-auto pr-1">
                              {member.bio}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - replace with new component */}
        <ContactCTA 
          variant="gradient"
          title="Ready to work with us?"
          subtitle="We're always looking for new challenges and exciting projects."
          buttonText="Get in Touch"
          buttonIcon="arrow-up-right"
          className="container mx-auto px-4 sm:px-6 max-w-5xl"
        />
      </div>
    </Layout>
  );
};

export default About;
