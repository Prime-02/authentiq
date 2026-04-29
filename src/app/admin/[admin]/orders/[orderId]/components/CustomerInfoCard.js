// components/CustomerInfoCard.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Copy,
  Check,
  ImageOff,
} from "lucide-react";

const CustomerInfoCard = ({ user, shippingAddress }) => {
  const [copiedField, setCopiedField] = useState(null);

  const fullName =
    user?.firstname || user?.lastname
      ? `${user?.firstname || ""} ${user?.lastname || ""}`.trim()
      : "N/A";

  const handleCopy = async (text, field) => {
    if (!text || text === "N/A") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const customerData = [
    {
      id: "name",
      icon: User,
      label: "Full Name",
      value: fullName,
      copyable: true,
    },
    {
      id: "email",
      icon: Mail,
      label: "Email Address",
      value: user?.email || "N/A",
      copyable: true,
    },
    {
      id: "phone",
      icon: Phone,
      label: "Phone Number",
      value: user?.phone_number || "N/A",
      copyable: true,
    },
    {
      id: "address",
      icon: MapPin,
      label: "Shipping Address",
      value: shippingAddress || "No address provided",
      isAddress: true,
      copyable: !!shippingAddress,
    },
  ];

  if (!user) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <User size={20} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
            Customer Information
          </h3>
        </div>
        <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
          <ImageOff
            size={32}
            className="mx-auto text-[var(--border-color)] mb-3"
          />
          <p className="text-sm text-[var(--text-muted)]">
            Customer information not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[var(--info-600)] flex items-center justify-center text-[var(--text-inverse)] font-semibold text-lg font-Montserrat">
                {fullName !== "N/A" ? fullName.charAt(0).toUpperCase() : "?"}
              </div>
              {user?.is_admin && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--warning-500)] rounded-full flex items-center justify-center border-2 border-[var(--bg-secondary)]">
                  <ShieldCheck
                    size={10}
                    className="text-[var(--text-inverse)]"
                  />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)] truncate">
                {fullName}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {user?.email || "No email"}
              </p>
            </div>
          </div>
          {user?.is_admin && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--warning-700)] bg-[var(--warning-50)] px-3 py-1.5 rounded-full border border-[var(--warning-200)] flex-shrink-0">
              <ShieldCheck size={12} />
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--border-light)] mx-6" />

      {/* Info Rows */}
      <div className="p-6 pt-4">
        <div className="grid gap-3">
          {customerData.map((item) => {
            const isCopied = copiedField === item.id;

            return (
              <div
                key={item.id}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p
                    className={`text-sm font-medium text-[var(--text-primary)] break-words ${
                      item.isAddress ? "leading-relaxed" : ""
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
                {item.copyable && (
                  <button
                    onClick={() => handleCopy(item.value, item.id)}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                      isCopied
                        ? "bg-[var(--success-100)] text-[var(--success-600)]"
                        : "hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    }`}
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoCard;
