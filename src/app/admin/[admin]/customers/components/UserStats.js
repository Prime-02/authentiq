// components/UserStats.jsx
import { Users, UserCheck, UserX, Shield, Sparkles } from "lucide-react";

function StatsCard({ label, value, accent, icon, loading }) {
  return (
    <div
      className="relative rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        borderTopWidth: "3px",
        borderTopColor: accent,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          <span
            className="text-2xl font-bold leading-none"
            style={{ color: accent }}
          >
            {loading ? (
              <div
                className="w-12 h-7 rounded-md animate-pulse"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              />
            ) : (
              (value ?? "—")
            )}
          </span>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${accent}20`,
            color: accent,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export function UserStats({ stats, loading }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6 max-sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      <StatsCard
        label="Total Users"
        value={stats.total}
        accent="var(--info-600)"
        icon={<Users className="w-6 h-6" />}
        loading={loading}
      />
      <StatsCard
        label="Active"
        value={stats.active}
        accent="var(--success-600)"
        icon={<UserCheck className="w-6 h-6" />}
        loading={loading}
      />
      <StatsCard
        label="Inactive"
        value={stats.inactive}
        accent="var(--error-600)"
        icon={<UserX className="w-6 h-6" />}
        loading={loading}
      />
      <StatsCard
        label="Admins"
        value={stats.admins}
        accent="var(--info-500)"
        icon={<Shield className="w-6 h-6" />}
        loading={loading}
      />
      <StatsCard
        label="New This Month"
        value={stats.newThisMonth}
        accent="var(--warning-600)"
        icon={<Sparkles className="w-6 h-6" />}
        loading={loading}
      />
    </div>
  );
}
