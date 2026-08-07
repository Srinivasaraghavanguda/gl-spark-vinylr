import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { catalogService } from '../api/catalogService';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

// --- FALLBACK MOCK DATA (Includes 'stock' for inventory logic) ---
const FALLBACK_ITEMS = [
  { id: 1, type: "Vinyl", collection: "New Releases", genre: "Rock", title: "RaGaForge OST", artist: "Cinematic Ensemble", stock: 15, price: 1999, badgeColor: "bg-[#6A00FF]" },
  { id: 2, type: "CD", collection: "Best Sellers", genre: "Pop", title: "Midnight Drive", artist: "The Synthetics", stock: 0, price: 599, badgeColor: "bg-[#E11D2E]" }, // Sold Out Example
  { id: 3, type: "Digital", collection: "Exclusive", genre: "Hip Hop", title: "Analog Echoes", artist: "VinylR Originals", stock: 999, price: 299, badgeColor: "bg-[#4A00E0]" },
  { id: 4, type: "Box Sets", collection: "Pre-Orders", genre: "K-Pop", title: "Neon Pulse", artist: "Cosmic Wave", stock: 5, price: 2499, badgeColor: "bg-[#8B0E1A]" },
];

const FORMAT_TABS = ['All Albums', 'Vinyl', 'CD', 'Digital', 'Box Sets'];
const SIDEBAR_CATEGORIES = ["All Albums", "Pre-Orders", "New Releases", "Best Sellers", "Exclusive"];
const GENRES = ["Rock", "Pop", "Hip Hop", "K-Pop", "Electronic", "Cinematic"];

