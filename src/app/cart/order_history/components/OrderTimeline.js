// components/OrderTimeline.jsx
import React from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShoppingBag,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const CIRCLE_SIZE = 48;

const steps = [
  {
    key: "pending",
    label: "Order placed",
    desc: "Received",
    icon: ShoppingBag,
    color: {
      bg: "bg-[var(--info-50)]",
      border: "border-[var(--info-600)]",
      circle: "bg-[var(--info-600)]",
      ring: "ring-[var(--info-100)]",
      text: "text-[var(--info-700)]",
      badge: "bg-[var(--info-100)] text-[var(--info-700)]",
      check: "text-[var(--info-600)]",
      progress: "var(--info-600)",
    },
  },
  {
    key: "processing",
    label: "Processing",
    desc: "Preparing",
    icon: Package,
    color: {
      bg: "bg-[var(--warning-50)]",
      border: "border-[var(--warning-600)]",
      circle: "bg-[var(--warning-600)]",
      ring: "ring-[var(--warning-100)]",
      text: "text-[var(--warning-700)]",
      badge: "bg-[var(--warning-100)] text-[var(--warning-700)]",
      check: "text-[var(--warning-600)]",
      progress: "var(--warning-600)",
    },
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "On the way",
    icon: Truck,
    color: {
      bg: "bg-purple-50",
      border: "border-purple-600",
      circle: "bg-purple-600",
      ring: "ring-purple-100",
      text: "text-purple-700",
      badge: "bg-purple-100 text-purple-700",
      check: "text-purple-600",
      progress: "#9333ea",
    },
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Completed",
    icon: CheckCircle2,
    color: {
      bg: "bg-[var(--success-50)]",
      border: "border-[var(--success-600)]",
      circle: "bg-[var(--success-600)]",
      ring: "ring-[var(--success-100)]",
      text: "text-[var(--success-700)]",
      badge: "bg-[var(--success-100)] text-[var(--success-700)]",
      check: "text-[var(--success-600)]",
      progress: "var(--success-600)",
    },
  },
];

const specialStatus = {
  cancelled: {
    icon: XCircle,
    title: "Order cancelled",
    desc: "This order has been cancelled",
    wrap: "bg-[var(--error-50)] border-[var(--error-600)]",
    iconBg: "bg-[var(--error-600)]",
    text: "text-[var(--error-700)]",
  },
  returned: {
    icon: RefreshCw,
    title: "Order returned",
    desc: "Return has been initiated",
    wrap: "bg-[var(--warning-50)] border-[var(--warning-600)]",
    iconBg: "bg-[var(--warning-600)]",
    text: "text-[var(--warning-700)]",
  },
  failed: {
    icon: AlertCircle,
    title: "Payment failed",
    desc: "Please update your payment method",
    wrap: "bg-[var(--error-50)] border-[var(--error-600)]",
    iconBg: "bg-[var(--error-600)]",
    text: "text-[var(--error-700)]",
  },
};

const OrderTimeline = ({ status }) => {
  const key = status?.toLowerCase();
  const sp = specialStatus[key];
  const idx = steps.findIndex((s) => s.key === key);
  const isDelivered = key === "delivered";

  if (sp) {
    const Icon = sp.icon;
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div
          className={`flex items-center gap-4 p-5 rounded-xl border-2 ${sp.wrap} ${sp.text}`}
        >
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full ${sp.iconBg} flex items-center justify-center`}
          >
            <Icon size={22} color="white" />
          </div>
          <div>
            <p className="font-Montserrat font-semibold text-base">
              {sp.title}
            </p>
            <p className="font-Poppins text-sm opacity-80 mt-0.5">{sp.desc}</p>
          </div>
        </div>
      </div>
    );
  }

  if (idx < 0) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 rounded-xl border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)]">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Clock size={22} />
          </div>
          <div>
            <p className="font-Montserrat font-semibold text-base text-[var(--text-primary)]">
              Status unknown
            </p>
            <p className="font-Poppins text-sm mt-0.5">
              Unable to determine order status
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pct = (idx / (steps.length - 1)) * 100;
  const activeColor = steps[idx].color;

  return (
    <div className="w-full">
      {isDelivered && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--success-50)] border border-[var(--success-200)] flex items-center gap-3">
          <CheckCircle2
            size={16}
            className="text-[var(--success-600)] flex-shrink-0"
          />
          <p className="font-Poppins text-sm font-medium text-[var(--success-700)]">
            Your order has been successfully delivered!
          </p>
        </div>
      )}

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] px-5 py-7">
        {/* Track + circles container */}
        <div className="relative">
          {/* Track line — centered to circle midpoint */}
          <div
            className="absolute bg-[var(--border-light)] rounded-full"
            style={{
              top: `${CIRCLE_SIZE / 2}px`,
              left: `${100 / steps.length / 2}%`,
              right: `${100 / steps.length / 2}%`,
              height: "2px",
              transform: "translateY(-50%)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${pct}%`, background: activeColor.progress }}
            />
          </div>

          {/* Steps */}
          <div className="relative z-10 flex">
            {steps.map((step, i) => {
              const done = i <= idx;
              const isCurr = i === idx;
              const Icon = step.icon;
              const c = step.color;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  {/* Circle */}
                  <div className="relative">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-400
                        ${done ? `${c.circle} border-transparent` : "bg-[var(--bg-secondary)] border-[var(--border-color)]"}
                        ${isCurr ? `ring-4 ${c.ring} scale-110` : ""}
                      `}
                    >
                      <Icon
                        size={19}
                        color={done ? "#fff" : "var(--text-muted)"}
                      />
                    </div>
                    {isCurr && !isDelivered && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--warning-400)] animate-pulse border-2 border-white" />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-2.5 text-[11.5px] font-semibold font-Montserrat text-center ${done ? c.text : "text-[var(--text-muted)]"}`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] text-center">
                    {step.desc}
                  </p>

                  {/* Badge */}
                  {isCurr && (
                    <span
                      className={`mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${c.badge}`}
                    >
                      Current
                    </span>
                  )}
                  {done && !isCurr && (
                    <CheckCircle2 size={13} className={`mt-1 ${c.check}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
