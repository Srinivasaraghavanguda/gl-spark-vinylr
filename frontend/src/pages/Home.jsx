import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ShieldCheck, Star, RefreshCcw, Lock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { catalogService } from "../api/catalogService";
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

// --- IMAGE-READY MOCK DATA ---
// To add your own images, just paste the URL/path into the 'image' field!


const FEATURES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: ShieldCheck, title: "Exclusive Drops", desc: "Limited edition merch" },
  { icon: Star, title: "Premium Quality", desc: "100% authentic products" },
  { icon: RefreshCcw, title: "Easy Returns", desc: "Hassle free returns" },
  { icon: Lock, title: "Secure Payments", desc: "Safe & encrypted" }
];


const TOP_ARTISTS = [
  { id: 1, name: "The Weeknd", tag: "Pop / R&B", image: "" },
  { id: 2, name: "RaGaForge", tag: "Cinematic / Score", image: "" },
  { id: 3, name: "Cosmic Wave", tag: "Electronic", image: "" },
  { id: 4, name: "The Synthetics", tag: "Synthwave", image: "" },
  { id: 5, name: "DJ Horizon", tag: "House", image: "" },
  { id: 6, name: "Miles & Co.", tag: "Jazz", image: "" },
  { id: 7, name: "Symphony X", tag: "Classical", image: "" }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
const [sliderItems, setSliderItems] = useState([]);
const [topSales, setTopSales] = useState([]);

  // Auto-rotate slider every 3.5 seconds
  useEffect(() => {

    const loadAlbums = async () => {

    try {

        const albums = await catalogService.getAllAlbums();

if (albums && albums.length > 0) {

    setSliderItems(albums.slice(0, 5));

    setTopSales(albums);

}

    } catch (err) {

        console.error(err);

    }

};

    loadAlbums();

}, []);

useEffect(() => {

    if (sliderItems.length === 0) return;

    const timer = setInterval(() => {

        setCurrentSlide((prev) => (prev + 1) % sliderItems.length);

    }, 3500);

    return () => clearInterval(timer);

}, [sliderItems]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pt-20 font-['Oswald'] overflow-x-hidden relative">
      
      {/* =========================================
          BACKGROUND: THICK SMOKE & FLOATING VINYL
          ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Thicker Red Smoke */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[10%] right-[5%] w-[900px] h-[900px] bg-[#E11D2E] rounded-full blur-[200px]" 
        />
        {/* Thicker Purple Smoke */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#6A00FF] rounded-full blur-[200px]" 
        />
        
        {/* The Slope-Panned Spinning Vinyl - Positioned behind the slider */}
        <div className="absolute top-[20%] right-[-10%] scale-[1.2] opacity-80">
          <FloatingVinyl />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col pt-12 pb-6">
        
        {/* =========================================
            MAIN HERO & ROTATING SLIDER
            ========================================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16 min-h-[500px]">
          
          {/* Left Side: Typography */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
              className="font-['Orbitron'] text-[100px] sm:text-[130px] leading-none font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#B146FF] to-[#6A00FF] drop-shadow-[0_0_30px_rgba(106,0,255,0.4)] mb-4"
            >
              VINYLR
            </motion.h1>

            <motion.h2 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-2xl sm:text-3xl tracking-[0.2em] font-bold text-white mb-6 uppercase"
            >
              Music. Merch. Moments.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#A09CA3] text-lg sm:text-xl max-w-lg mb-10 font-light leading-relaxed tracking-wide"
            >
              Discover timeless music, exclusive merchandise, and unforgettable experiences — all in one place.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <Link to="/trending" className="px-10 py-4 rounded-xl font-bold text-lg text-white bg-[#E11D2E] hover:bg-[#8B0E1A] shadow-[0_0_20px_rgba(225,29,46,0.4)] transition-all uppercase tracking-widest">
                Explore Now
              </Link>
              <Link to="/merch" className="px-10 py-4 rounded-xl font-bold text-lg text-white border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/10 transition-all uppercase tracking-widest">
                Shop Merch
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Automated Image Slider */}
          <div className="w-full lg:w-1/2 h-[500px] flex items-center justify-center relative perspective-[1200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 200, rotateY: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, x: -200, rotateY: 30, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-[320px] h-[450px] sm:w-[400px] rounded-3xl border border-white/10 bg-gradient-to-br from-[#8B0E1A] to-[#E11D2E] shadow-2xl shadow-[#E11D2E]/50 flex flex-col relative overflow-hidden group"
              >
                {/* IMAGE RENDERING LOGIC */}
<div className="absolute inset-0 z-0">

    {sliderItems[currentSlide]?.imageUrl ? (

        <img
            src={sliderItems[currentSlide].imageUrl}
            alt={sliderItems[currentSlide].title}
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
        />

    ) : (

        <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center border-4 border-dashed border-white/10">

            <span className="text-white/30 text-sm font-bold uppercase">
                No Image
            </span>

        </div>

    )}

</div>

{/* Glossy Overlay */}
<div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/90 via-transparent to-white/10 pointer-events-none z-10" />

<span className="absolute font-['Orbitron'] text-9xl text-white/5 font-black italic -rotate-12 select-none z-10 top-10 right-0">
    V
</span>

<div className="relative z-20 mt-auto p-8 text-center">

    <h3 className="text-3xl font-bold text-white tracking-widest uppercase drop-shadow-lg">

        {sliderItems[currentSlide]?.title}

    </h3>

    <p className="text-[#B146FF] text-lg mt-2">

        {sliderItems[currentSlide]?.artist}

    </p>

</div>

</motion.div>

</AnimatePresence>

<div className="absolute -bottom-8 flex items-center justify-center gap-3 w-full">

    {sliderItems.map((_, index) => (

        <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                    ? "w-10 bg-[#E11D2E] shadow-[0_0_15px_rgba(225,29,46,0.8)]"
                    : "w-2 bg-white/20"
            }`}
        />

    ))}

</div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="w-full border-t border-white/10 py-10 mb-8 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-[#E11D2E]/10 flex items-center justify-center group-hover:bg-[#E11D2E]/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-[#E11D2E]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{feature.title}</h4>
                  <p className="text-[10px] text-[#A09CA3] tracking-wide">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          DYNAMIC FOOTER: INFINITE MARQUEES
          ========================================= */}
      <div className="w-full bg-[#060818]/60 border-t border-white/5 py-12 backdrop-blur-md relative overflow-hidden z-10">
        
        {/* Row 1: Top Sales */}
        <div className="mb-12">
          <div className="flex items-center gap-3 px-10 mb-6">
            <Flame className="w-5 h-5 text-[#E11D2E]" />
            <h3 className="text-xl font-bold text-white tracking-widest uppercase">Top Sales of the Week</h3>
          </div>
          
          <div className="w-full overflow-hidden whitespace-nowrap flex group">
            <motion.div 
              className="flex gap-6 w-max pl-6"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...topSales, ...topSales].map((item, index) => (
                <div key={`sales-${index}`} className="w-72 h-24 bg-[#120E14] border border-white/10 rounded-2xl p-3 flex items-center gap-4 flex-shrink-0 hover:border-[#E11D2E]/50 transition-colors cursor-pointer">
                  
                  {/* IMAGE RENDERING LOGIC */}
                  <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] shadow-inner flex-shrink-0 relative overflow-hidden border border-white/5">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-white/30 uppercase font-bold text-center">Img</div>
                    )}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[#E11D2E] text-[10px] font-bold uppercase tracking-widest mb-1">{item.genre}</span>
                    <h4 className="text-white text-sm font-semibold truncate tracking-wide">{item.title}</h4>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Row 2: Top Artists */}
        <div>
          <div className="flex items-center gap-3 px-10 mb-6">
            <Star className="w-5 h-5 text-[#B146FF]" />
            <h3 className="text-xl font-bold text-white tracking-widest uppercase">Top Artists & Bands</h3>
          </div>
          
          <div className="w-full overflow-hidden whitespace-nowrap flex group">
            <motion.div 
              className="flex gap-6 w-max pl-6"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            >
              {[...TOP_ARTISTS, ...TOP_ARTISTS].map((artist, index) => (
                <div key={`artist-${index}`} className="w-72 h-24 bg-[#120E14] border border-white/10 rounded-2xl p-3 flex items-center gap-4 flex-shrink-0 hover:border-[#B146FF]/50 transition-colors cursor-pointer">
                  
                  {/* IMAGE RENDERING LOGIC */}
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] shadow-inner flex-shrink-0 relative overflow-hidden border border-white/5">
                    {artist.image ? (
                      <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-[8px] text-white/30 uppercase font-bold text-center">Img</div>
                    )}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[#B146FF] text-[10px] font-bold uppercase tracking-widest mb-1">{artist.tag}</span>
                    <h4 className="text-white text-sm font-semibold truncate tracking-wide">{artist.name}</h4>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;