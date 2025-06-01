import React from "react";
import Layout from "../components/Layout";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
