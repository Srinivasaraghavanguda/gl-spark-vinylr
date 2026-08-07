import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axiosConfig";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem("vinylr_user");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!username) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/orders/${username}`);
                setOrders(response.data);
            } catch (error) {
                toast.error("Unable to load your orders.", {
                    style: {
                        background: "#120E14",
                        color: "#fff",
                        border: "1px solid #E11D2E"
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <p className="text-white text-xl animate-pulse">
                    Loading your orders...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white px-6 py-12">
            <Toaster position="top-right" />

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex items-center gap-3 mb-10">
                    <Package className="text-[#E11D2E]" size={34} />
                    <h1 className="text-4xl font-bold tracking-wide">
                        My Orders
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#120E14] rounded-3xl border border-white/10 p-16 text-center"
                    >
                        <ShoppingBag
                            size={70}
                            className="mx-auto mb-6 text-[#B146FF]"
                        />

                        <h2 className="text-3xl font-bold mb-3">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-400">
                            Start shopping to see your order history here.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="bg-[#120E14] border border-white/10 rounded-3xl p-6 hover:border-[#E11D2E] transition-all duration-300"
                            >
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {order.orderReference}
                                        </h2>

                                        <p className="text-gray-400 mt-1">
                                            Product ID: {order.albumId}
                                        </p>

                                        <p className="text-gray-400">
                                            Type: {order.productType}
                                        </p>

                                        <p className="text-gray-400">
                                            Quantity: {order.quantity}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-[#BF953F]">
                                            ₹{order.totalPrice}
                                        </p>

                                        <span className="inline-block mt-3 px-4 py-2 rounded-full bg-green-600/20 text-green-400 border border-green-500">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Orders;