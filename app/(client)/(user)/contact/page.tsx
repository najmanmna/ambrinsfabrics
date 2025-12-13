"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook,
 
  Loader2,
  ArrowRight
} from "lucide-react";


import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactForm } from "@/lib/contact"; // Import the server action
import Container from "@/components/Container";
import { FaTiktok } from "react-icons/fa";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset(); // Clear form
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send message. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#2C3E50] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots" /> {/* Optional texture */}
        <Container className="relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto font-light"
          >
            Whether you have a question about our fabrics, need help with an order, or just want to say hello, we are here for you.
          </motion.p>
        </Container>
      </div>

      <Container className="py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Phone */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-[#A67B5B]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-[#A67B5B]" />
                </div>
                <h3 className="font-semibold text-gray-900">Call Us</h3>
                <p className="text-gray-600 mt-1">011 255 3633 | 077 721 2229</p>
                <p className="text-xs text-gray-400 mt-2">Mon-Sat, 9am - 6pm</p>
              </div>

               {/* Email */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-[#A67B5B]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-[#A67B5B]" />
                </div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <a href="mailto:ambrins.fabricstore@gmail.com" className="text-gray-600 mt-1 hover:text-[#A67B5B] block truncate">
                  ambrins.fabricstore@gmail.com
                </a>
                <p className="text-xs text-gray-400 mt-2">We reply within 24 hours</p>
              </div>
            </div>

            {/* Address & Map */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-start gap-4 mb-6">
                 <div className="bg-[#A67B5B]/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#A67B5B]" />
                 </div>
                 <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Visit Our Store</h3>
                    <p className="text-gray-600 ">
                Orchard Building (3rd Floor),
                <br />
                7 3/2 B Galle Road, Opposite Savoy Cinema, Colombo 06.
              </p>
                 </div>
               </div>

               {/* Interactive Map Wrapper */}
               <div className="relative w-full h-64 rounded-lg overflow-hidden group">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0956908083413!2d79.85754150834478!3d6.879138493091015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bb8e9f761db%3A0xc7fc450b2350a963!2sElda%20-%20House%20of%20Block%20Prints!5e0!3m2!1sen!2slk!4v1760169870898!5m2!1sen!2slk" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    className="grayscale group-hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                  <div className="absolute inset-0 pointer-events-none border border-black/10 rounded-lg shadow-inner"></div>
               </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-6 justify-center md:justify-start pt-4">
              <span className="text-gray-500 font-medium">Follow us on:</span>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/elda_houseofblockprints?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="bg-white p-3 rounded-full shadow-sm text-gray-600 hover:text-[#E1306C] hover:scale-110 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/eldaclothinglk" className="bg-white p-3 rounded-full shadow-sm text-gray-600 hover:text-[#1877F2] hover:scale-110 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@eldalk?is_from_webapp=1&sender_device=pc" className="bg-white p-3 rounded-full shadow-sm text-gray-600 hover:text-black hover:scale-110 transition-all">
                  <FaTiktok className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>


          {/* RIGHT COLUMN: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-playfair text-[#2C3E50]">Send a Message</h2>
              <p className="text-gray-500 mt-2">We'd love to discuss your fabric needs.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  disabled={loading}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g. Ahamed Najman"
                  required
                  className="h-12 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#A67B5B] focus:ring-[#A67B5B] transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  disabled={loading}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="e.g. name@example.com"
                  required
                  className="h-12 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#A67B5B] focus:ring-[#A67B5B] transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                <Textarea
                  disabled={loading}
                  id="message"
                  name="message"
                  rows={5}
                  placeholder=""
                  className="border-gray-200 bg-gray-50 focus:bg-white focus:border-[#A67B5B] focus:ring-[#A67B5B] transition-all resize-none"
                  required
                />
              </div>

              {error && (
                 <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                    {error}
                 </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#A67B5B] text-white h-12 rounded-lg font-semibold hover:bg-[#8E6A4F] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <>
                     Send Message 
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </Container>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Confetti Background Effect (Optional CSS) */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#A67B5B] to-[#2C3E50]" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">Message Sent!</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Thank you for contacting ELDA. We have sent a confirmation to your email.
              </p>
              
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-[#2C3E50] text-white py-3 rounded-xl font-medium hover:bg-[#1a252f] transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;