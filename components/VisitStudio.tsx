"use client";
import React, { useRef, useState } from "react";
import Container from "./Container";
import bgPattern from "../public/heri2.png";
import borderTile from "../public/line-motif.png";
import { Volume2, VolumeX } from "lucide-react"; // sound icons
import sectionBreak from "../public/sectionBreak.png";

const VisitStudio = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
    id="studio"
      className="relative bg-white py-20 "
      style={{
        backgroundImage: `url(${bgPattern.src})`,
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      
      <div className="absolute -bottom-8 w-full  z-40 ">
        <img
          src={sectionBreak.src}
          alt="Section divider flipped"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/85"></div>

      <Container className="relative z-10 mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-tech_primary">
            VISIT OUR STUDIO
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
          {/* Left: looping reel video with border */}
          <div
            className=" p-[10px] relative"
            style={{
              backgroundImage: `url(${borderTile.src})`,
              backgroundRepeat: "repeat",
              backgroundSize: "10%",
            }}
          >
            <div className="relative">
              <video
                ref={videoRef}
                src="/videos/visitreel.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-[500px] sm:h-[550px] object-cover rounded-sm"
              />

              {/* Mute/Unmute button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
              >
                {isMuted ? (
                  <VolumeX size={18} className="text-white" />
                ) : (
                  <Volume2 size={18} className="text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Right: text and map */}
          <div className="lg:w-1/2 w-full text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-gray-800 text-lg sm:text-xl max-w-md leading-relaxed">
              Experience <b>ELDA Fabrics</b> in person. Touch, feel, and explore
              our curated collection at our Colombo studio.
            </p>

            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-tech_primary mb-2">
                Visit Us At
              </h3>
              <p className="text-gray-700 text-base sm:text-lg">
                Orchard Building (3rd Floor),
                <br />
                7 3/2 B Galle Road, Opposite Savoy Cinema, Colombo 06.
              </p>
              <p className="text-gray-700 text-base sm:text-lg mt-2">
                📞 011 255 3633 | 077 721 2229
              </p>
            </div>

            {/* Google Map */}
            <div className="mt-6 w-full max-w-md h-80 rounded-sm shadow-md overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0956908083413!2d79.85754150834478!3d6.879138493091015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bb8e9f761db%3A0xc7fc450b2350a963!2sElda%20-%20House%20of%20Block%20Prints!5e0!3m2!1sen!2slk!4v1760169870898!5m2!1sen!2slk"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default VisitStudio;
