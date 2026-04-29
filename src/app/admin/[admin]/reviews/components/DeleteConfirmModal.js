// pages/admin/reviews/components/DeleteConfirmModal.js
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteConfirmModal({ review, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl border overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: "var(--error-50)" }}
            >
              <AlertTriangle
                className="w-6 h-6"
                style={{ color: "var(--error-500)" }}
              />
            </div>
            <h2
              className="text-xl font-bold font-Montserrat"
              style={{ color: "var(--text-primary)" }}
            >
              Delete Review
            </h2>
          </div>
          <button onClick={onCancel} className="btn btn-ghost btn-sm btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className="p-4 rounded-lg border mb-4"
            style={{
              backgroundColor: "var(--error-50)",
              borderColor: "var(--error-200)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--error-700)" }}
            >
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Review by:
              </p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {review.user?.name || "Unknown User"}
              </p>
            </div>

            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Product:
              </p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {review.product?.name || "Unknown Product"}
              </p>
            </div>

            {review.comment && (
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Comment:
                </p>
                <p
                  className="text-sm italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  "{review.comment.substring(0, 100)}
                  {review.comment.length > 100 ? "..." : ""}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: "var(--border-light)" }}
        >
          <button
            onClick={onCancel}
            className="btn btn-outline btn-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-danger btn-sm"
          >
            {loading ? (
              <>
                <span className="btn-loading" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
