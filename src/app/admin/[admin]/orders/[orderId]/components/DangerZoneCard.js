// components/DangerZoneCard.jsx
import React, { useState } from "react";
import { Trash2, AlertTriangle, X, AlertOctagon } from "lucide-react";

const DangerZoneCard = ({ onDelete, loading }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    onDelete();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border-2 border-[var(--error-200)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--error-100)] border border-[var(--error-200)] flex items-center justify-center">
            <AlertTriangle size={20} className="text-[var(--error-600)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-Montserrat text-[var(--error-700)]">
              Danger Zone
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Irreversible and destructive actions
            </p>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="px-6 pb-4">
        <div className="p-4 bg-[var(--error-50)] rounded-xl border border-[var(--error-200)]">
          <div className="flex items-start gap-3">
            <AlertOctagon
              size={18}
              className="text-[var(--error-500)] flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-[var(--error-700)] mb-1">
                This action cannot be undone
              </p>
              <p className="text-xs text-[var(--error-600)] leading-relaxed">
                Once you delete an order, all associated data including items,
                payment records, tracking information, and delivery assignments
                will be permanently removed from the system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="px-6 pb-6">
        {showConfirm ? (
          <div className="p-4 bg-[var(--error-50)] rounded-xl border border-[var(--error-200)] space-y-3">
            <p className="text-sm font-medium text-[var(--error-700)] text-center">
              Are you absolutely sure? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteClick}
                disabled={loading}
                className="btn btn-danger flex-1 justify-center"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Yes, Delete Permanently
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-ghost"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            className="btn btn-danger w-full sm:w-auto"
          >
            <Trash2 size={18} />
            Delete Order Permanently
          </button>
        )}
      </div>
    </div>
  );
};

export default DangerZoneCard;
