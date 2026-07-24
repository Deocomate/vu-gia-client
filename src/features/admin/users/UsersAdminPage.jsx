"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Plus, RefreshCw, ShieldCheck, X } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import { adminApi } from "@/shared/api/adminApi";
import { ROLE, ROLE_LABEL } from "@/shared/api/apiEnums";
import { useAdminAuthStore } from "@/shared/stores/adminAuthStore";
import { toast } from "@/shared/utils/feedback";

const PAGE_SIZE = 20;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-zinc-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-950">Đổi vai trò — {user.username}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
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
          <button type="button" onClick={onClose} className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-zinc-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-950">Đặt lại mật khẩu — {user.username}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
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
          <button type="button" onClick={onClose} className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4">
      <form onSubmit={submit} className="w-full max-w-md border border-zinc-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-950">Tạo tài khoản quản trị</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
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
          <button type="button" onClick={onClose} className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UsersAdminPage() {
  const currentUser = useAdminAuthStore((state) => state.user);
  const isSuperadmin = currentUser?.role === ROLE.SUPERADMIN;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [roleTarget, setRoleTarget] = useState(null);
  const [passwordTarget, setPasswordTarget] = useState(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get("/users", { page, size: PAGE_SIZE, username: search || undefined });
      setRows(data?.content || []);
      setTotal(data?.totalElements ?? 0);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách người dùng.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const canResetPassword = (user) => isSuperadmin || user.role === ROLE.CUSTOMER;

  const actions = [
    ...(isSuperadmin
      ? [{ label: "Đổi vai trò", onClick: setRoleTarget }]
      : []),
    { label: "Reset mật khẩu", onClick: (user) => canResetPassword(user) && setPasswordTarget(user) },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 border border-zinc-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Người dùng</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Không có API sửa/xóa chung — chỉ đổi vai trò (SUPERADMIN) và reset mật khẩu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadRows}
            className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tải lại
          </button>
          {isSuperadmin && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex h-10 items-center gap-2 bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tạo tài khoản
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 border border-zinc-200 bg-white p-4">
        <input
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Tìm theo tên đăng nhập"
          className="h-11 w-full max-w-sm border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        />
      </div>

      {loading ? (
        <div className="border border-zinc-200 bg-white p-8 text-sm font-semibold text-zinc-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: "username", label: "Tên đăng nhập", accessor: "username" },
              { key: "email", label: "Email", accessor: "email" },
              { key: "name", label: "Họ tên", accessor: "name" },
              {
                key: "role",
                label: "Vai trò",
                accessor: "role",
                render: (value) => (
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    {ROLE_LABEL[value] || value}
                  </span>
                ),
              },
              { key: "createdAt", label: "Ngày tạo", accessor: "createdAt", type: "date" },
            ]}
            rows={rows}
            actions={actions}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}

      {creating && (
        <CreateUserModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            loadRows();
          }}
        />
      )}
      {roleTarget && (
        <RoleModal
          user={roleTarget}
          onClose={() => setRoleTarget(null)}
          onSaved={() => {
            setRoleTarget(null);
            loadRows();
          }}
        />
      )}
      {passwordTarget && (
        <PasswordModal
          user={passwordTarget}
          onClose={() => setPasswordTarget(null)}
          onSaved={() => setPasswordTarget(null)}
        />
      )}
    </section>
  );
}
