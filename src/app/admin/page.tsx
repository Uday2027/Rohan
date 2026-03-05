"use client";

import { useState, useEffect } from "react";
import { Trash2, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loginProps = {
        onSubmit: (e: React.FormEvent) => {
            e.preventDefault();
            if (password === "magicadmin") {
                setIsAuthenticated(true);
                fetchOrders();
            } else {
                alert("Incorrect password");
            }
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteOrder = async (id: string) => {
        if (!confirm("Are you sure you want to delete this order?")) return;
        try {
            const res = await fetch("/api/admin/orders", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
                <form onSubmit={loginProps.onSubmit} className="glass p-8 rounded-2xl w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mb-4 text-white focus:outline-none focus:border-blue-500"
                        placeholder="Enter Admin Password"
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-6 pt-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Orders Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">Total: {orders.length}</span>
                        <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            View Site
                        </Link>
                        <button onClick={() => setIsAuthenticated(false)} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-zinc-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border-dashed border-zinc-800">
                        <p className="text-zinc-500 text-lg">No orders found yet.</p>
                    </div>
                ) : (
                    <div className="glass rounded-2xl overflow-hidden border-zinc-800/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-900/50 border-b border-zinc-800">
                                        <th className="p-4 font-medium text-zinc-400">Date</th>
                                        <th className="p-4 font-medium text-zinc-400">Customer</th>
                                        <th className="p-4 font-medium text-zinc-400">Address</th>
                                        <th className="p-4 font-medium text-zinc-400">Status</th>
                                        <th className="p-4 font-medium text-zinc-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                                            <td className="p-4 text-sm whitespace-nowrap">
                                                {new Date(order.created_at).toLocaleDateString()}
                                                <div className="text-xs text-zinc-500 mt-1">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-white">{order.name}</div>
                                                <div className="text-sm text-blue-400 mt-1">{order.phone}</div>
                                            </td>
                                            <td className="p-4 text-sm max-w-xs truncate" title={order.address}>
                                                {order.address}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                    }`}>
                                                    {order.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                {order.status === 'Pending' && (
                                                    <button
                                                        onClick={() => updateStatus(order.id, 'Completed')}
                                                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteOrder(order.id)}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
