"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// Import FaTiktok
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Mail } from "lucide-react"; // Imported Mail icon for the button

// Import your logo
import eldaLogo from "../../images/eldawhite.png"; 

// Data for the links
const quickLinks = [
  { href: "/", title: "Home" },
  { href: "/about", title: "About Us" },
  // Removed "Contact Us" from here to save space
  { href: "/care-guide", title: "Care Guide" },
  { href: "/terms-and-conditions", title: "Terms & Conditions" },
  { href: "/refund-policy", title: "Exchange & Return Policy" },
  { href: "/privacy-policy", title: "Privacy Policy" },
];

const shopLinks = [
  { href: "/category/fabrics", title: "Fabrics" },
  { href: "/category/clothing", title: "Clothing" },
  { href: "/category/home-and-bedding", title: "Home & Bedding" },
  { href: "/category/accessories", title: "Accessories" },
];

const Footer = () => {
  return (
    // THEME: Use brand colors
    <footer className="bg-tech_primary text-[#FDFBF6] border-t border-[#46627f]">
      <div className="mx-auto max-w-6xl px-4 sm:px-4 ">
        {/* Main Footer Content Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-4">
              <Image
                src={eldaLogo} 
                alt="ELDA - House of Block Prints"
                width={180}
                height={60} 
                className="sm:w-2xl sm:-ml-3" 
              />
            </Link>
            <p className="font-playfair text-md tracking-wider text-gray-300">
              HOUSE OF BLOCK PRINTS
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-5 text-[#A67B5B] uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="hover:text-[#A67B5B] transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Shop */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-5 text-[#A67B5B] uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3 text-gray-300">
              {shopLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="hover:text-[#A67B5B] transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us & Contact */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-5 text-[#A67B5B] uppercase tracking-wider">
              Follow Us
            </h3>
            
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start space-x-4 mb-8">
              <a
                href="https://www.facebook.com/eldaclothinglk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-3 border border-gray-600 rounded-md text-gray-300 hover:border-[#A67B5B] hover:text-[#A67B5B] transition-colors"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/elda_houseofblockprints?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-3 border border-gray-600 rounded-md text-gray-300 hover:border-[#A67B5B] hover:text-[#A67B5B] transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@eldalk?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-3 border border-gray-600 rounded-md text-gray-300 hover:border-[#A67B5B] hover:text-[#A67B5B] transition-colors"
              >
                <FaTiktok size={20} />
              </a>
            </div>

            {/* NEW: Contact Us Button */}
            <h3 className="text-lg font-semibold mb-3 text-[#A67B5B] uppercase tracking-wider">
              Get in Touch
            </h3>
            <Link
              href="/contact"
              className="group flex items-center gap-2 px-6 py-2 border border-[#A67B5B] rounded-md text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white transition-all duration-300"
            >
              <Mail size={18} />
              <span>Contact Us</span>
            </Link>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Credit */}
        <div className="py-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">ELDA</span>. All rights reserved.
          </p>
          <p className="mt-1 text-xs">
            Designed & Developed by{" "}
            <a
              href="https://ahamedwebstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-[#A67B5B] transition-colors"
            >
              Ahamed Web Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;