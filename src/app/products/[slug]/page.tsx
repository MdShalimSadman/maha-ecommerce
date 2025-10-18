import { client } from "@/lib/sanity.client";
import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    price,
    "imageUrl": image.asset->url,
    category->{name},
    description
  }`;
  return client.fetch(query, { slug });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={600}
          height={600}
          className="rounded-xl mb-6"
        />
      )}
      <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-2">{product.category?.name}</p>
      <p className="text-lg font-medium mb-4">${product.price}</p>
      <p className="mb-6">{product.description}</p>

      {/* Add to Cart button (client component) */}
      <AddToCartButton product={product} />
    </div>
  );
}
