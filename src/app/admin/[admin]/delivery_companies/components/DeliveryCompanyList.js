// components/DeliveryCompanyList.jsx
import React from "react";
import {
  Truck,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  Trash2,
  MapPin,
  Phone,
  Building2,
  Package,
  ArrowUpDown,
} from "lucide-react";

const DeliveryCompanyList = ({
  companies,
  onEdit,
  onViewOrders,
  onReassign,
  onDelete,
  onToggleActive,
}) => {
  if (companies.length === 0) {
    return (
      <div className="card rounded-2xl p-12 text-center">
        <Truck size={48} className="text-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
        <p className="text-secondary">
          {companies.length === 0 &&
            "No delivery companies match your search criteria."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div
          key={company.id}
          className={`card rounded-2xl overflow-hidden border-2 transition-all ${
            company.is_active
              ? "border-border hover:border-primary-200"
              : "border-gray-200 opacity-75"
          }`}
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      company.is_active ? "bg-primary-50" : "bg-gray-100"
                    }`}
                  >
                    <Building2
                      size={24}
                      className={
                        company.is_active ? "text-primary-600" : "text-muted"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          company.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {company.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {company.branch}, {company.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {company.contact_number}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package size={14} />
                        {company.orders_count ?? 0} orders
                      </span>
                    </div>
                    {company.address && (
                      <p className="text-sm text-muted mt-1">
                        {company.address}
                      </p>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
                      >
                        {company.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onViewOrders(company.id)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-secondary rounded-lg hover:bg-tertiary transition-colors font-medium"
                  title="View Orders"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">Orders</span>
                </button>

                <button
                  onClick={() => onEdit(company)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-secondary rounded-lg hover:bg-tertiary transition-colors font-medium"
                  title="Edit Company"
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => onToggleActive(company.id, !company.is_active)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                    company.is_active
                      ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                  title={company.is_active ? "Deactivate" : "Activate"}
                >
                  {company.is_active ? (
                    <ToggleLeft size={16} />
                  ) : (
                    <ToggleRight size={16} />
                  )}
                  <span className="hidden sm:inline">
                    {company.is_active ? "Deactivate" : "Activate"}
                  </span>
                </button>

                <button
                  onClick={() => onReassign(company)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  title="Reassign Orders"
                >
                  <ArrowUpDown size={16} />
                  <span className="hidden sm:inline">Reassign</span>
                </button>

                <button
                  onClick={() => onDelete(company)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  title="Delete Company"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryCompanyList;
