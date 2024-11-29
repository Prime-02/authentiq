"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { BarChart, Database, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const { formData } = useGlobalState();
  const current = usePathname();

  // Determine if the current link is active
  const isCurrent = (href) => current === href;

  // Format the adminFullName for use in routes
  const routeId = formData.adminFirstName.replace(/\s+/g, "_");

  // Define the dashboard routes
  const DashBoardRoute = [
    { link: "data", icon: <Database size={20} />, href: `/admin/${routeId}/dashboard` },
    {
      link: "stats",
      icon: <TrendingUp size={20} />,
      href: `/admin/${routeId}/dashboard/stats`,
    },
    {
      link: "analytics",
      icon: <BarChart size={20} />,
      href: `/admin/${routeId}/dashboard/analytics`,
    },
  ];

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex gap-x-5 p-4">
        {DashBoardRoute.map((links, indx) => (
          <Link
            href={links.href}
            key={indx}
            className={`flex gap-2 items-center px-3 py-2 rounded-lg transition duration-300 ${
              isCurrent(links.href)
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            <p>{links.icon}</p>
            <p>{links.link}</p>
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
