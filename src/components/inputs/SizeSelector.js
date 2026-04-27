// components/inputs/SizeSelector.jsx
"use client";
import React from "react";
import { CheckBoxList } from "@/components/inputs/CheckBox";

export const DEFAULT_SIZES = [
  { id: "xs", label: "XS", size: "XS", checked: false },
  { id: "s", label: "S", size: "S", checked: false },
  { id: "m", label: "M", size: "M", checked: false },
  { id: "fs", label: "FS", size: "FS", checked: false },
  { id: "l", label: "L", size: "L", checked: false },
  { id: "xl", label: "XL", size: "XL", checked: false },
];

const SizeSelector = ({
  sizes = DEFAULT_SIZES,
  onChange,
  label = "Available Sizes",
  showOptional = true,
  showSelectedCount = true,
  showSelectedTags = true,
  disabled = false,
  className = "",
  sizeClassName = "",
  layout = "list",
}) => {
  const handleSizeChange = (item) => {
    if (!disabled && onChange) {
      const updatedSizes = sizes.map((size) =>
        size.id === item.id ? { ...size, checked: !size.checked } : size,
      );
      onChange(updatedSizes);
    }
  };

  const getSelectedSizes = () => {
    return sizes.filter((size) => size.checked);
  };

  const selectedSizes = getSelectedSizes();
  const selectedCount = selectedSizes.length;

  const getLayoutClass = () => {
    switch (layout) {
      case "grid":
        return "grid grid-cols-2 sm:grid-cols-3 gap-2";
      case "horizontal":
        return "flex flex-wrap gap-3";
      case "list":
      default:
        return "flex flex-col divide-y divide-[var(--border-color)]";
    }
  };

  return (
    <div className={`size-selector ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-[var(--text-secondary)] font-medium">
          {label}
          {showOptional && (
            <span className="text-[var(--text-muted)] font-normal ml-1">
              (optional)
            </span>
          )}
        </label>
        {showSelectedCount && selectedCount > 0 && (
          <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded-full">
            {selectedCount} selected
          </span>
        )}
      </div>

      <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
        <CheckBoxList
          items={sizes}
          onChange={handleSizeChange}
          className={`${getLayoutClass()} ${sizeClassName}`}
        />
      </div>

      {showSelectedTags && selectedCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedSizes.map((size) => (
            <span
              key={size.id}
              className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-1 rounded-md font-medium"
            >
              {size.label || size.size}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
