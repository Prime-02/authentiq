"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ value, width, height, displayValue }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        lineColor: "#000",
        width: width || 2,
        height: height || 50,
        displayValue: displayValue !== undefined ? displayValue : true,
      });
    }
  }, [value, width, height, displayValue]);

  return (
    <div
      style={{
        display: "inline-block",
        minWidth: "fit-content",
      }}
    >
      <svg ref={barcodeRef} />
    </div>
  );
};

export default Barcode;
