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
          <h3 className="text-lg font-medium mb-2">Select Size</h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                // 2. Add onClick to update the selectedSize state
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 border rounded transition 
                  ${
                    // 3. Conditional class for visual selection
                    selectedSize === size
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                      : 'hover:bg-gray-100 border-gray-300'
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
        {/* 4. Pass the selectedSize to the AddToCartButton */}
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