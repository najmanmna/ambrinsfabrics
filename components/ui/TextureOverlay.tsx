"use client";

const TextureOverlay = () => {
  return (
    <div className="fixed inset-0 z-100 pointer-events-none opacity-[0.4] mix-blend-multiply">
      {/* This SVG filter creates a perfect, lightweight noise texture */}
      <svg className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.15" />
      </svg>
    </div>
  );
};

export default TextureOverlay;