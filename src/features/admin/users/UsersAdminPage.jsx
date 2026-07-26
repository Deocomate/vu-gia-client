"use client";

import { useState } from "react";
import AdminResourceManager from "@/features/admin/AdminResourceManager";
import { resources } from "@/features/admin/adminResources";
import Modal from "@/shared/components/admin/modal";
import { adminApi } from "@/shared/api/admin-api";
import { ROLE, ROLE_LABEL } from "@/shared/api/api-enums";
import { toast } from "@/shared/utils/feedback";

// Users has no generic PUT/POST/DELETE contract (see `adminResources.js`'s `users` entry) —
// role change, password reset, and account creation are separate endpoints with their own
// shapes, so they stay as bespoke modals wired in as custom row actions / a custom create
// override on the generic engine, instead of the field-driven editor every other resource uses.

function RoleModal({ user, onClose, onSaved }) {
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.patchBody(`/users/${user.id}/role`, { role });
      toast.success("Đã cập nhật vai trò.");
      onSaved();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật vai trò.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Đổi vai trò — ${user.username}`} size="sm" preventClose={saving}>
      <form onSubmit={submit} className="p-5">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        >
          {Object.values(ROLE).map((value) => (
            <option key={value} value={value}>
              {ROLE_LABEL[value]}
            </option>
          ))}
        </select>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PasswordModal({ user, onClose, onSaved }) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.patchBody(`/users/${user.id}/password`, { newPassword: password });
      toast.success("Đã đặt lại mật khẩu.");
      onSaved();
    } catch (error) {
      toast.error(error.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Đặt lại mật khẩu — ${user.username}`} size="sm" preventClose={saving}>
      <form onSubmit={submit} className="p-5">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
          placeholder="Mật khẩu mới"
          className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CreateUserModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "", role: ROLE.ADMIN });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApi.post("/users", form);
      toast.success("Đã tạo tài khoản.");
      onSaved();
    } catch (requestError) {
      setError(requestError.message || "Không thể tạo tài khoản.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Tạo tài khoản quản trị" size="md" preventClose={saving}>
      <form onSubmit={submit} className="p-5">
        {error && <p className="mb-3 text-sm font-semibold text-rose-600">{error}</p>}
        <div className="grid gap-3">
          <input required placeholder="Tên đăng nhập" value={form.username} onChange={(e) => setForm((c) => ({ ...c, username: e.target.value }))} className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950" />
          <input required type="password" minLength={6} placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))} className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950" />
          <input placeholder="Họ tên" value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950" />
          <select value={form.role} onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))} className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950">
            {Object.values(ROLE).map((value) => (
              <option key={value} value={value}>{ROLE_LABEL[value]}</option>
            ))}
          </select>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Mirrors the original page's `canResetPassword`: superadmins can reset anyone's password,
// everyone else (i.e. other admins) can only reset CUSTOMER accounts. The button itself stays
// visible either way (matching prior behavior) — the click is a no-op when not permitted.
const canResetPassword = (user, currentUser) =>
  currentUser?.role === ROLE.SUPERADMIN || user.role === ROLE.CUSTOMER;

const usersResource = {
  ...resources.users,
  rowActions: (row, { reload, currentUser, openModal, closeModal }) => {
    const actions = [];

    if (currentUser?.role === ROLE.SUPERADMIN) {
      actions.push({
        label: "Đổi vai trò",
        onClick: () =>
          openModal(
            <RoleModal
              user={row}
              onClose={closeModal}
              onSaved={() => {
                closeModal();
                reload();
              }}
            />,
          ),
      });
    }

    actions.push({
      label: "Reset mật khẩu",
      onClick: () => {
        if (!canResetPassword(row, currentUser)) return;
        openModal(
          <PasswordModal user={row} onClose={closeModal} onSaved={closeModal} />,
        );
      },
    });

    return actions;
  },
  onCreate: ({ reload, openModal, closeModal }) =>
    openModal(
      <CreateUserModal
        onClose={closeModal}
        onSaved={() => {
          closeModal();
          reload();
        }}
      />,
    ),
};

export default function UsersAdminPage() {
  return <AdminResourceManager resource={usersResource} />;
}
