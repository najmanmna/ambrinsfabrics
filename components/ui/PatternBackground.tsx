import React from "react";

const PatternBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* This is a repeating SVG pattern. 
         It creates a subtle "Jaali" (Lattice) look common in Indian architecture.
      */}
      <svg 
        className="absolute w-full h-full text-ambrins_secondary opacity-[0.03]" 
        width="100%" 
        height="100%"
      >
        <defs>
          <pattern 
            id="motif-pattern" 
            x="0" 
            y="0" 
            width="100" 
            height="100" 
            patternUnits="userSpaceOnUse"
          >
             {/* Simple geometric flower/star shape */}
             <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#motif-pattern)" />
      </svg>

      {/* Optional: A large gradient fade to make sure it's not too busy in the center */}
      <div className="absolute inset-0 bg-gradient-to-b from-ambrins_light via-transparent to-ambrins_light" />
    </div>
  );
};

export default PatternBackground;