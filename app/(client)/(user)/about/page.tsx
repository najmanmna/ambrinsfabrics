"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { 
  Feather, Gem, 
  Layers, Sun, Wind, CheckCircle2, ArrowRight, MapPin, Scissors, Sparkles
} from "lucide-react";

import fabricimage from "@/images/Hands touching luxury lace fabric.png"

// --- DATA ---
const fabricCategories = [
  {
    title: "The Essentials",
    description: "Pure Cotton, Linen, Viscose, Poplin, Muslin & Lycra blends.",
    icon: Layers,
  },
  {
    title: "Royal Silks",
    description: "Raw Silk, Armani, Bridal Satin, Charmause, Organza & Valentina.",
    icon: Gem,
  },
  {
    title: "Embellished",
    description: "Cutlawn, Mirror Work, Embroidered Denim & intricate Laces.",
    icon: Feather,
  },
  {
    title: "Heritage Brocades",
    description: "Heavy Banarasi & Silk Brocades for ceremonial grandeur.",
    icon: Sun,
  },
  {
    title: "Evening Wear",
    description: "Sequins, Shimmer Silk, Lame, and Flowing Georgettes.",
    icon: Wind, 
  },
];

const stats = [
  { label: "Years of Excellence", value: "25+" },
  { label: "Fabric Varieties", value: "500+" },
  { label: "Sourcing Countries", value: "08" },
];

// --- SOCIAL ICONS (Custom SVGs for consistency) ---
const SocialIcon = ({ path, viewBox = "0 0 24 24" }: { path: string, viewBox?: string }) => (
  <svg 
    viewBox={viewBox} 
    fill="currentColor" 
    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
  >
    <path d={path} />
  </svg>
);

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com", // Replace with actual link
    icon: <SocialIcon path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  },
  {
    name: "Facebook",
    url: "https://facebook.com", // Replace with actual link
    icon: <SocialIcon path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  },
  {
    name: "TikTok",
    url: "https://tiktok.com", // Replace with actual link
    icon: <SocialIcon path="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.07 3.5 2.87 1.12-.01 2.19-.66 2.74-1.65.51-.91.5-1.98.5-3.02V5.62c0-2.22.01-4.44-.02-6.66-.67.12-1.29.35-1.89.72 0-1.05.02-2.1.02-3.15z" />
  }
];

// --- COMPONENTS ---

const SectionHeader = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-[1px] w-12 bg-ambrins_secondary" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-ambrins_secondary">
        {label}
      </span>
    </div>
    <h2 className="font-heading text-4xl md:text-5xl text-ambrins_dark leading-tight">
      {title}
    </h2>
  </div>
);

