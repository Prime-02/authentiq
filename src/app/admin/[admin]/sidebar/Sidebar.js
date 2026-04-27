"use client";
import { adminDBSidebar } from "@/components/index";
import Modal from "@/components/Modal/Modal";
import { useAuthStore } from "@/stores";
import { LogOutIcon, UserCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiSideBarLine } from "react-icons/ri";

const Sidebar = () => {
  const [sideSlide, setSideSlide] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const current = usePathname();
  const isCurrent = (href) => current === href;

  const { adminFirstName, fetchAdminData } = useAuthStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Replace spaces with hyphens in the adminFirstName
  const formattedadminFirstName = adminFirstName
    ? adminFirstName.replace(/\s+/g, "_")
    : "admin";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSideSlide(true);
      } else {
        setSideSlide(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSideSlide = () => {
    setSideSlide((prevState) => !prevState);
  };

  const closeSideBar = () => {
    if (window.innerWidth < 768) {
      setSideSlide(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sideSlide && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
          onClick={closeSideBar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[75%] md:w-[15%] transition-transform duration-300 ease-in-out z-40 font-Poppins
          bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          ${sideSlide ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Mobile close button */}
        {sideSlide && (
          <button
            className="absolute md:hidden right-3 top-3 p-2 rounded-lg 
              text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors duration-200"
            onClick={() => setSideSlide(false)}
          >
            <X size={20} />
          </button>
        )}

        {/* Sidebar content */}
        <div className="flex flex-col h-full pt-16 px-3">
          {/* Logo/Brand area */}
          <div className="mb-8 px-3">
            <h2 className="text-xl font-Montserrat font-bold text-[var(--text-primary)]">
              Admin Panel
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {formattedadminFirstName.replace(/_/g, " ")}
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-y-1">
              {adminDBSidebar.map((links, index) => {
                const updatedHref = links.href.replace(
                  "/name",
                  `/${formattedadminFirstName}`,
                );
                return (
                  <div key={index}>
                    <Link
                      href={updatedHref}
                      onClick={closeSideBar}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                        ${
                          isCurrent(updatedHref)
                            ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium shadow-sm"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                      <span className="text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                        {links.icons}
                      </span>
                      <span className="text-sm md:text-base truncate">
                        {links.name}
                      </span>
                      {isCurrent(updatedHref) && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]"></span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Logout button */}
          <div className="border-t border-[var(--border-color)] pt-4 pb-6 mt-auto">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg
                text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] 
                transition-all duration-200 group"
            >
              <span className="text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                <LogOutIcon />
              </span>
              <span className="text-sm md:text-base">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Top Navigation Bar */}
      <nav className="fixed md:hidden top-0 left-0 right-0 z-20 bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-sm">
        <div className="flex px-4 md:px-6 py-3 items-center justify-between w-full">
          {/* Left Section */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Sidebar Toggle Button */}
            <button
              className="p-2 rounded-lg border border-[var(--border-color)] 
                hover:bg-[var(--bg-hover)] transition-colors duration-200
                text-[var(--text-primary)]"
              onClick={toggleSideSlide}
              aria-label="Toggle sidebar"
            >
              <RiSideBarLine size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        >
          <div className="flex flex-col items-center justify-center p-8">
            <div className="mb-6">
              <LogOutIcon
                size={48}
                className="text-[var(--text-secondary)] mx-auto"
              />
            </div>
            <h1 className="text-xl font-Montserrat font-bold mb-2 text-center text-[var(--text-primary)]">
              Ready to Leave?
            </h1>
            <p className="text-sm text-[var(--text-muted)] mb-6 text-center">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border-color)]
                  text-[var(--text-primary)] hover:bg-[var(--bg-hover)] 
                  transition-all duration-200 font-Poppins font-medium"
              >
                Cancel
              </button>
              <Link href="/" className="flex-1">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--text-primary)] text-[var(--text-inverse)]
                    hover:opacity-90 transition-all duration-200 font-Poppins font-medium"
                >
                  Log Out
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
