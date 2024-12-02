"use client";
import { useGlobalState } from "@/app/GlobalStateProvider"; // Adjust the path as needed

// A simple component to retrieve products from global state
const ProductsFetcher = ({ children }) => {
  const { formData } = useGlobalState();

  // Provide the products data to children or directly use it in the component
  const products = formData.products || [];

  return (
    <>
      {/* Render children, passing products data as a prop */}
      {children ? React.cloneElement(children, { products }) : null}
    </>
  );
};

export default ProductsFetcher;
