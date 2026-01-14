"use client";

import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../Container";
import { Fragment } from "react";

// 1. Map segments to readable names
const segmentLabels: Record<string, string> = {
  status: "Status",
  hot: "Hot Products",
  new: "New Arrivals",
  sale: "On Sale",
  best: "Best Products",
  account: "My Account",
  orders: "Order History",
};

// 2. PAGES TO HIDE THIS ON (The "Blocklist")
// Since we built custom headers for these, we don't want this generic one appearing.
const EXCLUDED_PATHS = [
  "/",                // Home
  "/product",         // Product Details (Has its own breadcrumb)
  "/shop",            // Shop (Has Sidebar/Header)
  "/collections",     // Collections
  "/cart",            // Cart (Has its own title)
  "/checkout",        // Checkout
  "/about",           // About (Has Hero)
  "/contact",         // Contact (Has Hero)
  "/terms",           // Legal pages
  "/privacy-policy",
  "/return-policy",
  "/elda",            // Elda landing
  "/success"          // Success page
];

const LinkBadge = () => {
  const pathname = usePathname();
  
  // --- LOGIC: CHECK EXCLUSION ---
  // If the current path starts with any of the excluded paths, return null (Render Nothing)
  if (pathname === "/" || EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);

  // If no segments (e.g. somehow on root), return null
  if (pathSegments.length === 0) return null;

  return (
    // Added mt-24 to push it down below fixed headers (Adjust 24 to match your header height)
    <div className="mt-24 md:mt-32 bg-ambrins_light border-b border-ambrins_dark/5 py-3">
      <Container className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ambrins_text/60">
        
        {/* Home Icon */}
        <Link href="/" className="hover:text-ambrins_primary transition-colors flex items-center">
          <Home size={14} className="mb-0.5" />
        </Link>

        {/* Segments */}
        {pathSegments.map((segment, index) => {
          const label = segmentLabels[segment] || segment.replace(/-/g, " ");
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

          return (
            <Fragment key={index}>
              <ChevronRight size={12} className="text-ambrins_text/40" />
              
              {isLast ? (
                <span className="text-ambrins_secondary font-bold truncate max-w-[200px]">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-ambrins_primary transition-colors hover:underline decoration-ambrins_primary/50 underline-offset-4"
                >
                  {label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </Container>
    </div>
  );
};

export default LinkBadge;