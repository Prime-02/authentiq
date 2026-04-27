"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import {
  User,
  MapPin,
  Lock,
  Monitor,
  ChevronRight,
  LogOut,
} from "lucide-react";
import ProfileTab from "./ProfileTab";
import AddressTab from "./AddressTab";
import SecurityTab from "./SecurityTab";
import SessionsTab from "./SessionsTab";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "address", label: "Address", Icon: MapPin },
  { id: "security", label: "Security", Icon: Lock },
  { id: "sessions", label: "Sessions", Icon: Monitor },
];

const TAB_META = {
  profile: { title: "Profile", subtitle: "Update your personal information" },
  address: { title: "Address", subtitle: "Manage your shipping & location" },
  security: { title: "Security", subtitle: "Change your password" },
  sessions: { title: "Sessions", subtitle: "Manage active sessions" },
};

const Settings = () => {
  const { userFirstName, userLastName, userEmail, loadingUser, logout } =
    useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  const logOut = async () => {
    await logout();
    router.push("/");
  };

  const tabContent = {
    profile: <ProfileTab />,
    address: <AddressTab />,
    security: <SecurityTab />,
    sessions: <SessionsTab />,
  };

  const initials =
    ((userFirstName?.[0] || "") + (userLastName?.[0] || "")).toUpperCase() ||
    "?";
  const displayName =
    `${userFirstName || ""} ${userLastName || ""}`.trim() || "User";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl card rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col sm:flex-row min-h-[580px]">
        {/* Sidebar */}
        <aside className="w-full sm:w-56 bg-[var(--bg-tertiary)] border-b sm:border-b-0 sm:border-r border-[var(--border-light)] flex flex-col p-5 shrink-0">
          {/* User identity */}
          <div className="flex sm:flex-col items-center sm:items-center gap-3 pb-5 border-b border-[var(--border-light)] mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-hover)] flex items-center justify-center text-lg sm:text-xl font-extrabold font-Montserrat text-[var(--text-primary)] shrink-0">
              {loadingUser ? "…" : initials}
            </div>
            <div className="flex flex-col gap-0.5 sm:items-center sm:text-center">
              <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                {loadingUser ? "Loading…" : displayName}
              </span>
              <span className="text-xs text-[var(--text-muted)] break-all">
                {userEmail || ""}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex sm:flex-col flex-row flex-wrap gap-1 flex-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={[
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-Poppins",
                  "border transition-all duration-150 cursor-pointer w-full text-left",
                  activeTab === id
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] font-semibold border-[var(--border-color)] shadow-sm"
                    : "bg-transparent text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] font-medium",
                ].join(" ")}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <span className="ml-auto opacity-40 hidden sm:block">
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </nav>

          {/* Footer links */}
          <div className="hidden sm:flex flex-col gap-1 pt-4 mt-2 border-t border-[var(--border-light)]">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-colors"
            >
              ← Back to store
            </Link>
            <button
              onClick={logOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold font-Poppins text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer border-none bg-transparent"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-col flex-1 min-w-0">
          <header className="px-6 sm:px-8 pt-6 pb-5 border-b border-[var(--border-light)]">
            <h1 className="text-xl font-bold font-Montserrat text-[var(--text-primary)] mb-0.5">
              {TAB_META[activeTab].title}
            </h1>
            <p className="text-xs text-[var(--text-muted)] m-0">
              {TAB_META[activeTab].subtitle}
            </p>
          </header>

          <div className="px-6 sm:px-8 py-7 flex-1">
            {tabContent[activeTab]}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
