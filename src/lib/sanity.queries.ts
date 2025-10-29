import { client } from "./sanity.client";

export async function getProducts() {
  const query = `*[_type == "product"]{
    _id,
    title,
    price,
    slug,
    "imageUrl": image.asset->url,
    category->{name},
    sale,
    sizes
  }`;
  
  return await client.fetch(query);
}
