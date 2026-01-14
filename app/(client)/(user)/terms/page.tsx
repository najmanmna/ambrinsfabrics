"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import { 
  Scale, FileText, ShoppingBag, Truck, 
  CreditCard, ShieldAlert, Gavel, MousePointer2 
} from "lucide-react";

const termsSections = [
  {
    id: "use",
    title: "1. Use of Our Services",
    icon: MousePointer2,
    content: (
      <>
        <p className="mb-4">
          By accessing the Ambrins Fabrics website, you agree to be bound by these terms. You confirm that you are at least 18 years of age or accessing the site under the supervision of a parent or guardian.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-ambrins_text/80 marker:text-ambrins_secondary">
          <li>You agree not to use our products for any illegal or unauthorized purpose.</li>
          <li>You must not transmit any worms, viruses, or any code of a destructive nature.</li>
          <li>A breach or violation of any of the Terms will result in an immediate termination of your Services.</li>
        </ul>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "2. Accuracy & Colors",
    icon: FileText,
    content: (
      <>
        <p className="mb-4">
          We have made every effort to display as accurately as possible the colors and images of our fabrics. However, we cannot guarantee that your computer monitor's display of any color will be accurate.
        </p>
        <p className="text-ambrins_text/80">
          We reserve the right to limit the sales of our products or Services to any person, geographic region, or jurisdiction. We may exercise this right on a case-by-case basis.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    title: "3. Billing & Cancellations",
    icon: CreditCard,
    content: (
      <>
        <p className="mb-4">
          We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
        </p>
        <p className="text-ambrins_dark font-medium">
          <strong>Important:</strong> Once a fabric has been cut to your specific length requirements, the order cannot be cancelled or modified.
        </p>
      </>
    ),
  },
  {
    id: "shipping",
    title: "4. Shipping & Delivery",
    icon: Truck,
    content: (
      <>
        <p className="mb-4">
          Delivery times are estimates and start from the date of shipping, rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-ambrins_text/80 marker:text-ambrins_secondary">
          <li>Ambrins Fabrics is not responsible for delays caused by customs clearance or courier service interruptions.</li>
          <li>Risk of loss transfers to you upon delivery of the goods to the carrier.</li>
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    title: "5. Limitation of Liability",
    icon: ShieldAlert,
    content: (
      <>
        <p>
          In no case shall Ambrins Fabrics, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind arising from your use of any of the service or any products procured using the service.
        </p>
      </>
    ),
  },
  {
    id: "governing",
    title: "6. Governing Law",
    icon: Gavel,
    content: (
      <>
        <p>
          These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Sri Lanka.
        </p>
      </>
    ),
  },
];

const TermsAndConditionsPage = () => {
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
              Terms & Conditions
            </h1>
            <p className="text-ambrins_text/70 text-lg leading-relaxed">
              Please read these terms carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.
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
            {termsSections.map((section, idx) => (
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
           <h3 className="font-heading text-2xl text-ambrins_dark mb-4">Questions about the Terms?</h3>
           <p className="text-ambrins_text/60 mb-8 max-w-lg mx-auto">
             If you require clarification regarding our terms of service, please contact us directly.
           </p>
           <a 
             href="mailto:ambrins.fabricstore@gmail.com" 
             className="inline-flex items-center gap-3 px-8 py-3 bg-ambrins_dark text-white font-bold uppercase tracking-widest text-xs hover:bg-ambrins_secondary transition-colors duration-300"
           >
             <Scale className="w-4 h-4" /> Contact Legal Team
           </a>
        </Container>
      </section> */}

    </div>
  );
};

export default TermsAndConditionsPage;