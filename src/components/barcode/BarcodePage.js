"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ value }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true,
      });
    }
  }, [value]);

  return (
    <svg
      ref={barcodeRef}
      // className="mx-auto" // Centers the barcode image horizontally
    />
  );
};

export default Barcode;