const AboutPage = () => {
  return (
    <div className=" min-h-screen overflow-hidden">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
           {/* Abstract Pattern SVG */}
           <svg width="100%" height="100%">
             <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        <Container className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block py-1 px-3 border border-ambrins_dark/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-ambrins_dark mb-6">
              Est. 2000 — Colombo, Sri Lanka
            </span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-ambrins_dark leading-[0.9] mb-8">
              Weave Your <br />
              <span className="text-ambrins_text/40 italic font-serif">Unique Story.</span>
            </h1>
            <p className="text-lg md:text-xl text-ambrins_text/80 max-w-2xl leading-relaxed font-light">
              For 25 years, Ambrins has been the quiet curator behind Colombo’s most 
              breathtaking outfits. We don't just sell fabric; we provide the canvas for your confidence.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* --- 2. THE NARRATIVE (Split Scroll) --- */}
      <section className="py-20 border-t border-ambrins_dark/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Sticky Image */}
            <div className="relative h-[500px] lg:h-[600px] w-full rounded-sm overflow-hidden lg:sticky lg:top-32">
               <div className="absolute inset-0 bg-[#E8E4DC]">
                  <Image 
                    src={fabricimage} 
                    alt="Fabric Texture"
                    fill
                    className="object-cover opacity-80"
                  />
               </div>
               {/* Overlay Badge */}
               <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 max-w-xs shadow-lg border-l-4 border-ambrins_secondary">
                  <p className="font-heading text-xl text-ambrins_dark italic">
                    "We take fabrics seriously."
                  </p>
               </div>
            </div>

            {/* Scrolling Text */}
            <div className="space-y-16 lg:pt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <SectionHeader label="Our Legacy" title="A Quarter Century of Curating Beauty" />
                <p className="text-ambrins_text/80 leading-loose mb-6">
                  It started as a family passion. Today, it is a legacy. Our journey began over 25 years ago with a simple belief: 
                  <strong> Fabric has the power to transform.</strong>
                </p>
                <p className="text-ambrins_text/80 leading-loose">
                  We understand that the right drape, the perfect weave, and the correct texture can change how a person feels. From sourcing intricate hand-blocks from Jaipur to the finest silks from the Orient, our collection is a labor of love, curated to empower you to create outfits that fit perfectly and tell unique stories.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-ambrins_dark/10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <h3 className="font-heading text-4xl text-ambrins_secondary mb-2">{stat.value}</h3>
                    <p className="text-xs uppercase tracking-widest text-ambrins_dark">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* --- 3. THE MANIFESTO (Dark Section) --- */}
      <section className="bg-ambrins_dark text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Scissors className="w-64 h-64 rotate-12" />
        </div>
        <Container className="relative z-10 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
             <Sparkles className="w-8 h-8 text-ambrins_secondary mx-auto mb-8" />
             <h2 className="font-heading text-4xl md:text-6xl leading-tight mb-8 text-white">
               "The fabric is the soul <br/> of the garment."
             </h2>
             <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
               This is not just our tagline; it's our commitment. Whether you are a bride looking for the perfect satin, a designer seeking rare block prints, or simply crafting your daily wear, we promise quality that speaks for itself.
             </p>
             <Link 
               href="/shop" 
               className="inline-flex items-center gap-3 px-8 py-4 border border-ambrins_secondary text-ambrins_secondary font-bold uppercase tracking-widest text-xs hover:bg-ambrins_secondary hover:text-ambrins_dark transition-all duration-300"
             >
               Explore the Collection <ArrowRight className="w-4 h-4" />
             </Link>
           </motion.div>
        </Container>
      </section>

      {/* --- 4. THE MATERIAL ARCHIVE (Grid) --- */}
      <section className="py-24 ">
        <Container>
          <SectionHeader label="The Archive" title="Our Fabric Library" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ambrins_dark/10 border border-ambrins_dark/10">
            {fabricCategories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 hover:bg-ambrins_light/30 transition-colors duration-500 group"
              >
                <div className="w-12 h-12 bg-ambrins_light rounded-full flex items-center justify-center mb-6 group-hover:bg-ambrins_secondary/20 transition-colors">
                  <cat.icon className="w-5 h-5 text-ambrins_dark group-hover:text-ambrins_secondary transition-colors" />
                </div>
                <h3 className="font-heading text-2xl text-ambrins_dark mb-3">{cat.title}</h3>
                <p className="text-ambrins_text/70 text-sm leading-relaxed mb-6 h-12">
                  {cat.description}
                </p>
                <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ambrins_dark group-hover:text-ambrins_secondary transition-colors">
                  View Fabrics <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- 5. LOCATION & FOOTER --- */}
      <section className="py-20 text-center bg-ambrins_light border-t border-ambrins_dark/5">
        <Container>
           
           <div className="max-w-2xl mx-auto mb-12">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ambrins_dark/5 text-ambrins_dark mb-6">
                <MapPin className="w-6 h-6" />
             </div>
             <h2 className="font-heading text-3xl text-ambrins_dark mb-4">Visit The Atelier</h2>
             <p className="text-lg text-ambrins_dark font-medium mb-1">
                7, 5 Galle - Colombo Rd, Colombo 00600
             </p>
             <p className="text-ambrins_text/60 text-sm">
                Located in: Orchard Shopping Complex
             </p>
           </div>

           {/* <div className="flex flex-col md:flex-row justify-center gap-6 text-sm text-ambrins_dark font-medium mb-12">
              <span className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-ambrins_secondary" /> Ample Parking</span>
              <span className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-ambrins_secondary" /> Expert Consultation</span>
              <span className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-ambrins_secondary" /> Cutting Service</span>
           </div> */}

           {/* Socials */}
           <div className="flex items-center justify-center gap-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-10 h-10 rounded-full border border-ambrins_dark/20 text-ambrins_dark hover:bg-ambrins_dark hover:text-white hover:border-ambrins_dark transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
           </div>

        </Container>
      </section>

    </div>
  );
};

export default AboutPage;