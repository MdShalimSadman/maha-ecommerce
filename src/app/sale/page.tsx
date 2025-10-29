import { groq } from "next-sanity";
import { client } from "@/lib/sanity.client";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/types";

// Fetch only products that have a sale value
const query = groq`
  *[_type == "product" && defined(sale) && sale > 0]{
    _id,
    title,
    slug,
    "imageUrl": image.asset->url,
    price,
    sale,
    sizes,
    category->{name, slug}
  }
`;

export default async function SalePage() {
  const products: Product[] = await client.fetch(query);

  if (!products?.length) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">
          No products are currently on sale.
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-10 text-4xl font-bold text-center text-primary">
        Sale Products
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
