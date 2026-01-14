"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { 
  ArrowRight, Leaf, Stamp, Sun, ExternalLink, 
  MapPin, Phone, Instagram, Facebook 
} from "lucide-react";

// Import images (Ensure these paths exist in your project)
import eldaHeroImg from "@/public/aboutimg1.jpeg"; 
import blockPrintImg from "@/public/aboutimg2.jpeg"; 

// --- SOCIAL ICONS (Custom SVG for TikTok) ---
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.07 3.5 2.87 1.12-.01 2.19-.66 2.74-1.65.51-.91.5-1.98.5-3.02V5.62c0-2.22.01-4.44-.02-6.66-.67.12-1.29.35-1.89.72 0-1.05.02-2.1.02-3.15z" />
  </svg>
);

const EldaShowcasePage = () => {
  return (
    <div className="bg-ambrins_light min-h-screen">
      
      {/* --- 1. CINEMATIC HERO --- */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src={eldaHeroImg} 
            alt="ELDA Block Prints" 
            fill 
            className="object-cover opacity-90 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ambrins_dark/60 via-ambrins_dark/40 to-ambrins_light" />
        </div>

        <Container className="relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block py-1 px-4 border border-white/30 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-6">
              Ambrins Presents
            </span>
            <h1 className="font-heading text-6xl md:text-8xl text-white mb-6 leading-tight">
              ELDA
            </h1>
            <p className="font-serif italic text-2xl md:text-3xl text-white/90 mb-10">
              "The House of Block Prints"
            </p>
            
            <Link 
              href="https://elda.lk" 
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-ambrins_dark font-bold uppercase tracking-widest text-xs hover:bg-ambrins_secondary hover:text-white transition-all duration-300 shadow-xl"
            >
              Shop ELDA Online <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* --- 2. THE STORY --- */}
      <section className="py-24 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-ambrins_secondary" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-ambrins_secondary">
                  The Origin
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl text-ambrins_dark mb-8 leading-tight">
                Empowerment through <br/> Legacy, Design & Artistry.
              </h2>
              <p className="text-ambrins_text/80 text-lg leading-relaxed mb-6">
                While Ambrins has spent 25 years curating the finest international textiles, we felt a calling to return to the roots of craftsmanship. 
              </p>
              <p className="text-ambrins_text/80 text-lg leading-relaxed mb-8">
                <strong>ELDA</strong> was born from this desire. It is our love letter to the ancient art of Indian block printing. Distinct from the main Ambrins collection, ELDA focuses exclusively on eco-friendly, hand-stamped fabrics that tell a story of human touch in a digital world.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8 border-t border-ambrins_dark/10 pt-8">
                 <div>
                    <h4 className="font-heading text-xl text-ambrins_dark mb-2">Sustainable</h4>
                    <p className="text-sm text-ambrins_text/60">Natural dyes and organic cottons.</p>
                 </div>
                 <div>
                    <h4 className="font-heading text-xl text-ambrins_dark mb-2">Hand-Crafted</h4>
                    <p className="text-sm text-ambrins_text/60">Every inch stamped by hand.</p>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] w-full rounded-sm overflow-hidden shadow-2xl"
            >
               <Image 
                 src={blockPrintImg} 
                 alt="Artisan working" 
                 fill 
                 className="object-cover"
               />
               <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-serif italic text-xl">
                    "No two prints are ever exactly the same."
                  </p>
               </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* --- 3. THE CRAFT ICONS --- */}
      <section className="bg-white py-20 border-y border-ambrins_dark/5">
        <Container>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-8 group">
                 <div className="w-16 h-16 mx-auto bg-ambrins_light rounded-full flex items-center justify-center mb-6 text-ambrins_dark group-hover:bg-ambrins_secondary group-hover:text-white transition-colors duration-300">
                    <Stamp className="w-8 h-8" />
                 </div>
                 <h3 className="font-heading text-xl text-ambrins_dark mb-3">Wooden Blocks</h3>
                 <p className="text-ambrins_text/60 text-sm leading-relaxed">Intricate designs hand-carved into teak wood blocks.</p>
              </div>
              <div className="p-8 group">
                 <div className="w-16 h-16 mx-auto bg-ambrins_light rounded-full flex items-center justify-center mb-6 text-ambrins_dark group-hover:bg-ambrins_secondary group-hover:text-white transition-colors duration-300">
                    <Leaf className="w-8 h-8" />
                 </div>
                 <h3 className="font-heading text-xl text-ambrins_dark mb-3">Natural Dyes</h3>
                 <p className="text-ambrins_text/60 text-sm leading-relaxed">Using indigo, turmeric, and pomegranate for earth-friendly hues.</p>
              </div>
              <div className="p-8 group">
                 <div className="w-16 h-16 mx-auto bg-ambrins_light rounded-full flex items-center justify-center mb-6 text-ambrins_dark group-hover:bg-ambrins_secondary group-hover:text-white transition-colors duration-300">
                    <Sun className="w-8 h-8" />
                 </div>
                 <h3 className="font-heading text-xl text-ambrins_dark mb-3">Sun Dried</h3>
                 <p className="text-ambrins_text/60 text-sm leading-relaxed">Fabrics are washed and dried under the Rajasthani sun.</p>
              </div>
           </div>
        </Container>
      </section>

      {/* --- 4. CONNECT & VISIT ELDA --- */}
      <section className="relative py-28 bg-ambrins_dark overflow-hidden">
         {/* Decor */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
         </div>

         <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Contact Info */}
              <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="text-white space-y-8"
              >
                 <h2 className="font-heading text-4xl md:text-5xl mb-6">
                   Visit The ELDA Studio
                 </h2>
                 <p className="text-white/70 text-lg leading-relaxed max-w-md">
                   Immerse yourself in our collection of authentic block prints at our dedicated studio space.
                 </p>

                 <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex items-start gap-4">
                       <MapPin className="w-6 h-6 text-ambrins_secondary mt-1" />
                       <div>
                          <p className="font-bold text-lg text-white">Orchard Building (3rd Floor)</p>
                          <p className="text-white/70">7 3/2 B Galle Road, Colombo 06</p>
                          <p className="text-white/50 text-sm">(Opposite Savoy Cinema)</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <Phone className="w-6 h-6 text-ambrins_secondary mt-1" />
                       <div className="flex flex-col gap-1">
                          <a href="tel:0112553633" className="text-white/80 hover:text-white transition-colors">011 255 3633</a>
                          <a href="tel:0777212229" className="text-white/80 hover:text-white transition-colors">077 721 2229</a>
                       </div>
                    </div>
                 </div>

                 {/* Socials */}
                 <div className="flex items-center gap-4 pt-4">
                    <a href="https://www.instagram.com/elda_houseofblockprints" target="_blank" className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white" aria-label="Instagram">
                       <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.facebook.com/eldaclothinglk" target="_blank" className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white" aria-label="Facebook">
                       <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.tiktok.com/@eldalk" target="_blank" className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white" aria-label="TikTok">
                       <TikTokIcon />
                    </a>
                 </div>
              </motion.div>

              {/* Right: Big CTA Link */}
              <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center justify-center text-center bg-white/5 p-12 rounded-sm border border-white/10"
              >
                 <span className="text-ambrins_secondary uppercase tracking-widest text-xs font-bold mb-4">Online Boutique</span>
                 <h3 className="font-heading text-3xl text-white mb-6">Shop the Collection Online</h3>
                 <p className="text-white/60 text-sm mb-8 max-w-xs">
                   Browse our full range of Dabu, Indigo, and Bagru prints from the comfort of your home.
                 </p>
                 <Link 
                    href="https://elda.lk" 
                    target="_blank"
                    className="group relative px-10 py-5 bg-ambrins_secondary text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-ambrins_dark transition-all duration-300 w-full md:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Go to ELDA.lk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
              </motion.div>

            </div>
         </Container>
      </section>

    </div>
  );
};

export default EldaShowcasePage;