"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactForm } from "@/lib/contact";
import Container from "@/components/Container";
import { 
  MapPin, Phone, Mail, Clock, 
  ArrowRight, Loader2, CheckCircle2, Sparkles, Send
} from "lucide-react";

// --- CUSTOM SOCIAL ICONS (Consistent with About Page) ---
const SocialIcon = ({ path, viewBox = "0 0 24 24" }: { path: string, viewBox?: string }) => (
  <svg viewBox={viewBox} fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
    <path d={path} />
  </svg>
);

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/elda_houseofblockprints",
    icon: <SocialIcon path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/eldaclothinglk",
    icon: <SocialIcon path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@eldalk",
    icon: <SocialIcon path="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.07 3.5 2.87 1.12-.01 2.19-.66 2.74-1.65.51-.91.5-1.98.5-3.02V5.62c0-2.22.01-4.44-.02-6.66-.67.12-1.29.35-1.89.72 0-1.05.02-2.1.02-3.15z" />
  }
];

// --- STYLES ---
const inputClasses = "w-full bg-white border border-ambrins_dark/20 text-ambrins_dark text-sm rounded-sm px-4 py-3 focus:outline-none focus:border-ambrins_secondary focus:ring-1 focus:ring-ambrins_secondary transition-all placeholder:text-ambrins_text/40";
const labelClasses = "block text-xs font-bold uppercase tracking-widest text-ambrins_secondary mb-2";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen">
      
      {/* --- HEADER --- */}
      <section className="relative pt-32 pb-20 md:pt-32 md:pb-24 px-4 bg-ambrins_light border-b border-ambrins_dark/5">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
               <Sparkles className="w-4 h-4 text-ambrins_secondary" />
               <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
                 At Your Service
               </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-ambrins_dark mb-6">
              Client Concierge
            </h1>
            <p className="text-ambrins_text/70 text-lg max-w-xl mx-auto leading-relaxed">
              Whether you need guidance on a bridal selection or details about our latest shipment, our team is here to assist.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            
            {/* LEFT: Contact Information & Map */}
            <div className="space-y-12">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-sm border border-ambrins_dark/5 shadow-sm hover:shadow-md transition-shadow">
                   <Phone className="w-6 h-6 text-ambrins_secondary mb-4" />
                   <h3 className="font-heading text-xl text-ambrins_dark mb-2">Speak to Us</h3>
                   <div className="space-y-1 text-sm text-ambrins_text/80">
                     <a href="tel:+94112553633" className="block hover:text-ambrins_secondary transition-colors">011 255 3633</a>
                     <a href="https://wa.me/94777212229" className="block hover:text-ambrins_secondary transition-colors">077 721 2229 (WhatsApp)</a>
                   </div>
                </div>

                <div className="bg-white p-8 rounded-sm border border-ambrins_dark/5 shadow-sm hover:shadow-md transition-shadow">
                   <Mail className="w-6 h-6 text-ambrins_secondary mb-4" />
                   <h3 className="font-heading text-xl text-ambrins_dark mb-2">Write to Us</h3>
                   <div className="space-y-1 text-sm text-ambrins_text/80">
                     <a href="mailto:ambrins.fabricstore@gmail.com" className="block hover:text-ambrins_secondary transition-colors break-all">
                       ambrins.fabricstore@gmail.com
                     </a>
                     <span className="text-xs text-ambrins_text/40 block mt-1">Response within 24hrs</span>
                   </div>
                </div>
              </div>

              {/* The Map Card */}
              <div className="bg-white p-2 rounded-sm border border-ambrins_dark/5 shadow-lg shadow-ambrins_dark/5">
                 <div className="relative h-64 w-full bg-ambrins_light overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.978572169826!2d79.85573527579737!3d6.893164993105973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2595ee5f5f993%3A0x627d3b0009477d94!2sOrchard%20Shopping%20Complex!5e0!3m2!1sen!2slk!4v1705234567890!5m2!1sen!2slk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                    />
                 </div>
                 <div className="p-6">
                    <div className="flex items-start gap-4">
                       <MapPin className="w-6 h-6 text-ambrins_secondary mt-1 flex-shrink-0" />
                       <div>
                          <h3 className="font-heading text-xl text-ambrins_dark mb-2">The Atelier</h3>
                          <p className="text-sm text-ambrins_text/80 leading-relaxed mb-4">
                            7, 5 Galle - Colombo Rd, Colombo 00600<br/>
                            Located in: <span className="font-bold text-ambrins_dark">Orchard Shopping Complex</span>
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ambrins_secondary">
                             <Clock className="w-3 h-3" />
                             Open Daily: 10:30 AM - 8:00 PM
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Socials */}
              <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-ambrins_text/40 mb-4 block">Follow Our Journey</span>
                 <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a 
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-12 h-12 rounded-full border border-ambrins_dark/10 text-ambrins_dark hover:bg-ambrins_dark hover:text-white hover:border-ambrins_dark transition-all duration-300 bg-white"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                 </div>
              </div>

            </div>

            {/* RIGHT: The Form */}
            <div className="relative">
               {/* Decorative background element for form */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-ambrins_secondary/5 rounded-full blur-3xl" />
               
               <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl shadow-ambrins_secondary/5 border-t-4 border-ambrins_dark relative z-10">
                  <h2 className="font-heading text-3xl text-ambrins_dark mb-2">Send a Message</h2>
                  <p className="text-ambrins_text/60 mb-8 text-sm">
                    For custom orders, bulk inquiries, or general questions.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-6">
                        <div>
                           <label htmlFor="name" className={labelClasses}>Full Name</label>
                           <input type="text" id="name" name="name" required className={inputClasses} placeholder="Your name" disabled={loading} />
                        </div>
                        <div>
                           <label htmlFor="email" className={labelClasses}>Email Address</label>
                           <input type="email" id="email" name="email" required className={inputClasses} placeholder="name@example.com" disabled={loading} />
                        </div>
                        <div>
                           <label htmlFor="message" className={labelClasses}>How can we help?</label>
                           <textarea id="message" name="message" rows={5} required className={`${inputClasses} resize-none`} placeholder="Tell us about your requirements..." disabled={loading} />
                        </div>
                     </div>

                     {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-sm">
                           {error}
                        </div>
                     )}

                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ambrins_dark hover:bg-ambrins_primary text-white font-body text-xs font-bold uppercase tracking-[0.2em] py-4 shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                     >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                           <>Send Message <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></>
                        )}
                     </button>
                  </form>
               </div>
            </div>

          </div>
        </Container>
      </section>

      {/* --- SUCCESS MODAL --- */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ambrins_dark/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-sm max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
               {/* Gold Accent Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ambrins_dark via-ambrins_secondary to-ambrins_dark" />
               
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
               </div>
               
               <h3 className="font-heading text-3xl text-ambrins_dark mb-2">Message Sent</h3>
               <p className="text-ambrins_text/70 mb-8 leading-relaxed">
                  Thank you for reaching out to Ambrins. We have received your inquiry and will respond shortly.
               </p>
               
               <button 
                 onClick={() => setSuccess(false)}
                 className="w-full bg-ambrins_dark text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-ambrins_primary transition-colors"
               >
                 Close
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ContactPage;