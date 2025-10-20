"use client";

import React, { useEffect, useState } from "react";
import GiftVoucherCard from "@/components/GiftVoucherCard";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";
import Image from "next/image";
import { GiftIcon, PencilIcon, ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";

interface VoucherTemplate {
  _id: string;
  title: string;
  amount: number;
  image?: { asset: { url: string } };
  description?: string;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/voucher");
        if (!res.ok) {
          throw new Error("Failed to fetch vouchers. Please try again later.");
        }
        const data = await res.json();
        setVouchers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  // Framer Motion variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen  py-32 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <Container className=" py-32 text-center min-h-screen flex flex-col justify-center items-center">
        <motion.div initial="hidden" animate="visible" variants={pageVariants}>
          <h2 className="font-serif text-3xl text-[#B85C5C] mb-4">
            Oops, Something Went Wrong
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2C3E50] text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-[#46627f] transition-all transform hover:scale-105"
          >
            Refresh Page
          </button>
        </motion.div>
      </Container>
    );
  }

  // --- MAIN CONTENT (with Empty State) ---
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-24 sm:py-32 text-white flex items-center justify-center"
        style={{
          // Use a more evocative hero image for gifting
          backgroundImage: "url('/img2.jpeg')",
          minHeight: "400px",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <Container className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg"
          >
            Gift the Art of Fabric
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md"
          >
            Give the gift of choice from our artisanal collection. A thoughtful
            gesture for those who appreciate true craftsmanship.
          </motion.p>
        </Container>
      </section>

      {/* "How to Gift" Section */}
      <section className="py-14 sm:py-14">
        <Container className="text-center">
          <h2 className="font-serif text-4xl text-[#2C3E50] mb-6">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Gifting is simple. In three easy steps, you can create a beautiful,
            printable gift certificate for someone special, ready to be
            downloaded instantly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#A67B5B]/10 p-4 rounded-full mb-4">
                <GiftIcon className="w-8 h-8 text-[#A67B5B]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E50] mb-2">
                1. Choose a Value
              </h3>
              <p className="text-gray-600">
                Select the voucher amount that's right for the occasion.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#A67B5B]/10 p-4 rounded-full mb-4">
                <PencilIcon className="w-8 h-8 text-[#A67B5B]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E50] mb-2">
                2. Personalize Certificate
              </h3>
              <p className="text-gray-600">
                Fill in the{" "}
                <span className="font-semibold text-[#A67B5B]">To</span> and{" "}
                <span className="font-semibold text-[#A67B5B]">From</span> fields.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#A67B5B]/10 p-4 rounded-full mb-4">
                <ArrowDownOnSquareIcon className="w-8 h-8 text-[#A67B5B]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E50] mb-2">
                3. Download & Gift
              </h3>
              <p className="text-gray-600">
                Instantly download a PDF and gift it to your loved ones.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vouchers Grid Section */}
      <Container className="py-20 sm:py-20">
        <h2 className="font-serif text-4xl text-[#2C3E50] text-center mb-16">
          Choose Your Gift
        </h2>
        {vouchers.length > 0 ? (
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {vouchers.map((voucher) => (
              <motion.div variants={cardItemVariants} key={voucher._id}>
                <GiftVoucherCard voucher={voucher} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // --- EMPTY STATE ---
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center py-16"
          >
            <Image
              src="/images/empty-vouchers.svg" // Assumes you have an on-brand empty state image
              alt="No vouchers available"
              width={150}
              height={150}
              className="mx-auto mb-8 opacity-70"
            />
            <h2 className="font-serif text-3xl text-[#2C3E50] mb-3">
              Currently Curating New Vouchers
            </h2>
            <p className="text-gray-600 text-lg max-w-lg mx-auto leading-relaxed">
              Our team is passionately designing a fresh collection of gift
              vouchers. Please check back soon to discover new ways to gift the
              <span className="font-semibold text-[#2C3E50]"> Ambrins Fabrics </span>
              experience.
            </p>
          </motion.div>
        )}
      </Container>
    </div>
  );
}