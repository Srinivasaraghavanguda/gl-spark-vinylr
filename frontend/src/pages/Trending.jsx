import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Music, TrendingUp, BarChart3, Star, Disc, Activity, Loader2 } from 'lucide-react';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';
import api from '../api/axiosConfig';

// --- FALLBACK MOCK DATA (In case backend is offline) ---
const FALLBACK_GLOBAL = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  rank: i + 1,
  title: `Global Hit Anthem ${i + 1}`,
  artist: `Artist ${String.fromCharCode(65 + i)}`,
  streams: (Math.random() * 40 + 10).toFixed(1) + "M",
  duration: `0${Math.floor(Math.random() * 2) + 2}:${Math.floor(Math.random() * 40) + 10}`,
  cover: ""
}));

const FALLBACK_VINYLR = [
  { id: 1, rank: 1, title: "RaGaForge OST (Deluxe)", artist: "Cinematic Ensemble", sales: "12,450" },
  { id: 2, rank: 2, title: "Midnight Drive LP", artist: "The Synthetics", sales: "9,820" },
  { id: 3, rank: 3, title: "Neon Pulse Boxset", artist: "Cosmic Wave", sales: "8,104" },
  { id: 4, rank: 4, title: "Analog Echoes", artist: "VinylR Originals", sales: "5,430" },
  { id: 5, rank: 5, title: "Deep House Sessions", artist: "DJ Horizon", sales: "4,200" },
];

const FALLBACK_GENRES = [
  { name: "Cinematic", percentage: 40, color: "#BF953F" }, // Gold
  { name: "Rock", percentage: 25, color: "#C0C0C0" },      // Silver
  { name: "Pop", percentage: 15, color: "#E11D2E" },      // Crimson
  { name: "Electronic", percentage: 12, color: "#B146FF" },// Purple
  { name: "Hip Hop", percentage: 8, color: "#4A00E0" },    // Deep Blue
];

