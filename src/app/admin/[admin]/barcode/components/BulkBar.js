import React from "react";
import { VALID_STATUSES } from "./barcodeUtils";

const BulkBar = ({ selected, onUpdateStatus, onDeleteBulk, onDeselect }) => (
  <div
    className="flex items-center gap-2 rounded-xl px-4 py-2.5 mb-3 flex-wrap border"
    style={{
      background: "rgba(99,102,241,0.06)",
      borderColor: "rgba(99,102,241,0.25)",
    }}
  >
    <span className="font-Montserrat text-xs font-semibold text-indigo-600 mr-1">
      {selected.size} selected
    </span>
    <div className="w-px h-4" style={{ background: "rgba(99,102,241,0.25)" }} />

    {VALID_STATUSES.map((s) => (
      <button
        key={s}
        onClick={() => onUpdateStatus([...selected], s)}
        className="card text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors font-Poppins"
        style={{ borderColor: "var(--border-color)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--bg-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--bg-secondary)")
        }
      >
        Mark {s}
      </button>
    ))}

    <button
      onClick={onDeleteBulk}
      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-Poppins"
    >
      Delete selected
    </button>

    <button
      onClick={onDeselect}
      className="ml-auto text-xs font-Poppins"
      style={{ color: "var(--text-muted)" }}
    >
      Deselect all
    </button>
  </div>
);

export default BulkBar;
