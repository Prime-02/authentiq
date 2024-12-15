"use client";

import { useGlobalState } from "@/app/GlobalStateProvider";
import Barcode from "@/components/barcode/BarcodePage";
import { Download } from "lucide-react";
import { useParams } from "next/navigation"; // Import useParams for dynamic route parameters
import React, { useEffect } from "react";

const FilteredBarcodesPage = () => {
  const { formData, fetchBarcodes } = useGlobalState();
  const allBarcodes = formData?.barcodes || []; // Ensure it's an array
  const { status } = useParams(); // Retrieve the 'status' parameter dynamically

  // Filter barcodess by status
  const filteredProducts =
    status === "all"
      ? allBarcodes
      : allBarcodes.filter(
          (barcodes) => barcodes.status.toLowerCase() === status.toLowerCase()
        );

  useEffect(() => {
    fetchBarcodes();
  }, [fetchBarcodes]);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-start mb-6">
        {status === "all"
          ? "All Barcodes"
          : `${status?.charAt(0).toUpperCase() + status.slice(1)} Barcodes`}
      </h1>

      {/* Barcode Table */}
      <div className="overflow-x-auto">
        {filteredProducts.length > 0 ? (
          <table className="min-w-full table-auto border-collapse text-left">
            <thead>
              <tr className="card">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Code</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Barcode</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((barcodes) => (
                <tr key={barcodes.id} className="">
                  <td className="px-4 py-2 border-b">{barcodes.id}</td>
                  <td className="px-4 py-2 border-b">{barcodes.code}</td>
                  <td className="px-4 py-2 border-b">{barcodes.status}</td>
                  <td className="px-4 py-2 border-b">
                    <Barcode value={barcodes.code} />
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        generateAndDownloadBarcode(barcodes.code, barcodes.code)
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
          <p className="text-center text-gray-500">
            No barcodes available for this status.
          </p>
        )}
      </div>
    </div>
  );
};

export default FilteredBarcodesPage;
