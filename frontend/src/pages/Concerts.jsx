import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Radio } from 'lucide-react';

// 5 Upcoming Concerts Mock Data
const CONCERTS = [
  { id: 1, artist: "The Weeknd", tour: "After Hours Til Dawn", date: "Oct 12, 2026", venue: "Wembley Stadium, London", tag: "SELLING FAST" },
  { id: 2, artist: "Cosmic Wave", tour: "Nebula Dreams Tour", date: "Nov 04, 2026", venue: "Tokyo Dome, Japan", tag: "UPCOMING" },
  { id: 3, artist: "RaGaForge", tour: "Cinematic Live Score", date: "Nov 18, 2026", venue: "Royal Albert Hall, UK", tag: "EXCLUSIVE" },
  { id: 4, artist: "The Synthetics", tour: "Midnight Drive", date: "Dec 02, 2026", venue: "Madison Square Garden, NY", tag: "NEW" },
  { id: 5, artist: "VinylR Festival", tour: "End of Year Special", date: "Dec 31, 2026", venue: "Coachella Valley, CA", tag: "FESTIVAL" },
];

const Concerts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate massive cards every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CONCERTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pt-24 pb-12 font-['Oswald'] relative overflow-hidden flex flex-col items-center">
      
      {/* BACKGROUND SMOKE */}
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="fixed top-[-10%] right-[10%] w-[900px] h-[900px] bg-[#E11D2E] rounded-full blur-[250px] pointer-events-none z-0" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 10, repeat: Infinity }} className="fixed bottom-[-10%] left-[10%] w-[900px] h-[900px] bg-[#6A00FF] rounded-full blur-[250px] pointer-events-none z-0" />

      <div className="w-full max-w-[1400px] px-6 relative z-10 mb-10 text-center">
        <h1 className="font-['Orbitron'] text-5xl sm:text-6xl font-black italic tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E11D2E] to-[#B146FF] drop-shadow-[0_0_20px_rgba(225,29,46,0.5)]">
          Upcoming Concerts
        </h1>
        <p className="text-[#A09CA3] text-lg font-light tracking-widest uppercase mt-4">Experience the music live.</p>
      </div>

      {/* MASSIVE SLIDESHOW CONTAINER */}
      <div className="w-full max-w-[1000px] h-[600px] relative z-10 flex items-center justify-center perspective-[1200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 200, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: -200, scale: 0.9, rotateY: 15 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full h-full bg-[#120E14]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden group"
          >
            {/* TAG */}
            <div className="absolute top-10 left-10 z-20 bg-[#E11D2E] text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-[0_0_15px_rgba(225,29,46,0.5)] flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" /> {CONCERTS[currentSlide].tag}
            </div>

            {/* MASSIVE BLANK IMAGE PLACEHOLDER */}
            <div className="w-full h-[350px] bg-[#1A1A1A] rounded-[2rem] border border-white/5 mb-8 relative overflow-hidden group-hover:border-[#E11D2E]/30 transition-colors">
               <div className="absolute inset-0 bg-gradient-to-t from-[#120E14] to-transparent opacity-80" />
            </div>

            {/* CONCERT DETAILS */}
            <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between px-4">
              <div>
                <h3 className="text-2xl font-bold text-[#E11D2E] tracking-widest uppercase mb-1">{CONCERTS[currentSlide].tour}</h3>
                <h2 className="font-['Orbitron'] text-5xl font-black text-white italic tracking-wider mb-4">{CONCERTS[currentSlide].artist}</h2>
              </div>
              
              <div className="flex flex-col gap-2 text-right">
                <p className="text-lg text-white flex items-center justify-end gap-2 font-light tracking-wide"><Calendar className="w-5 h-5 text-[#B146FF]" /> {CONCERTS[currentSlide].date}</p>
                <p className="text-lg text-[#A09CA3] flex items-center justify-end gap-2 font-light tracking-wide"><MapPin className="w-5 h-5 text-[#B146FF]" /> {CONCERTS[currentSlide].venue}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SLIDER DOTS */}
      <div className="relative z-10 flex items-center justify-center gap-4 mt-12">
        {CONCERTS.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-12 bg-[#E11D2E] shadow-[0_0_15px_rgba(225,29,46,0.8)]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

    </div>
  );
};

export default Concerts;