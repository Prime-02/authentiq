// app/product/[id]/page.js
import { Products } from "@/components/index";
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
  
  const allProducts = Products.flatMap((product) =>
    Object.entries(product)[0][1].img.map((img) => ({
      ...img,
      category: Object.entries(product)[0][0],
    }))
  );

  const product = allProducts.find(
    (prod) => prod.title.toLowerCase().replace(/\s+/g, "-") === params.id
  );

  if (!product) return <p>Product not found</p>;

  return (
    <div className="w-[80%] md:w-[70%] mx-auto my-10">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <div className="mt-5 flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col items-center rounded-lg shadow-2xl">
          <Image
            src={product.img}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>

        <div className="mt-5 md:mt-0 flex flex-col gap-y-3">
          
        <p className="mt-4 font-extrabold text-2xl md:text-4xl">{product.title}</p>
          <p className="text-lg font-semibold">Price: ${product.price}</p>
          <p className="text-lg font-semibold flex gap-x-5">
            {product.sizes.map((size, ind)=>(
              <span key={ind} className="border-blue-600 border rounded-lg h-10 flex items-center justify-center w-10 focus:bg-blue-600 focus:text-white">
                  {size}
              </span>
            ))}
          </p>
          <p className="text-md mt-4">Category: {product.category}</p>
          <p className="text-md mt-2">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
