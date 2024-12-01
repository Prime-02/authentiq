"use client";

import { useGlobalState } from "@/app/GlobalStateProvider";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProfilePage = () => {
  const { formData } = useGlobalState();

  return (
    <div className="min-h-screen  py-20 px-4">
      {/* Header Section */}
      <div className="card relative rounded-lg shadow-lg p-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-5xl font-extrabold border-4 mb-4">
          {/* Placeholder Profile Picture */}
          <h1>{`${formData.userFirstName
            .charAt(0)
            .toUpperCase()}.${formData.userLastName
            .charAt(0)
            .toUpperCase()}`}</h1>
        </div>
        <h1 className="text-2xl font-semibold ">
          {formData.userFirstName} {formData.userLastName}
        </h1>
        <p className="">
          Joined:{" "}
          {formData.dateJoined
            ? new Date(formData.dateJoined).toLocaleDateString("en-US")
            : "N/A"}
        </p>
        <p className="">ID: {formData.userId ? formData.userId : "N/A"}</p>

        <Link href={`/profile/settings`} className="absolute right-2 top-2">
          <Edit />
        </Link>
      </div>
      {/* Personal Information Section */}
      <div className="mt-8 card rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold ">Personal Information</h2>
        <div className="mt-4 space-y-2">
          <p className="">
            <span className="font-semibold">Email:</span>{" "}
            {formData.email || "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">Phone:</span>{" "}
            {formData.phone || "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">Gender:</span>{" "}
            {formData.gender || "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">Country:</span>{" "}
            {formData.location ? formData.location : "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">State:</span>{" "}
            {formData.state ? formData.state : "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">City:</span>{" "}
            {formData.city ? `${formData.city}, ` : "N/A"}
          </p>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8 card rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold ">Address</h2>
        <div className="mt-4 space-y-2">
          <p className="">
            <span className="font-semibold">Shipping Address:</span>{" "}
            {formData.shippingAddress || "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">Street Address:</span>{" "}
            {formData.streetAddress || "N/A"}
          </p>
          <p className="">
            <span className="font-semibold">Zip Code:</span>{" "}
            {formData.zipCode || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
