import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Disc3 } from "lucide-react";
import toast from "react-hot-toast";
import { catalogService } from "../api/catalogService";

export default function AlbumDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [album, setAlbum] = useState(null);
    useEffect(() => {
    console.log("Album State:", album);
}, [album]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadAlbum = async () => {

            try {

                const data = await catalogService.getAlbumById(id);

                console.log("API returned:", data);

                setAlbum(data);

            }catch (err) {

    console.log(err);
    console.log(err.response);
    console.log(err.response?.data);

    toast.error("Unable to load album");

            }finally {

                setLoading(false);

            }

        };

        loadAlbum();

    }, [id]);

    const addToCart = () => {

        const cart = JSON.parse(localStorage.getItem("vinylr_cart") || "[]");

        const existing = cart.find(
            item => item.cartKey === `album-${album.id}`
        );

        if (existing) {

            existing.quantity++;

        } else {

            cart.push({
                ...album,
                quantity: 1,
                productType: "ALBUM",
                cartKey: `album-${album.id}`
            });

        }

        localStorage.setItem("vinylr_cart", JSON.stringify(cart));

        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Added to Cart!");

    };

    if (loading) {

        return (

            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">

                Loading Album...

            </div>

        );

    }

    if (!album) {

        return (

            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">

                Album not found.

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-[#080808] text-white">

            <div className="max-w-7xl mx-auto p-10">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 text-[#E11D2E] hover:text-white"
                >
                    <ArrowLeft />
                    Back
                </button>

                <div className="grid lg:grid-cols-2 gap-12">

                    <div>

                        {album.imageUrl ? (

                            <img
                                src={album.imageUrl}
                                alt={album.title}
                                className="rounded-3xl shadow-2xl w-full"
                            />

                        ) : (

                            <div className="aspect-square rounded-3xl bg-[#181818] flex items-center justify-center">

                                <Disc3 size={140} />

                            </div>

                        )}

                    </div>

                    <div>

                        <h1 className="text-5xl font-bold mb-3">

                            {album.title}

                        </h1>

                        <h2 className="text-2xl text-gray-400 mb-8">

                            {album.artist}

                        </h2>

                        <div className="space-y-3 mb-8">

                            <p>

                                <strong>Genre:</strong> {album.genre}

                            </p>

                            <p>

                                <strong>Release Year:</strong> {album.releaseYear}

                            </p>

                            <p>

                                <strong>Stock:</strong> {album.stock}

                            </p>

                        </div>

                        <p className="text-gray-300 leading-8 mb-10">

                            {album.description}

                        </p>

                        <h3 className="text-4xl text-[#E11D2E] font-bold mb-8">

                            ₹{album.price}

                        </h3>

                        <button

                            onClick={addToCart}

                            className="bg-[#E11D2E] px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-red-700 transition"

                        >

                            <ShoppingCart />

                            Add To Cart

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}