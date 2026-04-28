// components/DeleteCompanyModal.jsx
import React, { useState } from "react";
import { useDeliveryCompanyStore } from "@/stores";
import Modal from "@/components/Modal/Modal";
import { Trash2, Loader2, X, AlertTriangle, Building2 } from "lucide-react";

const DeleteCompanyModal = ({ company, onClose, onSuccess }) => {
  const { deleteDeliveryCompany, loadingMutation } = useDeliveryCompanyStore();
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== company.name) return;
    await deleteDeliveryCompany(company.id);
    onSuccess();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Delete Company">
      <div className="space-y-6">

        {/* Warning */}
        <div className="flex justify-center">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Delete this company?</p>
          <p className="text-secondary">
            This action cannot be undone. All orders assigned to this company
            will need to be reassigned.
          </p>
        </div>

        {/* Company Info */}
        <div className="p-4 bg-secondary rounded-lg">
          <div className="flex items-center gap-3">
            <Building2 size={24} className="text-muted" />
            <div>
              <p className="font-semibold">{company.name}</p>
              <p className="text-sm text-secondary">
                {company.branch}, {company.state}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Input */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Type <span className="text-red-500 font-bold">{company.name}</span>{" "}
            to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-red-400 transition-colors"
            placeholder={company.name}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loadingMutation}
            className="flex-1 px-4 py-2.5 border-2 border-border rounded-lg hover:bg-secondary transition-colors font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loadingMutation || confirmText !== company.name}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loadingMutation ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Company</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCompanyModal;
