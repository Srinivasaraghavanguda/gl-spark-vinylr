import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { catalogService } from '../api/catalogService';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

// --- FALLBACK MOCK DATA (Includes 'stock' for inventory logic) ---
const FALLBACK_MERCH = [
  { id: 1, category: "Lightsticks", title: "Official Tour Lightstick", brand: "VinylR Merch", stock: 150, price: 3499, badgeColor: "bg-[#6A00FF]" },
  { id: 2, category: "T-Shirts", title: "Graphic Drop Tee", brand: "VinylR Apparel", stock: 0, price: 1499, badgeColor: "bg-[#E11D2E]" }, // Sold Out Example
  { id: 3, category: "Hoodies", title: "Heavyweight Zip Hoodie", brand: "Exclusive", stock: 45, price: 2999, badgeColor: "bg-[#4A00E0]" },
  { id: 4, category: "Photocards", title: "Holo Card Set (Vol 1)", brand: "Collectibles", stock: 300, price: 499, badgeColor: "bg-[#8B0E1A]" },
  { id: 5, category: "Plushies", title: "Mascot Bear Plush", brand: "Toys", stock: 20, price: 1999, badgeColor: "bg-[#6A00FF]" },
  { id: 6, category: "Pants", title: "Cargo Track Pants", brand: "VinylR Apparel", stock: 8, price: 2499, badgeColor: "bg-[#E11D2E]" },
  { id: 7, category: "Exclusive", title: "VIP Tour Jacket", brand: "Limited Edition", stock: 0, price: 5999, badgeColor: "bg-[#4A00E0]" },
  { id: 8, category: "Portraits", title: "Signed Canvas Portrait", brand: "Art", stock: 3, price: 1299, badgeColor: "bg-[#8B0E1A]" },
];

const CATEGORIES = ["All Merch", "Lightsticks", "T-Shirts", "Pants", "Hoodies", "Plushies", "Portraits", "Photocards", "Exclusive", "Stickers"];

