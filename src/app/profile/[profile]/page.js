"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Profile from "../../../components/reusables/dynamicProfile/Profile";
import Settings from "../../../components/reusables/dynamicSettings/Settings";
import { useGlobalState } from "@/app/GlobalStateProvider";

const Page = () => {
  const {userToken} = useGlobalState()
  const pathname = usePathname(); // Get the current path
  const user = 'user'
  const pages = [
    { link: "profile", component: <Profile prop={user} /> },
    {
      link: "settings",
      component: <Settings prop="user"  token={userToken}/>,
    },
  ];

  // Get the dynamic segment of the pathname (after '/profile/')
  const pathSegment = pathname.split("/").pop();

  // Find the matching page based on the path segment
  const currentPage = pages.find((page) => page.link === pathSegment);

  return (
    <div className="min-h-screen border h-auto w-full flex items-center justify-center">
      <div>
        {currentPage ? currentPage.component : <div>Page not found</div>}
      </div>
    </div>
  );
};

export default Page;
