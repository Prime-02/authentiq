"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Textinput } from "@/components/inputs/Textinput";
import { ButtonTwo } from "../reusables/buttons/Buttons";
import { toast } from "react-toastify";
import { useGlobalState } from "@/app/GlobalStateProvider";
import Modal from "../Modal/Modal";
import { Link2, Pen, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export const DeliveryCompany = () => {
  const { getToken, formData, fetchCart } = useGlobalState();
  const [modal, setModal] = useState(false);
  const token = getToken("user");
  const cart = formData.cart;
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    contact_number: "",
    address: "",
    branch: "",
    state: "",
    website: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryCompanies, setDeliveryCompanies] = useState([]);

  // Fetch delivery companies on component mount
  const fetchDeliveryCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/userdelivery/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeliveryCompanies(response.data);
    } catch (error) {
      console.error("Error fetching delivery companies:", error.message);
      toast.error("Failed to load delivery companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryCompanies();
  }, [token]);

  // Confirm order
  const handleConfirmOrder = async () => {
    setLoading(true);
    if (!selectedCompanyId) {
      toast.error("Please select a delivery company.");
    setLoading(false);
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Prepare the order payload
    const orderData = {
      delivery_company_id: selectedCompanyId,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      shipping_address: {
        street: formData.userStreetAddress,
        city: formData.userCity,
        state: formData.userState,
        zip_code: formData.userZipcode,
        country: formData.userCountry,
      },
    };

    setIsSubmitting(true);

   try {
     const response = await axios.post(
       "https://isans.pythonanywhere.com/shop/orders/",
       orderData,
       {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
       }
     );

     if (response.status === 201 || response.status === 200) {
       toast.success("Order confirmed successfully!");
     }
   } catch (error) {
     // Handle error response
     if (error.response) {
       console.error("Error Details:", error.response.data); // Log full error details
       if (error.response.data.detail) {
         toast.error(error.response.data.detail); // Show details in toast if available
       } else {
         toast.error("Failed to confirm order. Please check your input.");
       }
     } else {
       console.error("Error confirming order:", error.message); // Handle network errors
       toast.error("An unexpected error occurred. Please try again.");
     }
   } finally {
     setIsSubmitting(false);
     setLoading(false);
     fetchCart();
   }

  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Delivery company name is required.";
    if (!form.contact_number)
      newErrors.contact_number = "Contact number is required.";
    if (!form.address) newErrors.address = "Address is required.";
    if (!form.branch) newErrors.branch = "Branch is required.";
    if (!form.state) newErrors.state = "State is required.";
    if (!form.website) newErrors.website = "Website is required."; // Added validation for website

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://isans.pythonanywhere.com/shop/userdelivery/",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("Response:", response.status, response.data);
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Delivery company added successfully!");
        setForm({
          name: "",
          contact_number: "",
          address: "",
          branch: "",
          state: "",
          website: "",
        });
        fetchDeliveryCompanies(); // Refresh the list after successful addition
      }
    } catch (error) {
      console.error("Error adding delivery company:", error.message);
      toast.error("Failed to add delivery company. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
      setModal(false);
    }
  };

  // Handle editing a delivery company
  const handleEdit = (company) => {
    setForm({
      name: company.name,
      contact_number: company.contact_number,
      address: company.address,
      branch: company.branch,
      state: company.state,
      website: company.website || "", // Handle null values
    });
    setModal(true); // Open modal when edit is triggered
  };

  // Handle radio button selection
  const handleRadioChange = (id) => {
    setSelectedCompanyId(id);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Modal
        loading={loading}
        disabled={loading}
        isOpen={modal}
        onClose={() => setModal(false)}
        title={`Add or Update Delivery Company`}
        onSubmit={handleSubmit}
        buttonValue={`Add Company`}
      >
        {/* Modal form inputs */}
        <div className="mb-4">
          <Textinput
            id="name"
            label="Company Name"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            value={form.name}
            changed={handleInputChange}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">{errors.name}</span>
          )}
        </div>

        <div className="mb-4">
          <Textinput
            id="contact_number"
            label="Contact Number"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.contact_number ? "border-red-500" : "border-gray-300"
            }`}
            value={form.contact_number}
            changed={handleInputChange}
          />
          {errors.contact_number && (
            <span className="text-red-500 text-sm mt-1">
              {errors.contact_number}
            </span>
          )}
        </div>

        <div className="mb-4">
          <Textinput
            id="address"
            label="Address"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            value={form.address}
            changed={handleInputChange}
          />
          {errors.address && (
            <span className="text-red-500 text-sm mt-1">{errors.address}</span>
          )}
        </div>

        <div className="mb-4">
          <Textinput
            id="branch"
            label="Branch"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.branch ? "border-red-500" : "border-gray-300"
            }`}
            value={form.branch}
            changed={handleInputChange}
          />
          {errors.branch && (
            <span className="text-red-500 text-sm mt-1">{errors.branch}</span>
          )}
        </div>

        <div className="mb-4">
          <Textinput
            id="state"
            label="State"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
            value={form.state}
            changed={handleInputChange}
          />
          {errors.state && (
            <span className="text-red-500 text-sm mt-1">{errors.state}</span>
          )}
        </div>

        <div className="mb-4">
          <Textinput
            id="website"
            label="Website"
            type="text"
            className={`mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm ${
              errors.website ? "border-red-500" : "border-gray-300"
            }`}
            value={form.website}
            changed={handleInputChange}
          />
          {errors.website && (
            <span className="text-red-500 text-sm mt-1">{errors.website}</span>
          )}
        </div>
      </Modal>

      <div className="mt-8 ">
        <h2 className="text-lg font-semibold w-full flex justify-between">
          <span>Delivery Companies</span>
          <span onClick={() => setModal(true)}>
            <Plus />
          </span>
        </h2>
        <div className="flex flex-wrap gap-4 items-center  justify-center">
          {deliveryCompanies.map((company) => (
            <div
              key={company.id}
              className={`p-6 card shadow-lg rounded-xl cursor-pointer overflow-hidden relative w-full ${
                selectedCompanyId === company.id
                  ? "border-4 border-purple-500"
                  : ""
              }`}
              onClick={() => handleRadioChange(company.id)} // Set selected company id
            >
              <div className="relative">
                <h3 className="font-semibold text-xl truncate">
                  {company.name}
                </h3>

                {/* Radio Button */}
                <input
                  type="radio"
                  name="company"
                  checked={selectedCompanyId === company.id}
                  onChange={() => handleRadioChange(company.id)}
                  className="mt-2 absolute top-2 right-2"
                />
              </div>

              {/* Company Details */}
              <div className="mt-4 space-y-2">
                <p className="text-sm">{company.contact_number}</p>
                <span className="flex items-center divide-x-2">
                  <p className="text-sm pr-2">{company.state}</p>
                  <p className="text-sm px-2">{company.branch}</p>
                </span>
                <p className="text-sm truncate">{company.address}</p>
              </div>

              {/* Next.js Link for website */}
              {company.website && (
                <span className="mt-4 w-full flex justify-between items-center text-blue-500 hover:underline">
                  <Link href={company.website} target="_blank">
                    <Link2 size={24} className="mr-2" />
                  </Link>
                  {/* Update Button */}
                  <button
                    className="text-blue-500 hover:underline "
                    onClick={() => handleEdit(company)}
                  >
                    <Pen size={15} />
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>
      <ButtonTwo
        disabled={loading}
        className="w-full mt-6 rounded-md"
        buttonValue="Confirm Order"
        Clicked={handleConfirmOrder} // Trigger order confirmation
      />
      </div>
    </div>
  );
};
