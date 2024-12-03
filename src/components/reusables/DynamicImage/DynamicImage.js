'use client'
import Image from "next/image";
import React, { useState } from "react";
import ImageSkeleton from "../skeleton/Skeleton";
import { LoaderOne } from "@/components/Loader/Loader";

const DynamicImage = ({ prop, prod, width, height, className }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="relative">
      {/* Show loading text while the image is loading */}
      {isImageLoading && (
        <div className=" flex items-center justify-center">
          <LoaderOne fill={`#2563eb`} />
        </div>
      )}

      <Image
        src={`https://isans.pythonanywhere.com${prop}`} // Append base URL to image path
        alt={prod}
        width={width ? width : 300}
        height={height ? height : 300}
        className={`rounded-lg object-contain ${className} `}
        onLoad={() => setIsImageLoading(false)} // Set loading to false when the image has loaded
        priority
        onError={(e) => {
          e.target.style.display = "none"; // Hide the broken image
        }}
      />
    </div>
  );
};

export default DynamicImage;
