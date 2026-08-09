import React, { useEffect, useState } from "react";
import { Package, RefreshCw, Truck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import orderService from "../api/orderService";

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const response = await orderService.get("/orders");

            setOrders(response.data);

        } catch (error) {

            console.error(error);

            toast.error("Unable to load orders");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const markAsDelivered = async (orderId) => {

        try {

            setUpdating(orderId);

            const response = await orderService.put(
    `/orders/${orderId}/status`,
    {
        status: "DELIVERED"
    }
);

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId
                        ? response.data
                        : order
                )
            );

            toast.success("Order marked as delivered!");

        } catch (error) {

            console.error(error);

            toast.error("Unable to update order");

        } finally {

            setUpdating(null);

        }
    };

    if (loading) {

        return (
            <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">

                <p className="text-xl animate-pulse">
                    Loading orders...
                </p>

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[#080808] text-white px-8 py-12">

            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="flex items-center justify-between mb-10">

                    <div className="flex items-center gap-4">

                        <Package
                            size={38}
                            className="text-[#E11D2E]"
                        />

                        <div>

                            <h1 className="text-4xl font-bold">
                                Admin Orders
                            </h1>

                            <p className="text-gray-400 mt-1">
                                Manage customer orders
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-[#E11D2E] transition"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>

                </div>

                {/* NO ORDERS */}

                {orders.length === 0 ? (

                    <div className="bg-[#120E14] border border-white/10 rounded-3xl p-16 text-center">

                        <Package
                            size={70}
                            className="mx-auto mb-6 text-[#B146FF]"
                        />

                        <h2 className="text-3xl font-bold mb-3">
                            No Orders
                        </h2>

                        <p className="text-gray-400">
                            There are currently no customer orders.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {orders.map((order) => (

                            <div
                                key={order.id}
                                className="bg-[#120E14] border border-white/10 rounded-3xl p-6 hover:border-[#E11D2E] transition"
                            >

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                    {/* ORDER INFO */}

                                    <div className="space-y-2">

                                        <h2 className="text-xl font-bold">
                                            {order.productName}
                                        </h2>

                                        <p className="text-gray-400">
                                            Order: {order.orderReference}
                                        </p>

                                        <p className="text-gray-400">
                                            Customer: {order.username}
                                        </p>

                                        <div className="flex gap-5 text-gray-400">

                                            <span>
                                                Type: {order.productType}
                                            </span>

                                            <span>
                                                Quantity: {order.quantity}
                                            </span>

                                        </div>

                                        <p className="text-gray-500 text-sm">
    Order ID: {order.id}
</p>

<p className="text-gray-500 text-sm">
    Ordered on: {new Date(order.orderDate).toLocaleDateString()}
</p>

{order.estimatedDelivery && (
    <p className="text-gray-500 text-sm">
        Estimated Delivery:{" "}
        {new Date(order.estimatedDelivery).toLocaleDateString()}
    </p>
)}

{order.deliveredOn && (
    <p className="text-green-400 text-sm">
        Delivered on:{" "}
        {new Date(order.deliveredOn).toLocaleDateString()}
    </p>
)}

                                    </div>

                                    {/* PRICE + STATUS */}

                                    <div className="flex flex-col items-start lg:items-end gap-3">

                                        <p className="text-3xl font-bold text-[#BF953F]">
                                            ₹{order.totalPrice}
                                        </p>

                                        <span
                                            className={`px-4 py-2 rounded-full border ${
                                                order.status === "DELIVERED"
                                                    ? "bg-green-600/20 text-green-400 border-green-500"
                                                    : "bg-yellow-600/20 text-yellow-400 border-yellow-500"
                                            }`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                    {/* ACTION */}

                                    {order.status !== "DELIVERED" && (

                                        <button
                                            onClick={() =>
                                                markAsDelivered(order.id)
                                            }
                                            disabled={updating === order.id}
                                            className="bg-[#E11D2E] hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                                        >

                                            <Truck size={20} />

                                            {updating === order.id
                                                ? "Updating..."
                                                : "Mark Delivered"}

                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}