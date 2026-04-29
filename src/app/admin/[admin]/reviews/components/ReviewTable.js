// pages/admin/reviews/components/ReviewTable.js
import { Star, Eye, Edit, Trash2, User, Package } from "lucide-react";

export default function ReviewTable({
  reviews,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? "fill-current" : ""}`}
        style={{
          color: index < rating ? "var(--warning-500)" : "var(--border-color)",
        }}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getRatingBadgeColor = (rating) => {
    if (rating >= 4)
      return {
        bg: "var(--success-50)",
        text: "var(--success-700)",
        border: "var(--success-200)",
      };
    if (rating >= 3)
      return {
        bg: "var(--warning-50)",
        text: "var(--warning-700)",
        border: "var(--warning-200)",
      };
    return {
      bg: "var(--error-50)",
      text: "var(--error-700)",
      border: "var(--error-200)",
    };
  };

  return (
    <div
      className="card rounded-lg border overflow-hidden mb-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "var(--bg-tertiary)" }}>
              <th
                className="text-left p-4 text-sm font-semibold font-Montserrat"
                style={{ color: "var(--text-secondary)" }}
              >
                Review
              </th>
              <th
                className="text-left p-4 text-sm font-semibold font-Montserrat"
                style={{ color: "var(--text-secondary)" }}
              >
                Product
              </th>
              <th
                className="text-left p-4 text-sm font-semibold font-Montserrat"
                style={{ color: "var(--text-secondary)" }}
              >
                User
              </th>
              <th
                className="text-center p-4 text-sm font-semibold font-Montserrat"
                style={{ color: "var(--text-secondary)" }}
              >
                Rating
              </th>
              <th
                className="text-left p-4 text-sm font-semibold font-Montserrat"
                style={{ color: "var(--text-secondary)" }}
              >
                Date
              </th>
              <th
                className="text-right p-4 text-sm font-semibold font-Montserrat"
                style={{ color: "var(--text-secondary)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const badgeColor = getRatingBadgeColor(review.rating);
              return (
                <tr
                  key={review.id}
                  className="border-t transition-colors duration-150 hover:bg-opacity-50"
                  style={{
                    borderColor: "var(--border-light)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {/* Comment */}
                  <td className="p-4">
                    <div className="max-w-xs">
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {review.comment || "No comment"}
                      </p>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <span
                        className="text-sm font-medium truncate max-w-[150px]"
                        style={{ color: "var(--text-primary)" }}
                        title={review.product?.name || review.product_id}
                      >
                        {review.product?.name || review.product_id}
                      </span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <span
                        className="text-sm truncate max-w-[120px]"
                        style={{ color: "var(--text-primary)" }}
                        title={review.user?.name || review.user_id}
                      >
                        {review.user?.name || review.user_id}
                      </span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: badgeColor.bg,
                          color: badgeColor.text,
                          borderColor: badgeColor.border,
                        }}
                      >
                        {review.rating}/5
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {formatDate(review.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(review)}
                        className="btn btn-ghost btn-sm btn-icon"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(review)}
                        className="btn btn-ghost btn-sm btn-icon"
                        title="Edit review"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(review)}
                        className="btn btn-ghost btn-sm btn-icon"
                        title="Delete review"
                        style={{ color: "var(--error-500)" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
