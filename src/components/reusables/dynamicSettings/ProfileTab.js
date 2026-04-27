"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Check } from "lucide-react";
import { Field, Input, SelectInput, SaveButton, SavedBadge } from "./shared";

export default function ProfileTab() {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userPhone,
    userGender,
    updateProfile,
    loadingUser,
  } = useAuthStore();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phone_number: "", // Changed from "phone" to match API
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      firstname: userFirstName || "",
      lastname: userLastName || "",
      gender: userGender || "",
      phone_number: userPhone || "", // Keep consistent naming
    });
  }, [userFirstName, userLastName, userGender, userPhone]); // Added userPhone dependency

  const change = (id) => (e) =>
    setForm((p) => ({ ...p, [id]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstname.trim()) e.firstname = "First name is required";
    if (!form.lastname.trim()) e.lastname = "Last name is required";

    // Phone number validation (optional field)
    if (form.phone_number && form.phone_number.trim()) {
      const cleaned = form.phone_number.replace(/[\s\-\(\)\+\.]/g, "");
      if (!/^\d+$/.test(cleaned)) {
        e.phone_number = "Invalid phone number format";
      } else if (cleaned.length < 7 || cleaned.length > 15) {
        e.phone_number = "Phone number must be 7-15 digits";
      }
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Map form fields to what updateProfile expects
    const ok = await updateProfile({
      firstname: form.firstname,
      lastname: form.lastname,
      phoneNumber: form.phone_number || null, // Map to camelCase for store
      gender: form.gender || null,
    });

    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" error={errors.firstname}>
          <Input
            id="firstname"
            value={form.firstname}
            onChange={change("firstname")}
            placeholder="Jane"
            error={errors.firstname}
          />
        </Field>
        <Field label="Last Name" error={errors.lastname}>
          <Input
            id="lastname"
            value={form.lastname}
            onChange={change("lastname")}
            placeholder="Smith"
            error={errors.lastname}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Gender">
          <SelectInput
            id="gender"
            value={form.gender}
            onChange={change("gender")}
            options={[
              { value: "", label: "Prefer not to say" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
              { value: "prefer_not_to_say", label: "Prefer not to say" },
            ]}
          />
        </Field>
        <Field label="Phone" error={errors.phone_number}>
          <Input
            id="phone_number"
            value={form.phone_number}
            placeholder="+1 (555) 000-0000"
            onChange={change("phone_number")}
            error={errors.phone_number}
          />
        </Field>
      </div>

      <Field label="Email Address">
        <Input id="email" value={userEmail || ""} disabled />
      </Field>

      <div className="flex items-center justify-end gap-3 pt-1">
        {saved && <SavedBadge />}
        <SaveButton
          loading={loadingUser}
          icon={<Check className="w-3 h-3" />}
        />
      </div>
    </form>
  );
}
