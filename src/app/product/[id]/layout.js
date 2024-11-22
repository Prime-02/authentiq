// app/product/[id]/layout.js
import { Suspense } from "react";
import { ProductPage } from "./page"; // The dynamic content for each product

export default function ProductLayout({ children }) {
  return (
    <div className="">
      {/* Suspense is used here to delay rendering the dynamic content until it's ready */}
      <Suspense fallback={<p>Loading product details...</p>}>
        {children}
      </Suspense>
    </div>
  );
}
