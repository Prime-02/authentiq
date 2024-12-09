"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Textinput } from "@/components/inputs/Textinput";
import { ButtonTwo } from "../reusables/buttons/Buttons";


const CheckOut = ({ prop = "user", route = `/profile/profile` }) => {
  const back = useRouter();
  const { formData, setFormData, fetchUserData, getToken } = useGlobalState();
  const [form, setForm] = useState({
    shipping_address: "",
    country: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const token = getToken(`user`);
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
    if (!form.shipping_address)
      newErrors.shipping_address = "Shipping Address is required";
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
      if (response.status === 201 || response.status === 200) {
        fetchUserData();
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
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6  p-8  relative">
        <h1 className="text-xl font-semibold">Shipping Information</h1>
        {/* Form fields */}
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
        <div className="text-center mt-6 ">
          <ButtonTwo disabled={isSubmitting} buttonValue={`Update`} 
          className={`w-full rounded-lg`}
          />
        </div>
      </form>
    </div>
  );
};

export default CheckOut;
