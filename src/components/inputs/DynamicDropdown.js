import React from "react";

const Dropdown = ({
  options = [],
  onSelect,
  tag = "item",
  placeholder = "Select an option",
  valueKey = "id", // Key for the value attribute
  displayKey = "code", // Key for the display text
  filterFn = () => true, // Default filter (no filtering)
  className = "",
  emptyMessage = `No ${tag} available`, // Message for empty dropdown
}) => {
  // Filter the options
  const filteredOptions = options.filter(filterFn);

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className={`bg-transparent select outline-none ${className}`}
    >
      {/* Placeholder */}
      <option value="">{placeholder}</option>

      {/* Render Options */}
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[displayKey]}
          </option>
        ))
      ) : (
        // Empty State
        <option disabled>{emptyMessage}</option>
      )}
    </select>
  );
};

export default Dropdown;
