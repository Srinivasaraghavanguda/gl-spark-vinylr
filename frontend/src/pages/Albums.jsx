import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  SlidersHorizontal,
  Check,
  Loader2,
  PackageX,
  ArrowDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { catalogService } from '../api/catalogService';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';
import { getAlbumCover } from "../data/albumCoverService";
import {
    isFavorite,
    toggleFavorite
} from "../utils/favorites";

// =========================================================
// FALLBACK MOCK DATA
// =========================================================

const FALLBACK_ITEMS = [
  {
    id: 1,
    type: "Vinyl",
    collection: "New Releases",
    genre: "Rock",
    title: "RaGaForge OST",
    artist: "Cinematic Ensemble",
    stock: 15,
    price: 1999,
    badgeColor: "bg-[#6A00FF]"
  },
  {
    id: 2,
    type: "CD",
    collection: "Best Sellers",
    genre: "Pop",
    title: "Midnight Drive",
    artist: "The Synthetics",
    stock: 0,
    price: 599,
    badgeColor: "bg-[#E11D2E]"
  },
  {
    id: 3,
    type: "Digital",
    collection: "Exclusive",
    genre: "Hip Hop",
    title: "Analog Echoes",
    artist: "VinylR Originals",
    stock: 999,
    price: 299,
    badgeColor: "bg-[#4A00E0]"
  },
  {
    id: 4,
    type: "Box Sets",
    collection: "Pre-Orders",
    genre: "K-Pop",
    title: "Neon Pulse",
    artist: "Cosmic Wave",
    stock: 5,
    price: 2499,
    badgeColor: "bg-[#8B0E1A]"
  }
];

// =========================================================
// FILTER OPTIONS
// =========================================================

const FORMAT_TABS = [
  'All Albums',
  'Vinyl',
  'CD',
  'Digital',
  'Box Sets'
];

const SIDEBAR_CATEGORIES = [
  "All Albums",
  "Pre-Orders",
  "New Releases",
  "Best Sellers",
  "Exclusive"
];

const GENRES = [
  "Rock",
  "Pop",
  "Hip Hop",
  "K-Pop",
  "Electronic",
  "Cinematic"
];

// =========================================================
// ALBUMS PAGE
// =========================================================

