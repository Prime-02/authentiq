"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProfilePage from "@/components/reusables/dynamicProfile/Profile";

const Page = () => {
  const { formData, setFormData, adminToken } = useGlobalState();
  const admin = 'admin'
  const routeId = formData.adminEmail

  const fetchUserData = useCallback(async () => {
    if (!adminToken) {
      toast.error("Admin token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/users/profile/",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      // Check response status
      if (response.status === 200 || response.status === 201) {
        toast.success("Data fetched successfully!");

        const userData = response.data?.data || {};
        console.log("Fetched user data:", userData);

        // Dynamically map the user data to formData
        const updatedData = {
         adminId: userData.id || "",
         adminFirstName: userData.first_name || "",
         adminLastName: userData.last_name || "",
         adminEmail: userData.email || "",
         adminGender: userData.gender || "",
         adminPhone: userData.phone_number || "",
         adminLocation: userData.location || "",
         adminShippingAddress: userData.shipping_address || "",
         adminCountry: userData.country || "",
         adminStreetAddress: userData.street_address || "",
         adminCity: userData.city || "",
         adminState: userData.state || "",
         adminZipCode: userData.zip_code || "",
         adminDateJoined: userData.date_joined || "",
        };

        setFormData((prevState) => ({
          ...prevState,
          ...updatedData,
        }));
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Unable to load user data. Please try again.");
    }
  }, [adminToken, setFormData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div className="w-[80%] mx-auto md:w-1/2">
      <ProfilePage
        prop={admin}
        route={`/admin/${routeId}/profile/settings`}
      />
    </div>
  );
};

export default Page;
