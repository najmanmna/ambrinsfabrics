import React from "react";
import Container from "@/components/Container";
import ShopInterface from "@/components/ShopInterface"; // Renamed for clarity

export const metadata = {
  title: "Shop All Fabrics | Ambrins",
  description: "Browse our exclusive collection of hand-block prints, silks, and cottons.",
};

const ProductsPage = () => {
  return (
    <div className=" min-h-screen">
      <ShopInterface />
    </div>
  );
};

export default ProductsPage;