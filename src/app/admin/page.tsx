"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Trash2, CheckCircle, Clock, LogOut, RefreshCw, ShoppingCart,
  Package, TrendingUp, FileText, Printer, X, Search,
  Shield, Eye, ChevronDown, Copy, Download
} from "lucide-react";
import Link from "next/link";

/* ─── Types ─── */
interface Order {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  address: string;
  qty_black: number;
  qty_white: number;
  delivery_area: string;
  delivery_charge: number;
  total_price: number;
  status: string;
}

/* ─── Toast System ─── */
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-xl text-sm font-medium animate-slide-in max-w-sm
            ${t.type === "success" ? "bg-green-500/15 border-green-500/30 text-green-300" : ""}
            ${t.type === "error" ? "bg-red-500/15 border-red-500/30 text-red-300" : ""}
            ${t.type === "info" ? "bg-blue-500/15 border-blue-500/30 text-blue-300" : ""}
          `}
        >
          {t.type === "success" && <CheckCircle size={18} className="flex-shrink-0" />}
          {t.type === "error" && <X size={18} className="flex-shrink-0" />}
          {t.type === "info" && <Eye size={18} className="flex-shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="cursor-pointer text-current opacity-50 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Receipt Modal ─── */
function ReceiptModal({ order, onClose, onCopy }: { order: Order; onClose: () => void; onCopy: () => void }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Receipt - ${order.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; padding: 24px; color: #1a1a2e; background: #fff; }
        .receipt { max-width: 350px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px; }
        .logo { font-size: 22px; font-weight: 900; color: #1e3a5f; }
        .logo span { color: #3b82f6; }
        .tagline { font-size: 11px; color: #64748b; margin-top: 4px; }
        .divider { border: none; border-top: 1px dashed #e2e8f0; margin: 14px 0; }
        .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; font-weight: 700; margin-bottom: 8px; }
        .field { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; font-size: 13px; }
        .field .label { color: #64748b; min-width: 100px; }
        .field .value { color: #1e293b; font-weight: 600; text-align: right; }
        .price-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; text-align: center; margin: 16px 0; }
        .price { font-size: 28px; font-weight: 900; color: #1e3a5f; }
        .price-note { font-size: 11px; color: #64748b; margin-top: 4px; }
        .footer { text-align: center; padding-top: 16px; border-top: 2px dashed #cbd5e1; }
        .footer p { font-size: 11px; color: #94a3b8; line-height: 1.6; }
        .thank-you { font-size: 14px; font-weight: 700; color: #1e3a5f; margin-bottom: 4px; }
        .status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .status-pending { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
        .status-completed { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <div class="receipt">
        <div class="header">
          <div class="logo">Magic Publication <span>BD</span></div>
          <div class="tagline">Daily Planner — Start Each Day With A Purpose</div>
        </div>
        <div class="section-title">Order Details</div>
        <div class="field"><span class="label">Order ID</span><span class="value">#${order.id.slice(0, 8).toUpperCase()}</span></div>
        <div class="field"><span class="label">Date</span><span class="value">${new Date(order.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</span></div>
        <div class="field"><span class="label">Status</span><span class="value"><span class="status ${order.status === "Completed" ? "status-completed" : "status-pending"}">${order.status}</span></span></div>
        <hr class="divider" />
        <div class="section-title">Customer Info</div>
        <div class="field"><span class="label">Name</span><span class="value">${order.name}</span></div>
        <div class="field"><span class="label">Phone</span><span class="value">${order.phone}</span></div>
        <div class="field"><span class="label">Address</span><span class="value" style="max-width:200px">${order.address}</span></div>
        <hr class="divider" />
        <div class="section-title">Product</div>
        <div class="field"><span class="label">Item</span><span class="value">Magic Daily Planner</span></div>
        <div class="field"><span class="label">Qty</span><span class="value">1</span></div>
        <div class="price-box">
          <div class="price">৳ ৩৯০</div>
          <div class="price-note">+ ডেলিভারি চার্জ ৬০–১০০ টাকা</div>
        </div>
        <div class="footer">
          <div class="thank-you">ধন্যবাদ!</div>
          <p>Magic Publication BD<br/>WhatsApp: +88 01933-255101<br/>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</p>
        </div>
      </div></body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10">
          <X size={16} />
        </button>

        <div ref={receiptRef} className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-white">Magic Publication <span className="text-blue-400">BD</span></h3>
            <p className="text-xs text-zinc-500 mt-1">Daily Planner — Start Each Day With A Purpose</p>
          </div>

          <div className="border-t border-dashed border-zinc-700 my-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Order ID</span>
              <span className="text-white font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date</span>
              <span className="text-zinc-300">{new Date(order.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.status === "Completed" ? "bg-green-500/15 text-green-400" : "bg-orange-500/15 text-orange-400"}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Black Qty</span>
              <span className="text-zinc-300">{order.qty_black}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">White Qty</span>
              <span className="text-zinc-300">{order.qty_white}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery Area</span>
              <span className="text-zinc-300">{order.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery Charge</span>
              <span className="text-zinc-300">৳ {order.delivery_charge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Price</span>
              <span className="text-zinc-300 font-bold">৳ {order.total_price}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-700 my-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer</span>
              <span className="text-white font-medium">{order.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Phone</span>
              <span className="text-blue-400 font-medium">{order.phone}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 flex-shrink-0">Address</span>
              <span className="text-zinc-300 text-right ml-4 max-w-[220px]">{order.address}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-700 my-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Product</span>
              <span className="text-white font-medium">Magic Daily Planner</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Quantity</span>
              <span className="text-zinc-300">1</span>
            </div>
          </div>

          <div className="mt-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-white">৳ ৩৯০</div>
            <p className="text-xs text-zinc-500 mt-1">+ ডেলিভারি চার্জ {order.delivery_charge} টাকা</p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button onClick={handlePrint} className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
            <Printer size={16} /> Print
          </button>
          <button onClick={onCopy} className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 border border-zinc-700">
            <Copy size={16} /> Copy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Page ─── */
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const copyOrderDetails = useCallback((order: Order) => {
    const text = `Order #${order.id.slice(0, 8).toUpperCase()}\nDate: ${new Date(order.created_at).toLocaleDateString()}\nName: ${order.name}\nPhone: ${order.phone}\nAddress: ${order.address}\nStatus: ${order.status}\nAmount: 390 BDT + Delivery`;
    navigator.clipboard.writeText(text);
    addToast("Order details copied to clipboard!", "success");
  }, [addToast]);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => {
        setIsAuthenticated(r.ok);
        if (r.ok) fetchOrders();
        else setLoading(false);
      })
      .catch(() => { setIsAuthenticated(false); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        addToast("Login successful! Welcome back.", "success");
        fetchOrders();
      } else {
        addToast("Incorrect password. Please try again.", "error");
      }
    } catch {
      addToast("Connection failed. Please check your network.", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setOrders([]);
    setPassword("");
    addToast("Logged out successfully.", "info");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        setIsAuthenticated(false);
        addToast("Session expired. Please log in again.", "error");
        return;
      }
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch {
      addToast("Failed to fetch orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        addToast("Session expired.", "error");
        return;
      }
      if (res.ok) {
        fetchOrders();
        addToast(`Order marked as ${newStatus}`, "success");
      } else {
        addToast("Failed to update order status.", "error");
      }
    } catch {
      addToast("Network error. Could not update order.", "error");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        addToast("Session expired.", "error");
        return;
      }
      if (res.ok) {
        fetchOrders();
        addToast("Order deleted successfully.", "success");
      } else {
        addToast("Failed to delete order.", "error");
      }
    } catch {
      addToast("Network error. Could not delete order.", "error");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.address.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* ─── LOGIN SCREEN ─── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-zinc-500 text-sm mt-1">Magic Publication BD</p>
          </div>
          <form onSubmit={handleLogin} className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/60 border border-zinc-700 rounded-xl px-4 py-3.5 mb-5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600"
              placeholder="Enter admin password"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loginLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
              ) : (
                <><Shield size={18} /> Secure Login</>
              )}
            </button>
          </form>
          <p className="text-center text-xs text-zinc-600 mt-6">Protected with server-side authentication</p>
        </div>
      </div>
    );
  }

  /* ─── MAIN DASHBOARD ─── */
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {receiptOrder && <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} onCopy={() => copyOrderDetails(receiptOrder)} />}

      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-tight">Orders Dashboard</h1>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Magic Publication BD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} className="cursor-pointer p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors" title="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-400" : "text-zinc-400"} />
            </button>
            <Link href="/" className="cursor-pointer p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white" title="View Site">
              <Eye size={16} />
            </Link>
            <button onClick={handleLogout} className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: orders.length, icon: <ShoppingCart size={20} />, bg: "from-blue-600/10 to-blue-800/5", border: "border-blue-500/20", text: "text-blue-400" },
            { label: "Pending", value: pendingCount, icon: <Clock size={20} />, bg: "from-orange-600/10 to-orange-800/5", border: "border-orange-500/20", text: "text-orange-400" },
            { label: "Completed", value: completedCount, icon: <CheckCircle size={20} />, bg: "from-green-600/10 to-green-800/5", border: "border-green-500/20", text: "text-green-400" },
            { label: "Revenue (Est.)", value: `৳${orders.reduce((sum, o) => sum + (o.total_price || 0), 0).toLocaleString()}`, icon: <TrendingUp size={20} />, bg: "from-purple-600/10 to-purple-800/5", border: "border-purple-500/20", text: "text-purple-400" },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.bg} border ${s.border} rounded-2xl p-5 transition-all hover:scale-[1.02]`}>
              <div className={`${s.text} mb-3 opacity-70`}>{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, address, or ID..."
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-zinc-600 text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer appearance-none bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
          <button
            onClick={() => {
              const csv = [
                "Order ID,Date,Name,Phone,Address,Status",
                ...orders.map((o) =>
                  `"${o.id}","${new Date(o.created_at).toLocaleDateString()}","${o.name}","${o.phone}","${o.address.replace(/"/g, '""')}","${o.status}"`
                ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              addToast("Orders exported as CSV!", "success");
            }}
            className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <Download size={14} /> Export
          </button>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <ShoppingCart size={40} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg font-medium">
              {search || statusFilter !== "all" ? "No orders match your filters." : "No orders found yet."}
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/70 border-b border-zinc-800">
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Order</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Customer</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest hidden md:table-cell">Address</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Black Qty</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">White Qty</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Delivery</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Total</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="p-4">
                        <div className="text-xs text-zinc-500 font-mono">#{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-zinc-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{order.name}</div>
                        <a href={`tel:${order.phone}`} className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm mt-0.5 inline-block">{order.phone}</a>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="text-sm text-zinc-400 max-w-xs truncate" title={order.address}>{order.address}</div>
                      </td>
                      <td className="p-4 text-center font-bold text-zinc-200">{order.qty_black}</td>
                      <td className="p-4 text-center font-bold text-zinc-200">{order.qty_white}</td>
                      <td className="p-4">
                        <div className="text-xs text-zinc-400">{order.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}</div>
                        <div className="text-xs text-zinc-500">৳ {order.delivery_charge}</div>
                      </td>
                      <td className="p-4 text-center font-bold text-white">৳ {order.total_price}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border
                          ${order.status === "Completed"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          }`}>
                          {order.status === "Completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setReceiptOrder(order); addToast("Receipt opened", "info"); }}
                            className="cursor-pointer p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="View Receipt"
                          >
                            <FileText size={15} />
                          </button>
                          {order.status === "Pending" && (
                            <button
                              onClick={() => updateStatus(order.id, "Completed")}
                              className="cursor-pointer p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Mark Completed"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          {order.status === "Completed" && (
                            <button
                              onClick={() => updateStatus(order.id, "Pending")}
                              className="cursor-pointer p-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors"
                              title="Revert to Pending"
                            >
                              <Clock size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="cursor-pointer p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-600">
              <span>Showing {filtered.length} of {orders.length} orders</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
