"use client";

import type { Product } from "@/types/types";
import ProductCard from "./ProductCard";

interface ProductsListProps {
  products: Product[];
}

export default function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="mt-6 flex flex-col justify-center py-6 px-8">
      <h2 className="text-center font-semibold text-4xl text-[#A6686A]">
        Our Trending Products
      </h2>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
