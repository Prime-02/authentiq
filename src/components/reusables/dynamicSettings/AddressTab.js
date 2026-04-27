"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Check } from "lucide-react";
import { Field, Input, SaveButton, SavedBadge } from "./shared";

export default function AddressTab() {
  const {
    userLocation,
    userShippingAddress,
    userCountry,
    userStreetAddress,
    userCity,
    userState,
    userZipCode,
    updateProfile,
    loadingUser,
  } = useAuthStore();

  const [form, setForm] = useState({
    location: "",
    shipping_address: "",
    country: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      location: userLocation || "",
      shipping_address: userShippingAddress || "",
      country: userCountry || "",
      street_address: userStreetAddress || "",
      city: userCity || "",
      state: userState || "",
      zip_code: userZipCode || "",
    });
  }, [
    userLocation,
    userShippingAddress,
    userCountry,
    userStreetAddress,
    userCity,
    userState,
    userZipCode,
  ]);

  const change = (id) => (e) =>
    setForm((p) => ({ ...p, [id]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.street_address.trim()) e.street_address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip_code.trim()) e.zip_code = "Required";

    // ZIP code validation
    if (form.zip_code && !/^[\w\s\-]+$/.test(form.zip_code)) {
      e.zip_code = "Invalid ZIP code format";
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Map form fields to what updateProfile expects (camelCase)
    const ok = await updateProfile({
      location: form.location,
      country: form.country,
      streetAddress: form.street_address,
      city: form.city,
      state: form.state,
      zipCode: form.zip_code,
      shippingAddress: form.shipping_address,
    });

    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Location">
          <Input
            id="location"
            value={form.location}
            onChange={change("location")}
            placeholder="City, Country"
          />
        </Field>
        <Field label="Country">
          <Input
            id="country"
            value={form.country}
            onChange={change("country")}
            placeholder="United States"
          />
        </Field>
      </div>

      <Field label="Street Address" error={errors.street_address}>
        <Input
          id="street_address"
          value={form.street_address}
          onChange={change("street_address")}
          placeholder="123 Main Street, Apt 4B"
          error={errors.street_address}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="City" error={errors.city}>
          <Input
            id="city"
            value={form.city}
            onChange={change("city")}
            placeholder="New York"
            error={errors.city}
          />
        </Field>
        <Field label="State" error={errors.state}>
          <Input
            id="state"
            value={form.state}
            onChange={change("state")}
            placeholder="NY"
            error={errors.state}
          />
        </Field>
        <Field label="ZIP Code" error={errors.zip_code}>
          <Input
            id="zip_code"
            value={form.zip_code}
            onChange={change("zip_code")}
            placeholder="10001"
            error={errors.zip_code}
          />
        </Field>
      </div>

      <Field label="Default Shipping Address">
        <Input
          id="shipping_address"
          value={form.shipping_address}
          onChange={change("shipping_address")}
          placeholder="Same as above, or a different address"
        />
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
