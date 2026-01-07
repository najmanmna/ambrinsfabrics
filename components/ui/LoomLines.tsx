const LoomLines = () => {
  return (
    // CHANGED: z-0 to z-30, and added pointer-events-none
    <div className="fixed inset-0 pointer-events-none z-30 flex justify-between px-4 md:px-20 max-w-[1800px] mx-auto opacity-15">
      {/* Line 1 (Left) */}
      <div className="w-[1px] h-full bg-ambrins_dark hidden md:block" />
      
      {/* Line 2 (Left-Center) */}
      <div className="w-[1px] h-full bg-ambrins_dark" />
      
      {/* Line 3 (Center - Marigold) */}
      <div className="w-[1px] h-full bg-ambrins_secondary/40 hidden lg:block" />
      
      {/* Line 4 (Right-Center) */}
      <div className="w-[1px] h-full bg-ambrins_dark" />
      
      {/* Line 5 (Right) */}
      <div className="w-[1px] h-full bg-ambrins_dark hidden md:block" />
    </div>
  );
};

export default LoomLines;