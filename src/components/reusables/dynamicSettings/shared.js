import React from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
  );
}

export function Input({
  id,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  error,
  suffix,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          "w-full rounded-lg text-sm font-Poppins transition-all duration-150 outline-none",
          "px-3.5 py-2.5 border",
          "bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
          "focus:border-[var(--border-hover)] focus:ring-2 focus:ring-[var(--bg-hover)]",
          error ? "border-red-500" : "border-[var(--border-color)]",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          suffix ? "pr-10" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function SelectInput({ id, value, onChange, options }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3.5 py-2.5 rounded-lg text-sm font-Poppins border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] appearance-none outline-none cursor-pointer focus:border-[var(--border-hover)] focus:ring-2 focus:ring-[var(--bg-hover)] transition-all duration-150"
    >
      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          className="bg-[var(--bg-secondary)]"
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function SaveButton({
  loading,
  label = "Save Changes",
  disabled = false,
  icon = <Check className="w-3 h-3" />,
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={[
        "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold font-Poppins",
        "border transition-all duration-150",
        loading || disabled
          ? "bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-color)] cursor-not-allowed"
          : "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] hover:opacity-80 cursor-pointer",
      ].join(" ")}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
        </>
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </button>
  );
}

export function SavedBadge({ label = "Saved" }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full">
      <Check className="w-3 h-3" /> {label}
    </span>
  );
}
