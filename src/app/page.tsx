import { getProducts } from "@/lib/sanity.queries";

import type { Product } from "@/types/types";
import ProductsList from "./component/common/ProductsList";
import Hero from "./component/home/Hero";
import Categories from "./component/home/Categories";

export default async function HomePage() {
  const products: Product[] = await getProducts(); 

  return (
    <main>
      <Hero/>
      <Categories/>
      <ProductsList products={products} />
    </main>
  );
}
