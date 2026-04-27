import React from "react";
import { X } from "lucide-react";

export const Modal = ({ title, code, onClose, children }) => (
  <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center overflow-auto justify-center p-4">
    <div
      className="card rounded-2xl border w-full max-w-sm overflow-hidden shadow-2xl"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div>
          <p
            className="font-Montserrat font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </p>
          {code && (
            <p
              className="font-mono text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {code}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={15} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const ModalFooter = ({ onClose, onConfirm, confirmLabel, loading }) => (
  <div
    className="flex justify-end gap-2 px-5 py-3 border-t"
    style={{ borderColor: "var(--border-light)" }}
  >
    <button
      onClick={onClose}
      className="card text-xs px-4 py-2 rounded-lg border font-Poppins transition-colors"
      style={{ borderColor: "var(--border-color)" }}
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="text-xs px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-Poppins transition-colors"
      disabled={loading}
      style={{
        borderColor: "var(--border-color)",
      }}
    >
      {confirmLabel}
    </button>
  </div>
);
