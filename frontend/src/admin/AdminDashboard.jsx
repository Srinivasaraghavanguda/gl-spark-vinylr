import React from "react";
import { Link } from "react-router-dom";
import {
    Disc3,
    Shirt,
    ShoppingCart,
    Users,
    BarChart3
} from "lucide-react";

const cards = [
    {
        title: "Albums",
        icon: <Disc3 size={42} />,
        color: "from-purple-600 to-pink-600",
        path: "/admin/albums"
    },
    {
        title: "Merch",
        icon: <Shirt size={42} />,
        color: "from-blue-600 to-cyan-500",
        path: "/admin/merch"
    },
    {
        title: "Orders",
        icon: <ShoppingCart size={42} />,
        color: "from-red-600 to-orange-500",
        path: "/admin/orders"
    },
    {
        title: "Users",
        icon: <Users size={42} />,
        color: "from-green-600 to-emerald-500",
        path: "#"
    },
    {
        title: "Analytics",
        icon: <BarChart3 size={42} />,
        color: "from-yellow-500 to-orange-600",
        path: "#"
    }
];

export default function AdminDashboard() {

    return (

        <div className="min-h-screen bg-[#080808] text-white pt-28 lg:pt-32 px-4 sm:px-6 lg:px-10 pb-10">

            <h1 className="text-5xl font-bold mb-2">
                VinylR Admin Dashboard
            </h1>

            <p className="text-gray-400 mb-10">
                Manage Albums, Merch, Orders and Analytics
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {cards.map((card) => (

                    <Link
                        key={card.title}
                        to={card.path}
                    >

                        <div
                            className={`rounded-3xl bg-gradient-to-r ${card.color}
                            p-8 shadow-xl hover:scale-105 transition duration-300`}
                        >

                            {card.icon}

                            <h2 className="text-3xl font-bold mt-5">
                                {card.title}
                            </h2>

                        </div>

                    </Link>

                ))}

            </div>

        </div>

    );

}