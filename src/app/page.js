import { BentoImg } from "@/components/index";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <main className=" mt-32">
      <div className="w-full md:px-5 md:w-full mx-auto border-x h-auto">
        <h1 className="font-extrabold text-3xl md:text-5xl mb-10">
          {
            BentoImg.title
          }
        </h1>
        <div className="flex gap-x-5 min-w-full overflow-x-auto">
          {BentoImg.img.map((img, ind) => (
            <figure key={ind} className="border bg-gray-400 p-5 flex-shrink-0 rounded-lg">
              <Image
                src={img.img}
                alt={`Image ${ind + 1}`}
                className="object-cover"// Keeps the image scaling consistent
              />
            </figure>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
