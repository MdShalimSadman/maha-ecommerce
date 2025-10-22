

import { groq } from "next-sanity";
import { client } from "@/lib/sanity.client";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/types";

const query = groq`
  *[_type == "product" && category->slug.current == $slug]{
    _id,
    title,
    slug,
    "imageUrl": image.asset->url,
    price,
    category->{name, slug}
  }
`;

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const products: Product[] = await client.fetch(query, { slug });

  if (!products?.length) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">
          No products found for category:{" "}
          <span className="text-primary">{slug}</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-10 text-4xl font-bold capitalize text-center">
        {slug} Products
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
