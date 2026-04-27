import React, { useEffect, useRef } from "react";
import { Clock, ArrowRight, CheckCircle, Trash2 } from "lucide-react";
import { VALID_STATUSES } from "./barcodeUtils";

const MenuSection = ({ label, children }) => (
  <>
    <p
      className="font-Montserrat text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5"
      style={{ color: "var(--text-muted)" }}
    >
      {label}
    </p>
    {children}
  </>
);

const MenuButton = ({ icon, children, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs transition-colors capitalize"
    style={{ color: "var(--text-secondary)" }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {icon} {children}
  </button>
);

const RowMenu = ({ barcode, products, onAction, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-1 top-9 z-30 card border rounded-xl shadow-lg py-1.5 w-48"
      style={{ borderColor: "var(--border-color)" }}
    >
      <MenuSection label="Expiry">
        <MenuButton
          icon={<Clock size={13} className="text-indigo-500" />}
          onClick={() => onAction("extend", barcode)}
        >
          Extend expiry
        </MenuButton>
      </MenuSection>

      <MenuSection label="Assignment">
        <MenuButton
          icon={<ArrowRight size={13} className="text-indigo-500" />}
          onClick={() => onAction("reassign", barcode)}
        >
          Reassign product
        </MenuButton>
      </MenuSection>

      <div
        className="h-px my-1.5 mx-2"
        style={{ background: "var(--border-light)" }}
      />

      <MenuSection label="Status">
        {VALID_STATUSES.filter((s) => s !== barcode.status).map((s) => (
          <MenuButton
            key={s}
            icon={
              <CheckCircle size={13} style={{ color: "var(--text-muted)" }} />
            }
            onClick={() => onAction("status", barcode, s)}
          >
            Mark {s}
          </MenuButton>
        ))}
      </MenuSection>

      <div
        className="h-px my-1.5 mx-2"
        style={{ background: "var(--border-light)" }}
      />

      <button
        onClick={() => onAction("delete", barcode)}
        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-red-50 text-red-600 transition-colors capitalize"
      >
        <Trash2 size={13} /> Delete barcode
      </button>
    </div>
  );
};

export default RowMenu;
