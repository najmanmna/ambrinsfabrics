
import ProductGrid from "@/components/ProductGrid";
import ProductStatusSelector from "@/components/ProductStatusSelector";

import Hero from "@/components/Hero";

import PhilosophySection from "@/components/PhilosophySection";
import TheCurrentEdit from "@/components/TheCurrentEdit";
import SensorySection from "@/components/SensorySection";
import VisitStudio from "@/components/VisitStudio";
import FeaturedFabrics from "@/components/FeaturedFabrics";
import ShopByCategory from "@/components/ShopByCategory";
import PatternBackground from "@/components/ui/PatternBackground";

export default async function Home() {
  return (
    <div className="relative">
      {/* <PatternBackground  /> */}

        <Hero />
        {/* <MoreThanJustYardage /> */}
        <ShopByCategory />
          
        <PhilosophySection />
        {/* <ProductStatusSelector /> */}
   <TheCurrentEdit />
   <SensorySection  />
   <VisitStudio />
    <FeaturedFabrics />


 

      
      </div>

  );
}
