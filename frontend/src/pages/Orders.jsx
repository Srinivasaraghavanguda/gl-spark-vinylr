import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Package,
    ShoppingBag,
    RefreshCw,
    CalendarDays,
    Truck,
    CheckCircle2,
    Clock3
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import orderService from "../api/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const username = localStorage.getItem("vinylr_user");

    // =========================================================
    // FETCH ORDERS
    // =========================================================

    const fetchOrders = useCallback(
        async (isRefresh = false) => {
            if (!username) {
                setOrders([]);
                setLoading(false);
                return;
            }

            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response = await orderService.get(
                    `/orders/${encodeURIComponent(username)}`
                );

                console.log(
                    "LATEST ORDERS FROM BACKEND:",
                    response.data
                );

                setOrders(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {
                console.error(
                    "Unable to fetch orders:",
                    error
                );

                toast.error(
                    "Unable to load your orders.",
                    {
                        style: {
                            background: "#120E14",
                            color: "#fff",
                            border:
                                "1px solid #E11D2E"
                        }
                    }
                );

            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [username]
    );

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // =========================================================
    // REFRESH WHEN USER RETURNS TO THE PAGE
    // =========================================================

    useEffect(() => {
        const handleFocus = () => {
            fetchOrders(true);
        };

        window.addEventListener(
            "focus",
            handleFocus
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleFocus
            );
        };
    }, [fetchOrders]);

    // =========================================================
    // STATUS HELPERS
    // =========================================================

    const getStatusStyles = (status) => {
        switch (status?.toUpperCase()) {
            case "DELIVERED":
                return {
                    container:
                        "bg-green-500/10 border-green-500/30",
                    text:
                        "text-green-400",
                    icon:
                        <CheckCircle2 size={17} />
                };

            case "CONFIRMED":
                return {
                    container:
                        "bg-yellow-500/10 border-yellow-500/30",
                    text:
                        "text-yellow-400",
                    icon:
                        <Clock3 size={17} />
                };

            case "SHIPPED":
                return {
                    container:
                        "bg-blue-500/10 border-blue-500/30",
                    text:
                        "text-blue-400",
                    icon:
                        <Truck size={17} />
                };

            case "CANCELLED":
                return {
                    container:
                        "bg-red-500/10 border-red-500/30",
                    text:
                        "text-red-400",
                    icon:
                        <Clock3 size={17} />
                };

            default:
                return {
                    container:
                        "bg-white/5 border-white/10",
                    text:
                        "text-gray-300",
                    icon:
                        <Clock3 size={17} />
                };
        }
    };

    // =========================================================
    // DATE FORMATTER
    // =========================================================

    const formatDate = (date) => {
        if (!date) return null;

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center relative overflow-hidden">

                {/* Background glow */}
                <div className="absolute w-[500px] h-[500px] bg-[#E11D2E]/10 blur-[150px] rounded-full top-[-200px] right-[-100px]" />

                <div className="relative z-10 text-center">

                    <Package
                        size={50}
                        className="mx-auto mb-5 text-[#E11D2E] animate-pulse"
                    />

                    <p className="text-xl text-white/80 animate-pulse">
                        Loading your orders...
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <div className="min-h-screen bg-[#080808] text-white px-5 sm:px-8 py-10 sm:py-14 relative overflow-hidden">

            <Toaster position="top-right" />

            {/* =================================================
                BACKGROUND GLOW
            ================================================= */}

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.08, 0.16, 0.08]
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity
                }}
                className="
                    fixed
                    top-[-250px]
                    right-[-200px]
                    w-[700px]
                    h-[700px]
                    bg-[#E11D2E]
                    rounded-full
                    blur-[180px]
                    pointer-events-none
                "
            />

            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.05, 0.12, 0.05]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity
                }}
                className="
                    fixed
                    bottom-[-300px]
                    left-[-200px]
                    w-[700px]
                    h-[700px]
                    bg-[#6A00FF]
                    rounded-full
                    blur-[180px]
                    pointer-events-none
                "
            />

            <motion.div
                initial={{
                    opacity: 0,
                    y: 25
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.6
                }}
                className="
                    max-w-6xl
                    mx-auto
                    relative
                    z-10
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-5
                    mb-10
                ">

                    <div className="flex items-center gap-4">

                        <div className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gradient-to-br
                            from-[#E11D2E]/20
                            to-[#B146FF]/20
                            border
                            border-white/10
                            flex
                            items-center
                            justify-center
                            shadow-[0_0_30px_rgba(225,29,46,0.12)]
                        ">
                            <Package
                                size={30}
                                className="text-[#E11D2E]"
                            />
                        </div>

                        <div>

                            <h1 className="
                                text-3xl
                                sm:text-4xl
                                font-black
                                tracking-wide
                            ">
                                My Orders
                            </h1>

                            <p className="
                                text-gray-400
                                mt-1
                            ">
                                Track your VinylR purchases
                            </p>

                        </div>

                    </div>

                    {/* REFRESH BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            fetchOrders(true)
                        }
                        disabled={refreshing}
                        className="
                            self-start
                            sm:self-auto
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            bg-white/[0.03]
                            border
                            border-white/10
                            text-white/80
                            hover:text-white
                            hover:border-[#E11D2E]/60
                            hover:bg-[#E11D2E]/10
                            transition-all
                            duration-300
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>

                {/* =================================================
                    ORDER COUNT
                ================================================= */}

                {orders.length > 0 && (
                    <div className="
                        flex
                        items-center
                        gap-2
                        mb-6
                        text-sm
                        text-gray-400
                    ">

                        <ShoppingBag
                            size={16}
                            className="text-[#B146FF]"
                        />

                        <span>
                            {orders.length}{" "}
                            {orders.length === 1
                                ? "order"
                                : "orders"}{" "}
                            found
                        </span>

                    </div>
                )}

                {/* =================================================
                    NO ORDERS
                ================================================= */}

                {orders.length === 0 ? (

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.98
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        className="
                            bg-[#120E14]/80
                            backdrop-blur-xl
                            rounded-[2rem]
                            border
                            border-white/10
                            p-12
                            sm:p-16
                            text-center
                            shadow-[0_0_50px_rgba(0,0,0,0.3)]
                        "
                    >

                        <div className="
                            w-24
                            h-24
                            mx-auto
                            mb-7
                            rounded-full
                            bg-gradient-to-br
                            from-[#B146FF]/20
                            to-[#E11D2E]/10
                            border
                            border-white/10
                            flex
                            items-center
                            justify-center
                        ">

                            <ShoppingBag
                                size={45}
                                className="text-[#B146FF]"
                            />

                        </div>

                        <h2 className="
                            text-3xl
                            font-bold
                            mb-3
                        ">
                            No Orders Yet
                        </h2>

                        <p className="
                            text-gray-400
                            max-w-md
                            mx-auto
                        ">
                            Start shopping and your
                            VinylR order history will
                            appear here.
                        </p>

                    </motion.div>

                ) : (

                    /* =================================================
                       ORDERS LIST
                    ================================================= */

                    <div className="grid gap-6">

                        {orders.map(
                            (order, index) => {

                                const status =
                                    getStatusStyles(
                                        order.status
                                    );

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            delay:
                                                index *
                                                0.08
                                        }}
                                        className="
                                            group
                                            bg-[#120E14]/80
                                            backdrop-blur-xl
                                            border
                                            border-white/10
                                            rounded-[2rem]
                                            p-6
                                            sm:p-7
                                            hover:border-[#E11D2E]/40
                                            hover:shadow-[0_0_35px_rgba(225,29,46,0.08)]
                                            transition-all
                                            duration-300
                                        "
                                    >

                                        <div className="
                                            flex
                                            flex-col
                                            lg:flex-row
                                            lg:items-center
                                            lg:justify-between
                                            gap-7
                                        ">

                                            {/* =====================================
                                                PRODUCT INFO
                                            ===================================== */}

                                            <div className="
                                                flex-1
                                                min-w-0
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    mb-3
                                                ">

                                                    <div className="
                                                        w-10
                                                        h-10
                                                        rounded-xl
                                                        bg-[#E11D2E]/10
                                                        border
                                                        border-[#E11D2E]/20
                                                        flex
                                                        items-center
                                                        justify-center
                                                    ">

                                                        <Package
                                                            size={20}
                                                            className="text-[#E11D2E]"
                                                        />

                                                    </div>

                                                    <div>

                                                        <h2 className="
                                                            text-xl
                                                            sm:text-2xl
                                                            font-bold
                                                            truncate
                                                        ">
                                                            {order.productName ||
                                                                "Product"}
                                                        </h2>

                                                        <p className="
                                                            text-sm
                                                            text-gray-500
                                                            mt-0.5
                                                        ">
                                                            {order.productType ||
                                                                "ITEM"}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ORDER REFERENCE */}

                                                <p className="
                                                    text-sm
                                                    text-gray-400
                                                    mb-4
                                                ">
                                                    Order{" "}
                                                    <span className="text-white/80">
                                                        #
                                                        {order.orderReference ||
                                                            order.id}
                                                    </span>
                                                </p>

                                                {/* DETAILS */}

                                                <div className="
                                                    grid
                                                    grid-cols-1
                                                    sm:grid-cols-2
                                                    gap-3
                                                    text-sm
                                                ">

                                                    {order.quantity && (
                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-gray-400
                                                        ">
                                                            <ShoppingBag
                                                                size={16}
                                                                className="text-[#B146FF]"
                                                            />

                                                            Quantity:{" "}
                                                            <span className="text-white">
                                                                {order.quantity}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {order.orderDate && (
                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-gray-400
                                                        ">
                                                            <CalendarDays
                                                                size={16}
                                                                className="text-[#B146FF]"
                                                            />

                                                            Ordered:{" "}
                                                            <span className="text-white">
                                                                {formatDate(
                                                                    order.orderDate
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {order.estimatedDelivery && (
                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-gray-400
                                                        ">
                                                            <Truck
                                                                size={16}
                                                                className="text-[#B146FF]"
                                                            />

                                                            Estimated:{" "}
                                                            <span className="text-white">
                                                                {formatDate(
                                                                    order.estimatedDelivery
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {order.deliveredOn && (
                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-gray-400
                                                        ">
                                                            <CheckCircle2
                                                                size={16}
                                                                className="text-green-400"
                                                            />

                                                            Delivered:{" "}
                                                            <span className="text-green-400">
                                                                {formatDate(
                                                                    order.deliveredOn
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* =====================================
                                                PRICE + STATUS
                                            ===================================== */}

                                            <div className="
                                                lg:min-w-[190px]
                                                flex
                                                flex-col
                                                lg:items-end
                                                gap-4
                                            ">

                                                <p className="
                                                    text-3xl
                                                    font-black
                                                    text-[#BF953F]
                                                ">
                                                    ₹
                                                    {Number(
                                                        order.totalPrice ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>

                                                <div
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        px-4
                                                        py-2
                                                        rounded-full
                                                        border
                                                        font-semibold
                                                        text-sm
                                                        ${status.container}
                                                        ${status.text}
                                                    `}
                                                >

                                                    {status.icon}

                                                    {order.status ||
                                                        "UNKNOWN"}

                                                </div>

                                                {/* DELIVERY MESSAGE */}

                                                {order.status?.toUpperCase() ===
                                                    "DELIVERED" && (
                                                    <p className="
                                                        text-sm
                                                        text-green-400/80
                                                        text-center
                                                        lg:text-right
                                                    ">
                                                        Your order has
                                                        been delivered.
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                    </motion.div>
                                );
                            }
                        )}

                    </div>
                )}

            </motion.div>

        </div>
    );
};

export default Orders;