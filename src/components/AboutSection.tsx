import React from "react";
import { CheckCircle, Users, Award, Clock } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AnimatedText from "./AnimatedText";

const AboutSection: React.FC = () => {
  const stats = [
    { icon: Users, value: "150+", label: "Clients" },
    { icon: Award, value: "200+", label: "Projects" },
    { icon: Clock, value: "10+", label: "Years Experience" },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32 relative bg-white dark:bg-zinc-900 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 w-screen h-full min-h-full" />
      <div className="absolute -top-20 -left-20 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-cyberblue/10 dark:bg-cyberblue/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-20 -right-20 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-mintgreen/10 dark:bg-mintgreen/20 rounded-full blur-[120px]" />
      <div className="absolute top-3/4 left-1/3 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal animation="fade-right" threshold={0.2}>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-cyberblue to-mintgreen opacity-80 dark:opacity-90 absolute inset-0 z-0 w-full h-full" />
                <div className="p-10 md:p-16 relative z-10">
                  <h3 className="text-2xl md:text-4xl font-display font-bold text-zinc-900 dark:text-white mb-4 animated-gradient-text">
                    Who We Are
                  </h3>

                  <p className="text-zinc-700 dark:text-zinc-100 mb-6">
                    A team of passionate digital experts committed to delivering
                    exceptional results. With over a decade of experience, we
                    combine creativity with technical expertise to build
                    solutions that drive growth.
                  </p>

                  <div className="space-y-3">
                    {[
                      "Innovative Solutions",
                      "Client-Focused Approach",
                      "Technical Excellence",
                      "Creative Design",
                    ].map((item, index) => (
                      <ScrollReveal
                        key={index}
                        animation="fade-up"
                        delay={100 * (index + 1)}
                      >
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-zinc-700 dark:text-white">
                            {item}
                          </span>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-5 -left-5 w-20 h-20 border-l-4 border-t-4 border-cyberblue opacity-70 dark:opacity-90" />
              <div className="absolute -bottom-5 -right-5 w-20 h-20 border-r-4 border-b-4 border-mintgreen opacity-70 dark:opacity-90" />
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal animation="fade-left" delay={200}>
              <div className="mb-4 inline-flex items-center space-x-2 py-1 px-3 rounded-full bg-white/10 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/10 dark:border-zinc-700/50">
                <span className="text-sm font-medium animated-gradient-text">
                  Our Story
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-3xl md:text-5xl font-display font-medium mb-6 tracking-tight">
                  <span className="inline-block mr-3 text-zinc-900 dark:text-white">
                    About
                  </span>
                  <span className="text-gradient">ALAVI</span>
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-200 mb-6 max-w-2xl">
                  Driven by a passion for design and code, our team builds
                  impactful digital experiences tailored to achieve your
                  business goals.
                </p>
                <p className="text-zinc-600 dark:text-zinc-200 mb-8 max-w-2xl">
                  With expertise in web design, development, and digital
                  strategy, we collaborate closely with businesses to bring
                  their vision to life through innovative solutions.
                </p>
              </div>

              <ScrollReveal delay={0.1}>
                <AnimatedText
                  text="We are a full-service IT agency specializing in creating exceptional digital experiences. Our expertise spans web design, development, mobile applications, marketing, and strategic consulting."
                  className="text-lg text-zinc-600 dark:text-zinc-200 mb-6"
                />
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <AnimatedText
                  text="full-service IT agency"
                  el="h2"
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-zinc-900 dark:text-white tracking-tighter leading-tight"
                  data-testid="animated-heading"
                />
              </ScrollReveal>
              <p className="text-zinc-600 dark:text-zinc-200">
                Our approach combines technical excellence with creative
                innovation to deliver solutions that not only meet but exceed
                client expectations. We believe in collaborative partnerships
                and transparent communication throughout every project.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={400}>
              <div className="grid grid-cols-3 gap-6 mt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <ScrollReveal
                      key={index}
                      animation="rotate"
                      delay={200 * (index + 1)}
                    >
                      <div className="text-center p-4 rounded-xl bg-white/5 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/10 dark:border-zinc-700/50">
                        <Icon className="w-8 h-8 mx-auto mb-2 text-gradient" />
                        <div className="text-2xl md:text-3xl font-bold animated-gradient-text">
                          {stat.value}
                        </div>
                        <div className="text-zinc-500 dark:text-zinc-400">
                          {stat.label}
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
