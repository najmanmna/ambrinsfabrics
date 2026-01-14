"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ShieldCheck, Lock, Eye, FileText, Mail } from "lucide-react";

const sections = [
  {
    id: "collection",
    title: "1. Information We Collect",
    icon: FileText,
    content: (
      <>
        <p className="mb-4">
          When you visit Ambrins Fabrics or place an order, we may collect specific information to ensure a seamless experience:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-ambrins_text/80 marker:text-ambrins_secondary">
          <li>
            <strong className="text-ambrins_dark">Personal Details:</strong> Your name, shipping address, email, and phone number, provided voluntarily during checkout.
          </li>
          <li>
            <strong className="text-ambrins_dark">Payment Data:</strong> Payment processing is handled securely by our trusted third-party partners (e.g., Payable). Ambrins Fabrics <strong>does not</strong> store your full credit card details or sensitive financial data on our servers.
          </li>
          <li>
            <strong className="text-ambrins_dark">Order History:</strong> We maintain a record of your purchases to assist with returns, exchanges, and future recommendations.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    icon: Eye,
    content: (
      <>
        <p className="mb-4">We use the information collected for the following purposeful actions:</p>
        <ul className="list-disc pl-5 space-y-2 text-ambrins_text/80 marker:text-ambrins_secondary">
          <li>To process orders, coordinate fabric cutting, and manage island-wide delivery.</li>
          <li>To communicate order updates, shipping confirmations, and customer support responses.</li>
          <li>To improve our curated collection based on purchasing trends and customer feedback.</li>
          <li>To detect and prevent fraud, ensuring a secure shopping environment for all patrons.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "3. Information Sharing",
    icon: ShieldCheck,
    content: (
      <>
        <p className="mb-4">
          We respect your privacy as we do our own. We <strong>never</strong> sell, trade, or rent your personal data to advertisers. Information is shared only in strict necessity:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-ambrins_text/80 marker:text-ambrins_secondary">
          <li>
            <strong className="text-ambrins_dark">Service Partners:</strong> We share delivery details with our courier partners and payment data with our payment gateway to fulfill your contract.
          </li>
          <li>
            <strong className="text-ambrins_dark">Legal Compliance:</strong> We may disclose information if required by Sri Lankan law or in response to valid legal processes.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "4. Data Security",
    icon: Lock,
    content: (
      <>
        <p>
          We implement industry-standard security measures (SSL Encryption) to protect your personal information during transmission and storage. While we strive for absolute security, please understand that no method of digital transmission is 100% infallible. We are committed to commercially acceptable means of protecting your data.
        </p>
      </>
    ),
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-ambrins_light min-h-screen">
      
      {/* --- HERO HEADER --- */}
      <section className="pt-32 pb-20 border-b border-ambrins_dark/5">
        <Container className="text-center max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 border border-ambrins_dark/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-ambrins_dark mb-6">
              Legal & Compliance
            </span>
            <h1 className="font-heading text-4xl md:text-6xl text-ambrins_dark mb-6">
              Privacy Policy
            </h1>
            <p className="text-ambrins_text/70 text-lg leading-relaxed">
              At Ambrins Fabrics, your trust is as valuable as our textiles. This document outlines how we collect, safeguard, and use your personal information.
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-ambrins_secondary mt-8">
              Last Updated: January 2026
            </p>
          </motion.div>
        </Container>
      </section>

      {/* --- CONTENT BODY --- */}
      <section className="py-20 md:py-28">
        <Container className="max-w-4xl">
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-ambrins_dark/5 pb-16 last:border-0 last:pb-0"
              >
                {/* Left: Title */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3 mb-2">
                    <section.icon className="w-5 h-5 text-ambrins_secondary" />
                    <h2 className="font-heading text-2xl text-ambrins_dark">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="md:col-span-8 text-ambrins_text/80 leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- FOOTER CONTACT --- */}
      {/* <section className="bg-white py-20 border-t border-ambrins_dark/5">
        <Container className="text-center">
           <h3 className="font-heading text-2xl text-ambrins_dark mb-4">Questions regarding your data?</h3>
           <p className="text-ambrins_text/60 mb-8 max-w-lg mx-auto">
             If you have concerns about our privacy practices or wish to request data deletion, please contact our support team.
           </p>
           <a 
             href="mailto:ambrins.fabricstore@gmail.com" 
             className="inline-flex items-center gap-3 px-8 py-3 bg-ambrins_dark text-white font-bold uppercase tracking-widest text-xs hover:bg-ambrins_secondary transition-colors duration-300"
           >
             <Mail className="w-4 h-4" /> Contact Support
           </a>
        </Container>
      </section> */}

    </div>
  );
};

export default PrivacyPolicyPage;