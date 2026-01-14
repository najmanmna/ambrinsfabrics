"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import { Scissors, AlertCircle, Phone, CheckCircle2 } from "lucide-react";

const ReturnPolicyPage = () => {
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
              Policy & Care
            </span>
            <h1 className="font-heading text-4xl md:text-6xl text-ambrins_dark mb-6">
              Exchange & Returns
            </h1>
            <p className="text-ambrins_text/70 text-lg leading-relaxed">
              We want you to love your fabrics. Because every meter is cut specifically for you, we have a tailored policy to ensure fairness and quality.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* --- MAIN POLICY CONTENT --- */}
      <section className="py-20 md:py-28">
        <Container className="max-w-4xl">
          <div className="grid gap-12">

            {/* 1. THE GOLDEN RULE (Cut to Order) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-sm border-l-4 border-ambrins_secondary shadow-sm"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-ambrins_light rounded-full flex items-center justify-center flex-shrink-0">
                   <Scissors className="w-6 h-6 text-ambrins_dark" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-ambrins_dark mb-4">
                    The "Cut-to-Order" Policy
                  </h2>
                  <p className="text-ambrins_text/80 leading-relaxed mb-4">
                    At Ambrins Fabrics, every order is bespoke. When you request a specific length, we cut it from a fresh roll exclusively for you. 
                  </p>
                  <p className="text-ambrins_dark font-medium leading-relaxed">
                    Therefore, we generally <span className="underline decoration-ambrins_secondary/50 underline-offset-4">cannot accept returns or exchanges</span> for fabrics simply due to a change of mind or preference after the fabric has been cut.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2. THE EXCEPTION (Defects) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-sm border border-ambrins_dark/5 shadow-sm"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                   <AlertCircle className="w-6 h-6 text-red-800" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-ambrins_dark mb-4">
                    Defects & Errors
                  </h2>
                  <p className="text-ambrins_text/80 leading-relaxed mb-6">
                    While we inspect every inch before packing, human errors can happen. We will <strong>immediately replace or refund</strong> your order if:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-sm text-ambrins_dark font-medium">
                      <CheckCircle2 className="w-4 h-4 text-ambrins_secondary" />
                      The fabric has a visible manufacturing defect (tears, stains, print errors).
                    </li>
                    <li className="flex items-center gap-3 text-sm text-ambrins_dark font-medium">
                      <CheckCircle2 className="w-4 h-4 text-ambrins_secondary" />
                      You received a different fabric than what you ordered.
                    </li>
                    <li className="flex items-center gap-3 text-sm text-ambrins_dark font-medium">
                      <CheckCircle2 className="w-4 h-4 text-ambrins_secondary" />
                      The length received is significantly shorter than ordered.
                    </li>
                  </ul>
                  <div className="bg-ambrins_light p-4 rounded-sm text-sm text-ambrins_text/70 italic border border-ambrins_dark/5">
                    Note: Slight color variations between the digital screen and actual fabric are natural and are not considered defects.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. HOW TO RESOLVE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-ambrins_dark text-white p-10 rounded-sm shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                   <Phone className="w-6 h-6 text-ambrins_secondary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-white mb-4">
                    How to Request a Correction
                  </h2>
                  {/* UPDATED TEXT HERE */}
                  <p className="text-white/70 leading-relaxed mb-6">
                    If you encounter an issue with your order, please contact our support team immediately. We will review your concern and guide you through the necessary steps.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <a href="tel:+94777212229" className="text-white font-bold hover:text-ambrins_secondary transition-colors flex items-center gap-2">
                       <span className="w-2 h-2 bg-ambrins_secondary rounded-full" /> Call: 077 721 2229
                     </a>
                     <a href="https://wa.me/94777212229" className="text-white font-bold hover:text-ambrins_secondary transition-colors flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full" /> WhatsApp Support
                     </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* --- FOOTER STATEMENT --- */}
      <section className="py-12 border-t border-ambrins_dark/5 text-center">
        <Container className="max-w-2xl">
           <p className="text-ambrins_text/60 italic text-sm">
             We appreciate your understanding of our bespoke cutting process. Every purchase you make supports our commitment to quality and minimal waste.
           </p>
        </Container>
      </section>

    </div>
  );
};

export default ReturnPolicyPage;