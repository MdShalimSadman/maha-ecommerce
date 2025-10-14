import { getProducts } from "@/lib/sanity.queries";

import type { Product } from "@/types/types";
import ProductsList from "./component/common/ProductsList";
import Hero from "./component/home/Hero";

export default async function HomePage() {
  const products: Product[] = await getProducts(); 

  return (
    <main>
      <Hero/>
      <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <ProductsList products={products} />
      </div>
    </main>
  );
}
