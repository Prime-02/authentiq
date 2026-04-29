// components/NotificationIcon.jsx
import React from "react";
import {
  Bell,
  ShoppingBag,
  Truck,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const iconMap = {
  order: ShoppingBag,
  shipping: Truck,
  payment: CreditCard,
  alert: AlertTriangle,
  info: Info,
  success: CheckCircle2,
  message: MessageSquare,
};

const colorMap = {
  order:
    "bg-[var(--primary-100)] text-[var(--primary-600)] border-[var(--primary-200)]",
  shipping:
    "bg-[var(--info-100)] text-[var(--info-600)] border-[var(--info-200)]",
  payment:
    "bg-[var(--success-100)] text-[var(--success-600)] border-[var(--success-200)]",
  alert:
    "bg-[var(--error-100)] text-[var(--error-600)] border-[var(--error-200)]",
  info: "bg-[var(--warning-100)] text-[var(--warning-600)] border-[var(--warning-200)]",
  success:
    "bg-[var(--success-100)] text-[var(--success-600)] border-[var(--success-200)]",
  message:
    "bg-[var(--primary-100)] text-[var(--primary-600)] border-[var(--primary-200)]",
};

const NotificationIcon = ({ type, size = 18 }) => {
  const Icon = iconMap[type?.toLowerCase()] || Bell;
  const colors = colorMap[type?.toLowerCase()] || colorMap.info;

  return (
    <div
      className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors}`}
    >
      <Icon size={size} />
    </div>
  );
};

export default NotificationIcon;
