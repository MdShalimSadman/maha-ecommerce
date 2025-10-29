

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

  // 🧮 Sale percentage calculation
  const salePercent =
    product.sale && product.price
      ? Math.round(((product.price - product.sale) / product.price) * 100)
      : null;

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Product Image */}
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={600}
          height={600}
          className="rounded-xl mb-6"
        />
      )}

      {/* Title & Category */}
      <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-2">{product.category?.name}</p>

      {/* Price Display */}
      {product.sale ? (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-2xl font-bold text-red-500">${product.sale}</p>
          <p className="text-gray-400 line-through">${product.price}</p>
          {salePercent && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {salePercent}%
            </span>
          )}
        </div>
      ) : (
        <p className="text-2xl font-bold mb-4">${product.price}</p>
      )}

      {/* Description */}
      <p className="mb-6">{product.description}</p>

      {/* 🤝 INTERACTIVITY LAYER: This component handles size selection and action buttons */}
      <ProductInteraction product={product} />

    </div>
  );
}
