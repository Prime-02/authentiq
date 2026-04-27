import React from "react";
import Barcode from "@/components/barcode/BarcodePage";
import StatusBadge from "./StatusBadge";
import BarcodeActions from "./BarcodeActions";
import { fmt, expiryDisplay } from "./barcodeUtils";

const MetaRow = ({ label, children }) => (
  <>
    <span style={{ color: "var(--text-muted)" }}>{label}</span>
    <span style={{ color: "var(--text-secondary)" }}>{children}</span>
  </>
);

const BarcodeCard = ({
  b,
  isSel,
  onToggle,
  copiedId,
  openMenuId,
  onDownload,
  onCopy,
  onMenuToggle,
  onMenuClose,
  products,
  onAction,
}) => {
  const exp = expiryDisplay(b.expires_at, b.status);

  return (
    <div
      className={`card rounded-xl border p-4 flex flex-col gap-3 transition-all ${
        isSel ? "ring-2 ring-indigo-500 ring-offset-1" : ""
      }`}
      style={{ borderColor: isSel ? "transparent" : "var(--border-light)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="checkbox"
            checked={isSel}
            onChange={() => onToggle(b.id)}
            className="w-3.5 h-3.5 accent-indigo-600 flex-shrink-0 mt-0.5"
          />
          <span
            className="font-mono text-[11px] truncate"
            style={{ color: "var(--text-secondary)" }}
            title={b.code}
          >
            {b.code}
          </span>
        </div>
        <StatusBadge status={b.status} />
      </div>

      {/* Barcode visual */}
      <div
        className="rounded-lg px-3 py-2 flex items-center justify-center border"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border-light)",
        }}
      >
        <Barcode value={b.code} width={1.5} height={32} displayValue={false} />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
        <MetaRow label="Product">
          {b.product?.name ??
            (b.product_id ? b.product_id.slice(0, 8) + "…" : "—")}
        </MetaRow>
        <MetaRow label="Generated">{fmt(b.generated_at)}</MetaRow>
        <MetaRow label="Expires">
          <span className={exp.cls || undefined}>{exp.label}</span>
        </MetaRow>
        <MetaRow label="Used at">{fmt(b.used_at)}</MetaRow>
      </div>

      {/* Actions footer */}
      <div
        className="flex items-center justify-end pt-2 border-t"
        style={{ borderColor: "var(--border-light)" }}
      >
        <BarcodeActions
          barcode={b}
          copiedId={copiedId}
          openMenuId={openMenuId}
          onDownload={onDownload}
          onCopy={onCopy}
          onMenuToggle={onMenuToggle}
          onMenuClose={onMenuClose}
          products={products}
          onAction={onAction}
        />
      </div>
    </div>
  );
};

export default BarcodeCard;
