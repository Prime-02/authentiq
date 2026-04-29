// pages/admin/reviews/components/LoadingSpinner.js
import { Loader, Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="text-center">
        <Loader
          className=" animate-spin mb-4"
          size={100}
        />
        <p
          className="text-lg font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Loading reviews...
        </p>
      </div>
    </div>
  );
}
