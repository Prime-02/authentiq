// components/DeliveryCompanyCard.jsx
import React from "react";
import {
  Building2,
  Loader2,
  X,
  MapPin,
  Phone,
  Globe,
  Flag,
  Map,
  Check,
  AlertCircle,
} from "lucide-react";
import DeliveryCompanySelector from "@/app/admin/[admin]/delivery_companies/components/DeliveryCompanySelector";

const DeliveryCompanyCard = ({
  order,
  deliveryCompanies,
  showSelect,
  onToggleSelect,
  selectedCompanyId,
  onCompanySelect,
  onAssign,
  onUnassign,
  loading,
  deliveryState,
}) => {
  const selectedCompany = deliveryCompanies.find(
    (c) => c.id === selectedCompanyId,
  );

  const getServiceAreaConfig = (serviceArea) => {
    const configs = {
      worldwide: {
        icon: Globe,
        label: "Worldwide",
        color: "text-[var(--info-600)]",
        bg: "bg-[var(--info-50)]",
        border: "border-[var(--info-200)]",
      },
      nationwide: {
        icon: Flag,
        label: "Nationwide",
        color: "text-[var(--success-600)]",
        bg: "bg-[var(--success-50)]",
        border: "border-[var(--success-200)]",
      },
      regional: {
        icon: Map,
        label: "Regional",
        color: "text-[var(--warning-600)]",
        bg: "bg-[var(--warning-50)]",
        border: "border-[var(--warning-200)]",
      },
      local: {
        icon: MapPin,
        label: "Local",
        color: "text-[var(--primary-600)]",
        bg: "bg-[var(--primary-50)]",
        border: "border-[var(--primary-200)]",
      },
    };
    return configs[serviceArea] || configs.local;
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-100)] border border-[var(--primary-200)] flex items-center justify-center">
              <Building2 size={20} className="text-[var(--primary-600)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
                Delivery Company
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {order?.delivery_company
                  ? order.delivery_company.name
                  : "Not assigned"}
              </p>
            </div>
          </div>
          {!showSelect && (
            <button
              onClick={onToggleSelect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
            >
              {order?.delivery_company ? "Change" : "Assign"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {showSelect ? (
        <div className="px-6 pb-6">
          <div className="p-5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] space-y-4">
            {/* Selector */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Select Company
              </label>
              <DeliveryCompanySelector
                onSelect={onCompanySelect}
                selectedCompanyId={selectedCompanyId}
                deliveryState={deliveryState}
              />
            </div>

            {/* Selected Company Preview */}
            {selectedCompany && (
              <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-100)] flex items-center justify-center flex-shrink-0">
                    <Building2
                      size={18}
                      className="text-[var(--primary-600)]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-sm text-[var(--text-primary)]">
                        {selectedCompany.name}
                      </p>
                      {selectedCompany.service_area &&
                        (() => {
                          const config = getServiceAreaConfig(
                            selectedCompany.service_area,
                          );
                          const Icon = config.icon;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}
                            >
                              <Icon size={10} />
                              {config.label}
                            </span>
                          );
                        })()}
                    </div>
                    <div className="space-y-1">
                      {selectedCompany.branch && (
                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                          <MapPin size={10} />
                          {selectedCompany.branch}
                        </p>
                      )}
                      {selectedCompany.contact_number && (
                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                          <Phone size={10} />
                          {selectedCompany.contact_number}
                        </p>
                      )}
                      {selectedCompany.email && (
                        <p className="text-xs text-[var(--text-muted)]">
                          {selectedCompany.email}
                        </p>
                      )}
                    </div>
                    {/* Coverage */}
                    <div className="mt-2 pt-2 border-t border-[var(--border-light)]">
                      {selectedCompany.service_area === "worldwide" && (
                        <p className="text-xs text-[var(--info-600)]">
                          Delivers worldwide
                        </p>
                      )}
                      {selectedCompany.service_area === "nationwide" && (
                        <p className="text-xs text-[var(--success-600)]">
                          Delivers nationwide
                        </p>
                      )}
                      {selectedCompany.service_area === "regional" &&
                        selectedCompany.coverage_states && (
                          <p className="text-xs text-[var(--text-muted)]">
                            Covers:{" "}
                            {selectedCompany.coverage_states
                              .slice(0, 3)
                              .join(", ")}
                            {selectedCompany.coverage_states.length > 3 &&
                              ` +${selectedCompany.coverage_states.length - 3} more`}
                          </p>
                        )}
                      {selectedCompany.service_area === "local" &&
                        selectedCompany.state && (
                          <p className="text-xs text-[var(--text-muted)]">
                            {selectedCompany.state} only
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onAssign}
                disabled={loading || !selectedCompanyId}
                className="btn btn-primary btn-sm flex-1 justify-center"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Assign Company
              </button>
              {order?.delivery_company_id && (
                <button
                  onClick={onUnassign}
                  disabled={loading}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <button
              onClick={onToggleSelect}
              className="btn btn-ghost btn-sm w-full justify-center"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">
          {order?.delivery_company ? (
            <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--success-100)] border border-[var(--success-200)] flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-[var(--success-600)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">
                    {order.delivery_company.name}
                  </p>
                  {order.delivery_company.branch && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
                      <MapPin size={10} />
                      {order.delivery_company.branch}
                    </p>
                  )}
                  {order.delivery_company.contact_number && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                      <Phone size={10} />
                      {order.delivery_company.contact_number}
                    </p>
                  )}
                </div>
                {order.delivery_company.service_area &&
                  (() => {
                    const config = getServiceAreaConfig(
                      order.delivery_company.service_area,
                    );
                    const Icon = config.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${config.bg} ${config.color} ${config.border}`}
                      >
                        <Icon size={10} />
                        {config.label}
                      </span>
                    );
                  })()}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--warning-50)] border border-[var(--warning-200)] flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={20} className="text-[var(--warning-600)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                No delivery company assigned
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Assign a company to enable shipment tracking
              </p>
              <button
                onClick={onToggleSelect}
                className="btn btn-primary btn-sm"
              >
                Assign Company
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryCompanyCard;
