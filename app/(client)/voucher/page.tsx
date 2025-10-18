"use client";
import React, { useEffect, useState } from "react";
import GiftVoucherCard from "@/components/GiftVoucherCard";

interface VoucherTemplate {
  _id: string;
  title: string;
  amount: number;
  image?: { asset: { url: string } };
  description?: string;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherTemplate[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      const res = await fetch("/api/voucher"); // we'll make this route next
      const data = await res.json();
      setVouchers(data);
    };
    fetchVouchers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-tech_primary">
        Gift Vouchers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => (
          <GiftVoucherCard key={voucher._id} voucher={voucher} />
        ))}
      </div>
    </div>
  );
}
