"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import Link from "next/link";
import { RefreshCcw, FileText, ShoppingBag, Truck, DollarSign, Copyright, Shield, Edit } from "lucide-react";

const TermsAndConditionsPage = () => {
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
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Welcome to ELDA by Ambrins Fabrics. These Terms and Conditions govern your use of our website
            and the purchase and sale of our unique, handcrafted products. By accessing and using our website,
            you agree to comply with these terms. Please read them carefully.
          </p>
        </motion.div>

        {/* Section: Use of the Website - MODIFIED */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <FileText size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">1. Use of the Website</h2>
              <ul className="list-disc pl-8 mt-4 space-y-3 text-lg text-gray-700">
                <li>
                  You must be at least 18 years old to use our website or make purchases.
                </li>
                <li>
                  You agree to provide accurate and current information during the checkout process
                  when placing an order.
                </li>
                <li>
                  You may not use our website for any unlawful or unauthorized purposes,
                  or in any way that infringes upon the rights of others.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section: Product Information and Pricing */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <ShoppingBag size={36} className="text-[#5A7D7C] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">2. Product Information and Pricing</h2>
              <ul className="list-disc pl-8 mt-4 space-y-3 text-lg text-gray-700">
                <li>
                  We strive to provide accurate product descriptions, images, and pricing for our handcrafted fabrics,
                  beddings, clothing, and accessories. However, due to the artisanal nature of our products,
                  slight variations in color, pattern, or texture may occur. We do not guarantee the absolute
                  accuracy or completeness of all information.
                </li>
                <li>
                  Prices are subject to change without prior notice. Any promotions or discounts are valid for
                  a limited time and may be subject to additional terms and conditions.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section: Orders and Payments */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <DollarSign size={36} className="text-[#B98B73] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">3. Orders and Payments</h2>
              <ul className="list-disc pl-8 mt-4 space-y-3 text-lg text-gray-700">
                <li>
                  By placing an order on our website, you are making an offer to purchase the selected products.
                </li>
                <li>
                  We reserve the right to refuse or cancel any order for any reason, including but not limited
                  to product availability, errors in pricing or product information, or suspected fraudulent activity.
                </li>
                <li>
                  You agree to provide valid and up-to-date payment information and authorize us to charge the
                  total order amount, including applicable taxes and shipping fees, to your chosen payment method.
                </li>
                <li>
                  All payments for purchases made on ELDA are processed securely by our parent company, <span className="font-bold">Ambrins Fabrics</span>.
                  We utilize trusted third-party payment processors to handle your payment information.
                  ELDA by Ambrins Fabrics does not store or have direct access to your full payment details.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section: Shipping and Delivery */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <Truck size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">4. Shipping and Delivery</h2>
              <ul className="list-disc pl-8 mt-4 space-y-3 text-lg text-gray-700">
                <li>
                  We will make reasonable efforts to ensure timely shipping and delivery of your orders.
                </li>
                <li>
                  Shipping and delivery times provided are estimates and may vary based on your location,
                  the nature of the handcrafted product, and other unforeseen factors.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section: Returns and Refunds */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <RefreshCcw size={36} className="text-[#B85C5C] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">5. Returns and Exchanges</h2>
              <p className="mt-2 text-lg text-gray-700 leading-relaxed">
                Our comprehensive <Link href="/refund-policy" className="text-[#A67B5B] hover:underline font-medium">Exchange & Return Policy</Link>
                governs the process and conditions for returning or exchanging products. Please refer to
                the dedicated policy page on our website for detailed information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section: Intellectual Property */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <Copyright size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">6. Intellectual Property</h2>
              <ul className="list-disc pl-8 mt-4 space-y-3 text-lg text-gray-700">
                <li>
                  All content and materials on our website, including text, images, logos, product designs,
                  and graphics related to ELDA by Ambrins Fabrics, are protected by intellectual property rights
                  and are the exclusive property of ELDA by Ambrins Fabrics.
                </li>
                <li>
                  You may not use, reproduce, distribute, or modify any content from our website
                  without our prior written consent.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section: Limitation of Liability */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <Shield size={36} className="text-[#B85C5C] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">7. Limitation of Liability</h2>
              <ul className="list-disc pl-8 mt-4 space-y-3 text-lg text-gray-700">
                <li>
                  In no event shall ELDA by Ambrins Fabrics, its directors, employees, or affiliates
                  be liable for any direct, indirect, incidental, special, or consequential damages
                  arising out of or in connection with your use of our website or the purchase and
                  use of our products.
                </li>
                <li>
                  We make no warranties or representations, express or implied, regarding the quality,
                  accuracy, or suitability of the products offered on our website, beyond what is explicitly
                  stated in product descriptions.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section: Amendments and Termination */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <Edit size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">8. Amendments and Termination</h2>
              <p className="mt-2 text-lg text-gray-700 leading-relaxed">
                ELDA by Ambrins Fabrics reserves the right to modify, update, or terminate these Terms and Conditions
                at any time without prior notice. It is your responsibility to review these terms periodically
                for any changes. Continued use of the website after any such changes constitutes your acceptance
                of the new Terms and Conditions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="text-center mt-16"
        >
          <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50] mb-4">Contact Us</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            If you have any questions or concerns regarding these Terms and Conditions, please contact our
            customer support team.
          </p>
          <p className="mt-4 text-xl text-[#A67B5B] font-semibold">
            <a href="mailto:info@elda.lk" className="hover:underline">info@elda.lk</a>
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default TermsAndConditionsPage;