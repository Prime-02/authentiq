import React from "react";
import { Modal, ModalFooter } from "./Modal";

const ReassignModal = ({
  reassignModal,
  reassignProductId,
  setReassignProductId,
  products,
  onClose,
  onConfirm,
}) => (
  <Modal title="Reassign product" code={reassignModal.code} onClose={onClose}>
    <div className="px-5 py-4 space-y-4">
      <div
        className="rounded-lg px-3 py-2.5 text-xs"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-muted)",
        }}
      >
        Current product:{" "}
        <span
          className="font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {reassignModal.product?.name ??
            (reassignModal.product_id
              ? reassignModal.product_id.slice(0, 8) + "…"
              : "None")}
        </span>
      </div>

      <div>
        <label
          className="font-Montserrat text-[11px] font-semibold uppercase tracking-wide block mb-1.5"
          style={{ color: "var(--text-muted)" }}
        >
          Assign to product
        </label>
        <select
          value={reassignProductId}
          onChange={(e) => setReassignProductId(e.target.value)}
          className="card w-full text-sm px-3 py-2 rounded-lg border font-Poppins outline-none focus:border-indigo-400 transition-colors"
          style={{ borderColor: "var(--border-color)" }}
        >
          <option value="">No product (unassign)</option>
          {(products || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
    <ModalFooter
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Save changes"
    />
  </Modal>
);

export default ReassignModal;
