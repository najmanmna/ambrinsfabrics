"use client";
import React from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import PriceFormatter from "./PriceFormatter";
import { motion } from "framer-motion";
import type { Product } from "@/sanity.types";
import { CreditCardIcon } from "@heroicons/react/24/outline";

interface VoucherTemplate {
  _id: string;
  title: string;
  amount: number;
  image?: { asset: { url: string } };
  description?: string;
}

const GiftVoucherCard = ({ voucher }: { voucher: VoucherTemplate }) => {
const product = {
  _id: voucher._id,
  name: voucher.title,
  price: voucher.amount,
  productType: "voucher" as const, // custom flag
  image: voucher.image?.asset?.url, // ✅ custom field for voucher image
} as Product & { productType: "voucher"; image?: string };


  const variant = {
    _key: "voucher-default",
    availableStock: 1000,
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative rounded-xl overflow-hidden flex flex-col h-full cursor-pointer
                 bg-[#EEE8DD] text-[#2C3E50] font-serif shadow-md hover:shadow-lg
                 border border-[#A67B5B]/30"
      style={{
        backgroundImage: "url('/texture2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative border */}
      <div className="absolute inset-0 border-2 border-[#A67B5B]/70 rounded-xl pointer-events-none"></div>

      {/* Top: Logo */}
      <div className="p-4 pt-6 text-center relative z-10">
        <Image
          src="/ambrinslogo.png"
          alt="Ambrins Fabrics Logo"
          width={140}
          height={40}
          className="mx-auto mb-2 w-20"
        />
      </div>
      <div className=" text-center relative z-10">
        <Image
          src="/LogoBlack.png"
          alt="ELDA Logo"
          width={140}
          height={40}
          className="mx-auto mb-2"
        />
      </div>

      {/* Middle: Voucher info */}
      <div className="flex flex-col justify-center items-center flex-1 p-6 text-center relative z-10">
        {/* {voucher.image?.asset?.url ? (
          <div className="relative w-32 h-32 mb-3 rounded-md overflow-hidden">
            <Image
              src={voucher.image.asset.url}
              alt={voucher.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <CreditCardIcon className="w-16 h-16 text-gray-400 mb-3" />
        )} */}
        <h3 className="font-serif text-3xl font-bold text-[#2C3E50] leading-tight mb-2">
          {voucher.title}
        </h3>
        <p className="font-bold text-4xl text-[#A67B5B]">
          <PriceFormatter amount={voucher.amount} />
        </p>
        {voucher.description && (
          <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-2 max-w-[80%]">
            {voucher.description}
          </p>
        )}
      </div>

      {/* Add to cart */}
      <div className="p-6 relative z-10 mt-auto">
        <AddToCartButton
          product={product as any}
          variant={variant as any}
          className="w-full bg-[#2C3E50] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-[#46627f] transition-all transform hover:-translate-y-0.5"
        />
      </div>
    </motion.div>
  );
};

export default GiftVoucherCard;
