import { client } from "@/lib/sanity.client";
import type { Product } from "@/types/types";
import ProductCard from "@/components/product/ProductCard";

async function getNewInProducts(): Promise<Product[]> {
  // Fetch products created within the last 30 days, newest first
  const query = `
    *[_type == "product" && _createdAt > $thirtyDaysAgo]
    | order(_createdAt desc) {
       _id,
    title,
    price,
    slug,
    "imageUrl": image.asset->url,
    category->{name}
    }
  `;

  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return client.fetch(query, { thirtyDaysAgo: thirtyDaysAgo.toISOString() });
}

export default async function NewInPage() {
  const products = await getNewInProducts();

  return (
    <section className="mt-6 flex flex-col justify-center py-6 px-8">
      <h2 className="text-center font-semibold text-4xl text-[#A6686A]">
        New In
      </h2>

      {products.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-12">
          No new arrivals right now — check back soon!
        </p>
      )}
    </section>
  );
}
