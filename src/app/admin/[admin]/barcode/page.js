'use client';

import { useGlobalState } from '@/app/GlobalStateProvider';
import Barcode from '@/components/barcode/BarcodePage';
import JsBarcode from 'jsbarcode';
import { Download } from 'lucide-react';
import React, { useRef } from 'react';

const Page = () => {
  const { formData } = useGlobalState();
  const Products = formData?.products || []; // Ensure it's an array

  const generateAndDownloadBarcode = (value, name) => {
    // Create a temporary canvas
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 50,
      displayValue: true,
    });

    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL('image/png');

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${name}-barcode.png`;
    link.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Product List</h1>
      <div className="overflow-x-auto">
        {Products.length > 0 ? (
          <table className="table-auto border-collapse  w-full text-left">
            <thead>
              <tr className="">
                <th className=" px-4 py-2">#</th>
                <th className=" px-4 py-2">Name</th>
                <th className=" px-4 py-2">Price</th>
                <th className=" px-4 py-2">Barcode</th>
                <th className=" px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Products.map((product, index) => (
                <tr key={index} className="">
                  <td className=" px-4 py-2">{index + 1}</td>
                  <td className=" px-4 py-2">{product.name}</td>
                  <td className=" px-4 py-2">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className=" px-4 py-2">
                    <Barcode value={product.barcode} />
                  </td>
                  <td className=" px-4 py-2 flex items-center justify-center">
                    <button
                      className=" hover:underline"
                      onClick={() =>
                        generateAndDownloadBarcode(product.barcode, product.name)
                      }
                    >
                      <Download/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
