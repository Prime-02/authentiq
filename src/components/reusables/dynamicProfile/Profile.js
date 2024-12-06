"use client";

import { useGlobalState } from "@/app/GlobalStateProvider";
import { Edit, LogOut, Pen } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ButtonTwo } from "../buttons/Buttons";

const ProfilePage = ({ prop, route = `/profile/settings` }) => {
  const { formData } = useGlobalState();

  // Helper function to get the dynamically replaced property
  const getDynamicProp = (key) => formData[`${prop}${key}`] || "...";

  return (
    <div className="min-h-screen py-20 px-4 ">
      <h2 className="text-2xl my-4 font-semibold text-center">User Profile</h2>
      {/* Header Section */}
      <div className="card relative rounded-lg shadow-lg p-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-5xl font-extrabold border-4 mb-4">
          {/* Placeholder Profile Picture */}
          <h1>{`${getDynamicProp("FirstName")
            .charAt(0)
            .toUpperCase()}.${getDynamicProp("LastName")
            .charAt(0)
            .toUpperCase()}`}</h1>
        </div>
        <section className="flex flex-col items-center gap-y-2">
          <h1 className="text-2xl font-semibold ">
            {getDynamicProp("FirstName")} {getDynamicProp("LastName")}
          </h1>
          <p className="">{getDynamicProp("Email")}</p>

          <Link href={route} className="">
            <ButtonTwo
              buttonValue={`Edit Profile`}
              iconValue={<Pen size={12} />}
            />
          </Link>
        </section>
        <span className="absolute top-3 border-b hover:text-blue-500 cursor-pointer font-light right-3 flex items-center gap-x-1">
          <p>Logout</p>
        </span>
      </div>

      {/* Personal Information Section */}
      <h2 className="text-xl my-4 font-semibold ">Personal Information</h2>
      <div className=" card rounded-lg shadow-lg p-6">
        <div className="mt-4 space-y-2">
          <p className="hidden">
            <span className="font-semibold">Phone:</span>{" "}
            {getDynamicProp("Phone")}
          </p>
          <p className="">
            <span className="font-semibold">Gender:</span>{" "}
            {getDynamicProp("Gender")}
          </p>
          <p className="">
            <span className="font-semibold">Country:</span>{" "}
            {getDynamicProp("Location")}
          </p>
          <p className="">
            <span className="font-semibold">State:</span>{" "}
            {getDynamicProp("State")}
          </p>
          <p className="">
            <span className="font-semibold">City</span> {getDynamicProp("City")}
          </p>
        </div>
      </div>

      {/* Address Section */}
      <h2 className="text-xl font-semibold my-4 ">Addresses</h2>
      <div className=" card rounded-lg shadow-lg p-6">
        <div className="mt-4 space-y-2">
          <p className="">
            <span className="font-semibold">Shipping Address:</span>{" "}
            {getDynamicProp("ShippingAddress")}
          </p>
          <p className="">
            <span className="font-semibold">Street Address:</span>{" "}
            {getDynamicProp("StreetAddress")}
          </p>
          <p className="">
            <span className="font-semibold">Zip Code:</span>{" "}
            <span>{getDynamicProp("ZipCode")}</span>
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold my-4 ">Others</h2>
      <section className="card rounded-lg py-4 flex flex-col items-center space-y-2 text-center text-xs">
        {/* Joined Date */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-gray-500">Joined</span>
          <span className="text-sm font-medium">
            {getDynamicProp("DateJoined") !== "N/A"
              ? new Date(getDynamicProp("DateJoined")).toLocaleDateString(
                  "en-US"
                )
              : "N/A"}
          </span>
        </div>

        {/* UID Section */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-gray-500 font-semibold">Your UID</span>
          <strong className="text-sm">{getDynamicProp("Id")}</strong>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
