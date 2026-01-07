// "use client";

// import { motion } from "framer-motion";
// import Container from "@/components/Container";
// import Link from "next/link";
// import { Lock, Database, Share2, Mail, Edit, Shield } from "lucide-react"; // Removed Cookie icon

// const PrivacyPolicyPage = () => {
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   return (
//     <section className="bg-[#FDFBF6] text-[#2C3E50] py-20 sm:py-28">
//       <Container className="max-w-4xl">
//         <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="text-center mb-16">
//           <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">
//             Privacy Policy
//           </h1>
//           <p className="text-lg text-gray-700 max-w-2xl mx-auto">
//             At ELDA by Ambrins Fabrics, we are committed to protecting the privacy and security of your personal information.
//             This policy outlines how we collect, use, and safeguard your data when you visit or make a purchase from our website.
//             By using our website, you consent to the practices described here.
//           </p>
//           <p className="text-sm text-gray-500 mt-4">Last Updated: October 20, 2025</p>
//         </motion.div>

//         {/* Section: Information We Collect */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
//         >
//           <div className="flex items-start gap-4 mb-6">
//             <Database size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
//             <div>
//               <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">1. Information We Collect</h2>
//               <p className="mt-2 text-lg text-gray-700 leading-relaxed mb-4">
//                 When you visit our website or place an order, we may collect certain information, including:
//               </p>
//               <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
//                 <li>
//                     <span className="font-bold"> Personal Identification Information: </span>
//              Such as your name, email address, shipping address, and phone number,
//                   provided voluntarily by you during the checkout process.
//                 </li>
//                 <li>
//                   <span className="font-bold">Payment Information: </span> Details necessary to process your order (e.g., credit card information).
//                   This is securely handled by our trusted third-party payment processor (e.g., PayHere, facilitated by Ambrins Fabrics).
//                   ELDA does not store your full payment card details.
//                 </li>
//                 {/* Removed browsing information collected automatically by cookies */}
//               </ul>
//             </div>
//           </div>
//         </motion.div>

//         {/* Section: Use of Information */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
//         >
//           <div className="flex items-start gap-4 mb-6">
//             <Share2 size={36} className="text-[#5A7D7C] flex-shrink-0 mt-1" />
//             <div>
//               <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">2. How We Use Your Information</h2>
//               <p className="mt-2 text-lg text-gray-700 leading-relaxed mb-4">
//                 We use the information collected for the following purposes:
//               </p>
//               <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
//                 <li>To process and fulfill your orders, including shipping and delivery coordination.</li>
//                 <li>To communicate with you regarding your purchases, provide customer support, and respond to your inquiries.</li>
//                 {/* Removed personalization based on browsing patterns */}
//                 <li>To improve our website, product offerings, and services based on user feedback.</li>
//                 <li>To detect and prevent fraud, unauthorized activities, and ensure the security of our website.</li>
//               </ul>
//             </div>
//           </div>
//         </motion.div>

//         {/* Section: Information Sharing */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
//         >
//           <div className="flex items-start gap-4 mb-6">
//             <Lock size={36} className="text-[#B98B73] flex-shrink-0 mt-1" />
//             <div>
//               <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">3. Information Sharing</h2>
//               <p className="mt-2 text-lg text-gray-700 leading-relaxed mb-4">
//                 We respect your privacy and do not sell, trade, or rent your personal information to third parties.
//                 We only share your information in the following limited circumstances:
//               </p>
//               <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
//                 <li>
//                   <span className="font-bold">Trusted Service Providers: </span > We share necessary information with companies that help us operate our business,
//                   such as payment processors (facilitated by Ambrins Fabrics) and shipping carriers. These providers are
//                   contractually obligated to protect your data.
//                 </li>
//                 <li>
//                   <span className="font-bold">Legal Requirements: </span > We may disclose your information if required by law or in response to valid legal requests
//                   (e.g., court orders, government inquiries).
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </motion.div>

//         {/* Section: Data Security */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
//         >
//           <div className="flex items-start gap-4 mb-6">
//             <Shield size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
//             <div>
//               <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">4. Data Security</h2>
//               <p className="mt-2 text-lg text-gray-700 leading-relaxed">
//                 We implement industry-standard security measures to protect your personal information from unauthorized access,
//                 alteration, or disclosure. However, please understand that no method of transmission over the internet or
//                 electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data,
//                 we cannot guarantee its absolute security.
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Section: Changes to Policy - Renumbered from 6 to 5 */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="bg-white p-8 rounded-lg shadow-md border border-[#D7C8BB] mb-12"
//         >
//           <div className="flex items-start gap-4 mb-6">
//             <Edit size={36} className="text-[#A67B5B] flex-shrink-0 mt-1" />
//             <div>
//               <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50]">5. Changes to this Privacy Policy</h2>
//               <p className="mt-2 text-lg text-gray-700 leading-relaxed">
//                 We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page
//                 with a revised "Last Updated" date at the top. We encourage you to review this policy periodically to stay informed
//                 about how we collect, use, and protect your information.
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Contact Us */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="text-center mt-16"
//         >
//           <h2 className="font-playfair text-3xl font-semibold text-[#2C3E50] mb-4">Contact Us</h2>
//           <p className="text-lg text-gray-700 max-w-2xl mx-auto">
//             If you have any questions, concerns, or requests regarding our Privacy Policy or the handling of your
//             personal information, please contact us:
//           </p>
//           <p className="mt-4 text-xl text-[#A67B5B] font-semibold flex items-center justify-center gap-2">
//             <Mail size={20} /> <a href="mailto:ambrins.fabricstore@gmail.com" className="hover:underline">ambrins.fabricstore@gmail.com</a>
//           </p>
//         </motion.div>
//       </Container>
//     </section>
//   );
// };

// export default PrivacyPolicyPage;