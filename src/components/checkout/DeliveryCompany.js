"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Textinput } from "@/components/inputs/Textinput";
import { ButtonTwo } from "../reusables/buttons/Buttons";
import { toast } from "react-toastify";
import { useGlobalState } from "@/app/GlobalStateProvider";
import Modal from "../Modal/Modal";
import { Link2, Pen, Plus, Truck } from "lucide-react";
import Link from "next/link";

const BASE_URL = "https://isans.pythonanywhere.com";

const EMPTY_FORM = {
  name: "",
  contact_number: "",
  address: "",
  branch: "",
  state: "",
  website: "",
};

export const DeliveryCompany = () => {
  const { getToken, formData, fetchCart } = useGlobalState();
  const token = getToken("user");
  const cart = formData.cart;

  const [modal, setModal] = useState(false);
  // When editing, store the company being edited; null means "create" mode
  const [editingCompany, setEditingCompany] = useState(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deliveryCompanies, setDeliveryCompanies] = useState([]);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchDeliveryCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/shop/delivery-companies/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryCompanies(response.data);
    } catch (error) {
      console.error("Error fetching delivery companies:", error.message);
      toast.error("Failed to load delivery companies.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDeliveryCompanies();
  }, [fetchDeliveryCompanies]);

  // ── Confirm order ────────────────────────────────────────────────────────

  const handleConfirmOrder = async () => {
    if (!selectedCompanyId) {
      toast.error("Please select a delivery company.");
      return;
    }
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    // Build a flat shipping_address string expected by the backend
    const shippingAddress = [
      formData.userStreetAddress,
      formData.userCity,
      formData.userState,
      formData.userZipcode,
      formData.userCountry,
    ]
      .filter(Boolean)
      .join(", ");

    const params = new URLSearchParams({
      shipping_address: shippingAddress,
      ...(formData.shippingCost != null && {
        shipping_cost: formData.shippingCost,
      }),
      ...(formData.tax != null && { tax: formData.tax }),
      delivery_company_id: selectedCompanyId,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/shop/orders/?${params.toString()}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Order confirmed successfully!");
        setSelectedCompanyId(null);
        fetchCart();
      }
    } catch (error) {
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        console.error("Error confirming order:", error.message);
        toast.error("Failed to confirm order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // ── Form helpers ─────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    // Clear error on change
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Company name is required.";
    if (!form.contact_number.trim())
      newErrors.contact_number = "Contact number is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.branch.trim()) newErrors.branch = "Branch is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModal(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setForm({
      name: company.name,
      contact_number: company.contact_number,
      address: company.address,
      branch: company.branch,
      state: company.state,
      website: company.website || "",
    });
    setErrors({});
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditingCompany(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  // ── Create ───────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);
    try {
      // Build query params — the backend reads fields from query params for this endpoint
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "")),
      );

      const response = await axios.post(
        `${BASE_URL}/shop/admin/delivery-companies/?${params.toString()}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Delivery company added successfully!");
        fetchDeliveryCompanies();
        closeModal();
      }
    } catch (error) {
      const detail = error.response?.data?.detail;
      console.error("Error adding delivery company:", detail || error.message);
      toast.error(
        detail || "Failed to add delivery company. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "")),
      );

      const response = await axios.patch(
        `${BASE_URL}/shop/admin/delivery-companies/${editingCompany.id}?${params.toString()}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        toast.success("Delivery company updated successfully!");
        // Optimistically update the local list
        setDeliveryCompanies((prev) =>
          prev.map((c) => (c.id === editingCompany.id ? response.data : c)),
        );
        closeModal();
      }
    } catch (error) {
      const detail = error.response?.data?.detail;
      console.error(
        "Error updating delivery company:",
        detail || error.message,
      );
      toast.error(
        detail || "Failed to update delivery company. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Single submit handler dispatched by Modal's onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCompany) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Modal
        loading={loading}
        disabled={isSubmitting || loading}
        isOpen={modal}
        onClose={closeModal}
        title={
          editingCompany ? "Update Delivery Company" : "Add Delivery Company"
        }
        onSubmit={handleSubmit}
        buttonValue={editingCompany ? "Update Company" : "Add Company"}
      >
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
            label="Website (optional)"
            type="text"
            className="mt-1 block w-full bg-transparent p-3 border rounded-lg shadow-sm border-gray-300"
            value={form.website}
            changed={handleInputChange}
          />
        </div>
      </Modal>

      <div className="mt-8">
        <h2 className="text-lg font-semibold w-full flex justify-between items-center mb-4">
          <span className="flex items-center gap-2">
            <Truck size={20} />
            Delivery Companies
          </span>
          <button
            onClick={openCreateModal}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Add delivery company"
          >
            <Plus />
          </button>
        </h2>

        {loading && deliveryCompanies.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Loading delivery companies…
          </p>
        ) : deliveryCompanies.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No delivery companies available. Add one above.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4 items-start justify-center">
            {deliveryCompanies.map((company) => (
              <div
                key={company.id}
                className={`p-6 card shadow-lg rounded-xl cursor-pointer overflow-hidden relative w-full transition-all ${
                  selectedCompanyId === company.id
                    ? "border-4 border-purple-500"
                    : "border border-transparent"
                }`}
                onClick={() => setSelectedCompanyId(company.id)}
              >
                <div className="relative pr-8">
                  <h3 className="font-semibold text-xl truncate">
                    {company.name}
                  </h3>
                  <input
                    type="radio"
                    name="company"
                    checked={selectedCompanyId === company.id}
                    onChange={() => setSelectedCompanyId(company.id)}
                    className="absolute top-1 right-0"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm">{company.contact_number}</p>
                  <span className="flex items-center divide-x-2">
                    <p className="text-sm pr-2">{company.state}</p>
                    <p className="text-sm px-2">{company.branch}</p>
                  </span>
                  <p className="text-sm truncate">{company.address}</p>
                </div>

                <span className="mt-4 w-full flex justify-between items-center">
                  {company.website ? (
                    <Link
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-500 hover:underline"
                    >
                      <Link2 size={20} />
                    </Link>
                  ) : (
                    <span />
                  )}
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(company);
                    }}
                    aria-label={`Edit ${company.name}`}
                  >
                    <Pen size={15} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}


        <ButtonTwo
          disabled={loading || isSubmitting}
          className="w-full mt-6 rounded-md"
          buttonValue={isSubmitting ? "Placing Order…" : "Confirm Order"}
          Clicked={handleConfirmOrder}
        />
      </div>
    </div>
  );
};
