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

  const renderDonutChart = () => {
    const data = genreData.length ? genreData : FALLBACK_GENRES;
    const total = data.reduce(
      (sum, genre) => sum + Number(genre.percentage || 0),
      0
    ) || 100;

    let cumulative = 0;

    const segments = data.map((genre, index) => {
      const percentage = Number(genre.percentage || 0);
      const start = cumulative;
      cumulative += percentage;

      return {
        ...genre,
        index,
        start: (start / total) * 100,
        end: (cumulative / total) * 100
      };
    });

    const gradient = segments.length
      ? `conic-gradient(${segments
          .map(
            (segment) =>
              `${segment.color || "#BF953F"} ${segment.start}% ${segment.end}%`
          )
          .join(", ")})`
      : "conic-gradient(#BF953F 0% 100%)";

    return (
      <div
        className="
          relative
          w-64
          h-64
          sm:w-72
          sm:h-72
          rounded-full
          p-4
          shadow-[0_0_55px_rgba(191,149,63,0.16)]
        "
        style={{ background: gradient }}
        aria-label="Genre sales distribution"
      >
        <div className="
          absolute
          inset-4
          rounded-full
          bg-[#08080C]
          border
          border-white/10
          shadow-[inset_0_0_35px_rgba(0,0,0,0.9)]
        " />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-28 pb-16 font-['Oswald'] relative">
      {isLoading && (
        <div className="
          fixed
          inset-0
          z-[100]
          bg-[#08080C]/95
          backdrop-blur-md
          flex
          items-center
          justify-center
        ">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#BF953F] animate-spin" />
            <span className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-[#FCF6BA]
            ">
              Loading charts
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
          CINEMATIC TRENDING ATMOSPHERE
          ========================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.20, 0.34, 0.20],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="
            absolute
            top-[-18%]
            left-[-14%]
            w-[850px]
            h-[850px]
            rounded-full
            bg-[#BF953F]
            blur-[210px]
          "
        />

        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.12, 0.24, 0.12],
            x: [0, -35, 0]
          }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="
            absolute
            bottom-[-22%]
            right-[-12%]
            w-[950px]
            h-[950px]
            rounded-full
            bg-[#E11D2E]
            blur-[230px]
          "
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.18, 0.08],
            x: [0, 45, 0]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="
            absolute
            top-[38%]
            right-[20%]
            w-[600px]
            h-[600px]
            rounded-full
            bg-[#6A00FF]
            blur-[220px]
          "
        />

        {/* Fixed decorative vinyls */}
        <div className="
          absolute
          top-[7%]
          left-[-13%]
          scale-[1.05]
          opacity-45
          brightness-125
          contrast-125
          drop-shadow-[0_0_55px_rgba(191,149,63,0.35)]
        ">
          <FloatingVinyl />
        </div>

        <div className="
          absolute
          bottom-[-10%]
          right-[-11%]
          scale-[0.9]
          opacity-35
          brightness-125
          contrast-125
          drop-shadow-[0_0_45px_rgba(191,149,63,0.3)]
        ">
          <FloatingVinyl />
        </div>

        <div className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_20%,#08080C_88%)]
        " />
      </div>

      {/* =========================================================
          PAGE HEADER
          ========================================================= */}
      <main className="max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">

        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-[#BF953F]/25
              bg-[#120E14]/70
              backdrop-blur-2xl
              p-6
              sm:p-8
              shadow-[0_0_45px_rgba(191,149,63,0.10)]
            "
          >
            <div className="
              absolute
              inset-y-0
              right-0
              w-1/2
              bg-gradient-to-l
              from-[#BF953F]/10
              to-transparent
              pointer-events-none
            " />

            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-gradient-to-br
                    from-[#FCF6BA]
                    via-[#BF953F]
                    to-[#8F6B20]
                    flex
                    items-center
                    justify-center
                    shadow-[0_0_25px_rgba(191,149,63,0.4)]
                  ">
                    <TrendingUp className="w-5 h-5 text-[#08080C]" />
                  </div>

                  <span className="
                    text-[10px]
                    sm:text-xs
                    font-bold
                    uppercase
                    tracking-[0.28em]
                    text-[#FCF6BA]
                  ">
                    Live Music Intelligence
                  </span>

                  <span className="
                    w-2
                    h-2
                    rounded-full
                    bg-green-400
                    shadow-[0_0_12px_rgba(74,222,128,0.9)]
                    animate-pulse
                  " />
                </div>

                <h1 className="
                  font-['Orbitron']
                  text-4xl
                  sm:text-6xl
                  lg:text-7xl
                  font-black
                  italic
                  tracking-tight
                  uppercase
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-b
                  from-white
                  via-[#FCF6BA]
                  to-[#BF953F]
                  drop-shadow-[0_8px_22px_rgba(191,149,63,0.25)]
                ">
                  Trending
                </h1>

                <p className="
                  text-[#A09CA3]
                  mt-3
                  max-w-2xl
                  text-sm
                  sm:text-base
                  tracking-wide
                ">
                  Real-time charts, VinylR sales momentum, and genre movement
                  in one cinematic dashboard.
                </p>
              </div>

              <div className="
                flex
                flex-wrap
                gap-3
                text-[10px]
                uppercase
                tracking-[0.18em]
                font-bold
              ">
                <div className="
                  px-4
                  py-2.5
                  rounded-full
                  border
                  border-white/10
                  bg-black/25
                  text-white/55
                ">
                  Auto refresh · 60s
                </div>

                <div className="
                  px-4
                  py-2.5
                  rounded-full
                  border
                  border-green-400/20
                  bg-green-400/5
                  text-green-300
                ">
                  Live sync
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =========================================================
            MAIN DASHBOARD
            ========================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.85fr)] gap-7 items-start">

          {/* GLOBAL TOP 20 */}

          <section className="min-w-0">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="
                  w-11 h-11 rounded-xl
                  bg-gradient-to-br from-[#F5F5F5] via-[#C0C0C0] to-[#686868]
                  flex items-center justify-center
                  shadow-[0_0_22px_rgba(192,192,192,0.3)]
                ">
                  <Music className="w-5 h-5 text-[#08080C]" />
                </div>

                <div>
                  <h2 className="
                    font-['Orbitron']
                    text-xl sm:text-2xl
                    font-black italic uppercase tracking-widest
                  ">
                    Global Top 20
                  </h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                    iTunes global movement
                  </p>
                </div>
              </div>

              <div className="
                hidden sm:flex items-center gap-2
                text-[10px] uppercase tracking-widest text-white/30
              ">
                <Activity className="w-3.5 h-3.5" />
                Live chart
              </div>
            </div>

            <div className="
              rounded-[2rem]
              border border-white/10
              bg-[#120E14]/75 backdrop-blur-2xl
              p-3 sm:p-5
              shadow-[0_0_45px_rgba(192,192,192,0.07)]
            ">
              <div className="
                grid grid-cols-[48px_minmax(0,1fr)_auto]
                gap-3 px-4 py-3
                text-[9px] sm:text-[10px]
                font-bold text-white/30 uppercase tracking-[0.16em]
                border-b border-white/10 mb-3
              ">
                <div className="text-center">#</div>
                <div>Track / Artist</div>
                <div className="text-right">Chart</div>
              </div>

              <div className="
                max-h-[650px]
                overflow-y-auto pr-1 space-y-2
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full
              ">
                {globalTop.map((song, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025 }}
                    key={song.id || index}
                    className="
                      grid grid-cols-[48px_minmax(0,1fr)_auto]
                      gap-3 px-3 sm:px-4 py-3 items-center
                      bg-[#08080C]/55
                      border border-transparent
                      hover:border-[#BF953F]/35
                      hover:bg-[#BF953F]/[0.06]
                      rounded-xl transition-all group
                    "
                  >
                    <div className="flex justify-center">
                      {index === 0 ? (
                        <Star className="w-5 h-5 text-[#FCF6BA] fill-[#FCF6BA] drop-shadow-[0_0_10px_rgba(252,246,186,0.8)]" />
                      ) : index === 1 ? (
                        <Star className="w-5 h-5 text-[#C0C0C0] fill-[#C0C0C0]" />
                      ) : index === 2 ? (
                        <Star className="w-5 h-5 text-[#CD7F32] fill-[#CD7F32]" />
                      ) : (
                        <span className="text-white/35 font-bold group-hover:text-white transition-colors">
                          {song.rank || index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                      <div className="
                        w-10 h-10 sm:w-11 sm:h-11
                        rounded-lg bg-[#1A1A1A]
                        border border-white/10
                        flex-shrink-0 flex items-center justify-center
                        relative overflow-hidden
                        group-hover:border-[#BF953F]/50 transition-colors
                      ">
                        {song.cover ? (
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="
                              w-full h-full object-cover
                              group-hover:scale-110 group-hover:opacity-45
                              transition-all duration-500
                            "
                          />
                        ) : (
                          <Music className="w-4 h-4 text-white/20" />
                        )}

                        <Play
                          className="
                            w-4 h-4 text-[#FCF6BA]
                            opacity-0 group-hover:opacity-100
                            transition-opacity absolute z-10
                          "
                          fill="currentColor"
                        />
                      </div>

                      <div className="truncate min-w-0">
                        <h4 className="
                          text-white text-sm font-bold tracking-wide truncate
                          group-hover:text-[#FCF6BA] transition-colors
                        ">
                          {song.title}
                        </h4>
                        <p className="text-white/35 text-xs font-light truncate">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="
                      text-[9px] sm:text-[10px]
                      uppercase tracking-[0.16em]
                      text-white/20 group-hover:text-[#BF953F]
                      transition-colors
                    ">
                      Trending
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* VINYLR TOP 5 — SIDE BY SIDE WITH GLOBAL TOP 20 */}

          <aside className="min-w-0 xl:sticky xl:top-28">
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="
                  w-11 h-11 rounded-xl
                  bg-gradient-to-br from-[#FCF6BA] via-[#BF953F] to-[#8F6B20]
                  flex items-center justify-center
                  shadow-[0_0_22px_rgba(191,149,63,0.4)]
                ">
                  <TrendingUp className="w-5 h-5 text-[#08080C]" />
                </div>

                <div>
                  <h2 className="
                    font-['Orbitron']
                    text-xl sm:text-2xl
                    font-black italic tracking-widest uppercase
                    text-transparent bg-clip-text
                    bg-gradient-to-r from-[#FCF6BA] via-[#BF953F] to-[#AA771C]
                  ">
                    VinylR Top 5
                  </h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                    Top selling records
                  </p>
                </div>
              </div>

              <div className="
                rounded-[2rem]
                bg-[#120E14]/80 backdrop-blur-2xl
                border border-[#BF953F]/30
                p-4 sm:p-5
                shadow-[0_0_40px_rgba(191,149,63,0.10)]
              ">
                <div className="space-y-2">
                  {vinylrTop.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="
                        relative overflow-hidden
                        flex items-center gap-3
                        p-3 sm:p-3.5
                        bg-[#08080C]/65
                        border border-[#BF953F]/15
                        rounded-xl
                        hover:border-[#FCF6BA]/45
                        hover:bg-[#BF953F]/[0.05]
                        transition-all group
                      "
                    >
                      {index < 3 && (
                        <div className="
                          absolute inset-y-0 left-0 w-1
                          bg-gradient-to-b from-[#FCF6BA] via-[#BF953F] to-transparent
                          opacity-70
                        " />
                      )}

                      <div className="
                        w-9 sm:w-10
                        text-center font-black text-[#BF953F]
                        text-sm sm:text-base
                      ">
                        #{item.rank || index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="
                          text-white text-sm font-bold truncate
                          group-hover:text-[#FCF6BA] transition-colors
                        ">
                          {item.title}
                        </h4>

                        <p className="text-white/35 text-xs truncate mt-0.5">
                          {item.artist}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="
                          text-[8px] text-white/25
                          uppercase tracking-widest mb-0.5
                        ">
                          Sales
                        </div>

                        <div className="
                          text-sm font-bold text-[#FCF6BA]
                          flex items-center gap-1 justify-end
                        ">
                          <Activity className="w-3 h-3 text-green-400" />
                          {item.sales || "0"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="
                  mt-4 pt-4 border-t border-white/5
                  flex items-center justify-between
                  text-[9px] uppercase tracking-[0.18em]
                ">
                  <span className="text-white/25">VinylR sales index</span>
                  <span className="text-green-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* SALES DISTRIBUTION — BELOW BOTH COLUMNS */}

        <section className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="
              w-11 h-11 rounded-xl
              bg-[#08080C]
              border border-[#BF953F]/40
              flex items-center justify-center
            ">
              <BarChart3 className="w-5 h-5 text-[#BF953F]" />
            </div>

            <div>
              <h2 className="
                font-['Orbitron']
                text-xl sm:text-2xl
                font-black italic tracking-widest uppercase
              ">
                Sales Distribution
              </h2>

              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                Genre breakdown
              </p>
            </div>
          </div>

          <div className="
            bg-[#120E14]/80 backdrop-blur-2xl
            border border-white/10 rounded-[2rem]
            p-6 sm:p-8 relative overflow-hidden
            shadow-[0_0_35px_rgba(191,149,63,0.08)]
          ">
            <div className="
              absolute top-0 left-1/2 -translate-x-1/2
              w-64 h-32 bg-[#BF953F]/10 blur-[80px]
              pointer-events-none
            " />

            <div className="
              relative flex flex-col lg:flex-row
              items-center justify-center gap-8 lg:gap-14
            ">
              <div className="relative shrink-0">
                {renderDonutChart()}

                <div className="
                  absolute inset-0 flex items-center justify-center pointer-events-none
                ">
                  <div className="
                    w-16 h-16 rounded-full
                    bg-[#0B0B0F]/80 border border-[#BF953F]/20
                    flex items-center justify-center
                    shadow-[0_0_25px_rgba(191,149,63,0.15)]
                  ">
                    <Disc className="w-7 h-7 text-[#BF953F]/50" />
                  </div>
                </div>
              </div>

              <div className="
                w-full max-w-2xl
                grid grid-cols-1 sm:grid-cols-2 gap-2
              ">
                {(genreData.length ? genreData : FALLBACK_GENRES).map((genre, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    key={index}
                    className="
                      flex items-center gap-3 p-3
                      bg-[#08080C]/55 rounded-xl
                      border border-white/5
                      hover:border-white/10 transition-colors
                    "
                  >
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{
                        backgroundColor: genre.color || "#BF953F",
                        boxShadow: `0 0 10px ${genre.color || "#BF953F"}55`
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="
                        text-white text-xs font-bold uppercase
                        tracking-wider truncate
                      ">
                        {genre.name}
                      </div>
                    </div>

                    <div className="text-white/45 text-xs font-bold">
                      {genre.percentage}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Trending;