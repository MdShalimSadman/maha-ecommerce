import { client } from "@/lib/sanity.client";
import Image from "next/image";

import ProductInteraction from "@/components/product/ProductInteraction";
import { Product } from "@/types/types";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    price,
    "imageUrl": image.asset->url,
    category->{name},
    description,
    slug,
    sale,
    sizes
  }`;

  const product = await client.fetch<Product>(query, { slug });
  return product;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product data on the server
  const product = await getProduct(params.slug);

  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const salePercent =
    product.sale && product.price
      ? Math.round(((product.price - product.sale) / product.price) * 100)
      : null;

  return (
    <div className="p-2 md:p-6 xl:p-12 mx-auto flex flex-col md:flex-row gap-2 md:gap-6 lg:gap-12 xl:gap-16 max-w-6xl ">
      {/* Product Image */}
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={400}
          height={400}
        />
      )}

      {/* Title & Category */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-2">{product.category?.name}</p>

        {/* Price Display */}
        {product.sale ? (
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xl font-semibold text-gray-900">
              BDT {product.sale}
            </p>
            <p className="text-gray-400 line-through">BDT {product.price}</p>
            {salePercent && (
              <span className=" text-[#7C4A4A] text-xs px-2 py-1 font-semibold rounded">
                {salePercent}% Off
              </span>
            )}
          </div>
        ) : (
          <p className="text-2xl font-bold mb-4">BDT {product.price}</p>
        )}

        {/* Description */}
        <p className="mb-6 text-gray-700">{product.description}</p>

        <ProductInteraction product={product} />
      </div>
    </div>
  );
}
