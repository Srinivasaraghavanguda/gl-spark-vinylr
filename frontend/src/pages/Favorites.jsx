import React, { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { getFavorites, removeFavorite } from "../utils/favorites";
import FloatingVinyl from "../components/Aesthetics/FloatingVinyl";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    // =========================================================
    // LOAD FAVOURITES — CORE FUNCTIONALITY UNCHANGED
    // =========================================================

    const loadFavorites = () => {
        setFavorites(getFavorites());
    };

    useEffect(() => {
        loadFavorites();

        const handleFavoritesUpdated = () => {
            loadFavorites();
        };

        window.addEventListener(
            "favoritesUpdated",
            handleFavoritesUpdated
        );

        return () => {
            window.removeEventListener(
                "favoritesUpdated",
                handleFavoritesUpdated
            );
        };
    }, []);

    // =========================================================
    // REMOVE FAVOURITE — CORE FUNCTIONALITY UNCHANGED
    // =========================================================

    const handleRemove = (id, type) => {
        removeFavorite(id, type);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#08080C] text-white">

            {/* =====================================================
                CINEMATIC BACKGROUND
            ===================================================== */}

            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                {/* Purple atmospheric glow */}

                <motion.div
                    animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.08, 0.16, 0.08],
                        x: [0, 35, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        top-[25%]
                        left-[25%]
                        w-[600px]
                        h-[600px]
                        rounded-full
                        bg-[#6A00FF]
                        blur-[220px]
                    "
                />

                {/* Red atmospheric glow */}

                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.06, 0.13, 0.06],
                        x: [0, -30, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        bottom-[5%]
                        right-[20%]
                        w-[550px]
                        h-[550px]
                        rounded-full
                        bg-[#E11D2E]
                        blur-[220px]
                    "
                />

                {/* =================================================
                    FLOATING VINYL — LEFT
                ================================================= */}

                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 15, 0],
                    }}
                    transition={{
                        duration: 11,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        top-[18%]
                        left-[2%]
                        scale-[1.15]
                        opacity-[0.28]
                        brightness-125
                        contrast-125
                        drop-shadow-[0_0_70px_rgba(191,149,63,0.55)]
                    "
                >
                    <FloatingVinyl />
                </motion.div>

                {/* =================================================
                    FLOATING VINYL — RIGHT
                ================================================= */}

                <motion.div
                    animate={{
                        y: [0, 35, 0],
                        rotate: [0, -15, 0],
                    }}
                    transition={{
                        duration: 13,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        top-[52%]
                        right-[1%]
                        scale-[1.05]
                        opacity-[0.25]
                        brightness-125
                        contrast-125
                        drop-shadow-[0_0_65px_rgba(191,149,63,0.5)]
                    "
                >
                    <FloatingVinyl />
                </motion.div>

                {/* =================================================
                    CINEMATIC VIGNETTE
                ================================================= */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_center,transparent_35%,#08080C_88%)]
                    "
                />

            </div>


            {/* =====================================================
                MAIN CONTENT
                pt-32 keeps Navbar away from the title
            ===================================================== */}

            <main
                className="
                    relative
                    z-10
                    max-w-[1500px]
                    mx-auto
                    px-5
                    sm:px-8
                    pt-32
                    pb-20
                "
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                    }}
                    className="mb-10"
                >

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[2rem]
                            border
                            border-[#BF953F]/25
                            bg-[#120E14]/75
                            backdrop-blur-2xl
                            px-6
                            py-7
                            sm:px-8
                            sm:py-8
                            shadow-[0_0_50px_rgba(191,149,63,0.08)]
                        "
                    >

                        {/* Gold light sweep */}

                        <div
                            className="
                                absolute
                                inset-y-0
                                right-0
                                w-1/2
                                bg-gradient-to-l
                                from-[#BF953F]/10
                                via-[#B146FF]/5
                                to-transparent
                                pointer-events-none
                            "
                        />

                        {/* Decorative line */}

                        <div
                            className="
                                absolute
                                left-0
                                top-0
                                bottom-0
                                w-1
                                bg-gradient-to-b
                                from-[#BF953F]
                                via-[#B146FF]
                                to-[#E11D2E]
                            "
                        />

                        <div className="relative flex items-center gap-5">

                            {/* Icon */}

                            <div
                                className="
                                    w-14
                                    h-14
                                    sm:w-16
                                    sm:h-16
                                    shrink-0
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-[#FCF6BA]
                                    via-[#BF953F]
                                    to-[#8F6B20]
                                    flex
                                    items-center
                                    justify-center
                                    shadow-[0_0_30px_rgba(191,149,63,0.35)]
                                "
                            >
                                <Heart
                                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#08080C]"
                                    fill="currentColor"
                                />
                            </div>

                            {/* Heading */}

                            <div>

                                <div
                                    className="
                                        text-[10px]
                                        sm:text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.3em]
                                        text-[#FCF6BA]
                                        mb-2
                                    "
                                >
                                    Your Collection
                                </div>

                                <h1
                                    className="
                                        font-['Orbitron']
                                        text-3xl
                                        sm:text-5xl
                                        font-black
                                        italic
                                        uppercase
                                        tracking-wide
                                        text-transparent
                                        bg-clip-text
                                        bg-gradient-to-r
                                        from-white
                                        via-[#FCF6BA]
                                        to-[#BF953F]
                                        drop-shadow-[0_0_25px_rgba(191,149,63,0.25)]
                                    "
                                >
                                    My Favourites
                                </h1>

                                <p
                                    className="
                                        text-[#A09CA3]
                                        text-sm
                                        sm:text-base
                                        mt-2
                                        tracking-wide
                                    "
                                >
                                    Your favourite VinylR records & merchandise
                                </p>

                            </div>

                        </div>

                    </div>

                </motion.section>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {favorites.length === 0 ? (

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="
                            min-h-[450px]
                            rounded-[2rem]
                            border
                            border-white/10
                            bg-[#100c12]/80
                            backdrop-blur-xl
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                            px-6
                            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
                        "
                    >

                        <div
                            className="
                                w-24
                                h-24
                                rounded-full
                                bg-gradient-to-br
                                from-[#BF953F]/20
                                to-[#B146FF]/10
                                border
                                border-[#BF953F]/25
                                flex
                                items-center
                                justify-center
                                mb-7
                                shadow-[0_0_45px_rgba(191,149,63,0.15)]
                            "
                        >

                            <Heart
                                className="w-12 h-12 text-[#BF953F]"
                                fill="currentColor"
                            />

                        </div>

                        <h2 className="text-3xl font-bold mb-3">
                            No Favourites Yet
                        </h2>

                        <p className="text-gray-400 max-w-md">
                            Tap the ❤️ on albums or merch to save them here.
                        </p>

                    </motion.div>

                ) : (

                    <>
                        {/* =================================================
                            COLLECTION COUNT
                        ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="
                                flex
                                items-center
                                gap-3
                                mb-7
                            "
                        >

                            <div
                                className="
                                    w-1.5
                                    h-7
                                    rounded-full
                                    bg-gradient-to-b
                                    from-[#FCF6BA]
                                    via-[#BF953F]
                                    to-[#8F6B20]
                                    shadow-[0_0_15px_rgba(191,149,63,0.6)]
                                "
                            />

                            <div>

                                <p className="text-white font-bold tracking-wide">
                                    {favorites.length}{" "}
                                    {favorites.length === 1
                                        ? "item"
                                        : "items"}{" "}
                                    saved
                                </p>

                                <p
                                    className="
                                        text-[10px]
                                        text-white/30
                                        uppercase
                                        tracking-[0.25em]
                                    "
                                >
                                    Your personal collection
                                </p>

                            </div>

                        </motion.div>


                        {/* =================================================
                            FAVOURITE GRID
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-4
                                gap-6
                            "
                        >

                            {favorites.map((item, index) => (

                                <motion.div
                                    key={`${item.type}-${item.id}`}
                                    initial={{
                                        opacity: 0,
                                        y: 30,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay: index * 0.07,
                                        duration: 0.45,
                                    }}
                                    whileHover={{
                                        y: -7,
                                    }}
                                    className="
                                        group
                                        relative
                                        bg-[#120E14]/85
                                        backdrop-blur-xl
                                        border
                                        border-white/10
                                        rounded-[1.7rem]
                                        overflow-hidden
                                        transition-all
                                        duration-300
                                        hover:border-[#BF953F]/40
                                        hover:shadow-[0_20px_60px_rgba(191,149,63,0.12)]
                                    "
                                >

                                    {/* =================================================
                                        IMAGE
                                    ================================================= */}

                                    <div
                                        className="
                                            relative
                                            h-72
                                            bg-gradient-to-br
                                            from-[#18141a]
                                            via-[#120E14]
                                            to-[#08080C]
                                            flex
                                            items-center
                                            justify-center
                                            overflow-hidden
                                        "
                                    >

                                        {item.imageUrl ? (

                                            <img
                                                src={item.imageUrl}
                                                alt={
                                                    item.title ||
                                                    item.name
                                                }
                                                className="
                                                    w-full
                                                    h-full
                                                    object-cover
                                                    transition-transform
                                                    duration-700
                                                    group-hover:scale-105
                                                "
                                            />

                                        ) : (

                                            <Heart
                                                className="
                                                    w-20
                                                    h-20
                                                    text-[#BF953F]
                                                "
                                                fill="currentColor"
                                            />

                                        )}

                                        {/* Image overlay */}

                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                bg-gradient-to-t
                                                from-[#08080C]/90
                                                via-transparent
                                                to-white/[0.04]
                                                pointer-events-none
                                            "
                                        />

                                        {/* Type badge */}

                                        <div
                                            className="
                                                absolute
                                                top-4
                                                left-4
                                                px-3
                                                py-1.5
                                                rounded-full
                                                bg-black/65
                                                backdrop-blur-md
                                                border
                                                border-[#BF953F]/30
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.2em]
                                                text-[#FCF6BA]
                                            "
                                        >
                                            {item.type}
                                        </div>

                                        {/* Remove button */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(
                                                    item.id,
                                                    item.type
                                                )
                                            }
                                            className="
                                                absolute
                                                top-4
                                                right-4
                                                w-11
                                                h-11
                                                rounded-full
                                                bg-black/70
                                                backdrop-blur-md
                                                border
                                                border-red-500/30
                                                flex
                                                items-center
                                                justify-center
                                                text-red-400
                                                opacity-0
                                                translate-y-2
                                                group-hover:opacity-100
                                                group-hover:translate-y-0
                                                hover:bg-red-500/20
                                                hover:border-red-500/50
                                                hover:text-red-300
                                                transition-all
                                                duration-300
                                            "
                                            aria-label="Remove from favourites"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                    </div>


                                    {/* =================================================
                                        CARD CONTENT
                                    ================================================= */}

                                    <div className="p-5">

                                        {item.category && (
                                            <div
                                                className="
                                                    text-[10px]
                                                    text-[#BF953F]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.2em]
                                                    mb-2
                                                "
                                            >
                                                {item.category}
                                            </div>
                                        )}

                                        <h3
                                            className="
                                                text-xl
                                                font-bold
                                                text-white
                                                truncate
                                                group-hover:text-[#FCF6BA]
                                                transition-colors
                                            "
                                        >
                                            {item.title || item.name}
                                        </h3>

                                        {item.artist && (
                                            <p className="text-gray-400 mt-1 truncate">
                                                {item.artist}
                                            </p>
                                        )}

                                        {item.brand && (
                                            <p className="text-gray-400 mt-1 truncate">
                                                {item.brand}
                                            </p>
                                        )}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                mt-5
                                                pt-4
                                                border-t
                                                border-white/5
                                            "
                                        >

                                            <span
                                                className="
                                                    text-2xl
                                                    font-black
                                                    text-[#FCF6BA]
                                                    drop-shadow-[0_0_12px_rgba(191,149,63,0.2)]
                                                "
                                            >
                                                ₹
                                                {Number(
                                                    item.price || 0
                                                ).toLocaleString("en-IN")}
                                            </span>

                                            {/* Mobile remove button */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.id,
                                                        item.type
                                                    )
                                                }
                                                className="
                                                    sm:hidden
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-red-500/10
                                                    border
                                                    border-red-500/30
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-red-400
                                                    hover:bg-red-500/20
                                                    transition
                                                "
                                                aria-label="Remove from favourites"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                        </div>

                                    </div>

                                </motion.div>

                            ))}

                        </div>
                    </>
                )}

            </main>
        </div>
    );
};

export default Favorites;