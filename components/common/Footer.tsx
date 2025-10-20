"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

// Import your logo - **IMPORTANT**: Update this path to your actual logo file
import eldaLogo from "../../public/LogoBlack.png"; 

// Data for the links, making it easy to manage
const quickLinks = [
  { href: "/", title: "Home" },
  { href: "/about", title: "About Us" },
  { href: "/care-guide", title: "Care Guide" },
  { href: "/terms-and-conditions", title: "Terms & Conditions" },
  { href: "/refund-policy", title: "Refund Policy" },
  { href: "/privacy-policy", title: "Privacy Policy" },
];

const shopLinks = [
  { href: "/category/fabrics", title: "Fabrics" },
  { href: "/category/clothing", title:"Clothing" },
  { href: "/category/home-and-bedding", title: "Home & Bedding" },
  { href: "/category/accessories", title: "Accessories" },
];

const Footer = () => {
  return (
    <footer className="bg-tech_primary text-tech_white border-t border-gray-700">
      <div className="mx-auto max-w-6xl px-4 sm:px-4 ">
        {/* Main Footer Content Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-3">
              <Image
                src={eldaLogo} // Use the imported logo
                alt="ELDA - House of Block Prints"
                width={180} 
                height={60}
                className="bg-gray-400 p-4 rounded-md" // Added background to mimic the image
              />
            </Link>
            <p className="font-playfair text-xl tracking-wider">
              HOUSE OF BLOCK PRINTS
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-5 text-tech_gold">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="hover:text-tech_gold transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Shop */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-5 text-tech_gold">SHOP</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="hover:text-tech_gold transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-5 text-tech_gold">
              FOLLOW US ON
            </h3>
            <div className="flex justify-center md:justify-start space-x-5">
              <a
                href="https://www.facebook.com/your-page" // **TODO**: Replace with your Facebook URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-3 border border-tech_white rounded-md hover:border-tech_gold hover:text-tech_gold transition-colors"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/your-page" // **TODO**: Replace with your Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-3 border border-tech_white rounded-md hover:border-tech_gold hover:text-tech_gold transition-colors"
              >
                <FaInstagram size={20} />
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
              className="font-semibold text-white hover:text-tech_gold transition-colors"
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