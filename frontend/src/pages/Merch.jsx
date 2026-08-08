import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { catalogService } from '../api/catalogService';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

const Merch = () => {
  const navigate = useNavigate();

  // =========================================
  // DATA STATES
  // =========================================
  const [storeItems, setStoreItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================================
  // FILTER & SEARCH STATES
  // =========================================
  const [activeCategory, setActiveCategory] = useState('All Merch');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const searchRef = useRef(null);

  // =========================================
  // LOAD MERCH FROM DATABASE
  // =========================================
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await catalogService.getAllMerch();

        const formattedData = data.map((item) => ({
          ...item,

          // Backend: name → Frontend: title
          title: item.name,

          // Use variant as secondary information
          brand: item.variant || 'VinylR Merch',

          // Keep backend category exactly for filtering
          category: item.category,

          // Optional UI badge colors
          badgeColor: getBadgeColor(item.category),
        }));

        setStoreItems(formattedData);
      } catch (error) {
        console.error('Failed to load merch:', error);

        setStoreItems([]);

        toast.error('Unable to load merchandise');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // =========================================
  // CATEGORY COLOR
  // =========================================
  const getBadgeColor = (category) => {
    const value = String(category || '').toLowerCase();

    if (value.includes('hoodie')) {
      return 'bg-[#6A00FF]';
    }

    if (value.includes('shirt')) {
      return 'bg-[#E11D2E]';
    }

    if (value.includes('lightstick')) {
      return 'bg-[#4A00E0]';
    }

    if (value.includes('toy') || value.includes('plush')) {
      return 'bg-[#8B0E1A]';
    }

    if (value.includes('pant')) {
      return 'bg-[#E11D2E]';
    }

    if (value.includes('cap')) {
      return 'bg-[#6A00FF]';
    }

    return 'bg-[#E11D2E]';
  };

  // =========================================
  // DYNAMIC CATEGORIES
  // ONLY DATABASE CATEGORIES ARE SHOWN
  // =========================================
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        storeItems
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];

    return ['All Merch', ...uniqueCategories];
  }, [storeItems]);

  // =========================================
  // CART LOGIC
  // =========================================
  const addToLocalCart = (item) => {
    const existingCart = JSON.parse(
      localStorage.getItem('vinylr_cart') || '[]'
    );

    const cartItem = {
      ...item,
      productType: 'MERCH',
      cartKey: `merch-${item.id}`,
    };

    const existingItem = existingCart.find(
      (i) => i.cartKey === cartItem.cartKey
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        ...cartItem,
        quantity: 1,
      });
    }

    localStorage.setItem(
      'vinylr_cart',
      JSON.stringify(existingCart)
    );

    window.dispatchEvent(new Event('cartUpdated'));
  };

  // =========================================
  // BUY NOW
  // =========================================
  const handleBuyNow = (item) => {
    if (item.stock <= 0) {
      toast.error('Item is currently Sold Out.');
      return;
    }

    addToLocalCart(item);

    toast.success('Proceeding to Checkout!', {
      style: {
        background: '#E11D2E',
        color: '#fff',
      },
    });

    setTimeout(() => {
      navigate('/cart');
    }, 600);
  };

  // =========================================
  // ADD TO CART
  // =========================================
  const handleAddToCart = (item) => {
    if (item.stock <= 0) {
      toast.error('Item is currently Sold Out.', {
        style: {
          background: '#120E14',
          color: '#fff',
          border: '1px solid #E11D2E',
        },
      });

      return;
    }

    addToLocalCart(item);

    toast.success(`${item.title} added to cart!`, {
      style: {
        background: '#120E14',
        color: '#fff',
        border: '1px solid #E11D2E',
      },
    });
  };

  // =========================================
  // SEARCH OUTSIDE CLICK
  // =========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // =========================================
  // SEARCH RECOMMENDATIONS
  // =========================================
  const searchRecommendations = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    return storeItems
      .filter((item) =>
        item.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery, storeItems]);

  // =========================================
  // FILTERED PRODUCTS
  // =========================================
  const filteredItems = useMemo(() => {
    return storeItems.filter((item) => {
      const matchCategory =
        activeCategory === 'All Merch' ||
        String(item.category).toLowerCase() ===
          String(activeCategory).toLowerCase();

      const matchSearch =
        item.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [
    storeItems,
    activeCategory,
    searchQuery,
  ]);

  // =========================================
  // UI
  // =========================================
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pt-24 pb-12 font-['Oswald'] relative overflow-hidden">

      <Toaster position="top-right" />

      {/* =========================================
          BACKGROUND
          ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[10%] right-[5%] w-[900px] h-[900px] bg-[#E11D2E] rounded-full blur-[200px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#6A00FF] rounded-full blur-[200px]"
        />

        <div className="absolute top-[15%] right-[-5%] scale-[1.1] opacity-70">
          <FloatingVinyl />
        </div>

      </div>

      {/* =========================================
          MAIN CONTAINER
          ========================================= */}
      <div className="max-w-[1600px] mx-auto px-6 relative z-10 flex gap-8">

        {/* =========================================
            LEFT SIDEBAR
            ========================================= */}
        <aside className="w-64 hidden lg:block flex-shrink-0">

          <div className="bg-[#120E14]/80 backdrop-blur-xl border border-[#E11D2E]/20 rounded-2xl p-6 sticky top-28 shadow-[0_0_30px_rgba(225,29,46,0.1)]">

            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">

              <div className="flex items-center gap-2 text-white">

                <SlidersHorizontal className="w-5 h-5 text-[#E11D2E]" />

                <h2 className="text-lg font-bold tracking-widest uppercase">
                  Filters
                </h2>

              </div>

              <button
                onClick={() => {
                  setActiveCategory('All Merch');
                  setSearchQuery('');
                }}
                className="text-[#E11D2E] text-xs font-semibold hover:text-white transition-colors"
              >
                Clear All
              </button>

            </div>

            {/* =========================================
                DYNAMIC MERCH CATEGORIES
                ========================================= */}
            <div className="mb-8">

              <h3 className="text-xs font-bold text-[#A09CA3] tracking-widest uppercase mb-4">
                Merch Type
              </h3>

              <div className="space-y-4">

                {categories.map((cat) => (

                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setActiveCategory(cat)}
                  >

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        activeCategory === cat
                          ? 'border-[#E11D2E] shadow-[0_0_10px_rgba(225,29,46,0.5)]'
                          : 'border-white/20 group-hover:border-[#E11D2E]/50'
                      }`}
                    >

                      <div
                        className={`w-2 h-2 rounded-full bg-[#E11D2E] transition-all ${
                          activeCategory === cat
                            ? 'scale-100'
                            : 'scale-0'
                        }`}
                      />

                    </div>

                    <span
                      className={`text-sm tracking-wide transition-colors ${
                        activeCategory === cat
                          ? 'text-white font-medium'
                          : 'text-[#A09CA3] group-hover:text-white'
                      }`}
                    >
                      {cat}
                    </span>

                  </label>

                ))}

              </div>

            </div>

          </div>

        </aside>

        {/* =========================================
            MAIN CONTENT
            ========================================= */}
        <main className="flex-1 min-h-screen">

          <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">

            {/* HEADING */}
            <div>

              <h1 className="font-['Orbitron'] text-4xl sm:text-5xl font-black italic tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E11D2E] to-[#8B0E1A] drop-shadow-[0_8px_15px_rgba(225,29,46,0.6)]">
                VINYLR FAN MARKET
              </h1>

              <p className="text-[#A09CA3] font-light tracking-wide mt-2">
                Exclusive apparel, collectibles, and tour merchandise.
              </p>

            </div>

            {/* SEARCH */}
            <div
              className="relative w-full xl:w-96"
              ref={searchRef}
            >

              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />

              <input
                type="text"
                placeholder="Search merch drops..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowRecommendations(true);
                }}
                onFocus={() => setShowRecommendations(true)}
                className="w-full bg-[#120E14]/80 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#E11D2E] transition-all shadow-lg uppercase tracking-widest font-light"
              />

              {/* SEARCH DROPDOWN */}
              <AnimatePresence>

                {showRecommendations &&
                  searchRecommendations.length > 0 && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#120E14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >

                      {searchRecommendations.map((item) => (

                        <div
                          key={item.id}
                          onClick={() => {
                            setSearchQuery(item.title);
                            setShowRecommendations(false);
                          }}
                          className="px-4 py-3 hover:bg-[#E11D2E]/10 cursor-pointer flex items-center gap-3 transition-colors border-b border-white/5 last:border-0 group"
                        >

                          <Search className="w-4 h-4 text-[#A09CA3] group-hover:text-[#E11D2E] transition-colors" />

                          <div>

                            <p className="text-white text-sm tracking-wide font-medium">
                              {item.title}
                            </p>

                            <p className="text-[#A09CA3] text-xs uppercase tracking-widest">
                              {item.category}
                            </p>

                          </div>

                        </div>

                      ))}

                    </motion.div>

                  )}

              </AnimatePresence>

            </div>

          </div>

          {/* =========================================
              LOADING
              ========================================= */}
          {isLoading ? (

            <div className="w-full flex flex-col items-center justify-center py-32">

              <Loader2 className="w-12 h-12 text-[#E11D2E] animate-spin mb-4" />

              <p className="text-[#A09CA3] tracking-widest uppercase font-light animate-pulse">
                Syncing with Backend Database...
              </p>

            </div>

          ) : filteredItems.length === 0 ? (

            /* =========================================
                NO PRODUCTS
                ========================================= */
            <div className="flex flex-col items-center justify-center py-20 bg-[#120E14]/50 backdrop-blur-md rounded-[2rem] border border-white/5">

              <Search className="w-12 h-12 text-[#A09CA3] mb-4 opacity-50" />

              <p className="text-xl tracking-widest uppercase font-light text-white">
                {storeItems.length === 0
                  ? 'No merchandise available'
                  : `No drops match "${searchQuery}"`}
              </p>

              {storeItems.length > 0 && (

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All Merch');
                  }}
                  className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-bold uppercase tracking-widest transition-colors"
                >
                  Clear Filters
                </button>

              )}

            </div>

          ) : (

            /* =========================================
                PRODUCT GRID
                ========================================= */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
            >

              <AnimatePresence>

                {filteredItems.map((item) => {

                  const isSoldOut = item.stock <= 0;

                  return (

                    <motion.div
    layout
    key={item.id}
    onClick={() => navigate(`/merch/${item.id}`)}
    initial={{
        opacity: 0,
        scale: 0.9,
    }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className={`bg-[#120E14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col group transition-all ${
                        isSoldOut
                          ? 'opacity-60'
                          : 'hover:border-[#E11D2E]/50 hover:shadow-[0_0_30px_rgba(225,29,46,0.15)]'
                      }`}
                    >

                      {/* IMAGE */}
                      <div className="w-full aspect-[4/5] bg-[#1A1A1A] rounded-xl relative mb-4 overflow-hidden border border-white/5">

                        {item.imageUrl ? (

                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center text-white/20 text-sm uppercase tracking-widest">
                            Image
                          </div>

                        )}

                        {/* CATEGORY BADGE */}
                        <div
                          className={`absolute top-3 left-3 ${
                            item.badgeColor
                          } text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg`}
                        >
                          {item.category}
                        </div>

                        {/* HEART */}
                        <button className="absolute top-3 right-3 text-white/50 hover:text-[#E11D2E] transition-colors">

                          <Heart className="w-5 h-5" />

                        </button>

                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 flex flex-col">

                        <h3 className="text-lg font-bold text-white tracking-wide">
                          {item.title}
                        </h3>

                        <p className="text-sm text-[#A09CA3] font-light mb-2">
                          {item.brand}
                        </p>

                        {/* STOCK */}
                        <div className="mb-4 mt-1">

                          {isSoldOut ? (

                            <span className="text-xs font-bold text-[#E11D2E] tracking-widest uppercase flex items-center gap-1">

                              <span className="w-2 h-2 rounded-full bg-[#E11D2E] animate-pulse" />

                              Sold Out

                            </span>

                          ) : (

                            <span className="text-xs font-bold text-green-400 tracking-widest uppercase flex items-center gap-1">

                              <span className="w-2 h-2 rounded-full bg-green-400" />

                              In Stock

                            </span>

                          )}

                        </div>

                        {/* PRICE */}
                        <div className="text-right mb-4">

                          <span className="text-2xl font-bold text-[#E11D2E] tracking-wider">
                            ₹{item.price}
                          </span>

                        </div>

                        {/* BUTTONS */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">

                          <button
                            onClick={(e) => {
    e.stopPropagation();
    handleBuyNow(item);
}}
                            disabled={isSoldOut}
                            className={`w-full py-2.5 rounded-lg text-white text-sm font-bold uppercase tracking-widest transition-all ${
                              isSoldOut
                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] hover:shadow-[0_0_15px_rgba(225,29,46,0.4)]'
                            }`}
                          >
                            Buy Now
                          </button>

                          <button
                            onClick={(e) => {
    e.stopPropagation();
    handleAddToCart(item);
}}
                            disabled={isSoldOut}
                            className={`w-full py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                              isSoldOut
                                ? 'bg-transparent border border-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-[#0B0B0F] border border-white/20 text-[#A09CA3] hover:text-white hover:border-white/60'
                            }`}
                          >
                            Add To Cart
                          </button>

                        </div>

                      </div>

                    </motion.div>

                  );

                })}

              </AnimatePresence>

            </motion.div>

          )}

        </main>

      </div>

    </div>
  );
};

export default Merch;
