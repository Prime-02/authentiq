// components/DeliveryCompanySelector.jsx
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDeliveryCompanyStore } from "@/stores";
import {
  Truck,
  Loader2,
  MapPin,
  Phone,
  Building2,
  ChevronDown,
  Check,
  AlertCircle,
  Info,
  Globe,
  Flag,
  Map,
} from "lucide-react";

const DeliveryCompanySelector = ({
  onSelect,
  selectedCompanyId,
  deliveryState,
}) => {
  const {
    deliveryCompanies,
    fetchDeliveryCompanies,
    loadingCompanies,
    pagination,
  } = useDeliveryCompanyStore();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allCompanies, setAllCompanies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const dropdownRef = useRef(null);
  const observerRef = useRef(null);

  // Initial load
  useEffect(() => {
    loadCompanies(1);
  }, [deliveryState]);

  // Append new companies when deliveryCompanies updates
  useEffect(() => {
    if (deliveryCompanies.length > 0 && currentPage === 1) {
      setAllCompanies(deliveryCompanies);
    }
  }, [deliveryCompanies]);

  const loadCompanies = async (page = 1) => {
    if (page === 1) {
      setAllCompanies([]);
    }

    setIsLoadingMore(true);

    const filters = {
      page,
      perPage: 10, // Load 10 items per page for smooth infinite scroll
    };

    if (deliveryState) {
      filters.state = deliveryState;
    }

    await fetchDeliveryCompanies(filters);

    // Update hasMore based on pagination
    const store = useDeliveryCompanyStore.getState();
    setHasMore(store.pagination.has_next);
    setCurrentPage(page);
    setIsLoadingMore(false);
  };

  // Intersection Observer for infinite scroll
  const lastCompanyRef = useCallback(
    (node) => {
      if (loadingCompanies || isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadCompanies(currentPage + 1);
          }
        },
        { threshold: 0.5 },
      );

      if (node) observerRef.current.observe(node);
    },
    [loadingCompanies, isLoadingMore, hasMore, currentPage],
  );

  // Smart filtering based on service area (client-side for already loaded companies)
  const availableCompanies = useMemo(() => {
    if (!deliveryState) return allCompanies;

    return allCompanies.filter((company) => {
      switch (company.service_area) {
        case "worldwide":
          return true;
        case "nationwide":
          return true;
        case "regional":
          return company.coverage_states?.includes(deliveryState);
        case "local":
        default:
          return company.state?.toLowerCase() === deliveryState.toLowerCase();
      }
    });
  }, [allCompanies, deliveryState]);

  const selectedCompany = allCompanies.find((c) => c.id === selectedCompanyId);

  const handleSelect = (companyId) => {
    onSelect(companyId);
    setIsOpen(false);
  };

  const getServiceAreaLabel = (serviceArea) => {
    switch (serviceArea) {
      case "worldwide":
        return "Worldwide";
      case "nationwide":
        return "Nationwide";
      case "regional":
        return "Regional";
      case "local":
        return "Local";
      default:
        return "Local";
    }
  };

  const getServiceAreaIcon = (serviceArea) => {
    switch (serviceArea) {
      case "worldwide":
        return <Globe size={14} />;
      case "nationwide":
        return <Flag size={14} />;
      case "regional":
        return <Map size={14} />;
      case "local":
        return <MapPin size={14} />;
      default:
        return <MapPin size={14} />;
    }
  };

  const getServiceAreaBadgeStyle = (serviceArea) => {
    switch (serviceArea) {
      case "worldwide":
        return "bg-[var(--primary-100)] text-[var(--primary-700)] border border-[var(--primary-300)]";
      case "nationwide":
        return "bg-[var(--info-100)] text-[var(--info-700)] border border-[var(--info-300)]";
      case "regional":
        return "bg-[var(--success-100)] text-[var(--success-700)] border border-[var(--success-300)]";
      case "local":
        return "bg-[var(--warning-100)] text-[var(--warning-700)] border border-[var(--warning-300)]";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]";
    }
  };

  // Group companies by service area for organized display
  const groupedCompanies = useMemo(() => {
    const groups = {
      worldwide: [],
      nationwide: [],
      regional: [],
      local: [],
    };

    availableCompanies.forEach((company) => {
      const area = company.service_area || "local";
      if (groups[area]) {
        groups[area].push(company);
      }
    });

    return groups;
  }, [availableCompanies]);

  return (
    <div className="relative font-Poppins">
      <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
        Select Delivery Company
      </label>

      {/* Selected Company Display / Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-[var(--border-color)] hover:border-[var(--primary-400)] transition-colors bg-[var(--bg-primary)]"
      >
        {selectedCompany ? (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary-100)] rounded-lg">
              <Building2 size={20} className="text-[var(--primary-600)]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[var(--text-primary)]">
                  {selectedCompany.name}
                </p>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getServiceAreaBadgeStyle(
                    selectedCompany.service_area,
                  )}`}
                >
                  {getServiceAreaLabel(selectedCompany.service_area)}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {selectedCompany.branch}
                {selectedCompany.service_area === "worldwide" &&
                  " • Ships globally"}
                {selectedCompany.service_area === "nationwide" &&
                  " • Ships nationwide"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <Truck size={20} />
            <span>Choose a delivery company</span>
          </div>
        )}
        <ChevronDown
          size={20}
          className={`text-[var(--text-muted)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] shadow-lg overflow-hidden">
          {loadingCompanies && allCompanies.length === 0 ? (
            <div className="flex items-center justify-center gap-2 p-6">
              <Loader2
                size={20}
                className="animate-spin text-[var(--primary-600)]"
              />
              <span className="text-[var(--text-secondary)]">
                Loading companies...
              </span>
            </div>
          ) : availableCompanies.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle
                size={24}
                className="text-[var(--text-muted)] mx-auto mb-2"
              />
              <p className="text-[var(--text-secondary)]">
                No delivery companies available
                {deliveryState && ` for ${deliveryState}`}
              </p>
            </div>
          ) : (
            <div>
              {/* Info Banner */}
              <div className="p-3 bg-[var(--primary-100)] border-b border-[var(--border-color)]">
                <p className="text-xs text-[var(--primary-700)] flex items-center gap-1">
                  <Info size={12} />
                  {deliveryState
                    ? `Showing companies that deliver to ${deliveryState}`
                    : "Showing all available delivery companies"}
                </p>
              </div>

              {/* Scrollable List with Infinite Scroll */}
              <div ref={dropdownRef} className="max-h-72 overflow-y-auto">
                {/* Worldwide Companies */}
                {groupedCompanies.worldwide.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] sticky top-0 z-10 border-b border-[var(--border-light)]">
                      🌍 Worldwide Delivery
                    </div>
                    {groupedCompanies.worldwide.map((company, index) => (
                      <CompanyOption
                        key={company.id}
                        company={company}
                        isSelected={company.id === selectedCompanyId}
                        onSelect={handleSelect}
                        getServiceAreaLabel={getServiceAreaLabel}
                        getServiceAreaIcon={getServiceAreaIcon}
                        getServiceAreaBadgeStyle={getServiceAreaBadgeStyle}
                        ref={
                          index === groupedCompanies.worldwide.length - 1 &&
                          !groupedCompanies.nationwide.length &&
                          !groupedCompanies.regional.length &&
                          !groupedCompanies.local.length
                            ? lastCompanyRef
                            : null
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Nationwide Companies */}
                {groupedCompanies.nationwide.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] sticky top-0 z-10 border-b border-[var(--border-light)]">
                      🇳🇬 Nationwide Delivery
                    </div>
                    {groupedCompanies.nationwide.map((company, index) => (
                      <CompanyOption
                        key={company.id}
                        company={company}
                        isSelected={company.id === selectedCompanyId}
                        onSelect={handleSelect}
                        getServiceAreaLabel={getServiceAreaLabel}
                        getServiceAreaIcon={getServiceAreaIcon}
                        getServiceAreaBadgeStyle={getServiceAreaBadgeStyle}
                        ref={
                          index === groupedCompanies.nationwide.length - 1 &&
                          !groupedCompanies.regional.length &&
                          !groupedCompanies.local.length
                            ? lastCompanyRef
                            : null
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Regional Companies */}
                {groupedCompanies.regional.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] sticky top-0 z-10 border-b border-[var(--border-light)]">
                      📍 Regional Delivery
                    </div>
                    {groupedCompanies.regional.map((company, index) => (
                      <CompanyOption
                        key={company.id}
                        company={company}
                        isSelected={company.id === selectedCompanyId}
                        onSelect={handleSelect}
                        getServiceAreaLabel={getServiceAreaLabel}
                        getServiceAreaIcon={getServiceAreaIcon}
                        getServiceAreaBadgeStyle={getServiceAreaBadgeStyle}
                        ref={
                          index === groupedCompanies.regional.length - 1 &&
                          !groupedCompanies.local.length
                            ? lastCompanyRef
                            : null
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Local Companies */}
                {groupedCompanies.local.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] sticky top-0 z-10 border-b border-[var(--border-light)]">
                      🏠 Local Delivery
                    </div>
                    {groupedCompanies.local.map((company, index) => (
                      <CompanyOption
                        key={company.id}
                        company={company}
                        isSelected={company.id === selectedCompanyId}
                        onSelect={handleSelect}
                        getServiceAreaLabel={getServiceAreaLabel}
                        getServiceAreaIcon={getServiceAreaIcon}
                        getServiceAreaBadgeStyle={getServiceAreaBadgeStyle}
                        ref={
                          index === groupedCompanies.local.length - 1
                            ? lastCompanyRef
                            : null
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center gap-2 p-4 text-sm text-[var(--text-muted)]">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading more companies...</span>
                  </div>
                )}

                {/* End of List Message */}
                {!hasMore && availableCompanies.length > 0 && (
                  <div className="p-4 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-color)]">
                    All companies loaded ({availableCompanies.length} total)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Info */}
          {availableCompanies.length > 0 && (
            <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Info size={12} />
                Delivery time and cost may vary by company and service area
              </p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop for closing */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

// Company Option Sub-component with forwardRef for infinite scroll
const CompanyOption = React.forwardRef(
  (
    {
      company,
      isSelected,
      onSelect,
      getServiceAreaLabel,
      getServiceAreaIcon,
      getServiceAreaBadgeStyle,
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        onClick={() => onSelect(company.id)}
        className={`w-full flex items-start gap-3 p-4 hover:bg-[var(--bg-secondary)] transition-colors text-left border-b border-[var(--border-light)] last:border-0 ${
          isSelected ? "bg-[var(--primary-100)]" : ""
        }`}
      >
        <div
          className={`p-2 rounded-lg ${
            isSelected ? "bg-[var(--primary-200)]" : "bg-[var(--bg-tertiary)]"
          }`}
        >
          <Building2
            size={20}
            className={
              isSelected
                ? "text-[var(--primary-600)]"
                : "text-[var(--text-muted)]"
            }
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold truncate text-[var(--text-primary)]">
              {company.name}
            </p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getServiceAreaBadgeStyle(
                company.service_area,
              )}`}
            >
              {getServiceAreaIcon(company.service_area)}
              {getServiceAreaLabel(company.service_area)}
            </span>
            {isSelected && (
              <Check
                size={16}
                className="text-[var(--primary-600)] flex-shrink-0"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[var(--text-muted)]" />
              {company.branch}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-[var(--text-muted)]" />
              {company.contact_number}
            </span>
          </div>
          {company.service_area === "local" && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {company.state}
            </p>
          )}
          {company.service_area === "regional" && company.coverage_states && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Covers: {company.coverage_states.slice(0, 3).join(", ")}
              {company.coverage_states.length > 3 &&
                ` +${company.coverage_states.length - 3} more`}
            </p>
          )}
        </div>
      </button>
    );
  },
);

CompanyOption.displayName = "CompanyOption";

export default DeliveryCompanySelector;
