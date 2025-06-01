import React, { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";
import Layout from "../components/Layout";

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"privacy" | "imprint">("privacy");

  return (
    <Layout>
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-display font-medium mb-8 text-zinc-900 dark:text-white">
              Legal Information
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mb-8 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`pb-4 relative ${
                    activeTab === "privacy"
                      ? "text-primary dark:text-primary-foreground font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Privacy Policy
                  {activeTab === "privacy" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-foreground"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("imprint")}
                  className={`pb-4 relative ${
                    activeTab === "imprint"
                      ? "text-primary dark:text-primary-foreground font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Imprint
                  {activeTab === "imprint" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-foreground"></span>
                  )}
                </button>
              </div>
            </div>

            {activeTab === "privacy" && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h2>Privacy Policy</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>
                    [IMPORTANT: Please insert your full Privacy Policy text
                    here.]
                  </strong>
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  This section should detail how you collect, use, store, and
                  protect user data, information about cookies, user rights
                  (access, rectification, erasure), third-party services, and
                  contact information for privacy-related inquiries. Ensure
                  compliance with relevant regulations like GDPR, CCPA, etc.
                </p>
                {/* Add more paragraphs or sections as needed for your specific policy */}
              </div>
            )}

            {activeTab === "imprint" && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h2>Imprint / Legal Notice</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>
                    [IMPORTANT: Please insert your full Imprint/Legal Notice
                    text here.]
                  </strong>
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  This section typically includes:
                  <ul>
                    <li>Company Name and Legal Form</li>
                    <li>Full Address</li>
                    <li>
                      Contact Information (Email, Phone, Fax if applicable)
                    </li>
                    <li>Managing Director(s) or Legal Representative(s)</li>
                    <li>
                      Commercial Register Information (Register Court, Register
                      Number)
                    </li>
                    <li>VAT Identification Number (if applicable)</li>
                    <li>
                      Responsible person for content (if applicable, e.g., for
                      journalistic content)
                    </li>
                    <li>
                      Information regarding professional regulations (if
                      applicable)
                    </li>
                    <li>Dispute Resolution Information</li>
                  </ul>
                  Ensure all legally required information for your jurisdiction
                  is included.
                </p>
                {/* Add more details as needed for your specific Imprint */}
              </div>
            )}
          </ScrollReveal>
        </div>
      </main>
    </Layout>
  );
};

export default Legal;
