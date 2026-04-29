// components/UsersGrid.jsx
import { UserAvatar } from "./UserAvatar";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { Search, Users } from "lucide-react";

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 relative cursor-default pointer-events-none"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div className="flex items-center gap-3 mb-4 pr-8">
        <div
          className="w-12 h-12 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
        <div className="flex-1 flex flex-col gap-2">
          <div
            className="h-3.5 rounded-md animate-pulse"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              width: "70%",
            }}
          />
          <div
            className="h-3.5 rounded-md animate-pulse"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              width: "50%",
            }}
          />
        </div>
      </div>
      <div className="mb-4 space-y-2">
        <div
          className="h-3.5 rounded-md animate-pulse"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            width: "100%",
          }}
        />
        <div
          className="h-3.5 rounded-md animate-pulse"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            width: "80%",
          }}
        />
      </div>
      <div
        className="flex justify-between items-center pt-3 border-t"
        style={{ borderTopColor: "var(--border-light)" }}
      >
        <div
          className="h-6 rounded-xl animate-pulse"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            width: "70px",
          }}
        />
        <div
          className="h-6 rounded-xl animate-pulse"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            width: "70px",
          }}
        />
      </div>
    </div>
  );
}

export function UsersGrid({
  users,
  loading,
  selectedUsers,
  onSelectUser,
  onViewUser,
  onToggleStatus,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 mb-6 max-sm:grid-cols-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div
        className="text-center py-16 px-8 rounded-xl border-2 border-dashed"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <Search
          className="w-12 h-12 mx-auto mb-4 opacity-50"
          style={{ color: "var(--text-muted)" }}
        />
        <h3
          className="m-0 mb-2 text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          No users found
        </h3>
        <p className="m-0 text-sm" style={{ color: "var(--text-muted)" }}>
          Try adjusting your filters or create a new user
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 mb-6 max-sm:grid-cols-1">
      {users.map((user) => (
        <div
          key={user.id}
          className={`rounded-xl p-5 relative transition-all duration-200 cursor-pointer ${
            !user.is_active ? "opacity-75" : ""
          }`}
          style={{
            backgroundColor: selectedUsers.has(user.id)
              ? "var(--primary-50)"
              : "var(--bg-primary)",
            border: selectedUsers.has(user.id)
              ? "1px solid var(--primary-500)"
              : "1px solid var(--border-light)",
            boxShadow: selectedUsers.has(user.id)
              ? "0 0 0 2px var(--primary-200)"
              : "none",
          }}
          onClick={() => onViewUser(user)}
          onMouseEnter={(e) => {
            if (!selectedUsers.has(user.id)) {
              e.currentTarget.style.borderColor = "var(--primary-300)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!selectedUsers.has(user.id)) {
              e.currentTarget.style.borderColor = "var(--border-light)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {/* Checkbox */}
          <div
            className="absolute top-3 right-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={selectedUsers.has(user.id)}
              onChange={(e) => onSelectUser(user.id, e.target.checked)}
              className="w-[18px] h-[18px] cursor-pointer rounded"
              style={{ accentColor: "var(--primary-500)" }}
            />
          </div>

          {/* Active indicator */}
          {user.is_active && (
            <div
              className="absolute top-2 left-2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: "var(--success-500)",
                boxShadow: "0 0 0 2px var(--success-100)",
              }}
              title="Currently active"
            />
          )}

          {/* Card Header */}
          <div className="flex items-center gap-3 mb-4 pr-8">
            <UserAvatar
              firstname={user.firstname}
              lastname={user.lastname}
              size={48}
            />
            <div className="flex-1 min-w-0">
              <h3
                className="m-0 text-base font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {[user.firstname, user.lastname].filter(Boolean).join(" ") || (
                  <span
                    className="italic"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Unknown User
                  </span>
                )}
              </h3>
              <p
                className="mt-0.5 mb-0 text-xs truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center py-1.5 border-b"
              style={{ borderBottomColor: "var(--border-light)" }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Joined
              </span>
              <span
                className="text-xs text-right max-w-[60%] truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {user.date_joined
                  ? new Date(user.date_joined).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            <div
              className="flex justify-between items-center py-1.5 border-b"
              style={{ borderBottomColor: "var(--border-light)" }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Last Login
              </span>
              <span
                className="text-xs text-right max-w-[60%] truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {user.last_login
                  ? new Date(user.last_login).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Never"}
              </span>
            </div>
            {user.phone_number && (
              <div
                className="flex justify-between items-center py-1.5 border-b"
                style={{ borderBottomColor: "var(--border-light)" }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Phone
                </span>
                <span
                  className="text-xs text-right max-w-[60%] truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.phone_number}
                </span>
              </div>
            )}
            {user.location && (
              <div className="flex justify-between items-center py-1.5">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Location
                </span>
                <span
                  className="text-xs text-right max-w-[60%] truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.location}
                </span>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div
            className="flex justify-between items-center pt-3 border-t"
            style={{ borderTopColor: "var(--border-light)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-1.5">
              <StatusBadge active={user.is_active} />
              <RoleBadge isAdmin={user.is_admin} />
            </div>
            <button
              className={`btn btn-sm ${
                user.is_active ? "btn-warning" : "btn-success"
              }`}
              onClick={() => onToggleStatus(user)}
            >
              {user.is_active ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
