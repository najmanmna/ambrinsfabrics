"use client";

import React from "react";

const PrintedBackground = () => {
  return (
    // CHANGE 1: z-[-1] puts it BEHIND everything (like wallpaper)
    // CHANGE 2: Added 'bg-ambrins_light' here to act as the base layer
    <div className="fixed inset-0 z-[-1] h-screen w-screen overflow-hidden bg-ambrins_light">
      
      {/* The Pattern Layer */}
      <div 
        className="absolute inset-0 w-full h-full mix-blend-multiply opacity-[0.1]"
      >
        <div 
          className="absolute inset-0 bg-[url('/bg.jpeg')] bg-repeat bg-[length:250px] md:bg-[length:500px]" 
        />
      </div>

      {/* The Grain Layer (Optional - keeps it looking textured) */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply">
        <svg className="w-full h-full">
          <filter id="paperGrain">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.8" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#paperGrain)" opacity="0.4" />
        </svg>
      </div>

    </div>
  );
};

export default PrintedBackground;