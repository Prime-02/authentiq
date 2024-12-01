"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Profile from "../_pages/Profile";
import Wishlist from "../_pages/Wishlist";
import Settings from "../_pages/Settings";

const Page = () => {
  const pathname = usePathname(); // Get the current path
  const pages = [
    { link: "profile", component: <Profile /> },
    { link: "wish-list", component: <Wishlist /> },
    { link: "settings", component: <Settings /> },
  ];

  // Get the dynamic segment of the pathname (after '/profile/')
  const pathSegment = pathname.split("/").pop();

  // Find the matching page based on the path segment
  const currentPage = pages.find((page) => page.link === pathSegment);

  return (
    <div className="min-h-screen h-auto w-full flex items-center justify-center">
      <div>
        {currentPage ? currentPage.component : <div>Page not found</div>}
      </div>
    </div>
  );
};

export default Page;
