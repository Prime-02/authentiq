import React, { useState } from "react";

const Dropdown = ({
  options = [],
  onSelect,
  tag = "item",
  placeholder = "Select an option",
  valueKey = "id", // Key for the value attribute
  displayKey = "code", // Key for the display text
  filterFn = () => true, // Default filter (no filtering)
  className = "",
  divClassName ='',
  emptyMessage = `No ${tag} available`, // Message for empty dropdown
}) => {
  // Filter the options
  const filteredOptions = options.filter(filterFn);
  const [dropdown, setDropdownOpen] = useState(false);

  return (
    <div className={`${divClassName} flex items-center w-full relative w-32`}>
      <select
        onClick={() => setDropdownOpen(!dropdown)}
        onChange={(e) => onSelect(e.target.value)}
        className={`bg-transparent select outline-none  w-full cursor-pointer ${className}`}
      >
        {/* Placeholder */}
        <option className="card" value="">
          {placeholder}
        </option>

        {/* Render Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <option
              className="card"
              key={option[valueKey]}
              value={option[valueKey]}
            >
              {option[displayKey]}
            </option>
          ))
        ) : (
          // Empty State
          <option className="card" disabled>
            {emptyMessage}
          </option>
        )}
      </select>
    </div>
  );
};

export default Dropdown;
