import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Shirt } from "lucide-react";
import toast from "react-hot-toast";
import { catalogService } from "../api/catalogService";

export default function MerchDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [merch, setMerch] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================
    // LOAD MERCH
    // ==========================
    useEffect(() => {

        const loadMerch = async () => {

            try {

                const data =
                    await catalogService.getMerchById(id);

                setMerch(data);

            } catch (error) {

                console.error(error);

                toast.error("Unable to load merch");

            } finally {

                setLoading(false);

            }
        };

        loadMerch();

    }, [id]);

    // ==========================
    // ADD TO CART
    // ==========================
    const addToCart = () => {

        if (!merch || merch.stock <= 0) {

            toast.error("This item is sold out");

            return;
        }

        const cart = JSON.parse(
            localStorage.getItem("vinylr_cart") || "[]"
        );

        const cartKey = `merch-${merch.id}`;

        const existing = cart.find(
            (item) => item.cartKey === cartKey
        );

        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({
                ...merch,

                // Keep frontend naming consistent
                title: merch.name,

                quantity: 1,

                productType: "MERCH",

                cartKey: cartKey
            });

        }

        localStorage.setItem(
            "vinylr_cart",
            JSON.stringify(cart)
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        toast.success("Added to Cart!");

    };

    // ==========================
    // LOADING
    // ==========================
    if (loading) {

        return (

            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">

                Loading Merch...

            </div>

        );

    }

    // ==========================
    // NOT FOUND
    // ==========================
    if (!merch) {

        return (

            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">

                <div className="text-center">

                    <h2 className="text-3xl font-bold mb-4">
                        Merch not found.
                    </h2>

                    <button
                        onClick={() => navigate("/merch")}
                        className="text-[#E11D2E] hover:text-white"
                    >
                        Back to Merch
                    </button>

                </div>

            </div>

        );

    }

    // ==========================
    // DETAILS PAGE
    // ==========================
    return (

        <div className="min-h-screen bg-[#080808] text-white">

            <div className="max-w-7xl mx-auto p-10">

                {/* BACK */}

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 text-[#E11D2E] hover:text-white transition"
                >

                    <ArrowLeft />

                    Back

                </button>


                <div className="grid lg:grid-cols-2 gap-12">

                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div>

                        {merch.imageUrl ? (

                            <img
                                src={merch.imageUrl}
                                alt={merch.name}
                                className="rounded-3xl shadow-2xl w-full aspect-square object-cover"
                            />

                        ) : (

                            <div className="aspect-square rounded-3xl bg-[#181818] flex items-center justify-center">

                                <Shirt size={140} />

                            </div>

                        )}

                    </div>


                    {/* =================================
                        DETAILS
                    ================================= */}

                    <div>

                        <h1 className="text-5xl font-bold mb-3">

                            {merch.name}

                        </h1>


                        <h2 className="text-2xl text-gray-400 mb-8">

                            {merch.variant || "VinylR Merch"}

                        </h2>


                        <div className="space-y-3 mb-8">

                            <p>

                                <strong>Category:</strong>{" "}

                                {merch.category}

                            </p>


                            <p>

                                <strong>Variant:</strong>{" "}

                                {merch.variant || "Standard"}

                            </p>


                            <p>

                                <strong>Stock:</strong>{" "}

                                {merch.stock}

                            </p>

                        </div>


                        {/* DESCRIPTION */}

                        <p className="text-gray-300 leading-8 mb-10">

                            {merch.description}

                        </p>


                        {/* PRICE */}

                        <h3 className="text-4xl text-[#E11D2E] font-bold mb-8">

                            ₹{merch.price}

                        </h3>


                        {/* ADD TO CART */}

                        <button
                            onClick={addToCart}
                            disabled={merch.stock <= 0}
                            className={`px-8 py-4 rounded-xl flex items-center gap-3 transition ${
                                merch.stock <= 0
                                    ? "bg-gray-700 cursor-not-allowed"
                                    : "bg-[#E11D2E] hover:bg-red-700"
                            }`}
                        >

                            <ShoppingCart />

                            {merch.stock <= 0
                                ? "Sold Out"
                                : "Add To Cart"}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}