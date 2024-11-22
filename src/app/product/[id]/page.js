'use server'

// app/product/[id]/page.js
import { Products } from "@/components/index";
import { ButtonOne, ButtonTwo } from "@/components/reusables/buttons/Buttons";
import SizeSelector from "@/components/reusables/Selectors/SizeSelector";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

// This will be used to generate paths for the dynamic route
export async function generateStaticParams() {
  const paths = Products.flatMap((product) =>
    Object.entries(product)[0][1].img.map((img) => ({
      id: img.title.toLowerCase().replace(/\s+/g, "-"),
    }))
  );

  return paths;
}

// This fetches the data based on the dynamic ID (Server Component)
export default async function ProductPage({ params }) {
  const { id } = await params; // Await params to use id correctly

  const allProducts = Products.flatMap((product) =>
    Object.entries(product)[0][1].img.map((img) => ({
      ...img,
      category: Object.entries(product)[0][0],
    }))
  );

  const product = allProducts.find(
    (prod) => prod.title.toLowerCase().replace(/\s+/g, "-") === id
  );

  if (!product) return <p>Product not found</p>;
  return (
    <div className="w-[90%] sm:w-[70%] mx-auto h-auto sm:h-screen flex items-center justify-center mt-24 sm:mt-0 ">
      <div className="flex flex-col sm:flex-row items-center gap-x-10 w-full">
      <div className="flex items-center justify-center rounded-lg shadow-2xl bg-blue-200 h-[50dvh] w-full sm:w-1/2">
  <Image
    src={product.img}
    alt={product.title}
    width={300}
    height={300}
    className="rounded-lg object-contain"
  />
</div>


       <div className="sm:mt-0 flex flex-col w-full sm:w-1/2 gap-y-5 h-full items-start">
  {/* <p className="mt-4  text-2xl sm:text-4xl">{product.title}</p>
  <p className="text-lg ">${product.price}</p> */}
  <SizeSelector sizes={product.sizes} product={product} />
  {/* <p className="text-sm mt-2">{product.description}</p>
  <p className="text-sm mt-2">
    <ButtonTwo buttonValue={`Add to cart`} iconValue={<ShoppingCart size={20} />} />
  </p> */}
</div>

      </div>
    </div>
  );
}
