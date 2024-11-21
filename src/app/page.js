import {Beanies, Tshirts } from "@/components/index";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <main className=" mt-32">
      <div className="w-full md:px-5 md:w-full mx-auto h-auto flex flex-col gap-y-8">
        <h1 className="px-3 font-extrabold text-3xl md:text-5xl ">
          {
            Tshirts.title
          }
        </h1>
        <div>
        <h2 className="px-3 text-xl md:text-3xl font-bold mb-5">
          {`T's`}
        </h2>
        <div className="flex gap-x-5 min-w-full overflow-x-auto scrollbar-none">
          {Tshirts.img.map((img, ind) => (
            <>
            <div key={ind} className=" bg-gray-400 p-5 flex-shrink-0 rounded-lg flex items-center">
              <Image
                src={img.img}
                alt={`Image ${ind + 1}`}
                width={300}
                height={300}
                className="object-cover"// Keeps the image scaling consistent
              />
            </div>
            </>
          ))}
        </div>
      </div>


        <div>
        <h2 className="px-3 text-xl md:text-3xl font-bold mb-5">
          {`Beanies`}
        </h2>
        <div className="flex gap-x-5 min-w-full overflow-x-auto scrollbar-none">
          {Beanies.img.map((img, ind) => (
            <figure key={ind} className=" bg-gray-400 p-5 flex-shrink-0 rounded-lg flex items-center">
              <Image
                src={img.img}
                alt={`Image ${ind + 1}`}
                width={300}
                height={300}
                className="object-cover"// Keeps the image scaling consistent
              />
            </figure>
          ))}
        </div>
      </div>
        </div>
    </main>
    </>
  );
}
