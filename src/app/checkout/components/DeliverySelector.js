// components/DeliverySelector.jsx
import React from "react";
import { Truck, MapPin } from "lucide-react";
import DeliveryCompanySelector from "@/app/admin/[admin]/delivery_companies/components/DeliveryCompanySelector";

const DeliverySelector = ({ deliveryState, onSelect }) => {
  if (!deliveryState) {
    return (
      <div className="text-center py-6">
        <MapPin size={32} className="text-muted mx-auto mb-3" />
        <p className="text-secondary">
          Please select your state first to see available delivery companies
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm text-muted">
        <Truck size={16} />
        <span>Showing delivery companies for {deliveryState}</span>
      </div>
      <DeliveryCompanySelector
        onSelect={onSelect}
        deliveryState={deliveryState}
      />
    </div>
  );
};

export default DeliverySelector;
