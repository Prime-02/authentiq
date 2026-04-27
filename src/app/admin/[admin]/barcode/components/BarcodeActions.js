import React from "react";
import { Download, Copy, Check, MoreVertical } from "lucide-react";
import RowMenu from "./RowMenu";

const BarcodeActions = ({
  barcode,
  copiedId,
  openMenuId,
  onDownload,
  onCopy,
  onMenuToggle,
  onMenuClose,
  products,
  onAction,
}) => (
  <div className="relative flex items-center gap-0.5">
    <button
      onClick={() => onDownload(barcode.code)}
      title="Download"
      className="p-1.5 rounded-lg transition-colors"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--bg-hover)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Download size={13} />
    </button>

    <button
      onClick={() => onCopy(barcode.id, barcode.code)}
      title="Copy code"
      className="p-1.5 rounded-lg transition-colors"
      style={{
        color: copiedId === barcode.id ? undefined : "var(--text-muted)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--bg-hover)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {copiedId === barcode.id ? (
        <Check size={13} className="text-green-600" />
      ) : (
        <Copy size={13} />
      )}
    </button>

    <button
      onClick={() => onMenuToggle(barcode.id)}
      title="More"
      className="p-1.5 rounded-lg transition-colors"
      style={{
        background:
          openMenuId === barcode.id ? "var(--bg-hover)" : "transparent",
        color:
          openMenuId === barcode.id
            ? "var(--text-primary)"
            : "var(--text-muted)",
      }}
    >
      <MoreVertical size={13} />
    </button>

    {openMenuId === barcode.id && (
      <RowMenu
        barcode={barcode}
        products={products}
        onAction={onAction}
        onClose={onMenuClose}
      />
    )}
  </div>
);

export default BarcodeActions;
