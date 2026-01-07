// "use client";

// import { motion } from "framer-motion";
// import Container from "@/components/Container";
// import Link from "next/link";
// import { Droplets, Wind, ThermometerSun, Sparkles, Clock, MapPin, Phone } from "lucide-react";
// import { FaTiktok } from "react-icons/fa";

// // Custom Social Icons for brand consistency
// const InstagramIcon = ({ className }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
//       <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
//       <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
//     </svg>
// );

// const TikTokIcon = ({ className }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.55-2-2.31-4.52-2.3-7.16 0-3.87 2.4-7.28 6.02-8.52.1-.03.21-.07.32-.11.02-3.2.01-6.4-.01-9.6.95-.01 1.9-.01 2.85-.02z"></path>
//     </svg>
// );

// const FacebookIcon = ({ className }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
//     </svg>
// );


// const CareGuidePage = () => {

//     const sectionVariants = {
//         hidden: { opacity: 0, y: 40 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//     };

//     const careInstructions = [
//         { icon: Droplets, title: "Gentle Wash", description: "Cold hand wash or a gentle machine cycle." },
//         { icon: Sparkles, title: "Mild Detergent", description: "Use a mild, natural detergent. No bleach." },
//         { icon: Clock, title: "Avoid Soaking", description: "Do not soak fabrics for long periods." },
//         { icon: Wind, title: "Shade Dry", description: "Always dry your textiles in the shade to prevent fading." },
//         { icon: ThermometerSun, title: "Low Heat Iron", description: "Iron on a low heat setting, preferably when damp." },
//     ];

//     return (
//         <section className=" py-24 sm:py-32">
//             <Container className="max-w-4xl mx-auto px-4">
//                 {/* Header */}
//                 <motion.div 
//                     initial="hidden"
//                     animate="visible"
//                     variants={sectionVariants}
//                     className="text-center mb-16"
//                 >
//                     <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#2C3E50] mb-4">
//                         A Guide to Lasting Beauty
//                     </h1>
//                     <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
//                         Thank you for choosing Elda. Each fabric is block printed by hand using age-old techniques. Naturally dyed fabrics are gentle, free from harsh chemicals, and known for their soothing properties. With a little love, your piece will last for years to come.
//                     </p>
//                 </motion.div>

//                 {/* First Wash Instructions */}
//                 <motion.div 
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true, amount: 0.3 }}
//                     variants={sectionVariants}
//                     className="bg-white border border-gray-200/80 rounded-lg p-8 sm:p-10 mb-12 shadow-sm"
//                 >
//                     <div className="flex items-center gap-4 mb-4">
//                         <div className="bg-[#5A7D7C]/10 p-3 rounded-full">
//                             <Sparkles className="w-6 h-6 text-[#5A7D7C]" />
//                         </div>
//                         <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C3E50]">First Wash: Locking in the Colour</h2>
//                     </div>
//                     <p className="text-gray-600 mb-4">
//                         To keep your textiles vibrant, the first wash is key. We recommend using a simple, natural fixative to help lock in the beautiful dyes.
//                     </p>
//                     <ul className="list-decimal list-inside space-y-2 text-gray-700">
//                         <li>Soak the fabric separately in <strong>cold water</strong> with a splash of <strong>white vinegar</strong> (approx. 4:1 ratio).</li>
//                         <li>Let it sit for about 15 minutes. This helps the natural dyes set.</li>
//                         <li>Gently rinse with cold water and hang to dry in the shade.</li>
//                     </ul>
//                 </motion.div>

//                 {/* Ongoing Care */}
//                 <motion.div
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true, amount: 0.3 }}
//                     variants={sectionVariants}
//                     className="mb-16"
//                 >
//                     <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C3E50] text-center mb-8">Ongoing Care</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
//                         {careInstructions.map((item, index) => (
//                             <div key={index} className="flex flex-col items-center">
//                                 <div className="bg-[#A67B5B]/10 p-4 rounded-full mb-3">
//                                     <item.icon className="w-7 h-7 text-[#A67B5B]" />
//                                 </div>
//                                 <h3 className="font-semibold text-[#2C3E50] mb-1">{item.title}</h3>
//                                 <p className="text-gray-500 text-sm">{item.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </motion.div>
                
//                 {/* A Mark of Authenticity */}
//                 <motion.div
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true, amount: 0.3 }}
//                     variants={sectionVariants}
//                     className="bg-[#FBF8F2] border-l-4 border-[#A67B5B] p-6 rounded-r-lg mb-20"
//                 >
//                     <p className="text-[#A67B5B] italic">
//                         "Slight color bleeding during the first few washes is normal. It's a mark of a true block print – organic, soulful, and authentically hand-done."
//                     </p>
//                 </motion.div>

//                 {/* Contact & Follow */}
//                 <motion.div 
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true, amount: 0.3 }}
//                     variants={sectionVariants}
//                     className="border-t border-gray-200/80 pt-12"
//                 >
//                     <div className="grid md:grid-cols-2 gap-8">
//                         <div className="text-center md:text-left">
//                             <h3 className="font-serif text-xl font-medium text-[#2C3E50] mb-4">Visit or Contact Us</h3>
//                             <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 mb-2">
//                                 <MapPin className="w-5 h-5 flex-shrink-0" />
//                                 <span>Orchard Building (3rd Floor), 7 3/2 B Galle Road, Colombo 06</span>
//                             </div>
//                             <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
//                                 <Phone className="w-5 h-5" />
//                                 <a href="https://wa.me/94777212229" target="_blank" className="hover:text-[#2C3E50]">WhatsApp: 0777 21 2229</a>
//                             </div>
//                         </div>
//                         <div className="text-center md:text-left">
//                             <h3 className="font-serif text-xl font-medium text-[#2C3E50] mb-4">Follow Our Journey</h3>
//                              <div className="flex items-center justify-center md:justify-start gap-5">
//                                 <Link href="https://www.instagram.com/elda_houseofblockprints?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" className="text-gray-500 hover:text-[#A67B5B] transition-colors"><InstagramIcon className="w-6 h-6" /></Link>
//                                 <Link href="https://www.facebook.com/eldaclothinglk" target="_blank" className="text-gray-500 hover:text-[#A67B5B] transition-colors"><FacebookIcon className="w-6 h-6" /></Link>
//                                 <Link href="https://www.tiktok.com/@eldalk?is_from_webapp=1&sender_device=pc" target="_blank" className="text-gray-500 hover:text-[#A67B5B] transition-colors"><FaTiktok className="w-6 h-6" /></Link>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>

//             </Container>
//         </section>
//     );
// };

// export default CareGuidePage;