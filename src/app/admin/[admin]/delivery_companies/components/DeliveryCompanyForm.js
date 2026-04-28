// components/DeliveryCompanyForm.jsx
import React, { useState, useEffect } from "react";
import { useDeliveryCompanyStore } from "@/stores";
import Modal from "@/components/Modal/Modal";
import { Building2, Loader2, X, Globe, MapPin, Flag, Map, Loader } from "lucide-react";
import { toast } from "react-toastify";
import Dropdown from "@/components/inputs/DynamicDropdown";

const DeliveryCompanyForm = ({ company, onClose, onSuccess }) => {
  const { createDeliveryCompany, updateDeliveryCompany, loadingMutation } =
    useDeliveryCompanyStore();

  const isEditing = !!company;

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    branch: "",
    state: "",
    website: "",
    serviceArea: "local", // "local" | "regional" | "nationwide" | "worldwide"
    coverageStates: [], // For regional companies
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        contactNumber: company.contact_number || "",
        address: company.address || "",
        branch: company.branch || "",
        state: company.state || "",
        website: company.website || "",
        serviceArea: company.service_area || "local",
        coverageStates: company.coverage_states || [],
      });
    }
  }, [company]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.branch.trim()) newErrors.branch = "Branch is required";

    // State validation based on service area
    if (
      formData.serviceArea !== "worldwide" &&
      formData.serviceArea !== "nationwide"
    ) {
      if (!formData.state.trim()) {
        newErrors.state = "State is required for local/regional service";
      }
    }

    // Coverage states validation for regional
    if (
      formData.serviceArea === "regional" &&
      formData.coverageStates.length === 0
    ) {
      newErrors.coverageStates = "Select at least one coverage state";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
    };

    // Remove state for non-local/regional companies
    if (
      formData.serviceArea === "worldwide" ||
      formData.serviceArea === "nationwide"
    ) {
      payload.state = "All";
    }

    // Remove coverageStates for non-regional companies
    if (formData.serviceArea !== "regional") {
      payload.coverageStates = [];
    }

    if (isEditing) {
      await updateDeliveryCompany(company.id, payload);
    } else {
      await createDeliveryCompany(payload);
    }
    onSuccess();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Reset dependent fields when service area changes
    if (field === "serviceArea") {
      if (value === "worldwide" || value === "nationwide") {
        setFormData((prev) => ({
          ...prev,
          state: "",
          coverageStates: [],
        }));
        setErrors((prev) => ({
          ...prev,
          state: undefined,
          coverageStates: undefined,
        }));
      } else if (value === "local") {
        setFormData((prev) => ({
          ...prev,
          coverageStates: [],
        }));
        setErrors((prev) => ({
          ...prev,
          coverageStates: undefined,
        }));
      }
    }
  };

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

  const serviceAreaOptions = [
    {
      value: "local",
      icon: MapPin,
      label: "Local",
      description: "Single state only",
      color: "",
      activeColor: " ring-1",
    },
    {
      value: "regional",
      icon: Map,
      label: "Regional",
      description: "Multiple states/regions",
      color: "",
      activeColor: " ring-1",
    },
    {
      value: "nationwide",
      icon: Flag,
      label: "Nationwide",
      description: "All states in Nigeria",
      color: "",
      activeColor: " ring-1",
    },
    {
      value: "worldwide",
      icon: Globe,
      label: "Worldwide",
      description: "International delivery",
      color: "",
      activeColor: " ring-1",
    },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? "Edit Company" : "Add Company"}
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide">
              Basic Information
            </h4>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-border"
                } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
                placeholder="e.g., FedEx, UPS, DHL"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.contactNumber ? "border-red-500" : "border-border"
                  } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
                  placeholder="e.g., 08012345678"
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.address ? "border-red-500" : "border-border"
                } bg-transparent focus:outline-none focus:border-primary-400 transition-colors resize-none`}
                placeholder="Enter full address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => handleChange("branch", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.branch ? "border-red-500" : "border-border"
                } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
                placeholder="e.g., Main Branch, Ikeja Branch"
              />
              {errors.branch && (
                <p className="text-red-500 text-xs mt-1">{errors.branch}</p>
              )}
            </div>
          </div>

          {/* Service Area */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide">
              Service Area
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {serviceAreaOptions.map((option) => {
                const Icon = option.icon;
                const isActive = formData.serviceArea === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("serviceArea", option.value)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      isActive
                        ? option.activeColor
                        : `border-border hover:border-primary-200 ${option.color}`
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        size={20}
                        className={isActive ? "text-current" : "text-muted"}
                      />
                      <span className="font-semibold text-sm">
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* State Selection (Conditional) */}
          {(formData.serviceArea === "local" ||
            formData.serviceArea === "regional") && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide">
                Location Details
              </h4>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  {formData.serviceArea === "regional"
                    ? "Primary State"
                    : "State"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  options={nigerianStates.map((state) => ({
                    id: state,
                    code: state,
                  }))}
                  onSelect={(value) => handleChange("state", value)}
                  valueKey="id"
                  displayKey="code"
                  placeholder="Select state"
                  tag="state"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              {/* Coverage States for Regional */}
              {formData.serviceArea === "regional" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Coverage States <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted mb-3">
                    Select all states where this company operates
                  </p>

                  {errors.coverageStates && (
                    <p className="text-red-500 text-xs mb-2">
                      {errors.coverageStates}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg">
                    {nigerianStates.map((state) => {
                      const isChecked = formData.coverageStates.includes(state);
                      return (
                        <label
                          key={state}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? "border-border"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newStates = e.target.checked
                                ? [...formData.coverageStates, state]
                                : formData.coverageStates.filter(
                                    (s) => s !== state,
                                  );
                              handleChange("coverageStates", newStates);
                            }}
                            className="rounded border-border text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{state}</span>
                        </label>
                      );
                    })}
                  </div>

                  {formData.coverageStates.length > 0 && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted">
                        {formData.coverageStates.length} state(s) selected
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChange("coverageStates", [])}
                        className="text-red-500 hover:text-red-700"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Worldwide/Nationwide Info */}
          {(formData.serviceArea === "worldwide" ||
            formData.serviceArea === "nationwide") && (
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-start gap-3">
                {formData.serviceArea === "worldwide" ? (
                  <Globe
                    size={20}
                    className="text-primary-600 flex-shrink-0 mt-0.5"
                  />
                ) : (
                  <Flag
                    size={20}
                    className="text-primary-600 flex-shrink-0 mt-0.5"
                  />
                )}
                <div>
                  <p className="font-semibold text-primary-700">
                    {formData.serviceArea === "worldwide"
                      ? "Worldwide Coverage"
                      : "Nationwide Coverage"}
                  </p>
                  <p className="text-sm text-primary-600 mt-1">
                    {formData.serviceArea === "worldwide"
                      ? "This company will be available for all delivery locations, including international orders."
                      : "This company will be available for deliveries to all states in Nigeria."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {formData.name && formData.serviceArea && (
            <div className="p-4 bg-secondary rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-muted">Summary</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted">Company:</span>{" "}
                  <span className="font-medium">{formData.name}</span>
                </p>
                <p>
                  <span className="text-muted">Service Area:</span>{" "}
                  <span className="font-medium capitalize">
                    {formData.serviceArea}
                  </span>
                </p>
                {formData.serviceArea === "local" && formData.state && (
                  <p>
                    <span className="text-muted">State:</span>{" "}
                    <span className="font-medium">{formData.state}</span>
                  </p>
                )}
                {formData.serviceArea === "regional" && (
                  <>
                    {formData.state && (
                      <p>
                        <span className="text-muted">Primary State:</span>{" "}
                        <span className="font-medium">{formData.state}</span>
                      </p>
                    )}
                    {formData.coverageStates.length > 0 && (
                      <p>
                        <span className="text-muted">Coverage:</span>{" "}
                        <span className="font-medium">
                          {formData.coverageStates.length} state(s)
                        </span>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loadingMutation}
              className="flex-1 px-4 py-2.5 border-2 btn btn-md btn-ghost disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingMutation}
              className="flex-1 px-4 py-2.5 btn btn-md btn-primary font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingMutation ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{isEditing ? "Update Company" : "Create Company"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DeliveryCompanyForm;
