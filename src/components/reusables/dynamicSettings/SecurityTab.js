"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { Field, Input, SaveButton, SavedBadge } from "./shared";

export default function SecurityTab() {
  const { changePassword, loadingAuth } = useAuthStore();
  const [form, setForm] = useState({ old: "", newPwd: "", confirm: "" });
  const [show, setShow] = useState({
    old: false,
    newPwd: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const change = (id) => (e) =>
    setForm((p) => ({ ...p, [id]: e.target.value }));
  const toggle = (id) => () => setShow((p) => ({ ...p, [id]: !p[id] }));

  const strengthScore = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strengthMeta = [
    null,
    { label: "Weak", segColor: "bg-red-500", textColor: "text-red-500" },
    { label: "Fair", segColor: "bg-orange-500", textColor: "text-orange-500" },
    { label: "Good", segColor: "bg-yellow-500", textColor: "text-yellow-500" },
    { label: "Strong", segColor: "bg-green-500", textColor: "text-green-500" },
    {
      label: "Very Strong",
      segColor: "bg-green-600",
      textColor: "text-green-600",
    },
  ];

  const s = strengthScore(form.newPwd);
  const meta = strengthMeta[s];

  const validate = () => {
    const e = {};
    if (!form.old) {
      e.old = "Required";
    }
    if (!form.newPwd) e.newPwd = "Required";
    else if (form.newPwd.length < 8) e.newPwd = "Minimum 8 characters";
    else if (!/[A-Z]/.test(form.newPwd)) e.newPwd = "Needs an uppercase letter";
    else if (!/[a-z]/.test(form.newPwd)) e.newPwd = "Needs a lowercase letter";
    else if (!/[0-9]/.test(form.newPwd)) e.newPwd = "Needs a number";
    if (form.newPwd !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await changePassword(form.old, form.newPwd, form.confirm);
    if (ok) {
      setSaved(true);
      setForm({ old: "", newPwd: "", confirm: "" });
      setTimeout(() => setSaved(false), 4000);
    }
  };

  const eyeSuffix = (id) => (
    <span
      onClick={toggle(id)}
      className="flex text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
    >
      {show[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </span>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border-light)] px-4 py-3 rounded-lg">
        <Lock className="w-3.5 h-3.5" />
        Changing your password will log you out of all other devices.
      </div>

      <Field label="Current Password" error={errors.old}>
        <Input
          id="old"
          type={show.old ? "text" : "password"}
          value={form.old}
          onChange={change("old")}
          placeholder="Enter current password"
          error={errors.old}
          suffix={eyeSuffix("old")}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <Field label="New Password" error={errors.newPwd}>
          <Input
            id="newPwd"
            type={show.newPwd ? "text" : "password"}
            value={form.newPwd}
            onChange={change("newPwd")}
            placeholder="Min 8 chars, uppercase, number…"
            error={errors.newPwd}
            suffix={eyeSuffix("newPwd")}
          />
        </Field>
        {form.newPwd && (
          <div className="flex items-center gap-3 px-0.5">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s && meta ? meta.segColor : "bg-[var(--border-color)]"}`}
                />
              ))}
            </div>
            {meta && (
              <span className={`text-xs font-semibold ${meta.textColor}`}>
                {meta.label}
              </span>
            )}
          </div>
        )}
      </div>

      <Field label="Confirm New Password" error={errors.confirm}>
        <Input
          id="confirm"
          type={show.confirm ? "text" : "password"}
          value={form.confirm}
          onChange={change("confirm")}
          placeholder="Re-enter new password"
          error={errors.confirm}
          suffix={eyeSuffix("confirm")}
        />
      </Field>

      <div className="flex items-center justify-end gap-3 pt-1">
        {saved && <SavedBadge label="Password updated" />}
        <SaveButton
          loading={loadingAuth}
          label="Update Password"
          icon={<Check className="w-3 h-3" />}
        />
      </div>
    </form>
  );
}
