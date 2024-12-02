import React from "react";

const BarcodeDropdown = ({ products, onSelectBarcode }) => {
  return (
    <select
      onChange={(e) => onSelectBarcode(e.target.value)}
      className="border border-gray-300 px-4 py-2 rounded-md"
    >
      <option value="">Select Barcode</option>
      {products
        .filter((product) => product.status === "unused") // Only unused barcodes
        .map((product) => (
          <option key={product.id} value={product.id}>
            {product.code}
          </option>
        ))}
    </select>
  );
};

export default BarcodeDropdown;
