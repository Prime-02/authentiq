'use client'
import Image from "next/image";
import React, { useState } from "react";

const DynamicImage = ({ prop, prod }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="relative">
      {/* Show loading text while the image is loading */}
      {isImageLoading && (
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Loading Image...
        </p>
      )}

      <Image
        src={`https://isans.pythonanywhere.com${prop}`} // Append base URL to image path
        alt={prod}
        width={300}
        height={300}
        className="rounded-lg object-contain"
        onLoad={() => setIsImageLoading(false)} // Set loading to false when the image has loaded
        priority
      />
    </div>
  );
};

export default DynamicImage;
