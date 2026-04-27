import React from "react";
import { Clock } from "lucide-react";
import { Modal, ModalFooter } from "./Modal";
import { fmt, getDaysUntilExpiry } from "./barcodeUtils";

const ExtendModal = ({
  extendModal,
  extendDays,
  setExtendDays,
  onClose,
  onConfirm,
  loading,
}) => {
  const previewNewExpiry = () => {
    const base = extendModal?.expires_at
      ? new Date(extendModal.expires_at)
      : new Date();
    return fmt(new Date(base.getTime() + extendDays * 864e5).toISOString());
  };

  return (
    <Modal title="Extend expiry" code={extendModal.code} onClose={onClose}>
      <div className="px-5 py-4 space-y-4">
        <div
          className="rounded-lg px-3 py-2.5 text-xs"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-muted)",
          }}
        >
          Current expiry:{" "}
          <span
            className={
              getDaysUntilExpiry(extendModal.expires_at) < 0
                ? "text-red-600 font-semibold"
                : "text-amber-600 font-semibold"
            }
          >
            {fmt(extendModal.expires_at)}
          </span>
        </div>

        <div>
          <label
            className="font-Montserrat text-[11px] font-semibold uppercase tracking-wide block mb-1.5"
            style={{ color: "var(--text-muted)" }}
          >
            Additional days
          </label>
          <input
            type="number"
            value={extendDays}
            onChange={(e) =>
              setExtendDays(Math.max(1, Math.min(3650, Number(e.target.value))))
            }
            className="card w-full text-sm px-3 py-2 rounded-lg border font-Poppins outline-none focus:border-indigo-400 transition-colors"
            style={{ borderColor: "var(--border-color)" }}
            min={1}
            max={3650}
          />
          <p
            className="text-[11px] mt-1 font-Poppins"
            style={{ color: "var(--text-muted)" }}
          >
            Max 3,650 days (10 years)
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-[11px] px-3 py-1.5 rounded-full font-Montserrat font-semibold">
          <Clock size={12} /> New expiry: {previewNewExpiry()}
        </div>
      </div>
      <ModalFooter
        onClose={onClose}
        onConfirm={onConfirm}
        confirmLabel="Extend expiry"
        loading={loading}
      />
    </Modal>
  );
};

export default ExtendModal;
