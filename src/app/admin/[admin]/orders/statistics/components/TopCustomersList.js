// components/TopCustomersList.jsx
import React from "react";
import { User, ArrowUpRight, Mail, Phone, Calendar } from "lucide-react";

const TopCustomersList = ({ customers }) => {
  if (!Array.isArray(customers) || customers.length === 0) {
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
        <User size={32} className="mx-auto text-[var(--border-color)] mb-3" />
        <p className="text-sm text-[var(--text-muted)]">
          No customer data available
        </p>
      </div>
    );
  }

  const getFullName = (customer) => {
    const user = customer.user;
    if (!user) return "Unknown Customer";
    const firstName = user.firstname || "";
    const lastName = user.lastname || "";
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return user.email || `Customer ${customer.user_id?.slice(0, 8)}`;
  };

  const getInitials = (customer) => {
    const user = customer.user;
    if (!user) return "?";
    const first = (user.firstname || "").charAt(0).toUpperCase();
    const last = (user.lastname || "").charAt(0).toUpperCase();
    if (first || last) return `${first}${last}`;
    return (user.email || "?").charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-3">
      {customers.slice(0, 10).map((customer, index) => (
        <div
          key={customer.user_id || index}
          className="flex flex-col gap-2 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-colors group"
        >
          {/* Main Row */}
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            <div className="w-8 h-8 rounded-full bg-[var(--primary-100)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[var(--primary-700)]">
                {index + 1}
              </span>
            </div>

            {/* Customer Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[var(--primary-600)]">
                    {getInitials(customer)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {getFullName(customer)}
                  </p>
                  {customer.user?.email && (
                    <p className="text-xs text-[var(--text-muted)] truncate flex items-center gap-1">
                      <Mail size={10} />
                      {customer.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Info */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-[var(--primary-600)]">
                ₦{(customer.total_spent || 0).toLocaleString()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {customer.order_count} orders
              </p>
            </div>
          </div>

          {/* Details Row */}
          <div className="flex items-center gap-4 ml-11 text-xs text-[var(--text-muted)]">
            {customer.user?.phone_number && (
              <span className="flex items-center gap-1">
                <Phone size={10} />
                {customer.user.phone_number}
              </span>
            )}
            <span className="flex items-center gap-1">
              <ArrowUpRight size={10} />
              Avg ₦{(customer.average_order_value || 0).toLocaleString()}
            </span>
            {customer.last_order_date && (
              <span className="flex items-center gap-1 ml-auto">
                <Calendar size={10} />
                Last: {customer.last_order_date.slice(0, 10)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCustomersList;
