import React from "react";
import {
  Hash,
  MapPin,
  Building2,
  Phone,
  Package,
  ExternalLink,
  CreditCard,
  Info,
} from "lucide-react";

const OrderInformation = ({
  orderId,
  shippingAddress,
  deliveryCompany,
  trackingNumber,
  paymentStatus,
  paymentMethod,
  transactionId,
}) => {
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          bg: "bg-[var(--success-50)] dark:bg-[var(--success-900)]",
          text: "text-[var(--success-700)] dark:text-[var(--success-300)]",
          border:
            "border-[var(--success-200)] dark:border-[var(--success-800)]",
        };
      case "pending":
        return {
          bg: "bg-[var(--warning-50)] dark:bg-[var(--warning-900)]",
          text: "text-[var(--warning-700)] dark:text-[var(--warning-300)]",
          border:
            "border-[var(--warning-200)] dark:border-[var(--warning-800)]",
        };
      case "failed":
        return {
          bg: "bg-[var(--error-50)] dark:bg-[var(--error-900)]",
          text: "text-[var(--error-700)] dark:text-[var(--error-300)]",
          border: "border-[var(--error-200)] dark:border-[var(--error-800)]",
        };
      default:
        return {
          bg: "bg-[var(--bg-secondary)]",
          text: "text-[var(--text-secondary)]",
          border: "border-[var(--border-color)]",
        };
    }
  };

  const paymentBadge = getPaymentStatusColor(paymentStatus);

  const InfoCard = ({ icon, label, value, accent = "default", action }) => {
    const accents = {
      default: {
        wrapperBg: "bg-[var(--bg-secondary)]",
        iconColor: "text-[var(--text-muted)]",
        labelColor: "text-[var(--text-muted)]",
        valueColor: "text-[var(--text-primary)]",
      },
      primary: {
        wrapperBg: "bg-[var(--primary-50)] dark:bg-[var(--primary-900)]",
        iconColor: "text-[var(--primary-600)] dark:text-[var(--primary-400)]",
        labelColor: "text-[var(--primary-700)] dark:text-[var(--primary-300)]",
        valueColor: "text-[var(--primary-700)] dark:text-[var(--primary-300)]",
      },
      success: {
        wrapperBg: "bg-[var(--success-50)] dark:bg-[var(--success-900)]",
        iconColor: "text-[var(--success-600)] dark:text-[var(--success-400)]",
        labelColor: "text-[var(--success-700)] dark:text-[var(--success-300)]",
        valueColor: "text-[var(--success-700)] dark:text-[var(--success-300)]",
      },
      info: {
        wrapperBg: "bg-[var(--info-50)] dark:bg-[var(--info-900)]",
        iconColor: "text-[var(--info-600)] dark:text-[var(--info-400)]",
        labelColor: "text-[var(--info-700)] dark:text-[var(--info-300)]",
        valueColor: "text-[var(--info-700)] dark:text-[var(--info-300)]",
      },
      warning: {
        wrapperBg: "bg-[var(--warning-50)] dark:bg-[var(--warning-900)]",
        iconColor: "text-[var(--warning-600)] dark:text-[var(--warning-400)]",
        labelColor: "text-[var(--warning-700)] dark:text-[var(--warning-300)]",
        valueColor: "text-[var(--warning-700)] dark:text-[var(--warning-300)]",
      },
    };

    const style = accents[accent];
    const Icon = icon;

    return (
      <div
        className={`flex gap-3 p-4 rounded-xl ${style.wrapperBg} transition-colors duration-200`}
      >
        <Icon size={18} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`font-Poppins text-xs mb-1 ${style.labelColor}`}>
            {label}
          </p>
          <div
            className={`font-Poppins font-medium text-sm ${style.valueColor}`}
          >
            {value}
          </div>
          {action && <div className="mt-1.5">{action}</div>}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--info-100)] dark:bg-[var(--info-900)] flex items-center justify-center">
          <Info
            size={20}
            className="text-[var(--info-600)] dark:text-[var(--info-400)]"
          />
        </div>
        <div>
          <h3 className="font-Montserrat font-semibold text-lg text-[var(--text-primary)]">
            Order Information
          </h3>
          <p className="font-Poppins text-xs text-[var(--text-muted)]">
            Details and delivery information
          </p>
        </div>
      </div>

      {/* Information Cards */}
      <div className="space-y-3">
        {/* Order ID */}
        <InfoCard
          icon={Hash}
          label="Order ID"
          value={<code className="font-mono">{orderId}</code>}
          accent="default"
        />

        {/* Shipping Address */}
        <InfoCard
          icon={MapPin}
          label="Shipping Address"
          value={shippingAddress || "No address provided"}
          accent="primary"
        />

        {/* Delivery Company */}
        {deliveryCompany && (
          <InfoCard
            icon={Building2}
            label="Delivery Partner"
            value={
              <div>
                <p className="font-semibold">{deliveryCompany.name}</p>
                {deliveryCompany.contact_number && (
                  <p className="text-sm mt-1 flex items-center gap-1.5">
                    <Phone size={12} />
                    {deliveryCompany.contact_number}
                  </p>
                )}
              </div>
            }
            accent="primary"
          />
        )}

        {/* Tracking Number */}
        {trackingNumber && (
          <InfoCard
            icon={Package}
            label="Tracking Number"
            value={<code className="font-mono">{trackingNumber}</code>}
            accent="info"
            action={
              <button className="inline-flex items-center gap-1 text-[var(--info-600)] dark:text-[var(--info-400)] hover:text-[var(--info-700)] text-sm font-medium transition-colors">
                Track Package
                <ExternalLink size={12} />
              </button>
            }
          />
        )}

        {/* Payment Status */}
        <InfoCard
          icon={CreditCard}
          label="Payment Status"
          value={
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-Poppins font-semibold border ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}
              >
                {paymentStatus?.charAt(0).toUpperCase() +
                  paymentStatus?.slice(1) || "N/A"}
              </span>
              {paymentMethod && (
                <span className="text-sm">via {paymentMethod}</span>
              )}
            </div>
          }
          accent={
            paymentStatus?.toLowerCase() === "paid" ? "success" : "warning"
          }
        />

        {/* Transaction Reference */}
        {transactionId && (
          <InfoCard
            icon={Hash}
            label="Transaction Reference"
            value={
              <code className="font-mono text-xs break-all">
                {transactionId}
              </code>
            }
            accent="default"
          />
        )}
      </div>
    </div>
  );
};

export default OrderInformation;
