"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Textinput } from "@/components/inputs/Textinput";
import { ButtonTwo } from "../buttons/Buttons";
import Link from "next/link";

const Settings = ({ prop = "user", route = `/profile/profile`, token }) => {
  const back = useRouter();
  const { formData, setFormData, fetchUserData, } = useGlobalState();
  const nav = useRouter()
  const SignOut = () => {
    localStorage.removeItem("userAuthToken");
    sessionStorage.removeItem("userAuthToken");
    // window.location.reload();
    nav.push(`/`)
  };


  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    shipping_address: "",
    country: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to dynamically get properties
  const getDynamicProp = (key) => formData[`${prop}${key}`] || "";

  useEffect(() => {
    if (formData) {
      setForm({
        first_name: getDynamicProp("FirstName"),
        last_name: getDynamicProp("LastName"),
        email: getDynamicProp("Email"),
        phone: getDynamicProp("Phone"),
        location: getDynamicProp("Location"),
        shipping_address: getDynamicProp("ShippingAddress"),
        country: getDynamicProp("Country"),
        street_address: getDynamicProp("StreetAddress"),
        city: getDynamicProp("City"),
        state: getDynamicProp("State"),
        zip_code: getDynamicProp("ZipCode"),
        gender: getDynamicProp("Gender"),
      });
    }
  }, [formData, prop]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.first_name) newErrors.first_name = "First Name is required";
    if (!form.last_name) newErrors.last_name = "Last Name is required";
    // if (!form.email) {
    //   newErrors.email = "Email is required";
    // } else if (!/^\S+@\S+$/i.test(form.email)) {
    //   newErrors.email = "Invalid email address";
    // }
    // if (!form.phone) {
    //   newErrors.phone = "Phone number is required";
    // } else if (!/^[0-9]{11}$/.test(form.phone)) {
    //   newErrors.phone = "Invalid phone number";
    // }
    if (!form.shipping_address)
      newErrors.shipping_address = "Shipping Address is required";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.street_address)
      newErrors.street_address = "Street Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.zip_code) newErrors.zip_code = "Zip Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      toast.error("Authorization token not found.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `https://isans.pythonanywhere.com/users/profile/`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData((prev) => ({ ...prev, ...response.data }));
      toast.success("Profile updated successfully!");
      if (response.status === 201 || response.status === 200){
        fetchUserData()
      back.push(route);
      }
      // setForm(response.data);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8  px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 card p-8  relative rounded-lg shadow-lg"
      >
        <header className="flex mb-6 justify-between items-center">
          <Link
            href={`/`}
            className="text-xs underline hover:text-blue-600 cursor-pointer"
          >
            Back
          </Link>
          <h1 className="text-3xl font-semibold text-center ">Profile</h1>
          <span
            className="text-xs underline hover:text-blue-600 cursor-pointer"
            onClick={() => SignOut()}
          >
            Log Out
          </span>
        </header>
        {/* Form fields */}
        <div className="flex flex-wrap items-center gap-5 w-full">
          {/* Initial Letter Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <span className="border text-center flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              {form.first_name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* First Name Input */}
          <div className="flex-1 min-w-[150px]">
            <Textinput
              id={`first_name`}
              label={`First Name`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              value={form.first_name}
              changed={handleInputChange}
            />
            {errors.first_name && (
              <span className="text-red-500 text-sm">{errors.first_name}</span>
            )}
          </div>

          {/* Last Name Input */}
          <div className="flex-1 min-w-[150px]">
            <Textinput
              id={`last_name`}
              label={`Last Name`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
              value={form.last_name}
              changed={handleInputChange}
            />
            {errors.last_name && (
              <span className="text-red-500 text-sm">{errors.last_name}</span>
            )}
          </div>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Textinput
              id={`email`}
              label={`Email`}
              type={`email`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={form.email}
              changed={handleInputChange}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <Textinput
              id={`phone`}
              label={`Phone`}
              type={`phone`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              value={form.phone}
              changed={handleInputChange}
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <select
              id="gender"
              name="gender"
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
              value={form.gender || ""}
              onChange={handleInputChange}
            >
              <option value="" className="text-blue-600">
                Select Gender
              </option>
              <option value="MALE" className="text-blue-600">
                Male
              </option>
              <option value="FEMALE" className="text-blue-600">
                Female
              </option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-sm">{errors.gender}</span>
            )}
          </div>

          <div>
            <Textinput
              id={`location`}
              label={`Location`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              value={form.location}
              changed={handleInputChange}
            />
            {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <Textinput
              id={`country`}
              label={`country`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
              value={form.country}
              changed={handleInputChange}
            />
            {errors.country && (
              <span className="text-red-500 text-sm">{errors.country}</span>
            )}
          </div>
          <div className="col-span-2">
            <Textinput
              id={`shipping_address`}
              label={`Shipping Address`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.shipping_address ? "border-red-500" : "border-gray-300"
              }`}
              value={form.shipping_address}
              changed={handleInputChange}
            />
            {errors.shipping_address && (
              <span className="text-red-500 text-sm">
                {errors.shipping_address}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div>
            <Textinput
              id={`street_address`}
              label={`Street Address`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.street_address ? "border-red-500" : "border-gray-300"
              }`}
              value={form.street_address}
              changed={handleInputChange}
            />
            {errors.street_address && (
              <span className="text-red-500 text-sm">
                {errors.street_address}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <Textinput
              id={`state`}
              label={`State`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
              value={form.state}
              changed={handleInputChange}
            />
            {errors.state && (
              <span className="text-red-500 text-sm">{errors.state}</span>
            )}
          </div>
          <div>
            <Textinput
              label={`City`}
              id={`city`}
              type={`text`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              value={form.city}
              changed={handleInputChange}
            />
            {errors.city && (
              <span className="text-red-500 text-sm">{errors.city}</span>
            )}
          </div>

          <div>
            <Textinput
              id={`zip_code`}
              label={`Zipcode`}
              type={`number`}
              className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
                errors.zip_code ? "border-red-500" : "border-gray-300"
              }`}
              value={form.zip_code}
              changed={handleInputChange}
            />
            {errors.zip_code && (
              <span className="text-red-500 text-sm">{errors.zip_code}</span>
            )}
          </div>
        </div>
        <div className="text-center mt-6">
          <ButtonTwo disabled={isSubmitting} buttonValue={`Submit`} />
        </div>
      </form>
    </div>
  );
};

export default Settings;
