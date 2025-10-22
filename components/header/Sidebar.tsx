"use client";

import { X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import { quickLinksDataMenu } from "@/constants";
import { ExpandedCategory } from "./MobileMenu";
import { GiftIcon } from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: ExpandedCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const mainCategories = categories?.filter((cat) => !cat.parent?._id);
  const getSubcategories = (parentId: string) =>
    categories?.filter((cat) => cat.parent?._id === parentId);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory((prevId) => (prevId === categoryId ? null : categoryId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed h-screen inset-0 bg-black/40 z-40"
        >
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 sm:w-full max-w-sm bg-[#FDFBF6] z-50 h-screen p-6 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium text-[#2C3E50]">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-[#2C3E50] p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* CTA for Vouchers */}
            <Link
              href="/voucher"
              onClick={onClose}
              className="flex items-center justify-center gap-3 bg-[#A67B5B] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-[#8e6e52] transition-colors duration-200"
            >
              <GiftIcon className="w-5 h-5" />
              <span>Gift Vouchers</span>
            </Link>

            {/* Scrollable Section for Categories + Store/Care */}
            <div className="flex-grow overflow-y-auto mt-6 pr-5 space-y-6">
              {/* Category List */}
              <div>
                {mainCategories?.length ? (
                  mainCategories.map((mainCat) => {
                    const subcategories = getSubcategories(mainCat._id!);
                    const isActive = activeCategory === mainCat._id;

                    return (
                      <div key={mainCat._id} className="mb-1">
                        <div
                          onClick={() => handleCategoryClick(mainCat._id!)}
                          className="flex items-center justify-between cursor-pointer font-serif text-xl text-[#2C3E50] hover:text-[#A67B5B] transition-colors duration-200 py-2"
                        >
                          <span>{mainCat.name}</span>
                          <ChevronDown
                            className={`transform ml-5 sm:ml-0 transition-transform duration-300 ${
                              isActive ? "rotate-180 text-[#A67B5B]" : "rotate-0"
                            }`}
                            size={20}
                          />
                        </div>

                        {/* Dropdown */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="flex flex-col gap-3 pl-4 mt-3 border-l-2 border-gray-200 overflow-hidden"
                            >
                              <Link
                                onClick={onClose}
                                href={`/category/${mainCat.slug?.current}`}
                                className={`hover:text-[#A67B5B] transition text-gray-700 font-medium text-base ${
                                  pathname ===
                                  `/category/${mainCat.slug?.current}`
                                    ? "text-[#A67B5B] font-semibold"
                                    : ""
                                }`}
                              >
                                All {mainCat.name}
                              </Link>

                              {subcategories?.length ? (
                                subcategories.map((sub) => (
                                  <Link
                                    onClick={onClose}
                                    key={sub._id}
                                    href={`/category/${sub.slug?.current}`}
                                    className={`hover:text-[#A67B5B] transition text-gray-500 text-base ${
                                      pathname ===
                                      `/category/${sub.slug?.current}`
                                        ? "text-[#A67B5B] font-semibold"
                                        : ""
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  (No subcategories)
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400">Loading categories...</div>
                )}
              </div>

              {/* Store Locator + Care Guide */}
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <Link
                  href="/#studio"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  Store Locator
                </Link>
                <Link
                  href="/care-guide"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  Care Guide
                </Link>
              </div>
            </div>

            {/* Footer Links (Pinned Bottom) */}
            <div className="border-t border-gray-200 mb-15 pt-4 mt-4 space-y-3">
              {quickLinksDataMenu?.map((item) => (
                <Link
                  key={item?.title}
                  href={item?.href}
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  {item?.title}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
