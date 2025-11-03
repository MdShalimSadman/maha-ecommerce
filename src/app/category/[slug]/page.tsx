import { groq } from "next-sanity";
import { client } from "@/lib/sanity.client";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/types";
import AnimatedHeading from "@/components/common/AnimatedHeading";

const query = groq`
  *[_type == "product" && category->slug.current == $slug]{
    _id,
    title,
    slug,
    "imageUrl": image.asset->url,
    price,
    category->{name, slug},
    sale,
    sizes
  }
`;

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const products: Product[] = await client.fetch(query, { slug });

  // Convert "modest-gown" -> "MODEST GOWN"
  const formattedSlug = slug.replace(/-/g, " ").toUpperCase();

  if (!products?.length) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">
          No products found for category:{" "}
          <span className="text-primary">{formattedSlug}</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col justify-center py-6 px-8">
      <div className="flex items-end gap-2">
        <p className="text-xl font-medium text-[#A6686A]">CATEGORY</p>
        <AnimatedHeading text={formattedSlug} />
      </div>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
