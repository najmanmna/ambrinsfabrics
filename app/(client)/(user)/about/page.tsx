// "use client";

// import { motion } from "framer-motion";
// import Container from "@/components/Container";
// import Image from "next/image";
// import { Leaf, Palette, Stamp, Layers, Hand, MapPin, Phone } from "lucide-react"; // Updated icons for relevance

// const AboutPage = () => {
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   return (
//     <section className="bg-[#FDFBF6] text-[#2C3E50] pb-20"> {/* Soft background, primary dark text */}
//       {/* Hero Section - ELDA Introduction */}
//       <div className="bg-[#EEE8DD] py-20 sm:py-28 text-center border-b border-[#D7C8BB]"> {/* Lighter background, subtle border */}
//         <Container>
//           <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
//             <div className="w-40 flex mx-auto  ">
//             <Image
//               src="/ambrinslogo.png" // Replace with an image showcasing unique block prints
//               alt="Unique Block Prints"
//               width={800}
//               height={500}
//               className="w-full h-full object-contain"
//             />
//           </div>
           
//             <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-[#2C3E50] leading-tight">
//               Welcome to ELDA
//             </h1>
//              <p className="text-sm uppercase tracking-widest text-[#A67B5B] mb-2">A Sub-Brand of Ambrins Fabrics</p>
//             <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
//               <span className="font-bold text-2xl">E</span>mpowerment through <span className="font-bold text-2xl">L</span>egacy, <span className="font-bold text-2xl">D</span>esign and <span className="font-bold text-2xl">A</span>rtistry.
//               Established in 2024, ELDA is a boutique fabric store specializing in authentic block-printed, eco-friendly fabrics.
//             </p>
//           </motion.div>
//         </Container>
//       </div>

//       {/* Our Story / Philosophy Section */}
//       <Container className="py-20 sm:py-28">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="grid lg:grid-cols-2 gap-16 items-center"
//         >
//           {/* Image Placeholder */}
//           <div className="w-full aspect-video bg-[#D8CEC6] rounded-lg overflow-hidden shadow-lg">
//             <Image
//               src="/aboutimg1.jpeg" // Replace with an actual image of your studio or a beautiful fabric display
//               alt="ELDA Studio in Colombo"
//               width={800}
//               height={500}
//               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//             />
//           </div>
//           <div className="text-center lg:text-left">
//             <h2 className="font-playfair text-4xl font-semibold text-[#2C3E50] mb-6">Our Passion for Artisanal Fabrics</h2>
//             <p className="text-lg text-gray-700 leading-loose mb-6">
//               Based in Colombo 06, ELDA is dedicated to bringing you the timeless beauty of authentic block-printed fabrics sourced directly from India. We celebrate traditional printing techniques such as <span className="font-bold">Bagru, Sanganeri, Ajrakh, Indigo, and Dabu</span>, each revered for its unique patterns and generations of craftsmanship.
//             </p>
//             <p className="text-lg text-gray-700 leading-loose">
//               Beyond our diverse fabric selection, our passion extends to handcrafted <span className="font-bold">beddings, clothing, and accessories</span>, all created with the same love for artistry and meticulous detail.
//             </p>
//           </div>
//         </motion.div>
//       </Container>

//       {/* The Craft - Block Printing Process */}
//       <div className="bg-[#F0EBE3] py-20 sm:py-28"> {/* Another soft background variant */}
//         <Container>
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             variants={sectionVariants}
//             className="text-center mb-16"
//           >
//             <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-[#2C3E50]">The Art of Block Printing</h2>
//             <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
//               We cherish block printing, a heritage art form passed down through generations, blending tradition with modern design in every piece we create.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {/* Step 1: Hand-Drawn Sketch */}
//             <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-[#D8CEC6]">
//               <div className="mb-4 text-[#A67B5B]">
//                 <Hand size={48} strokeWidth={1.5} />
//               </div>
//               <h3 className="font-serif text-2xl font-semibold mb-3">Hand-Drawn Sketch</h3>
//               <p className="text-gray-700">
//                 Each design begins as a simple hand-drawn sketch, infused with artistic vision.
//               </p>
//             </motion.div>

//             {/* Step 2: Carved Wooden Blocks */}
//             <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-[#D8CEC6]">
//               <div className="mb-4 text-[#A67B5B]">
//                 <Stamp size={48} strokeWidth={1.5} />
//               </div>
//               <h3 className="font-serif text-2xl font-semibold mb-3">Intricate Carving</h3>
//               <p className="text-gray-700">
//                 These unique sketches are then meticulously carved into wooden blocks, becoming the tools of creation.
//               </p>
//             </motion.div>

//             {/* Step 3: Layer by Layer Printing */}
//             <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-[#D8CEC6]">
//               <div className="mb-4 text-[#A67B5B]">
//                 <Layers size={48} strokeWidth={1.5} />
//               </div>
//               <h3 className="font-serif text-2xl font-semibold mb-3">Layered Application</h3>
//               <p className="text-gray-700">
//                 Dipped in vibrant, often natural, dyes, these blocks are patiently stamped onto soft organic cotton, layer by layer, entirely by hand.
//               </p>
//             </motion.div>
//           </div>
//         </Container>
//       </div>

//       {/* The Value of Uniqueness */}
//       <Container className="py-20 sm:py-28">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={sectionVariants}
//           className="grid lg:grid-cols-2 gap-16 items-center"
//         >
//           <div className="text-center lg:text-left">
//             <h2 className="font-playfair text-4xl font-semibold text-[#2C3E50] mb-6">Embracing the Human Touch</h2>
//             <p className="text-lg text-gray-700 leading-loose mb-6">
//               In a world dominated by machines and mass production, we deeply value the human touch. No two prints are ever exactly the same, and it&apos;s these small variations, the rich depth of color, and the unique story behind every single print that we celebrate.
//             </p>
//             <p className="text-lg text-gray-700 leading-loose">
//               Each piece from ELDA is a testament to the artisan&apos;s patience and care, offering you something truly unique and imbued with soul.
//             </p>
//           </div>
//           {/* Image Placeholder */}
//           <div className="w-full aspect-video bg-[#D8CEC6] rounded-lg overflow-hidden shadow-lg">
//             <Image
//               src="/aboutimg2.jpeg" // Replace with an image showcasing unique block prints
//               alt="Unique Block Prints"
//               width={800}
//               height={500}
//               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//             />
//           </div>
//         </motion.div>
//       </Container>

//       {/* Studio Location & Contact */}
//       <div className="bg-[#EEE8DD] py-20 sm:py-28 text-center">
//         <Container>
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             variants={sectionVariants}
//           >
//             <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2C3E50] mb-6">Visit Our Studio</h2>
//             <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700 mb-8">
//               Experience the quality and artistry of ELDA fabrics in person. We look forward to welcoming you.
//             </p>

//             <div className="flex flex-col items-center gap-4 text-xl text-gray-800">
//               <p className="flex items-center gap-3">
//                 <MapPin size={24} className="text-[#A67B5B]" />
//                 Orchard Building (3rd floor), 7 3/2 B Galle Road, Colombo 06.
//               </p>
//               <p className="flex items-center gap-3">
//                 <Phone size={24} className="text-[#A67B5B]" />
//                 <a href="tel:+94112553633" className="hover:text-[#A67B5B] transition-colors">0112 553 633</a> | <a href="tel:+94777212229" className="hover:text-[#A67B5B] transition-colors">0777 21 2229</a>
//               </p>
//             </div>
//           </motion.div>
//         </Container>
//       </div>
//     </section>
//   );
// };

// export default AboutPage;