"use client";

import useCartStore from "@/store";
import { Check, Home, ShoppingBag, Copy, ArrowRight, Gift } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // Optional: for responsive confetti
import VoucherCertificate from "@/components/VoucherCertificate"; 

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetCart = useCartStore((state) => state.resetCart);
  
  // Use window size for confetti if you want it responsive, otherwise just full width
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("payment") || "Cash on Delivery";
  const total = searchParams.get("total");

  const [validAccess, setValidAccess] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [hasFabrics, setHasFabrics] = useState(false);
  const [hasOtherItems, setHasOtherItems] = useState(false);

  // Determine if we need to show physical shipping info
  const hasPhysicalProducts = useMemo(
    () => hasFabrics || hasOtherItems,
    [hasFabrics, hasOtherItems]
  );

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const placed = sessionStorage.getItem("orderPlaced");
    if (!orderNumber || !paymentMethod || !placed) {
      router.replace("/");
      return;
    }

    setValidAccess(true);
    resetCart();

    // Fetch order details
    fetch(`/api/order-vouchers?orderNumber=${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setVouchers(data.vouchers || []);
        setHasFabrics(data.hasFabrics || false);
        setHasOtherItems(data.hasOtherItems || false);
      })
      .catch(console.error);

    const handleUnload = () => sessionStorage.removeItem("orderPlaced");
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [orderNumber, paymentMethod, router, resetCart]);

  if (!validAccess) return null;

  const bankDetails = `Ambrin
200050086362
Nations Trust Bank Wellawatte`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Confetti Explosion on Load */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={400}
        gravity={0.15}
        colors={['#2C3E50', '#A67B5B', '#E5E7EB', '#5A7D7C']}
      />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#2C3E50] z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 container mx-auto px-4 pt-12 pb-24 max-w-4xl"
      >
        
        {/* --- HERO CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-[#2C3E50] p-8 sm:p-12 text-center text-white relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-white/20"
            >
              <Check className="w-10 h-10 text-[#A67B5B]" strokeWidth={3} />
            </motion.div>
            
            <h1 className="font-serif text-3xl sm:text-5xl mb-4">Thank You!</h1>
            <p className="text-blue-100 text-lg max-w-lg mx-auto">
              Your order <span className="font-semibold text-white">#{orderNumber}</span> has been placed successfully. 
              We've sent a confirmation email your way.
            </p>
          </div>

          {/* --- ORDER DETAILS GRID --- */}
          <div className="p-8 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="pb-4 sm:pb-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-medium text-gray-900 text-lg break-all">#{orderNumber}</p>
              </div>
              <div className="py-4 sm:py-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Amount</p>
                <p className="font-medium text-[#2C3E50] text-lg">Rs. {total}</p>
              </div>
              <div className="pt-4 sm:pt-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 text-lg">{paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* --- VOUCHERS SECTION (Highlighted) --- */}
          {vouchers.length > 0 && (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50/30 border-b border-blue-100/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg text-[#2C3E50]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#2C3E50]">Your Digital Vouchers</h2>
                  <p className="text-sm text-gray-500">Ready to use immediately. Valid for 1 year.</p>
                </div>
              </div>
              
              <div className="grid gap-6 justify-center">
                {vouchers.map((v) => (
                  <div key={v.code} className="transform hover:scale-[1.01] transition-transform duration-300">
                    <VoucherCertificate voucher={v} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- BANK TRANSFER INSTRUCTIONS --- */}
          {paymentMethod.toLowerCase().includes("bank") && (
            <div className="p-8 bg-amber-50/50 border-b border-amber-100">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                  <h3 className="text-[#A67B5B] font-semibold flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-[#A67B5B] rounded-full animate-pulse"/>
                    Payment Pending
                  </h3>
                  <p className="text-gray-600 text-sm max-w-md">
                    Please transfer <strong className="text-gray-900">Rs. {total}</strong> to the account below. 
                    Use your Order ID as the reference.
                  </p>
                </div>
                
                <div className="w-full md:w-auto bg-white border border-amber-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4 min-w-[280px]">
                  <pre className="font-mono text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {bankDetails}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bankDetails);
                      toast.success("Details copied!");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#2C3E50] transition-colors"
                    title="Copy details"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- SHIPPING INFO (Only if Physical) --- */}
          {hasPhysicalProducts && (
            <div className="p-8 text-sm text-gray-600 space-y-4 bg-gray-50/50">
              <h3 className="font-medium text-gray-900 mb-2 uppercase tracking-wide text-xs">What happens next?</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#5A7D7C] flex-shrink-0" />
                  <span>
                    <strong>Dispatch:</strong> Parcels are handed to the courier same-day.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#5A7D7C] flex-shrink-0" />
                  <span>
                    <strong>Timeline:</strong> Delivery typically takes 2-6 business days.
                  </span>
                </li>
                {hasFabrics && (
                  <li className="flex items-start gap-3 sm:col-span-2">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#A67B5B] flex-shrink-0" />
                    <span>
                      <strong>Fabric Policy:</strong> Fabrics are custom cut and cannot be returned unless defective (report within 7 days).
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group flex items-center px-6 py-3 rounded-full text-gray-500 hover:text-[#2C3E50] hover:bg-white transition-all"
          >
            <Home className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="group flex items-center px-8 py-3.5 bg-[#2C3E50] text-white rounded-full font-medium shadow-lg shadow-blue-900/20 hover:bg-[#34495e] hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default SuccessPage;