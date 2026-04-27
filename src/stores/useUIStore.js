import { create } from "zustand";

/**
 * useUIStore  [1 / 11]
 * --------------------
 * Owns: modal visibility + type.
 * No server calls. No dependencies on other stores.
 */
export const useUIStore = create((set) => ({
  // ── State ─────────────────────────────────────────────────────────────────
  modal: false,
  modalType: null, // "login" | "confirm" | "edit-product" | …

  // ── Actions ───────────────────────────────────────────────────────────────
  openModal: (type) => set({ modal: true, modalType: type }),
  closeModal: () => set({ modal: false, modalType: null }),
}));
