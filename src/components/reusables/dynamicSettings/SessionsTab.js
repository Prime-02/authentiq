"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Monitor, LogOut, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SessionsTab() {
  const { logout, logoutAllDevices, loadingAuth, userDateJoined } =
    useAuthStore();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleLogoutAll = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await logoutAllDevices();
    setConfirming(false);
    router.push("/");
  };

  const joined = userDateJoined
    ? new Date(userDateJoined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-5 py-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-light)]">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Member since
        </span>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {joined}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 rounded-xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Monitor className="w-4 h-4" /> All Devices
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
          Log out from all devices except this one. Useful if you think your
          account may be compromised.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {confirming && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-500">
              <AlertTriangle className="w-3 h-3" /> Are you sure?
            </span>
          )}
          {confirming && (
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold font-Poppins border border-[var(--border-color)] text-[var(--text-muted)] bg-transparent hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleLogoutAll}
            disabled={loadingAuth}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-Poppins",
              "border border-red-500/30 text-red-500 transition-colors cursor-pointer",
              confirming
                ? "bg-red-500/10"
                : "bg-[var(--bg-tertiary)] hover:bg-red-500/10",
              loadingAuth ? "opacity-50 cursor-not-allowed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {loadingAuth ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Monitor className="w-3.5 h-3.5" />
            )}
            {confirming ? "Confirm — Logout All" : "Logout All Devices"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 rounded-xl border border-[var(--border-light)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <LogOut className="w-4 h-4" /> Current Session
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
          Log out from this device only.
        </p>
        <button
          type="button"
          onClick={logout}
          disabled={loadingAuth}
          className="flex items-center gap-2 w-fit px-4 py-2 rounded-lg text-xs font-semibold font-Poppins border border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>
    </div>
  );
}
