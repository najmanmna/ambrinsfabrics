"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// Import FaTiktok
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

// Import your logo - **IMPORTANT**: Update this path to your actual logo file
import eldaLogo from "../../images/eldawhite.png"; // Assuming this path is correct relative to src

// Data for the links, making it easy to manage
const quickLinks = [
  { href: "/", title: "Home" },
  { href: "/about", title: "About Us" },
  { href: "/care-guide", title: "Care Guide" },
  { href: "/terms-and-conditions", title: "Terms & Conditions" },
  // Corrected link spelling
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
                src={eldaLogo} // Use the imported logo
                alt="ELDA - House of Block Prints"
                width={180}
                height={60} // Adjust height if needed based on logo aspect ratio
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

          {/* Column 4: Follow Us */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-5 text-[#A67B5B] uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-4"> {/* Adjusted spacing */}
              <a
                href="https://www.facebook.com/eldaclothinglk" // Updated URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                // THEME: Updated icon styling
                className="p-3 border border-gray-600 rounded-md text-gray-300 hover:border-[#A67B5B] hover:text-[#A67B5B] transition-colors"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/elda_houseofblockprints?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" // Updated URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                // THEME: Updated icon styling
                className="p-3 border border-gray-600 rounded-md text-gray-300 hover:border-[#A67B5B] hover:text-[#A67B5B] transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              {/* Added TikTok Link */}
              <a
                href="https://www.tiktok.com/@eldalk?is_from_webapp=1&sender_device=pc" // Updated URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                // THEME: Updated icon styling
                className="p-3 border border-gray-600 rounded-md text-gray-300 hover:border-[#A67B5B] hover:text-[#A67B5B] transition-colors"
              >
                <FaTiktok size={20} />
              </a>
            </div>
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