const Albums = () => {

  const navigate = useNavigate();

  // =======================================================
  // NAVIGATION
  // =======================================================

  const openAlbum = (item) => {
    navigate(`/albums/${item.id}`);
  };

  // =======================================================
  // DATA STATES
  // =======================================================

  const [storeItems, setStoreItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =======================================================
  // FILTER STATES
  // =======================================================

  const [activeFormat, setActiveFormat] =
    useState("All Albums");

  const [activeCategory, setActiveCategory] =
    useState("All Albums");

  const [selectedGenres, setSelectedGenres] =
    useState([]);

  // =======================================================
  // FETCH ALBUMS
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const fetchCatalog = async () => {
      try {
        const data =
          await catalogService.getAllAlbums();

        if (!mounted) return;

        /*
         * Resolve the album cover once here.
         *
         * This avoids the previous second useEffect
         * that was making another round of cover requests.
         */

        const albums = Array.isArray(data)
          ? data
          : [];

        const mappedAlbums =
          await Promise.all(
            albums.map(async (album) => {

              let coverUrl =
                album.imageUrl || "";

              try {
                const appleCover =
                  await getAlbumCover(
                    album.artist,
                    album.title
                  );

                if (appleCover) {
                  coverUrl = appleCover;
                }
              } catch (coverError) {
                console.warn(
                  `Could not load cover for ${album.title}`,
                  coverError
                );
              }

              return {
                ...album,

                imageUrl: coverUrl,

                type:
                  album.type ||
                  "Vinyl",

                collection:
                  album.collection ||
                  "New Releases",

                badgeColor:
                  album.badgeColor ||
                  "bg-[#E11D2E]"
              };
            })
          );

        if (mounted) {
          setStoreItems(mappedAlbums);
        }

      } catch (error) {

        console.warn(
          "Backend unreachable. Loading fallback mock data.",
          error
        );

        if (mounted) {
          setStoreItems(
            FALLBACK_ITEMS
          );
        }

      } finally {

        if (mounted) {
          setTimeout(() => {
            setIsLoading(false);
          }, 600);
        }
      }
    };

    fetchCatalog();

    return () => {
      mounted = false;
    };

  }, []);

  // =======================================================
  // CART
  // =======================================================

  const addToLocalCart = (item) => {

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          'vinylr_cart'
        ) || '[]'
      );

    const cartItem = {
      ...item,
      productType: 'ALBUM',
      cartKey: `album-${item.id}`
    };

    const existingItem =
      existingCart.find(
        (i) =>
          i.cartKey ===
          cartItem.cartKey
      );

    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      existingCart.push({
        ...cartItem,
        quantity: 1
      });
    }

    localStorage.setItem(
      'vinylr_cart',
      JSON.stringify(existingCart)
    );

    window.dispatchEvent(
      new Event('cartUpdated')
    );
  };

  // =======================================================
  // BUY NOW
  // =======================================================

  const handleBuyNow = (item) => {

    const stock =
      Number(item.stock) || 0;

    if (stock <= 0) {

      toast.error(
        'Item is currently Sold Out.',
        {
          style: {
            background: '#120E14',
            color: '#fff',
            border:
              '1px solid #E11D2E'
          }
        }
      );

      return;
    }

    addToLocalCart(item);

    toast.success(
      'Proceeding to Checkout!',
      {
        style: {
          background: '#E11D2E',
          color: '#fff'
        }
      }
    );

    setTimeout(() => {
      navigate('/cart');
    }, 600);
  };

  // =======================================================
  // ADD TO CART
  // =======================================================

  const handleAddToCart = (item) => {

    const stock =
      Number(item.stock) || 0;

    if (stock <= 0) {

      toast.error(
        'Item is currently Sold Out.',
        {
          style: {
            background: '#120E14',
            color: '#fff',
            border:
              '1px solid #E11D2E'
          }
        }
      );

      return;
    }

    addToLocalCart(item);

    toast.success(
      `${item.title} added to cart!`,
      {
        style: {
          background: '#120E14',
          color: '#fff',
          border:
            '1px solid #E11D2E'
        }
      }
    );
  };

  // =======================================================
  // GENRE FILTER
  // =======================================================

  const toggleGenre = (genre) => {

    setSelectedGenres(
      (prev) =>
        prev.includes(genre)
          ? prev.filter(
              (g) => g !== genre
            )
          : [
              ...prev,
              genre
            ]
    );
  };

  // =======================================================
  // CLEAR FILTERS
  // =======================================================

  const clearFilters = () => {

    setActiveFormat(
      "All Albums"
    );

    setActiveCategory(
      "All Albums"
    );

    setSelectedGenres([]);
  };

  // =======================================================
  // FILTER + STOCK SORTING
  // =======================================================

  const filteredItems = useMemo(() => {

    const filtered =
      storeItems.filter((item) => {

        const matchFormat =
          activeFormat ===
            "All Albums" ||
          item.type ===
            activeFormat;

        const matchCategory =
          activeCategory ===
            "All Albums" ||
          item.collection ===
            activeCategory;

        const matchGenre =
          selectedGenres.length ===
            0 ||
          selectedGenres.includes(
            item.genre
          );

        return (
          matchFormat &&
          matchCategory &&
          matchGenre
        );
      });

    /*
     * IMPORTANT:
     *
     * In-stock albums stay first.
     * Sold-out albums move to the bottom.
     *
     * Their original order is preserved
     * within each group.
     */

    return [...filtered].sort(
      (a, b) => {

        const stockA =
          Number(a.stock) || 0;

        const stockB =
          Number(b.stock) || 0;

        const soldA =
          stockA <= 0;

        const soldB =
          stockB <= 0;

        if (
          !soldA &&
          soldB
        ) {
          return -1;
        }

        if (
          soldA &&
          !soldB
        ) {
          return 1;
        }

        return 0;
      }
    );

  }, [
    storeItems,
    activeFormat,
    activeCategory,
    selectedGenres
  ]);

  // =======================================================
  // STOCK COUNTS
  // =======================================================

  const availableItems =
    filteredItems.filter(
      (item) =>
        (Number(item.stock) || 0) > 0
    );

  const soldOutItems =
    filteredItems.filter(
      (item) =>
        (Number(item.stock) || 0) <= 0
    );

  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div
      className="
        min-h-screen
        bg-[#0B0B0F]
        text-white
        pt-24
        pb-16
        font-['Oswald']
        relative
        overflow-hidden
      "
    >

      <Toaster
        position="top-right"
      />

      {/* =================================================
          BACKGROUND ATMOSPHERE
          ================================================= */}

      <div
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
        "
      >

        {/* Red smoke */}

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [
              0.28,
              0.42,
              0.28
            ]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="
            absolute
            top-[5%]
            right-[-5%]
            w-[900px]
            h-[900px]
            bg-[#E11D2E]
            rounded-full
            blur-[210px]
          "
        />

        {/* Purple smoke */}

        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [
              0.18,
              0.30,
              0.18
            ]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="
            absolute
            bottom-[-15%]
            left-[-10%]
            w-[850px]
            h-[850px]
            bg-[#6A00FF]
            rounded-full
            blur-[210px]
          "
        />

        {/* Additional left purple haze */}

        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
            scale: [1, 1.12, 1],
            opacity: [0.10, 0.20, 0.10]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="
            absolute
            top-[28%]
            left-[-18%]
            w-[700px]
            h-[700px]
            bg-[#A855F7]
            rounded-full
            blur-[190px]
          "
        />

        {/* =================================================
            FLOATING VINYL
            ================================================= */}

        <motion.div
  animate={{
    rotate: [18, 21, 18],
    scale: [1, 1.025, 1]
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="
    fixed
    top-[18vh]
    right-[-15vw]
    w-[40vw]
    h-[40vw]
    min-w-[520px]
    min-h-[520px]
    max-w-[720px]
    max-h-[720px]
    z-[1]
    pointer-events-none
    opacity-80
  "
>
  <FloatingVinyl />
</motion.div>
      </div>

      {/* =================================================
          MAIN CONTAINER
          ================================================= */}

      <div
        className="
          max-w-[1600px]
          mx-auto
          px-6
          relative
          z-10
          flex
          gap-8
        "
      >

        {/* =================================================
            SIDEBAR
            ================================================= */}

        <aside
          className="
            w-64
            hidden
            lg:block
            flex-shrink-0
          "
        >

          <div
            className="
              bg-[#120E14]/80
              backdrop-blur-xl
              border
              border-[#E11D2E]/20
              rounded-2xl
              p-6
              sticky
              top-28
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            "
          >

            {/* Filter heading */}

            <div
              className="
                flex
                items-center
                justify-between
                mb-8
                border-b
                border-white/10
                pb-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <SlidersHorizontal
                  className="
                    w-5
                    h-5
                    text-[#E11D2E]
                  "
                />

                <h2
                  className="
                    text-lg
                    font-bold
                    tracking-widest
                    uppercase
                  "
                >
                  Filters
                </h2>

              </div>

              <button
                onClick={
                  clearFilters
                }
                className="
                  text-[#E11D2E]
                  text-xs
                  font-semibold
                  hover:text-white
                  transition-colors
                "
              >
                Clear All
              </button>

            </div>

            {/* CATEGORY */}

            <div className="mb-8">

              <h3
                className="
                  text-xs
                  font-bold
                  text-[#A09CA3]
                  tracking-widest
                  uppercase
                  mb-4
                "
              >
                Category
              </h3>

              <div className="space-y-4">

                {SIDEBAR_CATEGORIES.map(
                  (cat) => (

                    <label
                      key={cat}
                      className="
                        flex
                        items-center
                        gap-3
                        cursor-pointer
                        group
                      "
                      onClick={() =>
                        setActiveCategory(
                          cat
                        )
                      }
                    >

                      <div
                        className={`
                          w-4
                          h-4
                          rounded-full
                          border
                          flex
                          items-center
                          justify-center
                          transition-all

                          ${
                            activeCategory ===
                            cat
                              ? `
                                border-[#E11D2E]
                                shadow-[0_0_10px_rgba(225,29,46,0.5)]
                              `
                              : `
                                border-white/20
                                group-hover:border-[#E11D2E]/50
                              `
                          }
                        `}
                      >

                        <div
                          className={`
                            w-2
                            h-2
                            rounded-full
                            bg-[#E11D2E]
                            transition-all

                            ${
                              activeCategory ===
                              cat
                                ? "scale-100"
                                : "scale-0"
                            }
                          `}
                        />

                      </div>

                      <span
                        className={`
                          text-sm
                          tracking-wide
                          transition-colors

                          ${
                            activeCategory ===
                            cat
                              ? `
                                text-white
                                font-medium
                              `
                              : `
                                text-[#A09CA3]
                                group-hover:text-white
                              `
                          }
                        `}
                      >
                        {cat}
                      </span>

                    </label>
                  )
                )}

              </div>
            </div>

            {/* GENRE */}

            <div>

              <h3
                className="
                  text-xs
                  font-bold
                  text-[#A09CA3]
                  tracking-widest
                  uppercase
                  mb-4
                "
              >
                Genre
              </h3>

              <div className="space-y-4">

                {GENRES.map(
                  (genre) => {

                    const isChecked =
                      selectedGenres.includes(
                        genre
                      );

                    return (

                      <label
                        key={genre}
                        className="
                          flex
                          items-center
                          gap-3
                          cursor-pointer
                          group
                        "
                        onClick={() =>
                          toggleGenre(
                            genre
                          )
                        }
                      >

                        <div
                          className={`
                            w-4
                            h-4
                            rounded
                            flex
                            items-center
                            justify-center
                            transition-all

                            ${
                              isChecked
                                ? `
                                  bg-[#E11D2E]
                                  border-[#E11D2E]
                                  shadow-[0_0_10px_rgba(225,29,46,0.5)]
                                `
                                : `
                                  border
                                  border-white/20
                                  group-hover:border-[#E11D2E]/50
                                `
                            }
                          `}
                        >

                          <Check
                            className={`
                              w-3
                              h-3
                              text-white
                              transition-transform

                              ${
                                isChecked
                                  ? "scale-100"
                                  : "scale-0"
                              }
                            `}
                            strokeWidth={4}
                          />

                        </div>

                        <span
                          className={`
                            text-sm
                            tracking-wide

                            ${
                              isChecked
                                ? `
                                  text-white
                                  font-medium
                                `
                                : `
                                  text-[#A09CA3]
                                  group-hover:text-white
                                `
                            }
                          `}
                        >
                          {genre}
                        </span>

                      </label>
                    );
                  }
                )}

              </div>
            </div>

          </div>
        </aside>

        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <main
          className="
            flex-1
            min-h-screen
            min-w-0
          "
        >

          {/* HEADER */}

          <div className="mb-8">

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-end
                justify-between
                gap-4
                mb-6
              "
            >

              <div>

                <h1
                  className="
                    font-['Orbitron']
                    text-4xl
                    sm:text-5xl
                    font-black
                    italic
                    tracking-wider
                    uppercase
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-b
                    from-white
                    via-[#E11D2E]
                    to-[#8B0E1A]
                    drop-shadow-[0_8px_15px_rgba(225,29,46,0.6)]
                  "
                >
                  Vinylr Album Store
                </h1>

                <p
                  className="
                    mt-2
                    text-xs
                    text-white/35
                    tracking-[0.2em]
                    uppercase
                  "
                >
                  Discover your next record
                </p>

              </div>

              {!isLoading &&
                filteredItems.length >
                  0 && (

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    uppercase
                    tracking-widest
                  "
                >

                  <span
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-green-400/5
                      border
                      border-green-400/15
                      text-green-400
                    "
                  >
                    {availableItems.length}{" "}
                    Available
                  </span>

                  {soldOutItems.length >
                    0 && (

                    <span
                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-[#E11D2E]/5
                        border
                        border-[#E11D2E]/15
                        text-[#E11D2E]
                      "
                    >
                      {soldOutItems.length}{" "}
                      Sold Out
                    </span>
                  )}

                </div>
              )}

            </div>

            {/* FORMAT TABS */}

            <div
              className="
                w-full
                bg-[#120E14]/80
                backdrop-blur-md
                border
                border-white/10
                rounded-xl
                p-1.5
                flex
                gap-1
                shadow-lg
                shadow-black/50
                overflow-x-auto
              "
            >

              {FORMAT_TABS.map(
                (tab) => (

                  <button
                    key={tab}
                    onClick={() =>
                      setActiveFormat(
                        tab
                      )
                    }
                    className={`
                      flex-1
                      min-w-[110px]
                      py-3
                      rounded-lg
                      text-sm
                      font-bold
                      tracking-widest
                      uppercase
                      whitespace-nowrap
                      transition-all
                      duration-300

                      ${
                        activeFormat ===
                        tab
                          ? `
                            bg-gradient-to-r
                            from-[#8B0E1A]
                            to-[#E11D2E]
                            text-white
                            shadow-[0_0_15px_rgba(225,29,46,0.4)]
                          `
                          : `
                            text-[#A09CA3]
                            hover:text-white
                            hover:bg-white/5
                          `
                      }
                    `}
                  >
                    {tab}
                  </button>

                )
              )}

            </div>

          </div>

          {/* =================================================
              LOADING
              ================================================= */}

          {isLoading ? (

            <div
              className="
                w-full
                flex
                flex-col
                items-center
                justify-center
                py-32
              "
            >

              <Loader2
                className="
                  w-12
                  h-12
                  text-[#E11D2E]
                  animate-spin
                  mb-4
                "
              />

              <p
                className="
                  text-[#A09CA3]
                  tracking-widest
                  uppercase
                  font-light
                  animate-pulse
                "
              >
                Syncing with Backend
                Database...
              </p>

            </div>

          ) : filteredItems.length ===
            0 ? (

            /* EMPTY STATE */

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-24
                text-[#A09CA3]
              "
            >

              <PackageX
                className="
                  w-12
                  h-12
                  text-white/20
                  mb-5
                "
              />

              <p
                className="
                  text-xl
                  tracking-widest
                  uppercase
                  font-light
                "
              >
                No items match
                your filters.
              </p>

              <button
                onClick={
                  clearFilters
                }
                className="
                  mt-4
                  text-[#E11D2E]
                  font-bold
                  hover:text-white
                  transition-colors
                  tracking-widest
                "
              >
                CLEAR FILTERS
              </button>

            </div>

          ) : (

            <>

              {/* =================================================
                  AVAILABLE ALBUMS
                  ================================================= */}

              {availableItems.length >
                0 && (

                <section>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-5
                    "
                  >

                    <div
                      className="
                        w-1.5
                        h-7
                        rounded-full
                        bg-[#E11D2E]
                        shadow-[0_0_15px_rgba(225,29,46,0.7)]
                      "
                    />

                    <div>

                      <h2
                        className="
                          text-xl
                          font-bold
                          uppercase
                          tracking-widest
                        "
                      >
                        Available Now
                      </h2>

                      <p
                        className="
                          text-[10px]
                          text-white/30
                          uppercase
                          tracking-[0.2em]
                        "
                      >
                        Ready to order
                      </p>

                    </div>

                  </div>

                  <motion.div
                    layout
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                      gap-6
                    "
                  >

                    <AnimatePresence>
                      {availableItems.map(
                        (item) => (

                          <AlbumCard
                          
                            key={item.id}
                            item={item}
                            openAlbum={
                              openAlbum
                            }
                            handleBuyNow={
                              handleBuyNow
                            }
                            handleAddToCart={
                              handleAddToCart
                            }
                          />

                        )
                      )}
                    </AnimatePresence>

                  </motion.div>

                </section>
              )}

              {/* =================================================
                  SOLD OUT ALBUMS
                  ================================================= */}

              {soldOutItems.length >
                0 && (

                <section
                  className="
                    mt-16
                    pt-10
                    border-t
                    border-white/[0.07]
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-6
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-1.5
                          h-7
                          rounded-full
                          bg-[#E11D2E]/50
                        "
                      />

                      <div>

                        <h2
                          className="
                            text-xl
                            font-bold
                            uppercase
                            tracking-widest
                            text-white/55
                          "
                        >
                          Currently Sold Out
                        </h2>

                        <p
                          className="
                            text-[10px]
                            text-white/25
                            uppercase
                            tracking-[0.2em]
                            mt-1
                          "
                        >
                          Available again soon
                        </p>

                      </div>

                    </div>

                    <div
                      className="
                        hidden
                        sm:flex
                        items-center
                        gap-2
                        text-white/20
                        text-[10px]
                        uppercase
                        tracking-widest
                      "
                    >
                      <ArrowDown className="w-3 h-3" />
                      End of collection
                    </div>

                  </div>

                  <motion.div
                    layout
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                      gap-6
                    "
                  >

                    <AnimatePresence>
                      {soldOutItems.map(
                        (item) => (

                          <AlbumCard
                            key={item.id}
                            item={item}
                            openAlbum={
                              openAlbum
                            }
                            handleBuyNow={
                              handleBuyNow
                            }
                            handleAddToCart={
                              handleAddToCart
                            }
                          />

                        )
                      )}
                    </AnimatePresence>

                  </motion.div>

                </section>
              )}

            </>
          )}

        </main>

      </div>
    </div>
  );
};

// =========================================================
// ALBUM CARD
// =========================================================

const AlbumCard = ({
  item,
  openAlbum,
  handleBuyNow,
  handleAddToCart
}) => {

  // ❤️ FAVOURITE STATE
  const [favorite, setFavorite] = useState(
    isFavorite(
      item.id,
      "ALBUM"
    )
  );

  // ❤️ KEEP HEART IN SYNC
  useEffect(() => {

    const syncFavorite = () => {
      setFavorite(
        isFavorite(
          item.id,
          "ALBUM"
        )
      );
    };

    syncFavorite();

    window.addEventListener(
      "favoritesUpdated",
      syncFavorite
    );

    return () => {
      window.removeEventListener(
        "favoritesUpdated",
        syncFavorite
      );
    };

  }, [item.id]);

  const isSoldOut =
    (Number(item.stock) || 0) <= 0;

  return (
    <motion.div
      layout
      onClick={() =>
        openAlbum(item)
      }
      initial={{
        opacity: 0,
        scale: 0.96
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      exit={{
        opacity: 0,
        scale: 0.96
      }}
      transition={{
        duration: 0.3
      }}
      className={`
        cursor-pointer
        bg-[#120E14]/80
        backdrop-blur-md
        border
        border-white/10
        rounded-2xl
        p-4
        flex
        flex-col
        group
        transition-all
        duration-300

        ${
          isSoldOut
            ? `
              opacity-55
              hover:opacity-70
            `
            : `
              hover:border-[#E11D2E]/55
              hover:shadow-[0_0_35px_rgba(225,29,46,0.18)]
              hover:-translate-y-1.5
            `
        }
      `}
    >

      {/* =====================================================
          ALBUM ARTWORK
          ===================================================== */}

      <div
        className="
          w-full
          aspect-[4/5]
          bg-[#1A1A1A]
          rounded-xl
          relative
          mb-4
          overflow-hidden
          border
          border-white/5
        "
      >

        {item.imageUrl ? (

          <img
            src={item.imageUrl}
            alt={item.title}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

        ) : (

          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              bg-gradient-to-br
              from-[#120E14]
              via-[#24101A]
              to-[#080808]
            "
          >

            <span
              className="
                text-[#E11D2E]
                text-5xl
                font-black
              "
            >
              V
            </span>

          </div>
        )}

        {/* Subtle artwork overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/45
            via-transparent
            to-white/[0.05]
            pointer-events-none
            transition-opacity
            duration-500
            group-hover:opacity-80
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-white/[0.08]
            via-transparent
            to-[#E11D2E]/[0.06]
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
            pointer-events-none
          "
        />

        {/* Collection badge */}

        <div
          className={`
            absolute
            top-3
            left-3
            ${item.badgeColor || 'bg-[#E11D2E]'}
            text-white
            text-[10px]
            font-bold
            px-2
            py-1
            rounded
            uppercase
            tracking-wider
            shadow-lg
          `}
        >
          {item.collection ===
          'All Albums'
            ? item.type
            : item.collection}
        </div>

        {/* Favourite button */}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            const added = toggleFavorite({
              id: item.id,
              type: "ALBUM",
              title: item.title,
              artist: item.artist,
              imageUrl: item.imageUrl,
              price: item.price,
              stock: item.stock,
              category: item.collection
            });

            setFavorite(added);

            toast.success(
              added
                ? "Added to favourites ❤️"
                : "Removed from favourites",
              {
                style: {
                  background: "#120E14",
                  color: "#fff",
                  border: "1px solid #E11D2E"
                }
              }
            );
          }}
          className={`
            absolute
            top-3
            right-3
            z-20
            w-10
            h-10
            rounded-full
            bg-black/55
            backdrop-blur-md
            border
            flex
            items-center
            justify-center
            transition-all
            duration-300
            hover:scale-110
            active:scale-95

            ${
              favorite
                ? `
                  border-[#E11D2E]
                  text-[#E11D2E]
                  bg-[#E11D2E]/10
                  shadow-[0_0_18px_rgba(225,29,46,0.55)]
                `
                : `
                  border-white/10
                  text-white/60
                  hover:text-[#E11D2E]
                  hover:border-[#E11D2E]/50
                  hover:bg-[#E11D2E]/10
                `
            }
          `}
          aria-label={
            favorite
              ? "Remove from favourites"
              : "Add to favourites"
          }
        >
          <Heart
            className="w-5 h-5"
            fill={favorite ? "currentColor" : "none"}
            strokeWidth={favorite ? 2.5 : 2}
          />
        </button>

        {/* Sold-out overlay */}

        {isSoldOut && (
          <div
            className="
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              pointer-events-none
              bg-black/10
            "
          >
            <span
              className="
                px-4
                py-2
                rounded-lg
                bg-black/75
                backdrop-blur-md
                border
                border-[#E11D2E]/40
                text-[#FF5965]
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                shadow-[0_0_20px_rgba(225,29,46,0.18)]
              "
            >
              Sold Out
            </span>
          </div>
        )}

      </div>

      {/* =====================================================
          DETAILS
          ===================================================== */}

      <div
        className="
          flex-1
          flex
          flex-col
        "
      >

        <h3
          className="
            text-lg
            font-bold
            text-white
            tracking-wide
            truncate
          "
        >
          {item.title}
        </h3>

        <p
          className="
            text-sm
            text-[#A09CA3]
            font-light
            mb-2
            truncate
          "
        >
          {item.artist}
        </p>

        {/* Stock status */}

        <div
          className="
            mb-4
            mt-1
          "
        >

          {isSoldOut ? (

            <span
              className="
                text-xs
                font-bold
                text-[#E11D2E]
                tracking-widest
                uppercase
                flex
                items-center
                gap-1
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-[#E11D2E]
                "
              />

              Sold Out

            </span>

          ) : (

            <span
              className="
                text-xs
                font-bold
                text-green-400
                tracking-widest
                uppercase
                flex
                items-center
                gap-1
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                "
              />

              In Stock

            </span>
          )}

        </div>

        {/* Price */}

        <div
          className="
            text-right
            mb-4
          "
        >

          <span
            className="
              text-2xl
              font-bold
              text-[#E11D2E]
              tracking-wider
            "
          >
            ₹
            {Number(
              item.price || 0
            ).toLocaleString(
              'en-IN'
            )}
          </span>

        </div>

        {/* =================================================
            ACTION BUTTONS
            ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            mt-auto
          "
        >

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow(item);
            }}
            disabled={isSoldOut}
            className={`
              w-full
              py-2.5
              rounded-lg
              text-white
              text-sm
              font-bold
              uppercase
              tracking-widest
              transition-all

              ${
                isSoldOut
                  ? `
                    bg-white/5
                    text-white/30
                    cursor-not-allowed
                  `
                  : `
                    bg-gradient-to-r
                    from-[#8B0E1A]
                    to-[#E11D2E]
                    hover:shadow-[0_0_15px_rgba(225,29,46,0.4)]
                  `
              }
            `}
          >
            Buy Now
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
            disabled={isSoldOut}
            className={`
              w-full
              py-2.5
              rounded-lg
              text-sm
              font-bold
              uppercase
              tracking-widest
              transition-all

              ${
                isSoldOut
                  ? `
                    bg-transparent
                    border
                    border-white/5
                    text-white/30
                    cursor-not-allowed
                  `
                  : `
                    bg-[#0B0B0F]
                    border
                    border-white/20
                    text-[#A09CA3]
                    hover:text-white
                    hover:border-white/60
                  `
              }
            `}
          >
            Add To Cart
          </button>

        </div>

      </div>

    </motion.div>
  );
};

export default Albums;