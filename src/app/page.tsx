import { getProducts } from "@/lib/sanity.queries";
import type { Product } from "@/types/types";
import ProductsList from "../components/product/ProductsList";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";

export default async function HomePage() {
  const products: Product[] = await getProducts();

  const limitedProducts = products.slice(0, 8);

  return (
    <main>
      <Hero />
      <Categories />
      <ProductsList products={limitedProducts} />
    </main>
  );
}
