// components/LoadingScreen.jsx
import React from "react";
import { Loader2, BarChart3 } from "lucide-react";

const LoadingScreen = ({ message = "Loading statistics...", submessage }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-[var(--border-light)] border-t-[var(--primary-500)] animate-spin" />

        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BarChart3 size={28} className="text-[var(--primary-600)]" />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-[var(--text-primary)] font-Montserrat">
          {message}
        </p>
        {submessage && (
          <p className="text-sm text-[var(--text-muted)] mt-1">{submessage}</p>
        )}
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5 mt-4">
        <div
          className="w-2 h-2 rounded-full bg-[var(--primary-400)] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-[var(--primary-400)] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-[var(--primary-400)] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
