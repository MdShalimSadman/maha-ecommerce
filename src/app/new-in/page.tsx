import { client } from "@/lib/sanity.client";
import type { Product } from "@/types/types";
import ProductCard from "@/components/product/ProductCard";
import AnimatedHeading from "@/components/common/AnimatedHeading";

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
    <section className="mt-2 flex flex-col justify-center py-6 px-2 md:px-8">
      <AnimatedHeading text="NEW IN" isSlash={false} />
      {products.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
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
