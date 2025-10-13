import { client } from "./sanity.client";

export async function getProducts() {
  const query = `*[_type == "product"]{
    _id,
    title,
    price,
    "imageUrl": image.asset->url,
    category->{name}
  }`;
  
  return await client.fetch(query);
}
