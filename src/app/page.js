// app/page.js (Home Page)
import { Products } from "@/components/index";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full md:w-full mx-auto h-auto flex flex-col gap-y-8">
        <h1 className="font-extrabold text-3xl md:text-5xl">
          {"What would you like to buy from us?"}
        </h1>

        {Products.map((product, ind) => {
          // Extract the first key of the product object (e.g., "Tshirts" or "Beanies")
          const [key, value] = Object.entries(product)[0];

          return (
            <div key={ind}>
              <h2 className="text-xl md:text-3xl font-bold mb-5">
                {value.title}
              </h2>
              <div className="flex gap-x-5 min-w-full overflow-x-auto scrollbar-none pb-16 scroll-snap-x scroll-snap-mandatory">
  {value.img.map((img, imgInd) => (
    <Link
      href={`/product/${img.title.toLowerCase().replace(/\s+/g, "-")}`}
      passHref
      key={imgInd}
      className="flex-shrink-0 flex flex-col min-h-full items-center justify-between p-5 bg-white shadow-2xl overflow-hidden rounded-lg scroll-snap-align-start"
    >
      {/* Image */}
      <div className="rounded-lg overflow-hidden flex items-center justify-center flex-1">
        <Image
          src={img.img}
          alt={`Image ${imgInd + 1}`}
          width={250}
          height={250}
          className="object-cover hover:scale-125 transition"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      {/* Title */}
      <figcaption className="mt-4 text-lg font-bold text-customGray">
        {img.title}
      </figcaption>

      {/* Price */}
      <p className="text-lg font-semibold text-customGray">
        ${img.price}
      </p>
    </Link>
  ))}
</div>

            </div>
          );
        })}
      </div>
    </main>
  );
}
