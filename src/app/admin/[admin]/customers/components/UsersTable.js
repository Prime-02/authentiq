// components/UsersTable.jsx
import { UserAvatar } from "./UserAvatar";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  MoreVertical,
} from "lucide-react";

function SkeletonRow() {
  return (
    <tr>
      <td className="p-3.5 w-10">
        <div
          className="h-4 w-4 rounded animate-pulse"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
      </td>
      {[40, 180, 140, 80, 80, 80, 80].map((w, i) => (
        <td key={i} className="p-3.5">
          <div
            className="h-3.5 rounded animate-pulse"
            style={{
              width: w,
              backgroundColor: "var(--bg-tertiary)",
            }}
          />
        </td>
      ))}
      <td className="p-3.5 w-[120px]">
        <div
          className="h-7 w-20 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
      </td>
    </tr>
  );
}

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) {
    return (
      <ArrowUpDown
        className="inline-block w-2.5 h-2.5 ml-1"
        style={{ color: "var(--text-muted)" }}
      />
    );
  }
  return (
    <>
      {sortDir === "asc" ? (
        <ArrowUp
          className="inline-block w-2.5 h-2.5 ml-1"
          style={{ color: "var(--info-600)" }}
        />
      ) : (
        <ArrowDown
          className="inline-block w-2.5 h-2.5 ml-1"
          style={{ color: "var(--info-600)" }}
        />
      )}
    </>
  );
}

export function UsersTable({
  users,
  loading,
  filters,
  selectedUsers,
  onSort,
  onSelectAll,
  onSelectUser,
  onViewUser,
  onToggleStatus,
  onToggleAdmin,
  onDeleteUser,
}) {
  return (
    <div
      className="border rounded-xl overflow-hidden overflow-x-auto"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <table className="w-full border-collapse text-sm">
        <thead
          className="border-b-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderBottomColor: "var(--border-color)",
          }}
        >
          <tr>
            <th className="w-10 p-3">
              <input
                type="checkbox"
                checked={
                  users.length > 0 && selectedUsers.size === users.length
                }
                onChange={onSelectAll}
                disabled={loading}
                className="rounded"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--info-600)",
                }}
              />
            </th>
            <th className="w-11" />
            <th
              className="p-3 text-left font-semibold text-xs uppercase tracking-wider cursor-pointer select-none"
              style={{ color: "var(--text-muted)" }}
              onClick={() => onSort("lastname")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Name{" "}
              <SortIcon
                col="lastname"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
              />
            </th>
            <th
              className="p-3 text-left font-semibold text-xs uppercase tracking-wider cursor-pointer select-none"
              style={{ color: "var(--text-muted)" }}
              onClick={() => onSort("email")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Email{" "}
              <SortIcon
                col="email"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
              />
            </th>
            <th
              className="p-3 text-left font-semibold text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Role
            </th>
            <th
              className="p-3 text-left font-semibold text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Status
            </th>
            <th
              className="p-3 text-left font-semibold text-xs uppercase tracking-wider cursor-pointer select-none"
              style={{ color: "var(--text-muted)" }}
              onClick={() => onSort("date_joined")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Joined{" "}
              <SortIcon
                col="date_joined"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
              />
            </th>
            <th
              className="p-3 text-left font-semibold text-xs uppercase tracking-wider cursor-pointer select-none"
              style={{ color: "var(--text-muted)" }}
              onClick={() => onSort("last_login")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Last Login{" "}
              <SortIcon
                col="last_login"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
              />
            </th>
            <th
              className="p-3 text-right font-semibold text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-12">
                <div className="flex flex-col items-center gap-4">
                  <Search
                    className="w-12 h-12"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <div>
                    <h3
                      className="text-lg font-semibold m-0 mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No users found
                    </h3>
                    <p
                      className="text-sm m-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try adjusting your filters or create a new user
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className={`transition-colors duration-150 border-b ${
                  !user.is_active ? "opacity-70" : ""
                }`}
                style={{
                  borderBottomColor: "var(--border-light)",
                  backgroundColor: selectedUsers.has(user.id)
                    ? "var(--info-50)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!selectedUsers.has(user.id)) {
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedUsers.has(user.id)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  } else {
                    e.currentTarget.style.backgroundColor = "var(--info-50)";
                  }
                }}
              >
                <td className="p-3.5">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={(e) => onSelectUser(user.id, e.target.checked)}
                    className="rounded"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--info-600)",
                    }}
                  />
                </td>
                <td className="p-3.5">
                  <UserAvatar
                    firstname={user.firstname}
                    lastname={user.lastname}
                    size={34}
                  />
                </td>
                <td
                  className="p-3.5 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {[user.firstname, user.lastname]
                    .filter(Boolean)
                    .join(" ") || (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  )}
                </td>
                <td
                  className="p-3.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.email}
                </td>
                <td className="p-3.5">
                  <RoleBadge isAdmin={user.is_admin} />
                </td>
                <td className="p-3.5">
                  <StatusBadge active={user.is_active} />
                </td>
                <td
                  className="p-3.5 whitespace-nowrap"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.date_joined
                    ? new Date(user.date_joined).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  {user.last_login ? (
                    <span style={{ color: "var(--text-secondary)" }}>
                      {new Date(user.last_login).toLocaleDateString()}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>Never</span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex gap-1 justify-end items-center">
                    <button
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-secondary)",
                        border: `1px solid var(--border-color)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-primary)";
                      }}
                      onClick={() => onViewUser(user)}
                      title="View details"
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
                      style={{
                        backgroundColor: user.is_active
                          ? "var(--warning-50)"
                          : "var(--success-50)",
                        color: user.is_active
                          ? "var(--warning-700)"
                          : "var(--success-700)",
                        border: `1px solid ${
                          user.is_active
                            ? "var(--warning-300)"
                            : "var(--success-300)"
                        }`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = user.is_active
                          ? "var(--warning-100)"
                          : "var(--success-100)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = user.is_active
                          ? "var(--warning-50)"
                          : "var(--success-50)";
                      }}
                      onClick={() => onToggleStatus(user)}
                      title={user.is_active ? "Deactivate" : "Activate"}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <div className="relative group">
                      <button
                        className="p-1 rounded transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--bg-secondary)";
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const menu = e.currentTarget.nextElementSibling;
                          menu.classList.toggle("hidden");
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div
                        className="hidden group-hover:block absolute right-0 top-full mt-1 rounded-lg shadow-lg z-50 min-w-[150px]"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          border: `1px solid var(--border-color)`,
                        }}
                      >
                        <button
                          className="block w-full px-3 py-2 text-left text-sm transition-colors rounded-t-lg"
                          style={{ color: "var(--text-primary)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--bg-secondary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          onClick={() => onToggleAdmin(user)}
                        >
                          {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </button>
                        <button
                          className="block w-full px-3 py-2 text-left text-sm transition-colors rounded-b-lg"
                          style={{ color: "var(--error-600)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--bg-secondary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          onClick={() => onDeleteUser(user)}
                        >
                          Delete User
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
