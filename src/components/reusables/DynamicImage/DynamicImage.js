"use client";
import React, { useState } from "react";
import { LoaderOne } from "@/components/Loader/Loader";

const DynamicImage = ({ prop, prod, width, height, className }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative">
      {/* Show loader while the image is loading */}
      {isImageLoading && !isError && (
        <div className="flex items-center overflow-visible justify-center">
          <LoaderOne fill={`#2563eb`} />
        </div>
      )}

      {/* HTML image tag */}
      {!isError && (
        <img
          src={`https://isans.pythonanywhere.com${prop || ""}`} // Append base URL to image path
          alt={prod}
          width={width || 300}
          height={height || 300}
          className={`rounded-lg object-contain ${className}`}
          onLoad={() => setIsImageLoading(false)} // Hide loader on successful load
          onError={() => setIsError(true)} // Set error state on load failure
          loading="lazy"
        />
      )}

      {/* Fallback content in case of an error */}
      {isError && (
        <div className="text-red-500 text-center">
          <p>No Image Found.</p>
        </div>
      )}
    </div>
  );
};

export default DynamicImage;
