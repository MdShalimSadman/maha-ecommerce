import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity.client"; // Adjust path to your Sanity client

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [], categories: [] });
    }

    // Search for products
    const productsQuery = `*[_type == "product" && (
      title match $searchQuery ||
      category->name match $searchQuery
    )] | order(_createdAt desc) [0...8] {
      _id,
      title,
      price,
      "imageUrl": image.asset->url,
      slug,
      "category": category->{
        name
      }
    }`;

    // Search for categories
    const categoriesQuery = `*[_type == "category" && name match $searchQuery] | order(name asc) [0...5] {
      _id,
      name,
      slug,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`;

    // Execute both queries in parallel
    const [products, categories] = await Promise.all([
      client.fetch(productsQuery, { searchQuery: `${query}*` }),
      client.fetch(categoriesQuery, { searchQuery: `${query}*` }),
    ]);

    return NextResponse.json({ 
      products, 
      categories 
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search", products: [], categories: [] },
      { status: 500 }
    );
  }
}