const Trending = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Backend Data
  const [globalTop, setGlobalTop] = useState([]);
  const [vinylrTop, setVinylrTop] = useState([]);
  const [genreData, setGenreData] = useState([]);

  // --- FETCH FROM SPRING BOOT TRENDING SERVICE WITH AUTO-REFRESH ---
  useEffect(() => {
    const fetchTrendingData = async (isInitialLoad = false) => {
      try {
        const [globalRes, vinylrRes, genreRes] = await Promise.all([
          api.get('/trending/itunes-global'),
          api.get('/trending/vinylr-top'),
          api.get('/trending/genres')
        ]);
        
        setGlobalTop(globalRes.data || []);
        setVinylrTop(vinylrRes.data || []);
        setGenreData(genreRes.data || []);
      } catch (error) {
        console.warn("Trending Backend Unreachable. Loading Fallbacks.", error);
        setGlobalTop(prev => prev.length ? prev : FALLBACK_GLOBAL);
        setVinylrTop(prev => prev.length ? prev : FALLBACK_VINYLR);
        setGenreData(prev => prev.length ? prev : FALLBACK_GENRES);
      } finally {
        if (isInitialLoad) {
          setTimeout(() => setIsLoading(false), 800); 
        }
      }
    };
    
    // Initial fetch on page mount
    fetchTrendingData(true);

    // Auto-refresh data silently every 60 seconds
    const intervalId = setInterval(() => {
      fetchTrendingData(false);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // --- CUSTOM SVG DONUT CHART LOGIC ---
  const renderDonutChart = () => {
    let cumulativePercent = 0;
    return (
      <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90 drop-shadow-[0_0_20px_rgba(191,149,63,0.4)]">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1A1A1A" strokeWidth="12" />
        {genreData.map((genre, index) => {
          const strokeDasharray = `${genre.percentage} 100`;
          const strokeDashoffset = -cumulativePercent;
          cumulativePercent += genre.percentage;
          return (
            <motion.circle
              key={index}
              cx="50" cy="50" r="40"
              fill="transparent"
              stroke={genre.color || '#BF953F'}
              strokeWidth="12"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: genre.percentage / 100 }}
              transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
              className="drop-shadow-lg"
            />
          );
        })}
        <text x="50" y="50" textAnchor="middle" dy=".3em" transform="rotate(90 50 50)" className="font-['Orbitron'] text-xs font-black fill-white tracking-widest">
          SALES
        </text>
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center font-['Oswald']">
        <Loader2 className="w-12 h-12 text-[#BF953F] animate-spin mb-4" />
        <p className="text-[#A09CA3] tracking-widest uppercase font-light animate-pulse">Syncing with Live Charts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pt-28 pb-12 font-['Oswald'] relative overflow-hidden">
      
      {/* =========================================
          BACKGROUND: THICK GOLD SMOKE & CRISP VISIBLE VINYLS
          ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Golden Volumetric Smoke Layers */}
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[0%] left-[-5%] w-[900px] h-[900px] bg-[#BF953F] rounded-full blur-[180px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-[#AA771C] rounded-full blur-[200px]" />
        
        {/* Primary Vinyl (Top Left) - High contrast & crisp glow to cut through smoke */}
        <div className="absolute top-[12%] left-[-8%] scale-[1.3] opacity-85 brightness-110 contrast-125 filter drop-shadow-[0_0_50px_rgba(252,246,186,0.3)]">
          <FloatingVinyl />
        </div>
        
        {/* Secondary Vinyl (Bottom Right) - Accent visual depth */}
        <div className="absolute bottom-[8%] right-[-4%] scale-[0.95] opacity-80 brightness-110 contrast-125 filter drop-shadow-[0_0_40px_rgba(191,149,63,0.35)]">
          <FloatingVinyl />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-10">
        
        {/* =========================================
            LEFT COL: GLOBAL TOP 20 (SILVER METALLIC AESTHETIC)
            ========================================= */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <div className="mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E0E0E0] via-[#C0C0C0] to-[#757575] flex items-center justify-center shadow-[0_0_20px_rgba(224,224,224,0.4)]">
              <Music className="w-6 h-6 text-[#0B0B0F]" />
            </div>
            <div>
              <h1 className="font-['Orbitron'] text-4xl sm:text-5xl font-black italic tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C0C0C0] to-[#757575] drop-shadow-[0_8px_15px_rgba(192,192,192,0.3)]">
                Global Top 20
              </h1>
              <p className="text-[#A09CA3] font-light tracking-wide mt-1">Live synchronized updates from iTunes API</p>
            </div>
          </div>

          <div className="flex-1 bg-[#120E14]/75 backdrop-blur-2xl border border-[#C0C0C0]/30 rounded-[2rem] p-2 sm:p-6 shadow-[0_0_40px_rgba(192,192,192,0.1)]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-[#A09CA3] uppercase tracking-widest border-b border-[#C0C0C0]/20 mb-4">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6 sm:col-span-7">Track / Artist</div>
              <div className="col-span-3 sm:col-span-2 text-right">Streams</div>
              <div className="hidden sm:block col-span-2 text-right">Time</div>
            </div>

            <div className="h-[700px] overflow-y-auto pr-2 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0B0B0F]/50 [&::-webkit-scrollbar-thumb]:bg-[#C0C0C0]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#C0C0C0]/50">
              {globalTop.map((song, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}
                  key={song.id || index} 
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center bg-[#0B0B0F]/50 border border-transparent hover:border-[#C0C0C0]/40 hover:bg-[#C0C0C0]/10 rounded-xl transition-all group cursor-pointer"
                >
                  {/* Rank Badge */}
                  <div className="col-span-1 flex justify-center">
                    {index === 0 ? <Star className="w-5 h-5 text-[#FCF6BA] fill-[#FCF6BA] drop-shadow-[0_0_10px_rgba(252,246,186,0.8)]" /> : 
                     index === 1 ? <Star className="w-5 h-5 text-[#C0C0C0] fill-[#C0C0C0]" /> : 
                     index === 2 ? <Star className="w-5 h-5 text-[#CD7F32] fill-[#CD7F32]" /> : 
                     <span className="text-[#A09CA3] font-bold group-hover:text-white transition-colors">{song.rank || index + 1}</span>}
                  </div>

                  {/* Artwork, Title & Artist */}
                  <div className="col-span-6 sm:col-span-7 flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-white/10 flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:border-[#C0C0C0]/50 transition-colors shadow-md">
                       {song.cover ? (
                         <img src={song.cover} alt={song.title} className="w-full h-full object-cover group-hover:opacity-30 transition-opacity" />
                       ) : (
                         <Music className="w-4 h-4 text-white/20 group-hover:opacity-0 transition-opacity" />
                       )}
                       <Play className="w-4 h-4 text-[#C0C0C0] opacity-0 group-hover:opacity-100 transition-opacity absolute z-10" fill="currentColor"/>
                    </div>
                    
                    <div className="truncate">
                      <h4 className="text-white text-sm font-bold tracking-wide truncate group-hover:text-[#C0C0C0] transition-colors">{song.title}</h4>
                      <p className="text-[#A09CA3] text-xs font-light truncate">{song.artist}</p>
                    </div>
                  </div>

                  {/* Streams */}
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className="text-sm font-medium text-white">{song.streams}</span>
                  </div>

                  {/* Duration */}
                  <div className="hidden sm:block col-span-2 text-right">
                    <span className="text-sm text-[#A09CA3]">{song.duration || '3:30'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COL: VINYLR TOP 5 & DISTRIBUTION (GOLD AESTHETIC)
            ========================================= */}
        <div className="w-full lg:w-[40%] flex flex-col gap-8">
          
          {/* VINYLR TOP 5 */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FCF6BA] via-[#BF953F] to-[#AA771C] flex items-center justify-center shadow-[0_0_20px_rgba(191,149,63,0.4)]">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <h2 className="font-['Orbitron'] text-2xl font-black italic tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FCF6BA] via-[#BF953F] to-[#AA771C]">
                VinylR Trending
              </h2>
            </div>

            <div className="bg-[#120E14]/80 backdrop-blur-2xl border border-[#BF953F]/40 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(191,149,63,0.15)] space-y-3">
              {vinylrTop.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-4 p-3 bg-[#0B0B0F]/60 border border-[#BF953F]/20 rounded-xl hover:border-[#FCF6BA]/50 transition-colors group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FCF6BA] to-[#BF953F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-8 text-center font-bold text-[#BF953F] text-lg">#{item.rank || index + 1}</div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-white text-sm font-bold truncate group-hover:text-[#FCF6BA] transition-colors">{item.title}</h4>
                    <p className="text-[#A09CA3] text-xs font-light">{item.artist}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#A09CA3] uppercase tracking-widest mb-0.5">Sales</div>
                    <div className="text-sm font-bold text-[#FCF6BA] flex items-center gap-1 justify-end">
                      <Activity className="w-3 h-3 text-green-400" /> {item.sales || '0'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GENRE SALES DISTRIBUTION */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B0B0F] border border-[#BF953F]/50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#BF953F]" />
              </div>
              <h2 className="text-xl font-bold tracking-widest uppercase text-white">
                Sales Distribution
              </h2>
            </div>

            <div className="bg-[#120E14]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative mb-8 flex justify-center">
                {renderDonutChart()}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Disc className="w-10 h-10 text-white/20 animate-spin-slow" />
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                {genreData.map((genre, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + (index * 0.1) }}
                    key={index} className="flex items-center gap-3 p-2 bg-[#0B0B0F]/50 rounded-lg border border-white/5"
                  >
                    <div className="w-3 h-3 rounded-sm shadow-[0_0_8px_currentColor]" style={{ backgroundColor: genre.color || '#BF953F', color: genre.color || '#BF953F' }} />
                    <div className="flex-1">
                      <div className="text-white text-xs font-bold uppercase tracking-wider">{genre.name}</div>
                    </div>
                    <div className="text-[#A09CA3] text-xs font-bold">{genre.percentage}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Trending;