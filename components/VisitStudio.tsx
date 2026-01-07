import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

// REPLACE THIS with your actual shop photo
import SHOP_IMAGE from "@/images/visitstudio.png";

// --- SVG: Mandala Watermark ---
const MandalaWatermark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
     <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" />
  </svg>
);

const VisitStudio = () => {
  return (
    <section className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-ambrins_dark">
      
      {/* --- Background: Image with Warm Overlay --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src={SHOP_IMAGE} 
          alt="Ambrins Fabrics Flagship Store" 
          fill
          className="object-cover"
          placeholder="blur"
        />
        {/* Warm Gradient Overlay for the "Indian Luxury" feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-ambrins_dark/90 via-ambrins_dark/40 to-transparent mix-blend-multiply" />
      </div>

      {/* --- Overlay Content: The "Invitation Card" --- */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <div className="relative bg-ambrins_light max-w-2xl w-full text-center shadow-2xl p-2 md:p-3 rounded-sm">
            
            {/* Inner Border (The 'Card' look) */}
            <div className="border border-ambrins_dark/20 p-8 md:p-12 relative overflow-hidden">
                
                {/* Mandala Watermark (Decorative) */}
                <div className="absolute -top-10 -right-10 text-ambrins_secondary/10 w-40 h-40 animate-spin-slow">
                    <MandalaWatermark className="w-full h-full" />
                </div>
                <div className="absolute -bottom-10 -left-10 text-ambrins_secondary/10 w-40 h-40 animate-spin-slow">
                    <MandalaWatermark className="w-full h-full" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                        <MapPin className="w-6 h-6 text-ambrins_primary animate-bounce" />
                    </div>

                    <span className="block font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase mb-4">
                        — You are Invited
                    </span>

                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-ambrins_dark mb-6 leading-tight">
                        Experience Texture <br /> <span className="italic text-ambrins_primary">in Person.</span>
                    </h2>

                    <p className="font-body text-ambrins_text/80 text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto">
                        Visit our flagship studio in the heart of Colombo&apos;s textile hub. Touch the silks, see the true colors under natural light, and consult with our master curators.
                    </p>

                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-3 bg-ambrins_primary text-white font-body text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-full shadow-lg hover:bg-ambrins_dark hover:shadow-xl transition-all duration-300"
                    >
                        Plan Your Visit
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Ornate Corner Accents (CSS Borders) */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ambrins_secondary"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-ambrins_secondary"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-ambrins_secondary"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ambrins_secondary"></div>
            </div>
        </div>
      </div>

    </section>
  );
};

export default VisitStudio;