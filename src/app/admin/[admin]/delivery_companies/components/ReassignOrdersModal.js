// components/ReassignOrdersModal.jsx
import React, { useState } from "react";
import { useDeliveryCompanyStore } from "@/stores";
import Modal from "@/components/Modal/Modal";
import { ArrowUpDown, Loader2, X, AlertTriangle } from "lucide-react";

const ReassignOrdersModal = ({ company, companies, onClose, onSuccess }) => {
  const { reassignCompanyOrders, loadingMutation } = useDeliveryCompanyStore();
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const availableCompanies = companies.filter(
    (c) => c.id !== company.id && c.is_active,
  );

  const handleReassign = async () => {
    if (!selectedCompanyId) return;
    await reassignCompanyOrders(company.id, selectedCompanyId);
    onSuccess();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Reassign Orders">
      <div className="space-y-6">
        {/* Warning */}
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
          <AlertTriangle size={20} className="flex-shrink-0" />
          <p className="text-sm">
            This will reassign all orders from{" "}
            <span className="font-semibold">{company.name}</span> to another
            delivery company.
          </p>
        </div>

        {/* Company Info */}
        <div className="p-4 bg-secondary rounded-lg">
          <p className="text-sm text-muted mb-1">From Company</p>
          <p className="font-semibold">{company.name}</p>
          <p className="text-sm text-secondary">
            {company.branch}, {company.state}
          </p>
        </div>

        {/* Select Target Company */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Target Company
          </label>
          {availableCompanies.length === 0 ? (
            <p className="text-sm text-red-500">
              No other active companies available for reassignment.
            </p>
          ) : (
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
            >
              <option value="">Select a company</option>
              {availableCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.branch}, {c.state}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loadingMutation}
            className="flex-1 px-4 py-2.5 border-2 border-border rounded-lg hover:bg-secondary transition-colors font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReassign}
            disabled={loadingMutation || !selectedCompanyId}
            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loadingMutation ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Reassigning...</span>
              </>
            ) : (
              <>
                <ArrowUpDown size={16} />
                <span>Reassign Orders</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReassignOrdersModal;