const Merch = () => {
  const navigate = useNavigate();

  // Data States
  const [storeItems, setStoreItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering & Search States
  const [activeCategory, setActiveCategory] = useState("All Merch");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const searchRef = useRef(null);

  // Fetch Data on Mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await catalogService.getAllMerch();
        setStoreItems(data.map(item => ({
          ...item,
          title: item.title || item.name,
          brand: item.brand || item.variant || 'VinylR Merch'
        })));
      } catch (error) {
        setStoreItems(FALLBACK_MERCH);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    fetchCatalog();
  }, []);

  // --- CART LOGIC ---
  const handleBuyNow = (item) => {
    if (item.stock === 0) return;
    addToLocalCart(item);
    toast.success('Proceeding to Checkout!', { style: { background: '#E11D2E', color: '#fff' } });
    setTimeout(() => navigate('/cart'), 600);
  };
  
  const handleAddToCart = (item) => {
    if (item.stock === 0) {
      toast.error('Item is currently Sold Out.', { style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
      return;
    }
    addToLocalCart(item);
    toast.success(`${item.title} added to cart!`, { style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
  };

  const addToLocalCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem('vinylr_cart') || '[]');
    const cartItem = { ...item, productType: 'MERCH', cartKey: `merch-${item.id}` };
    const existingItem = existingCart.find(i => i.cartKey === cartItem.cartKey);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...cartItem, quantity: 1 });
    }
    localStorage.setItem('vinylr_cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated')); // Notifies Navbar
  };

  // --- SEARCH BAR LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecommendations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchRecommendations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return storeItems
      .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, storeItems]);

  const filteredItems = useMemo(() => {
    return storeItems.filter(item => {
      const matchCategory = activeCategory === "All Merch" || item.category === activeCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [storeItems, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pt-24 pb-12 font-['Oswald'] relative overflow-hidden">
      <Toaster position="top-right" />

      {/* =========================================
          BACKGROUND: THICK SMOKE & FLOATING VINYL
          ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[5%] w-[900px] h-[900px] bg-[#E11D2E] rounded-full blur-[200px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#6A00FF] rounded-full blur-[200px]" />
        
        {/* Cinematic Panned Vinyl Background */}
        <div className="absolute top-[15%] right-[-5%] scale-[1.1] opacity-70">
          <FloatingVinyl />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 flex gap-8">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <div className="bg-[#120E14]/80 backdrop-blur-xl border border-[#E11D2E]/20 rounded-2xl p-6 sticky top-28 shadow-[0_0_30px_rgba(225,29,46,0.1)]">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white">
                <SlidersHorizontal className="w-5 h-5 text-[#E11D2E]" />
                <h2 className="text-lg font-bold tracking-widest uppercase">Filters</h2>
              </div>
              <button onClick={() => { setActiveCategory("All Merch"); setSearchQuery(""); }} className="text-[#E11D2E] text-xs font-semibold hover:text-white transition-colors">Clear All</button>
            </div>

            {/* Merch Category Filters */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[#A09CA3] tracking-widest uppercase mb-4">Merch Type</h3>
              <div className="space-y-4">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveCategory(cat)}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${activeCategory === cat ? 'border-[#E11D2E] shadow-[0_0_10px_rgba(225,29,46,0.5)]' : 'border-white/20 group-hover:border-[#E11D2E]/50'}`}>
                      <div className={`w-2 h-2 rounded-full bg-[#E11D2E] transition-all ${activeCategory === cat ? 'scale-100' : 'scale-0'}`} />
                    </div>
                    <span className={`text-sm tracking-wide transition-colors ${activeCategory === cat ? 'text-white font-medium' : 'text-[#A09CA3] group-hover:text-white'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: FAN MARKET */}
        <main className="flex-1 min-h-screen">
          <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            
            {/* Glossy Red Shiny Heading */}
            <div>
              <h1 className="font-['Orbitron'] text-4xl sm:text-5xl font-black italic tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E11D2E] to-[#8B0E1A] drop-shadow-[0_8px_15px_rgba(225,29,46,0.6)]">
                VINYLR FAN MARKET
              </h1>
              <p className="text-[#A09CA3] font-light tracking-wide mt-2">Exclusive apparel, collectibles, and tour merchandise.</p>
            </div>

            {/* LIVE SEARCH BAR */}
            <div className="relative w-full xl:w-96" ref={searchRef}>
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
              <input
                type="text"
                placeholder="Search merch drops..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowRecommendations(true); }}
                onFocus={() => setShowRecommendations(true)}
                className="w-full bg-[#120E14]/80 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#E11D2E] transition-all shadow-lg uppercase tracking-widest font-light"
              />
              
              {/* Dropdown Recommendations */}
              <AnimatePresence>
                {showRecommendations && searchRecommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#120E14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {searchRecommendations.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => { setSearchQuery(item.title); setShowRecommendations(false); }}
                        className="px-4 py-3 hover:bg-[#E11D2E]/10 cursor-pointer flex items-center gap-3 transition-colors border-b border-white/5 last:border-0 group"
                      >
                        <Search className="w-4 h-4 text-[#A09CA3] group-hover:text-[#E11D2E] transition-colors" />
                        <div>
                          <p className="text-white text-sm tracking-wide font-medium">{item.title}</p>
                          <p className="text-[#A09CA3] text-xs uppercase tracking-widest">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* LOADING STATE & PRODUCT GRID */}
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-[#E11D2E] animate-spin mb-4" />
              <p className="text-[#A09CA3] tracking-widest uppercase font-light animate-pulse">Syncing with Backend Database...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#120E14]/50 backdrop-blur-md rounded-[2rem] border border-white/5">
              <Search className="w-12 h-12 text-[#A09CA3] mb-4 opacity-50" />
              <p className="text-xl tracking-widest uppercase font-light text-white">No drops match "{searchQuery}"</p>
              <button onClick={() => setSearchQuery("")} className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-bold uppercase tracking-widest transition-colors">
                Clear Search
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              <AnimatePresence>
                {filteredItems.map((item) => {
                  const isSoldOut = item.stock === 0;

                  return (
                    <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className={`bg-[#120E14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col group transition-all ${isSoldOut ? 'opacity-60' : 'hover:border-[#E11D2E]/50 hover:shadow-[0_0_30px_rgba(225,29,46,0.15)]'}`}>
                      
                      {/* BLANK IMAGE PLACEHOLDER */}
                      <div className="w-full aspect-[4/5] bg-[#1A1A1A] rounded-xl relative mb-4 overflow-hidden border border-white/5">
                        <div className={`absolute top-3 left-3 ${item.badgeColor || 'bg-[#E11D2E]'} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg`}>
                          {item.category}
                        </div>
                        <button className="absolute top-3 right-3 text-white/50 hover:text-[#E11D2E] transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white tracking-wide">{item.title}</h3>
                        <p className="text-sm text-[#A09CA3] font-light mb-2">{item.brand}</p>
                        
                        {/* INVENTORY STATUS */}
                        <div className="mb-4 mt-1">
                          {isSoldOut ? (
                            <span className="text-xs font-bold text-[#E11D2E] tracking-widest uppercase flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#E11D2E] animate-pulse" /> Sold Out
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-green-400 tracking-widest uppercase flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-400" /> In Stock
                            </span>
                          )}
                        </div>

                        <div className="text-right mb-4">
                          <span className="text-2xl font-bold text-[#E11D2E] tracking-wider">₹{item.price}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <button 
                            onClick={() => handleBuyNow(item)}
                            disabled={isSoldOut}
                            className={`w-full py-2.5 rounded-lg text-white text-sm font-bold uppercase tracking-widest transition-all ${isSoldOut ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] hover:shadow-[0_0_15px_rgba(225,29,46,0.4)]'}`}
                          >
                            Buy Now
                          </button>
                          <button 
                            onClick={() => handleAddToCart(item)}
                            disabled={isSoldOut}
                            className={`w-full py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${isSoldOut ? 'bg-transparent border border-white/5 text-white/30 cursor-not-allowed' : 'bg-[#0B0B0F] border border-white/20 text-[#A09CA3] hover:text-white hover:border-white/60'}`}
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
