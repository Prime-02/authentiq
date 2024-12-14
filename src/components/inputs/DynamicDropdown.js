import { ArrowDown, ArrowUp } from "lucide-react";
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
    <div className={`${divClassName} flex items-center relative w-32`}>
      <select
        onClick={() => setDropdownOpen(!dropdown)}
        onChange={(e) => onSelect(e.target.value)}
        className={`bg-transparent select outline-none  w-full cursor-pointer ${className}`}
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
      <span className="absolute right-1">
        {!dropdown ? <ArrowDown size={15} /> : <ArrowUp size={15} />}
      </span>
    </div>
  );
};

export default Dropdown;
