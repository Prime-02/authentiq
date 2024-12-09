"use client";
import React from "react";
import Settings from "../../../components/reusables/dynamicSettings/Settings";
import { useGlobalState } from "@/app/GlobalStateProvider";

const Page = () => {
  const {getToken} = useGlobalState()
  const userToken = getToken(`user`)

  return (
    <div className="min-h-screen border h-auto w-full flex items-center justify-center">
      <Settings prop="user" token={userToken} />
    </div>
  );
};

export default Page;
