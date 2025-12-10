"use client";

import useCartStore from "@/store";
import { Check, Home, ShoppingBag, Copy, Download } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react"; // --- ADD useMemo ---
import { toast } from "react-hot-toast";
import VoucherCertificate from "@/components/VoucherCertificate"; // adjust path if needed

// Custom Block Stamp Icon
const BlockStampHandle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7.5 12h9" />
    <path d="M6 15h12" />
    <path d="M12 15v-3" />
    <path d="M9 9a3 3 0 013-3h0a3 3 0 013 3v3H9V9z" />
  </svg>
);

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetCart = useCartStore((state) => state.resetCart);

  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("payment") || "Cash on Delivery";
  const total = searchParams.get("total");

  const [validAccess, setValidAccess] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);

  // --- ADD THIS STATE ---
  const [hasFabrics, setHasFabrics] = useState(false);
  const [hasOtherItems, setHasOtherItems] = useState(false);

  // --- ADD THIS MEMO ---
  // This will be true if the order has anything *other* than a voucher
  const hasPhysicalProducts = useMemo(
    () => hasFabrics || hasOtherItems,
    [hasFabrics, hasOtherItems]
  );

  useEffect(() => {
    const placed = sessionStorage.getItem("orderPlaced");
    if (!orderNumber || !paymentMethod || !placed) {
      router.replace("/");
      return;
    }

    setValidAccess(true);
    resetCart();

    // fetch vouchers and order contents
    fetch(`/api/order-vouchers?orderNumber=${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        // --- UPDATE THIS BLOCK ---
        setVouchers(data.vouchers || []);
        setHasFabrics(data.hasFabrics || false);
        setHasOtherItems(data.hasOtherItems || false);
        // --- END UPDATE ---
      })
      .catch(console.error);

    const handleUnload = () => sessionStorage.removeItem("orderPlaced");
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [orderNumber, paymentMethod, router, resetCart]);

  if (!validAccess) return null;

  const bankDetails = `Amrin fabrics
xxxxxxxx
xxxxxx Bank Dehiwala`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200/80 p-8 sm:p-12 text-center"
      >
        {/* Custom Stamping Animation */}
        <motion.div
          variants={itemVariants}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          {/* ... (no change to animation) ... */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1], scale: [0.5, 1, 1] }}
            transition={{ duration: 1.5, ease: "easeOut", times: [0, 0.5, 1] }}
            className="absolute inset-0 flex items-center justify-center bg-[#5A7D7C] rounded-full"
          >
            <Check className="text-white w-12 h-12" />
          </motion.div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: [-50, 10, 10], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeOut", times: [0, 0.5, 1] }}
            className="absolute inset-0 flex items-center justify-center text-[#A67B5B]"
          >
            <BlockStampHandle className="w-12 h-12" />
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-3xl sm:text-4xl font-medium text-[#2C3E50] mb-3"
        >
          Thank You For Your Order
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-gray-500 max-w-lg mx-auto mb-8"
        >
          Your order has been placed and is being prepared with care. A
          confirmation will be sent to your email shortly.
        </motion.p>

        {/* Order Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-[#FDFBF6]/70 rounded-lg p-6 border text-left mb-6"
        >
          {/* ... (no change to order summary) ... */}
          <h2 className="font-serif font-medium text-xl text-[#2C3E50] mb-4">
            Order Summary
          </h2>
          <div className="space-y-4 text-sm text-gray-500">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/80">
              <span>Order Number:</span>
              <span className="font-medium text-[#2C3E50] break-all">
                {orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/80">
              <span>Total:</span>
              <span className="font-medium text-[#2C3E50]">
                Rs. {total || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payment Method:</span>
              <span className="font-medium text-[#2C3E50]">
                {paymentMethod}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bank Details */}
        {paymentMethod.toLowerCase().includes("bank") && (
          <motion.div
            variants={itemVariants}
            className="bg-[#FBF8F2] border border-yellow-200/80 rounded-lg p-6 mb-6 text-left"
          >
            {/* ... (no change to bank details) ... */}
            <h3 className="font-serif font-medium text-lg text-[#A67B5B] mb-3">
              Action Required: Bank Transfer
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please transfer{" "}
              <span className="font-semibold text-[#2C3E50]">Rs. {total}</span>{" "}
              using your order number{" "}
              <span className="font-semibold text-[#2C3E50]">
                {orderNumber}
              </span>{" "}
              as the payment reference.
            </p>
            <div className="bg-white border rounded-md px-4 py-3 text-sm flex justify-between items-center">
              <pre className="font-mono text-gray-700 whitespace-pre-wrap">
                {bankDetails}
              </pre>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(bankDetails);
                  toast.success("Bank details copied!");
                }}
                className="ml-4 p-2 text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* --- MODIFIED: Vouchers Section --- */}
        {vouchers.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-[#F0F9FF] border border-blue-200/70 rounded-lg p-6 mb-6 text-left"
          >
            <h2 className="font-serif font-medium text-xl text-[#2C3E50] mb-4">
              Your Vouchers
            </h2>
            {/* --- ADDED THIS PARAGRAPH --- */}
            <p className="text-sm text-gray-700 mb-4">
              You can redeem these vouchers online at checkout or in-person at
              our store.
            </p>
             <p className="text-sm text-gray-700 mb-4">
              Valid fot 1 year from the date of purchase.
            </p>
            <div className="space-y-4 flex flex-col items-center">
              {vouchers.map((v) => (
                <VoucherCertificate key={v.code} voucher={v} />
              ))}
            </div>
          </motion.div>
        )}

        {/* --- MODIFIED: Delivery & Fabric Info --- */}
        {/* This whole block will now *only* show if there are physical items */}
        {hasPhysicalProducts && (
          <motion.div
            variants={itemVariants}
            className="bg-[#FBF8F2] border border-gray-200/50 rounded-lg p-6 mb-6 text-left"
          >
            <h3 className="font-serif font-medium text-lg text-[#A67B5B] mb-3">
              Important Delivery & Return Info
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Deliveries typically take <strong>2-6 business days</strong>.
              Deliveries do not occur on Sundays or Holidays.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              All parcels are handed over to the courier on the same day the
              order is placed. Delivery timelines are managed by the courier.
            </p>

            {/* --- This paragraph is now conditional --- */}
            {hasFabrics && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Fabrics:</strong> All fabrics are cut to individual
                orders, so we cannot accept returns unless the fabric piece is
                defective (within 7 days).
              </p>
            )}

            {/* --- This paragraph is now conditional --- */}
            {hasOtherItems && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Other items:</strong> Items other than fabrics are
                exchangeable/returnable according to our{" "}
                <Link
                  href="/refund-policy"
                  className="underline text-blue-600"
                >
                  Return & Refund Policy
                </Link>
                .
              </p>
            )}

            <p className="text-sm text-gray-600">
              For full details, please read our{" "}
              <Link
                href="/refund-policy"
                className="underline text-blue-600"
              >
                Return & Refund Policy
              </Link>
              .
            </p>
          </motion.div>
        )}
        {/* --- END OF MODIFIED SECTION --- */}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
        >
          <Link
            href="/"
            className="flex items-center justify-center px-5 py-3 font-semibold text-[#2C3E50] bg-transparent border border-[#2C3E50]/30 rounded-full hover:bg-[#2C3E50]/5 transition-colors duration-300"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center px-5 py-3 font-semibold bg-[#2C3E50] text-white rounded-full hover:bg-[#46627f] transition-colors duration-300 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" /> Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;