const Albums = () => {

    const navigate = useNavigate();

    const openAlbum = (item) => {
        navigate(`/albums/${item.id}`);
    };

    // Data & Loading States

  // Data & Loading States
  const [storeItems, setStoreItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering States
  const [activeFormat, setActiveFormat] = useState("All Albums");
  const [activeCategory, setActiveCategory] = useState("All Albums");
  const [selectedGenres, setSelectedGenres] = useState([]);

  // FETCH DATA FROM BACKEND ON MOUNT
useEffect(() => {
  const fetchCatalog = async () => {
    try {
      const data = await catalogService.getAllAlbums();

      const mappedAlbums = data.map((album) => ({
        ...album,
        type: "Vinyl",
        collection: "New Releases",
        badgeColor: "bg-[#E11D2E]"
      }));

      setStoreItems(mappedAlbums);
    } catch (error) {
      console.warn("Backend unreachable. Loading fallback mock data.");
      setStoreItems(FALLBACK_ITEMS);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  fetchCatalog();
}, []);
  // --- CART & NAVIGATION LOGIC ---
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

  // Helper function to update Cart and notify Navbar
  const addToLocalCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem('vinylr_cart') || '[]');
    const cartItem = { ...item, productType: 'ALBUM', cartKey: `album-${item.id}` };
    const existingItem = existingCart.find(i => i.cartKey === cartItem.cartKey);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...cartItem, quantity: 1 });
    }
    
    localStorage.setItem('vinylr_cart', JSON.stringify(existingCart));
    // Dispatch custom event so the Navbar instantly updates its counter badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const clearFilters = () => {
    setActiveFormat("All Albums");
    setActiveCategory("All Albums");
    setSelectedGenres([]);
  };

  // The Active Filtering Engine
  const filteredItems = useMemo(() => {
    return storeItems.filter(item => {
      const matchFormat = activeFormat === "All Albums" || item.type === activeFormat;
      const matchCategory = activeCategory === "All Albums" || item.collection === activeCategory;
      const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(item.genre);
      return matchFormat && matchCategory && matchGenre;
    });
  }, [storeItems, activeFormat, activeCategory, selectedGenres]);

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
          <div className="bg-[#120E14]/80 backdrop-blur-xl border border-[#E11D2E]/20 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white">
                <SlidersHorizontal className="w-5 h-5 text-[#E11D2E]" />
                <h2 className="text-lg font-bold tracking-widest uppercase">Filters</h2>
              </div>
              <button onClick={clearFilters} className="text-[#E11D2E] text-xs font-semibold hover:text-white transition-colors">Clear All</button>
            </div>

            {/* Category Filters */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[#A09CA3] tracking-widest uppercase mb-4">Category</h3>
              <div className="space-y-4">
                {SIDEBAR_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveCategory(cat)}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${activeCategory === cat ? 'border-[#E11D2E] shadow-[0_0_10px_rgba(225,29,46,0.5)]' : 'border-white/20 group-hover:border-[#E11D2E]/50'}`}>
                      <div className={`w-2 h-2 rounded-full bg-[#E11D2E] transition-all ${activeCategory === cat ? 'scale-100' : 'scale-0'}`} />
                    </div>
                    <span className={`text-sm tracking-wide transition-colors ${activeCategory === cat ? 'text-white font-medium' : 'text-[#A09CA3] group-hover:text-white'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Genre Filters */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[#A09CA3] tracking-widest uppercase mb-4">Genre</h3>
              <div className="space-y-4">
                {GENRES.map((genre) => {
                  const isChecked = selectedGenres.includes(genre);
                  return (
                    <label key={genre} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleGenre(genre)}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${isChecked ? 'bg-[#E11D2E] border-[#E11D2E] shadow-[0_0_10px_rgba(225,29,46,0.5)]' : 'border border-white/20 group-hover:border-[#E11D2E]/50 bg-transparent'}`}>
                        <Check className={`w-3 h-3 text-white transition-transform ${isChecked ? 'scale-100' : 'scale-0'}`} strokeWidth={4} />
                      </div>
                      <span className={`text-sm tracking-wide transition-colors ${isChecked ? 'text-white font-medium' : 'text-[#A09CA3] group-hover:text-white'}`}>{genre}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: CATALOG */}
        <main className="flex-1 min-h-screen">
          <div className="mb-8">
            {/* Glossy Red Shiny Heading */}
            <h1 className="font-['Orbitron'] text-4xl sm:text-5xl font-black italic tracking-wider uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E11D2E] to-[#8B0E1A] drop-shadow-[0_8px_15px_rgba(225,29,46,0.6)]">
              Vinyl Album Store
            </h1>
            <div className="w-full bg-[#120E14]/80 backdrop-blur-md border border-white/10 rounded-xl p-1.5 flex gap-1 shadow-lg shadow-black/50">
              {FORMAT_TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveFormat(tab)} className={`flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-300 ${activeFormat === tab ? 'bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] text-white shadow-[0_0_15px_rgba(225,29,46,0.4)]' : 'text-[#A09CA3] hover:text-white hover:bg-white/5'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING STATE & PRODUCT GRID */}
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-[#E11D2E] animate-spin mb-4" />
              <p className="text-[#A09CA3] tracking-widest uppercase font-light animate-pulse">Syncing with Backend Database...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#A09CA3]">
              <p className="text-xl tracking-widest uppercase font-light">No items match your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-[#E11D2E] font-bold hover:text-white transition-colors">CLEAR FILTERS</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              <AnimatePresence>
                {filteredItems.map((item) => {
                  const isSoldOut = item.stock === 0;

                  return (
                    <motion.div layout key={item.id} onClick={() => openAlbum(item)} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className={`cursor-pointer bg-[#120E14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col group transition-all ${isSoldOut ? 'opacity-60' : 'hover:border-[#E11D2E]/50 hover:shadow-[0_0_30px_rgba(225,29,46,0.15)]'}`}>
                      
                      {/* BLANK IMAGE PLACEHOLDER */}
                      <div className="w-full aspect-[4/5] bg-[#1A1A1A] rounded-xl relative mb-4 overflow-hidden border border-white/5">
                        <div className={`absolute top-3 left-3 ${item.badgeColor || 'bg-[#E11D2E]'} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg`}>
                          {item.collection === 'All Albums' ? item.type : item.collection}
                        </div>
                        <button className="absolute top-3 right-3 text-white/50 hover:text-[#E11D2E] transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white tracking-wide">{item.title}</h3>
                        <p className="text-sm text-[#A09CA3] font-light mb-2">{item.artist}</p>
                        
                        {/* INVENTORY STATUS INSTEAD OF RATINGS */}
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
                            onClick={(e) => { e.stopPropagation(); handleBuyNow(item);}}
                            disabled={isSoldOut}
                            className={`w-full py-2.5 rounded-lg text-white text-sm font-bold uppercase tracking-widest transition-all ${isSoldOut ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] hover:shadow-[0_0_15px_rgba(225,29,46,0.4)]'}`}
                          >
                            Buy Now
                          </button>
                          <button 
                            onClick={(e) => {e.stopPropagation(); handleAddToCart(item);}}
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

export default Albums;
