import { groq } from "next-sanity";
import { client } from "@/lib/sanity.client";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/types";
import AnimatedHeading from "@/components/common/AnimatedHeading";

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
    <div className="mt-2 flex flex-col justify-center py-6 px-2 md:px-8">
       <AnimatedHeading text="SALE" isSlash={false} /> 
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 ">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
