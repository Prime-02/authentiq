// components/SummaryRow.jsx
import React from "react";

const SummaryRow = ({ label, value, withBorder = false }) => {
  return (
    <div
      className={`flex justify-between py-2 ${
        withBorder ? "border-t border-border" : ""
      }`}
    >
      <span className="text-secondary">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

export default SummaryRow;
