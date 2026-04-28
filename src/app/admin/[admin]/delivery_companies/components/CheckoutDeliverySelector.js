// components/CheckoutDeliverySelector.jsx
import React, { useState } from "react";
import { useDeliveryCompanyStore } from "@/stores";
import DeliveryCompanySelector from "./DeliveryCompanySelector";
import {
  Truck,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

const CheckoutDeliverySelector = ({ deliveryState, onCompanySelect }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleSelect = (companyId) => {
    setSelectedCompanyId(companyId);
    const company = useDeliveryCompanyStore
      .getState()
      .deliveryCompanies.find((c) => c.id === companyId);
    setSelectedCompany(company);
    onCompanySelect(companyId);
  };

  return (
    <div className="space-y-4">
      <DeliveryCompanySelector
        onSelect={handleSelect}
        selectedCompanyId={selectedCompanyId}
        deliveryState={deliveryState}
      />

      {/* Selected Company Details */}
      {selectedCompany && (
        <div className="card rounded-xl p-4 bg-primary-50 border border-primary-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-primary-600" />
            <h4 className="font-semibold text-primary-700">
              Selected Delivery Company
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-muted" />
              <span>
                {selectedCompany.address}, {selectedCompany.branch}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-muted" />
              <span>{selectedCompany.contact_number}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck size={16} className="text-muted" />
              <span>Delivery to {selectedCompany.state}</span>
            </div>
            {selectedCompany.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe size={16} className="text-muted" />
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delivery Info */}
      {selectedCompany && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Shield size={14} />
            <span>Your order is protected by our delivery guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock size={14} />
            <span>Estimated delivery: 3-5 business days</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutDeliverySelector;
