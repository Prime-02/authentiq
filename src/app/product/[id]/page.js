"use server";

// app/product/[id]/page.js

import SizeSelector from "@/components/reusables/Selectors/SizeSelector";
import Image from "next/image";
import axios from "axios";
import Reviews from "@/components/reviews/Reviews";
import DynamicImage from "./DynamicImage";

// This will be used to generate paths for the dynamic route
export async function generateStaticParams() {
  // Fetch products from the API using Axios
  const response = await axios.get(
    "https://isans.pythonanywhere.com/shop/get-products/"
  );
  const products = response.data;

  const paths = products.flatMap((product) => ({
    id: product.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  return paths;
}

// This fetches the data based on the dynamic ID (Server Component)
export default async function ProductPage({ params }) {
  const { id } = await params; // Await params to use id correctly

  // Fetch products from the API using Axios
  const response = await axios.get(
    "https://isans.pythonanywhere.com/shop/get-products/"
  );
  const products = response.data;

  // Find the product by the dynamic ID
  const product = products.find(
    (prod) => prod.name.toLowerCase().replace(/\s+/g, "-") === id
  );

  if (!product) return <p>Product not found</p>;

  

  return (
    <div className="w-[90%] sm:w-[70%] mx-auto min-h-screen flex flex-col items-center justify-center mt-24 sm:mt-0">
      <div className="flex flex-col sm:flex-row items-center gap-x-10 w-full">
        <div className="flex items-center justify-center rounded-lg shadow-2xl bg-blue-200 h-[50dvh] w-full sm:w-1/2">
         <DynamicImage prop={product.image} prod={product.name}/>
        </div>

        <div className="sm:mt-0 mb-10 flex flex-col w-full sm:w-1/2 gap-y-5 h-full items-start ">
          <SizeSelector sizes={product.sizes.split(",")} product={product} />
        </div>
      </div>
      <section>
        <Reviews id={product.id}/>
      </section>
    </div>
  );
}
