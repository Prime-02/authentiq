"use client";

import { useGlobalState } from "@/app/GlobalStateProvider";
import Barcode from "@/components/barcode/BarcodePage";
import JsBarcode from "jsbarcode";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BarcodePage = () => {
  const { formData, fetchBarcodes } = useGlobalState();
  const Products = formData?.barcodes || []; // Ensure it's an array

  const [barcodeCount, setBarcodeCount] = useState(10); // Default to 50
  const [loading, setLoading] = useState(false);

  // Generate and download barcode
  const generateAndDownloadBarcode = (value, name) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 50,
      displayValue: true,
    });

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${name}-barcode.png`;
    link.click();
  };

  // Handle barcode generation
  const generateBarcodes = async () => {
    const token =
      localStorage.getItem("adminAuthToken") ||
      sessionStorage.getItem("adminAuthToken");
    if (!token) {
      toast.error("Authorization token is missing!");
      return;
    }

    setLoading(true);

    try {
      const start = Math.floor(Math.random() * 10000); // Random start number between 0 and 9999
      const count = barcodeCount;

      // Call the API with the generated start and count
      const response = await fetch(
        "https://isans.pythonanywhere.com/shop/generate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the token for authorization
          },
          body: JSON.stringify({ start, count }),
        }        
      );
        console.log(response);
      if (response.status === 200 || response.status === 201) {
        // Fetch the updated barcode data and refresh the page
        await fetchBarcodes(); // Assuming this function fetches the latest barcode data
        toast.success("Barcodes generated successfully!");
      } else {
        toast.error("Failed to generate barcodes.");
      }
    } catch (error) {
      console.error("Error generating barcodes:", error);
      toast.error("An error occurred while generating barcodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchBarcodes()
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Product Barcode List
      </h1>

      {/* Barcode Generation Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <label htmlFor="barcodeCount" className="mr-2 text-lg">
            Number of Barcodes:
          </label>
          <input
            id="barcodeCount"
            type="number"
            value={barcodeCount}
            onChange={(e) => setBarcodeCount(parseInt(e.target.value))}
            className="border border-gray-300 px-4 py-2 rounded-md"
            min="1"
            max="100"
          />
        </div>
        <button
          onClick={generateBarcodes}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Barcodes"}
        </button>
      </div>

      <div className="overflow-x-auto">
        {Products.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Code</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Barcode</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{product.id}</td>
                  <td className="px-4 py-2 border-b">{product.code}</td>
                  <td className="px-4 py-2 border-b">{product.status}</td>
                  <td className="px-4 py-2 border-b">
                    <Barcode value={product.code} />
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        generateAndDownloadBarcode(product.code, product.code)
                      }
                    >
                      <Download className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default BarcodePage;
