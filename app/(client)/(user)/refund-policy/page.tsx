"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { Info, RefreshCcw, XCircle, Store, MessageSquare } from "lucide-react"; // Icons for better visual guidance

const ReturnRefundPolicyPage = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[#FDFBF6] text-[#2C3E50] py-20 sm:py-28">
      <Container className="max-w-4xl">
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="text-center mb-16">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">
            Exchange & Return Policy
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your satisfaction is important to us. Please read our policy carefully regarding exchanges and returns.
          </p>
        </motion.div>

        {/* Fabric Policy Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <Info size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">Fabrics: Cut to Order</h2>
              <p className="mt-2 text-lg text-gray-700 leading-relaxed">
                At ELDA, each fabric is meticulously cut to order specifically for you. Due to this bespoke nature,
                we are unable to accept returns or exchanges on fabrics <span className="font-bold">unless a defective or incorrect item has been sent. </span>
                We kindly ask that you check your fabric carefully before purchase or cutting.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Other Products Exchange Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <RefreshCcw size={36} className="text-[#5A7D7C] flex-shrink-0 mt-1" /> {/* Muted green for exchange */}
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">Exchanges for Other Products</h2>
              <p className="mt-2 text-lg text-gray-700 leading-relaxed">
                We want you to love everything you buy from us! You&apos;re welcome to exchange other products such as <span className="font-bold">beddings, clothing, and accessories</span>
                within <span>7 days of purchase</span>, provided they meet the following conditions:
              </p>
              <ul className="list-disc pl-8 mt-4 space-y-2 text-gray-700">
                <li>They must be unused.</li>
                <li>They must be unwashed.</li>
                <li>They must be in their original condition.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-playfair text-2xl font-semibold text-[#2C3E50] mb-4">How to Exchange:</h3>
            <div className="grid sm:grid-cols-2 gap-6 text-lg">
              <div className="flex items-start gap-3">
                <Store size={24} className="text-[#A67B5B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">In-Store Exchanges:</p>
                  <p className="text-gray-700">You can make exchanges directly at our Colombo 06 studio.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare size={24} className="text-[#A67B5B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Online / Delivery Orders:</p>
                  <p className="text-gray-700">
                    Please contact us via WhatsApp at <a href="https://wa.me/94777212229" target="_blank" rel="noopener noreferrer" className="text-[#A67B5B] hover:underline">0777 21 2229</a> before sending your item, so our team can assist you with the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notes Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB]"
        >
          <div className="flex items-start gap-4 mb-6">
            <XCircle size={36} className="text-[#B85C5C] flex-shrink-0 mt-1" /> {/* Soft red for important notes/restrictions */}
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">Important Notes:</h2>
              <ul className="list-disc pl-8 mt-2 space-y-2 text-lg text-gray-700">
                <li>Exchanges are subject to product availability.</li>
                <li>We do not offer cash refunds.</li>
                <li>Sale or discounted items are not eligible for exchange.</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Closing statement */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="mt-16 text-center text-lg italic text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          We appreciate your understanding and continued support of handcrafted, small-batch creations.
          Every piece you purchase helps us keep this beautiful art form alive.
        </motion.p>
      </Container>
    </section>
  );
};

export default ReturnRefundPolicyPage;