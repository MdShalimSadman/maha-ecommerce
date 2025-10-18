import Image from "next/image";
import React from "react";

const categories = [
  { name: "Modest Gown", src: "/images/categories/modest-gown-2.jpg" },
  { name: "Hijab", src: "/images/categories/hijab.jpg" },
  { name: "Abaya", src: "/images/categories/abaya.jpg" },
];

const Categories = () => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center py-6 px-8">
      <h2 className="text-center font-semibold text-4xl text-[#A6686A]">
        Top Categories
      </h2>

      <div className="flex justify-between mt-12 gap-12">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col items-center gap-3">
            <div className="relative w-60 h-60 overflow-hidden rounded-full border border-gray-200">
              <Image
                src={category.src}
                alt={category.name}
                fill
                className="object-cover cursor-pointer hover:scale-125 transition-all duration-300"
                priority
              />
            </div>
            <p className="text-lg font-medium text-[#5e5a57] ">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
