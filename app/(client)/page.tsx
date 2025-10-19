import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import ProductStatusSelector from "@/components/ProductStatusSelector";
import WhatIs from "@/components/WhatIs";
import HeritageStory from "@/components/HeritageStory";
import VisitStudio from "@/components/VisitStudio";
import SocialShowcase from "@/components/SocialShowcase";
import FloatingVoucherCta from "@/components/FloatingVoucherCta";

export default async function Home() {
  return (
    <div className="relative">
      <div className="relative">
        <HomeBanner />
        <WhatIs />

        {/* Section Break Image */}
        {/* <div className="absolute w-full overflow-hidden">
          <img
            src={sectionBreak.src}
            alt="Section divider"
            className="w-full h-auto object-cover"
          />
        </div> */}

        <div className="">
          <ProductGrid />
        </div>

        {/* Optional flipped divider */}
        {/* <div className="relative w-full overflow-hidden">
          <img
            src={sectionBreak.src}
            alt="Section divider flipped"
            className="w-full h-auto object-cover rotate-180"
          />
        </div> */}

        <ProductStatusSelector />
        {/* <MissionSection /> */}
        <HeritageStory />
        <VisitStudio />
        <SocialShowcase />
        <FloatingVoucherCta />

      
      </div>
    </div>
  );
}
