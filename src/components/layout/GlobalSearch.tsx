"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Package, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/types"; // Adjust path as needed

interface SearchResults {
  products: Product[];
  categories: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    productCount?: number;
  }>;
}

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    products: [],
    categories: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.trim().length > 0) {
        searchAll(query);
      } else {
        setResults({ products: [], categories: [] });
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const searchAll = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) throw new Error("Search failed");
      
      const data = await response.json();
      setResults({
        products: data.products || [],
        categories: data.categories || [],
      });
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults({ products: [], categories: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults({ products: [], categories: [] });
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  const hasResults = results.products.length > 0 || results.categories.length > 0;

  return (
    <div ref={searchRef} className="relative w-fit md:min-w-60 max-w-md">
     <div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
  <Input
    type="text"
    placeholder="Search products, categories..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="
      pl-10 w-full bg-transparent border-0 border-b border-[#A6686A]
      focus:border-[#7C4A4A] focus:!ring-0 
      transition-colors duration-200 !rounded-none
    "
  />
  {query && (
    <button
      onClick={clearSearch}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <X className="w-4 h-4" />
    </button>
  )}
</div>


      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#A6686A] rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-gray-500 font-medium">Searching...</p>
            </div>
          ) : hasResults ? (
            <div>
              {/* Categories Section */}
              {results.categories.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      Categories ({results.categories.length})
                    </h3>
                  </div>
                  <div className="py-1">
                    {results.categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug.current}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#A6686A] bg-opacity-10 rounded flex items-center justify-center">
                          <Tag className="w-5 h-5 text-[#A6686A]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{category.name}</p>
                          {category.productCount !== undefined && (
                            <p className="text-xs text-gray-500">
                              {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {results.products.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                      <Package className="w-3 h-3" />
                      Products ({results.products.length})
                    </h3>
                  </div>
                  <div className="py-1">
                    {results.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug.current}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[#A6686A] font-semibold text-sm">
                              ${product.price.toFixed(2)}
                            </p>
                            {product.category && (
                              <span className="text-xs text-gray-500">
                                • {product.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;