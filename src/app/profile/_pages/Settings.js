"use client";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { toast } from "react-toastify";
import { Textinput } from "@/components/inputs/Textinput";

const Settings = () => {
  const { formData, setFormData } = useGlobalState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: formData?.userFirstName || "",
      last_name: formData?.userLastName || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      location: formData?.location || "",
      shipping_address: formData?.shippingAddress || "",
      country: formData?.country || "",
      street_address: formData?.streetAddress || "",
      city: formData?.city || "",
      state: formData?.state || "",
      zip_code: formData?.zipCode || "",
    },
  });

  const onSubmit = async (data) => {
    const token =
      localStorage.getItem("userAuthToken") ||
      sessionStorage.getItem("userAuthToken");

    if (!token) {
      toast.error("Authorization token not found.");
      return;
    }

    try {
      const response = await axios.put(
        `https://isans.pythonanywhere.com/users/profile/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData((prev) => ({ ...prev, ...response.data }));
      toast.success("Profile updated successfully!");
      reset(response.data);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 card shadow-md rounded p-6"
      >
        {/* First Name */}
        <div>
          <Textinput
            label="First Name"
            type="text"
            value={formData.userFirstName} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your first name"
            {...register("first_name", { required: "First Name is required" })}
          />
          {errors.first_name && (
            <span className="text-red-500 text-sm">
              {errors.first_name.message}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div>
          <Textinput
            label="Last Name"
            type="text"
            value={formData.userLastName} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your last name"
            {...register("last_name", { required: "Last Name is required" })}
          />
          {errors.last_name && (
            <span className="text-red-500 text-sm">
              {errors.last_name.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div>
          <Textinput
            label="Email"
            type="email"
            value={formData.email} // Prefilled value
            changed={(e) => {}}
            className={`${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div>
          <Textinput
            label="Phone"
            type="text"
            value={formData.phone} // Prefilled value
            changed={(e) => {}}
            className={`${errors.phone ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your phone number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid phone number",
              },
            })}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>

        {/* Location */}
        <div>
          <Textinput
            label="Location"
            type="text"
            value={formData.location} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your location"
            {...register("location", { required: "Location is required" })}
          />
          {errors.location && (
            <span className="text-red-500 text-sm">
              {errors.location.message}
            </span>
          )}
        </div>

        {/* Shipping Address */}
        <div>
          <Textinput
            label="Shipping Address"
            type="text"
            value={formData.shippingAddress} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.shipping_address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your shipping address"
            {...register("shipping_address", {
              required: "Shipping Address is required",
            })}
          />
          {errors.shipping_address && (
            <span className="text-red-500 text-sm">
              {errors.shipping_address.message}
            </span>
          )}
        </div>

        {/* Country */}
        <div>
          <Textinput
            label="Country"
            type="text"
            value={formData.country} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your country"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && (
            <span className="text-red-500 text-sm">
              {errors.country.message}
            </span>
          )}
        </div>

        {/* Street Address */}
        <div>
          <Textinput
            label="Street Address"
            type="text"
            value={formData.streetAddress} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.street_address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your street address"
            {...register("street_address", {
              required: "Street Address is required",
            })}
          />
          {errors.street_address && (
            <span className="text-red-500 text-sm">
              {errors.street_address.message}
            </span>
          )}
        </div>

        {/* City */}
        <div>
          <Textinput
            label="City"
            type="text"
            value={formData.city} // Prefilled value
            changed={(e) => {}}
            className={`${errors.city ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your city"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <span className="text-red-500 text-sm">{errors.city.message}</span>
          )}
        </div>

        {/* State */}
        <div>
          <Textinput
            label="State"
            type="text"
            value={formData.state} // Prefilled value
            changed={(e) => {}}
            className={`${errors.state ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your state"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && (
            <span className="text-red-500 text-sm">{errors.state.message}</span>
          )}
        </div>

        {/* Zip Code */}
        <div>
          <Textinput
            label="Zip Code"
            type="text"
            value={formData.zipCode} // Prefilled value
            changed={(e) => {}}
            className={`${
              errors.zip_code ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your zip code"
            {...register("zip_code", { required: "Zip Code is required" })}
          />
          {errors.zip_code && (
            <span className="text-red-500 text-sm">
              {errors.zip_code.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
