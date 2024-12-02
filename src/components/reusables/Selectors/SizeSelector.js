'use client';  // Ensure this component runs on the client-side

import { Shipping } from '@/components/index';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { ButtonTwo } from '../buttons/Buttons';

export default function SizeSelector({ sizes, product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [prodInfo, setProdInfo] = useState(false);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // Log the selected size along with the product details
    console.log('Product Details:', product);
    console.log('Selected Size:', size);
  };

  return (
    <div className="flex flex-col items-start  justify-center gap-y-6 mx-auto w-full sm:w-[80%] mt-16 md:mt-0">
      <p className="text-2xl sm:text-4xl font-semibold">{product.name}</p>
      <p className="text-lg ">${product.price}</p>

      {/* Size Selection */}
      <div className="text-lg flex gap-3 flex-wrap">
        {sizes?.map((size, ind) => (
          <span
            key={ind}
            onClick={() => handleSizeSelect(size)}
            className={`border rounded h-10 flex items-center justify-center w-12 cursor-pointer transition-colors duration-300 ${
              selectedSize === size
                ? "bg-blue-400 text-white"
                : "border-blue-400 text-blue-400"
            } hover:bg-blue-500 hover:text-white`}
          >
            {size}
          </span>
        ))}
      </div>

      {/* Add to Cart Button */}
      <ButtonTwo
        buttonValue="Add to Cart"
        iconValue={<ShoppingCart size={20} />}
      />

      {/* Product Description */}
      <p className="text-sm break-words whitespace-normal">
        {product.description}
      </p>

      {/* Shipping Information Section */}
      <div className=" w-full  rounded-lg">
        <p
          onClick={() => setProdInfo(!prodInfo)}
          className="cursor-pointer flex justify-between items-center text-lg font-semibold transition-all duration-200 w-full"
        >
          <span>{Shipping.title}</span>
          <span className="focus:animate-spin">
            {prodInfo ? <Minus /> : <Plus />}
          </span>
        </p>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            prodInfo ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {Shipping.points.map((ship, ind) => (
            <div className="flex items-start space-x-4 py-2 px-4" key={ind}>
              <span className="text-2xl text-blue-400">{ship.icon}</span>
              <span className="flex flex-col space-y-1">
                <p className="font-medium text-lg">{ship.heading}</p>
                <p className="text-sm ">{ship.text}</p>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
