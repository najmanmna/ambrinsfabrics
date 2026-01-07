import React from "react";

const MoreThanJustYardage = () => {
  return (
    <section className="py-16 bg-[#f8f7f3] text-[#2c2c2c] font-['Roboto']">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start relative">
          {/* Image Side */}
          <div className="lg:w-1/2 w-full z-0">
            <img
              src="https://images.unsplash.com/photo-1597063871561-c93513725172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
              alt="Hands holding a delicate white lace fabric"
              className="w-full h-auto lg:h-[500px] object-cover rounded-sm shadow-sm"
            />
          </div>

          {/* Text Side */}
          <div className="lg:w-1/2 w-full bg-white p-8 lg:p-12 lg:ml-[-8%] z-10 rounded-sm shadow-md lg:mt-12 relative">
            <p className="text-[#b9a88a] uppercase tracking-widest font-medium text-sm mb-4 before:content-['—_'] before:mr-1">
              Our Philosophy
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight mb-6">
              More Than Just Yardage.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              For over two decades, Ambrins has been the silent partner to
              Colombo's most demanding brides and designers. We don't just sell
              fabric; we curate texture, drape, and possibility.
            </p>

            {/* Elda Sub-brand Feature Box */}
            <div className="bg-[#f1efe8] p-6 border-l-4 border-[#b9a88a]">
              <p className="text-gray-700 mb-4">
                Also featuring Elda — Our dedicated sub-brand for heritage
                hand-block prints and artisan cottons.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[#b9a88a] font-medium hover:text-[#a49376] transition duration-300 group"
              >
                ->{" "}
                <span className="ml-2 border-b border-[#b9a88a] group-hover:border-[#a49376]">
                  Discover Elda.
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreThanJustYardage;