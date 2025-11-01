// components/products/ProductInteraction.tsx

'use client'; // 👈 Essential for client-side interactivity (useState, onClick)

import { useState } from 'react';
import { Product } from '@/types/types';
import AddToCartButton from '@/components/cart/AddToCartButton';
import WishlistButton from '@/components/wishlist/WIshlistButton';

interface ProductInteractionProps {
  product: Product;
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
  // 1. State to track the selected size
  const [selectedSize, setSelectedSize] = useState<number | null>(
    // Set initial state to the first size, if available
    product.sizes?.length ? product.sizes[0] : null
  );

  return (
    <>
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Select Size</h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 border rounded transition cursor-pointer hover:bg-[#A6686A] hover:text-white
                  ${
                    selectedSize === size
                      ? 'bg-[#A6686A] text-white border-[#A6686A]'
                      : 'border-[#A6686A] text-[#A6686A]'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
          {/* Optional: Display error if no size is selected, though we pre-select one */}
          {product.sizes.length > 0 && !selectedSize && (
            <p className="text-sm text-red-500 mt-2">Please select a size.</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 items-center">
        <AddToCartButton 
          product={product} 
          selectedSize={selectedSize} // Assuming AddToCartButton can accept this prop
          disabled={!selectedSize && product.sizes && product.sizes.length > 0} // Disable if size is required but not picked
        />
        <WishlistButton product={product} />
      </div>
    </>
  );
}