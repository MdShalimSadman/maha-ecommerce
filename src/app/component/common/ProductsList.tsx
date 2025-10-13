import type { Product } from "@/types/types";

interface ProductsListProps {
  products: Product[];
}

export default function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-400">{product.category?.name}</p>
        </div>
      ))}
    </div>
  );
}
