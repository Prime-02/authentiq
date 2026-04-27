"use client";
import React from "react";
import BarcodeGeneratorControls from "./components/BarcodeGeneratorControls";

const layout = ({ children }) => {
  return (
    <div>
      <BarcodeGeneratorControls />
      {children}
    </div>
  );
};

export default layout;
