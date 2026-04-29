// components/UserDetailDrawer.jsx
import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: "0 0 10px",
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 13, color: "var(--text-muted)", flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          color: "var(--text-primary)",
          textAlign: "right",
          fontFamily: mono ? "monospace" : undefined,
          wordBreak: "break-all",
          maxWidth: "60%",
        }}
      >
        {String(value)}
      </span>
    </div>
  );
}

function EditField({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid var(--border-color)",
            borderRadius: 6,
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: 14,
          }}
        >
          <option value="">Select {label}</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid var(--border-color)",
            borderRadius: 6,
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

export function UserDetailDrawer({
  user,
  open,
  onClose,
  onToggleStatus,
  onToggleAdmin,
  onResetPassword,
  onRevokeSessions,
  onUpdateUser,
  isUpdating,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordModal, setPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!open || !user) return null;

  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(" ") || "—";
  const address =
    [user.street_address, user.city, user.state, user.zip_code, user.country]
      .filter(Boolean)
      .join(", ") || "—";

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditData({});
    } else {
      setEditData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        gender: user.gender || "",
        location: user.location || "",
        country: user.country || "",
        street_address: user.street_address || "",
        city: user.city || "",
        state: user.state || "",
        zip_code: user.zip_code || "",
        shipping_address: user.shipping_address || "",
      });
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onUpdateUser(user.id, editData);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onResetPassword(user.id, newPassword);
    setPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 900,
        }}
        onClick={onClose}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(440px, 100vw)",
          background: "var(--bg-primary)",
          borderLeft: "1px solid var(--border-color)",
          zIndex: 901,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
          >
            <UserAvatar
              firstname={user.firstname}
              lastname={user.lastname}
              size={44}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{fullName}</h3>
              <p
                style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}
              >
                {user.email}
              </p>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ fontWeight: 600, fontSize: 18, padding: "4px 10px" }}
          >
            ✕
          </button>
        </div>

        {/* Badges */}
        <div
          style={{
            padding: "1rem 1.5rem",
            display: "flex",
            gap: 8,
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <StatusBadge active={user.is_active} />
          <RoleBadge isAdmin={user.is_admin} />
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem 1.5rem", flex: 1 }}>
          {isEditing ? (
            <>
              <Section title="Personal Information">
                <EditField
                  label="First Name"
                  name="firstname"
                  value={editData.firstname}
                  onChange={handleChange}
                />
                <EditField
                  label="Last Name"
                  name="lastname"
                  value={editData.lastname}
                  onChange={handleChange}
                />
                <EditField
                  label="Email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  type="email"
                />
                <EditField
                  label="Gender"
                  name="gender"
                  value={editData.gender}
                  onChange={handleChange}
                  type="select"
                />
                <EditField
                  label="Phone"
                  name="phone_number"
                  value={editData.phone_number}
                  onChange={handleChange}
                  type="tel"
                />
              </Section>

              <Section title="Address">
                <EditField
                  label="Location"
                  name="location"
                  value={editData.location}
                  onChange={handleChange}
                />
                <EditField
                  label="Country"
                  name="country"
                  value={editData.country}
                  onChange={handleChange}
                />
                <EditField
                  label="Street Address"
                  name="street_address"
                  value={editData.street_address}
                  onChange={handleChange}
                />
                <EditField
                  label="City"
                  name="city"
                  value={editData.city}
                  onChange={handleChange}
                />
                <EditField
                  label="State"
                  name="state"
                  value={editData.state}
                  onChange={handleChange}
                />
                <EditField
                  label="ZIP Code"
                  name="zip_code"
                  value={editData.zip_code}
                  onChange={handleChange}
                />
                <EditField
                  label="Shipping Address"
                  name="shipping_address"
                  value={editData.shipping_address}
                  onChange={handleChange}
                />
              </Section>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={isUpdating}
                  style={{ flex: 1 }}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleEditToggle}
                  disabled={isUpdating}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <Section title="Account">
                <Field label="User ID" value={user.id} mono />
                <Field
                  label="Date Joined"
                  value={
                    user.date_joined
                      ? new Date(user.date_joined).toLocaleDateString()
                      : "—"
                  }
                />
                <Field
                  label="Last Login"
                  value={
                    user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "Never"
                  }
                />
                <Field
                  label="Updated At"
                  value={
                    user.updated_at
                      ? new Date(user.updated_at).toLocaleString()
                      : "—"
                  }
                />
              </Section>

              <Section title="Personal Info">
                <Field label="Gender" value={user.gender || "—"} />
                <Field label="Phone" value={user.phone_number || "—"} />
              </Section>

              <Section title="Address">
                <Field label="Full Address" value={address} />
                <Field label="Location" value={user.location || "—"} />
                <Field
                  label="Shipping Address"
                  value={user.shipping_address || "—"}
                />
              </Section>
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              className="btn btn-sm btn-full btn-primary"
              onClick={handleEditToggle}
            >
              Edit User Details
            </button>

            <button
              className={`btn btn-sm btn-full ${user.is_active ? "btn-warning" : "btn-success"}`}
              onClick={() => onToggleStatus(user)}
            >
              {user.is_active ? "Deactivate Account" : "Activate Account"}
            </button>

            <button
              className={`btn btn-sm btn-full ${user.is_admin ? "btn-secondary" : "btn-info"}`}
              onClick={() => onToggleAdmin(user)}
            >
              {user.is_admin ? "Remove Admin Role" : "Grant Admin Role"}
            </button>

            <button
              className="btn btn-sm btn-full btn-secondary"
              onClick={() => setPasswordModal(true)}
            >
              Reset Password
            </button>

            <button
              className="btn btn-sm btn-full btn-danger"
              onClick={() => onRevokeSessions(user)}
            >
              Revoke All Sessions
            </button>
          </div>
        )}
      </aside>

      {/* Password Reset Modal */}
      {passwordModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setPasswordModal(false)}
        >
          <div
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              padding: "2rem",
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 1rem", fontSize: 18 }}>
              Reset Password for {fullName}
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: 6,
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: 6,
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={handleResetPassword}
                disabled={!newPassword || !confirmPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
