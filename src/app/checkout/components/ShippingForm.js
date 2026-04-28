// components/ShippingForm.jsx
import React, { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { User, Phone, MapPin, Building, Flag, Hash } from "lucide-react";

const ShippingForm = ({ shippingDetails, onChange, errors }) => {
  const {
    userFirstName,
    userLastName,
    userPhone,
    userStreetAddress,
    userCity,
    userState,
    userZipCode,
  } = useAuthStore();

  // Auto-fill from auth store on mount if fields are empty
  useEffect(() => {
    if (!shippingDetails.fullName && (userFirstName || userLastName)) {
      onChange("fullName", `${userFirstName} ${userLastName}`.trim());
    }
    if (!shippingDetails.phoneNumber && userPhone) {
      onChange("phoneNumber", userPhone);
    }
    if (!shippingDetails.streetAddress && userStreetAddress) {
      onChange("streetAddress", userStreetAddress);
    }
    if (!shippingDetails.city && userCity) {
      onChange("city", userCity);
    }
    if (!shippingDetails.state && userState) {
      onChange("state", userState);
    }
    if (!shippingDetails.zipCode && userZipCode) {
      onChange("zipCode", userZipCode);
    }
  }, []);

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

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={shippingDetails.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
              errors.fullName ? "border-red-500" : "border-border"
            } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
            placeholder="John Doe"
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="tel"
            value={shippingDetails.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
              errors.phoneNumber ? "border-red-500" : "border-border"
            } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
            placeholder="08012345678"
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-3 text-muted" />
          <textarea
            value={shippingDetails.streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
            rows={2}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
              errors.streetAddress ? "border-red-500" : "border-border"
            } bg-transparent focus:outline-none focus:border-primary-400 transition-colors resize-none`}
            placeholder="123 Main Street, Off Broad Road"
          />
        </div>
        {errors.streetAddress && (
          <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={shippingDetails.city}
              onChange={(e) => onChange("city", e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                errors.city ? "border-red-500" : "border-border"
              } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
              placeholder="Ikeja"
            />
          </div>
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Flag
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <select
              value={shippingDetails.state}
              onChange={(e) => onChange("state", e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                errors.state ? "border-red-500" : "border-border"
              } bg-transparent focus:outline-none focus:border-primary-400 transition-colors`}
            >
              <option value="">Select state</option>
              {nigerianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      {/* ZIP Code (Optional) */}
      <div>
        <label className="block text-sm font-semibold mb-1">ZIP Code</label>
        <div className="relative">
          <Hash
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={shippingDetails.zipCode}
            onChange={(e) => onChange("zipCode", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
            placeholder="100001"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
