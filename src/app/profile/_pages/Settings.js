"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { toast } from "react-toastify";
import { LoaderStyle5Component } from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";

const Settings = () => {
  const back = useRouter();
  const { formData, setFormData } = useGlobalState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (formData) {
      reset({
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
        gender: formData?.gender || "",
      });
    }
  }, [formData, reset]);

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
    } finally {
      back.push(`/profile/profile`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 card p-6 rounded-lg shadow-lg"
      >
        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="first_name"
              className="block text-lg font-medium "
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your first name"
              {...register("first_name", {
                required: "First Name is required",
              })}
            />
            {errors.first_name && (
              <span className="text-red-500 text-sm">
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-lg font-medium "
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
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
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium "
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
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

        {/* Gender Dropdown */}
        {/* Gender Dropdown */}
        <div>
          <label
            htmlFor="gender"
            className="block text-lg font-medium "
          >
            Gender
          </label>
          <select
            id="gender"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
            {...register("gender")}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm">
              {errors.gender.message}
            </span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-medium "
          >
            Phone
          </label>
          <input
            id="phone"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
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

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="location"
              className="block text-lg font-medium "
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
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

          <div>
            <label
              htmlFor="shipping_address"
              className="block text-lg font-medium "
            >
              Shipping Address
            </label>
            <input
              id="shipping_address"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
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
        </div>

        {/* Country and Street Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="country"
              className="block text-lg font-medium "
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
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

          <div>
            <label
              htmlFor="street_address"
              className="block text-lg font-medium "
            >
              Street Address
            </label>
            <input
              id="street_address"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
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
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-lg font-medium "
            >
              City
            </label>
            <input
              id="city"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your city"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <span className="text-red-500 text-sm">
                {errors.city.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-lg font-medium "
            >
              State
            </label>
            <input
              id="state"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your state"
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <span className="text-red-500 text-sm">
                {errors.state.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="zip_code"
              className="block text-lg font-medium "
            >
              Zip Code
            </label>
            <input
              id="zip_code"
              type="text"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
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
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center duration-200"
          >
            {isSubmitting ? (
              <LoaderStyle5Component fill={`#ffffff`} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
