'use client';  // Ensure this component runs on the client-side

import { Shipping } from '@/components/index';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SizeSelector({ sizes, product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [prodInfo, setProdInfo] = useState(false)

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // Log the selected size along with the product details
    console.log('Product Details:', product);
    console.log('Selected Size:', size);
  };

  return (
    <div className='flex flex-col items-start justify-center gap-y-3 mx-auto'>
    <div className="text-lg flex gap-2 flex-wrap">
      {sizes?.map((size, ind) => (
        <span
          key={ind}
          onClick={() => handleSizeSelect(size)}
          className={`border rounded h-10 flex items-center justify-center w-10 cursor-pointer ${
            selectedSize === size ? 'bg-blue-600 text-white' : 'border-blue-600'
          }`}
        >
          {size}
        </span>
      ))}
    </div>
    <div className="border-neutral-600 w-full mx-auto mt-3 rounded-lg ">
  <p
    className="cursor-pointer flex gap-x-24  transition-all duration-200 w-full "
  >
    <span>
    {Shipping.title}
    </span>
    <span
     onClick={() => setProdInfo(!prodInfo)}
     className='focus:animate-spin'
    >
        {
            prodInfo ? <Minus/> : <Plus/>
        }
    </span>
  </p>
  
  <div
    className={`overflow-hidden transition-all duration-1000 ease-in-out ${prodInfo ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
  >
    {Shipping.points.map((ship, ind) => (
      <div className="flex items-start space-x-4 py-2" key={ind}>
        <span className="text-2xl ">
          {ship.icon}
        </span>
        <span className="flex flex-col space-y-1">
          <p className="font-medium  text-lg">{ship.heading}</p>
          <p className=" text-sm">{ship.text}</p>
        </span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
