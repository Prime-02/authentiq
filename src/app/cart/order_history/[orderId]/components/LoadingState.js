import { Loader } from "lucide-react";
import React from "react";

const LoadingState = () => {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Loader
              size={100}
              className="animate-spin text-[var(--primary-600)]"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--primary-600)] rounded-full animate-ping" />
        </div>
        <h2 className="font-Montserrat font-semibold text-lg text-[var(--text-primary)] mb-2">
          Loading Order
        </h2>
        <p className="font-Poppins text-sm text-[var(--text-muted)]">
          Please wait while we fetch your order details...
        </p>
      </div>
    </main>
  );
};

export default LoadingState;
