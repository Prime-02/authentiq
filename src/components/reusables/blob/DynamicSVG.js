import React from 'react';

const DynamicSVG = ({ gradient, size, className }) => {
  return (
    <svg
      id="visual"
      viewBox="0 0 900 600"
      width={size?.width || 900}
      height={size?.height || 600}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      className={className} // Apply the className for dynamic positioning and styles
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: gradient?.start || "#ff0066", stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: gradient?.end || "#ff6600", stopOpacity: 0.5 }} />
        </linearGradient>
      </defs>
      <g transform="translate(492.6151456877542 328.512707941018)">
        <path
          d="M162.1 -312.2C200 -259 213.4 -195 229.5 -141.2C245.6 -87.3 264.3 -43.7 277.1 7.4C290 58.5 297 117 268.6 149.5C240.2 182 176.3 188.4 125.7 223.3C75 258.2 37.5 321.6 -9.3 337.8C-56.2 354 -112.3 322.9 -145.7 278C-179 233.1 -189.5 174.3 -227.6 125.6C-265.7 77 -331.4 38.5 -358.6 -15.7C-385.9 -70 -374.8 -140 -334 -183.9C-293.2 -227.8 -222.6 -245.5 -162 -285.5C-101.3 -325.5 -50.7 -387.8 5.7 -397.7C62.2 -407.7 124.3 -365.4 162.1 -312.2"
          fill="url(#gradient)"
        />
      </g>
    </svg>
  );
};

export default DynamicSVG;
