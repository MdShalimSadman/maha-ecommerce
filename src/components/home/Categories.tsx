"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, Variants } from "framer-motion";

const categories = [
  { name: "Modest Gown", src: "/images/categories/modest-gown-2.jpg" },
  { name: "Hijab", src: "/images/categories/hijab.jpg" },
  { name: "Abaya", src: "/images/categories/abaya.jpg" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
};

const Categories = () => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center py-6 px-8">
      <h2 className="text-center font-semibold text-2xl md:text-4xl text-[#A6686A]">
        Top Categories
      </h2>

      <div className="flex flex-col md:flex-row justify-between mt-12 gap-6 xl:gap-12 px-2 md:!px-6">
        {categories.map((category, i) => (
          <motion.div
            key={category.name}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.2 }} // stagger effect manually
          >
            <Link
              href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative w-60 h-60 overflow-hidden rounded-full border border-gray-200">
                <Image
                  src={category.src}
                  alt={category.name}
                  fill
                  className="object-cover cursor-pointer hover:scale-125 transition-all duration-300"
                  priority
                />
              </div>
              <p className="text-lg font-medium text-[#5e5a57]">
                {category.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
