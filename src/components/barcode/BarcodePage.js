'use client'
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ value }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128", // Specify the barcode format (e.g., CODE128, CODE39, etc.)
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true, // Display the value below the barcode
      });
    }
  }, [value]);

  return <svg ref={barcodeRef}></svg>;
};

export default Barcode;
