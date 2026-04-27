import React from "react";
import Barcode from "@/components/barcode/BarcodePage";
import StatusBadge from "./StatusBadge";
import BarcodeActions from "./BarcodeActions";
import { fmt, expiryDisplay } from "./barcodeUtils";

const TABLE_HEADERS = [
  "Code",
  "Product",
  "Status",
  "Generated",
  "Expires",
  "Used at",
  "Barcode",
  "Actions",
];

const BarcodeTable = ({
  barcodes,
  selected,
  onToggle,
  onToggleAll,
  copiedId,
  openMenuId,
  onDownload,
  onCopy,
  onMenuToggle,
  onMenuClose,
  products,
  onAction,
}) => (
  <table className="w-full text-sm" style={{ tableLayout: "auto" }}>
    <thead>
      <tr style={{ background: "var(--bg-secondary)" }}>
        {/* Select-all checkbox */}
        <th className="px-4 py-3 w-9">
          <input
            type="checkbox"
            checked={selected.size === barcodes.length && barcodes.length > 0}
            onChange={onToggleAll}
            className="w-3.5 h-3.5 accent-indigo-600"
          />
        </th>
        {TABLE_HEADERS.map((h, i) => (
          <th
            key={i}
            className="px-3 py-3 text-left font-Montserrat text-[11px] font-semibold uppercase tracking-wider border-b"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--border-light)",
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>

    <tbody className="divide-y" style={{ borderColor: "var(--border-light)" }}>
      {barcodes.map((b) => {
        const exp = expiryDisplay(b.expires_at, b.status);
        const isSel = selected.has(b.id);

        return (
          <tr
            key={b.id}
            className="relative transition-colors"
            style={{
              background: isSel ? "rgba(99,102,241,0.06)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isSel)
                e.currentTarget.style.background = "var(--bg-secondary)";
            }}
            onMouseLeave={(e) => {
              if (!isSel) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Checkbox */}
            <td className="px-4 py-3">
              <input
                type="checkbox"
                checked={isSel}
                onChange={() => onToggle(b.id)}
                className="w-3.5 h-3.5 accent-indigo-600"
              />
            </td>

            {/* Code */}
            <td
              className="px-3 py-3 font-mono text-[11px] truncate"
              style={{ color: "var(--text-secondary)" }}
              title={b.code}
            >
              {b.code}
            </td>

            {/* Product */}
            <td
              className="px-3 py-3 text-xs truncate"
              style={{ color: "var(--text-muted)" }}
            >
              {b.product?.name ??
                (b.product_id ? b.product_id.slice(0, 8) + "…" : "—")}
            </td>

            {/* Status */}
            <td className="px-3 py-3">
              <StatusBadge status={b.status} />
            </td>

            {/* Generated */}
            <td
              className="px-3 py-3 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {fmt(b.generated_at)}
            </td>

            {/* Expires */}
            <td
              className={`px-3 py-3 text-xs ${exp.cls}`}
              style={!exp.cls ? { color: "var(--text-muted)" } : undefined}
            >
              {exp.label}
            </td>

            {/* Used at */}
            <td
              className="px-3 py-3 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {fmt(b.used_at)}
            </td>

            {/* Barcode visual */}
            <td className="px-3 py-3">
              <Barcode
                value={b.code}
                width={2}
                height={22}
                displayValue={false}
              />
            </td>

            {/* Actions — dedicated cell, separate from Barcode */}
            <td className="px-2 py-3">
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
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default BarcodeTable;
