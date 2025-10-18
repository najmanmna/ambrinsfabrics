"use client";
import React from "react";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import PriceFormatter from "./PriceFormatter";
import { motion } from "framer-motion";
import type { Product } from "@/sanity.types";


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
  productType: "voucher", // custom flag
} as Product & { productType: "voucher" };



  const variant = {
    _key: "voucher-default",
    availableStock: 10, // always available for purchase
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col"
    >
      {voucher.image?.asset?.url && (
        <Image
          src={voucher.image.asset.url}
          alt={voucher.title}
          width={400}
          height={250}
          className="w-full h-56 object-cover"
        />
      )}

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold mb-2">{voucher.title}</h3>
          {voucher.description && (
            <p className="text-gray-600 text-sm mb-3">{voucher.description}</p>
          )}
          <p className="text-tech_primary font-bold text-lg">
            <PriceFormatter amount={voucher.amount} />
          </p>
        </div>

        <div className="mt-4">
          <AddToCartButton
            product={product as any}
            variant={variant as any}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GiftVoucherCard;
