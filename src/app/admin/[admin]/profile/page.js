"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProfilePage from "@/components/reusables/dynamicProfile/Profile";
import Settings from "@/components/reusables/dynamicSettings/Settings";

const Page = () => {
  const { formData, setFormData, getToken, fetchAdminData } = useGlobalState();
  const admin = 'admin'
  const adminToken = getToken(`admin`)
  const routeId = formData.adminFirstName ? formData.adminFirstName : 'admin';

  

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return (
    <div className="w-[80%] mx-auto md:w-1/2">
      <Settings
        prop={admin}
        route={`/admin/${routeId}/profile/settings`}
        token={adminToken}
      />
    </div>
  );
};

export default Page;
