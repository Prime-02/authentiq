'use client'
import { useGlobalState } from '@/app/GlobalStateProvider';
import { ButtonTwo } from '@/components/reusables/buttons/Buttons';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { usePathname } from "next/navigation"; // Use usePathname for Next.js 13+

const layout = ({children}) => {
  const { formData, fetchBarcodes, getToken } = useGlobalState();
  const [barcodeCount, setBarcodeCount] = useState(1); // Default to 10
  const [loading, setLoading] = useState(null);
  const pathname = usePathname(); // Get the current pathname

  const adminRoute = formData.adminFirstName
    ? formData.adminFirstName
    : "admin";
  const statusHeader = [
    {
      route: `/admin/${adminRoute}/barcode`,
      status: "All",
    },
    {
      route: `/admin/${adminRoute}/barcode/used`,
      status: "Used",
    },
    {
      route: `/admin/${adminRoute}/barcode/unused`,
      status: "Unused",
    },
  ];
  // Handle barcode generation
  const generateBarcodes = async () => {
    const token = getToken(`admin`);
    if (!token) {
      toast.error("Authorization token is missing!");
      return;
    }

    setLoading(`true`);

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
      setLoading(null);
    }
  };
  return (
    <div>
      <header className="w-full text-xs flex gap-x-5 py-8 px-4 sm:px-6 lg:px-8">
        {statusHeader.map((status, ind) => (
          <Link
            href={status.route}
            key={ind}
            className={`flex items-center gap-x-2 ${
              pathname === status.route ||
              (pathname.startsWith(status.route) &&
                status.route !== "/admin/admin/order")
                ? "card px-3 py-1 rounded-lg"
                : ""
            }`}
          >
            <p className="hidden sm:flex">{status.status}</p>
          </Link>
        ))}
      </header>
      {/* Barcode Generation Controls */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center">
          <label htmlFor="barcodeCount" className="mr-2 text-lg">
            Number of Barcodes:
          </label>
          <input
            id="barcodeCount"
            type="number"
            value={barcodeCount}
            onChange={(e) => setBarcodeCount(parseInt(e.target.value))}
            className=" card px-4 py-2 rounded-md"
            min="1"
            max="100"
          />
        </div>
        <ButtonTwo
          Clicked={generateBarcodes}
          disabled={loading === `true`}
          buttonValue={`Generate ${barcodeCount} Barcode${
            barcodeCount > 1 ? "s" : ""
          }`}
          className={`rounded-lg`}
        />
      </div>

      {children}
    </div>
  );
}

export default layout