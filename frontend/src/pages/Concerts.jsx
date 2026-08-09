import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Radio,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Sparkles,
  Clock3
} from 'lucide-react';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

// =========================================================
// UPCOMING CONCERTS
// =========================================================

const CONCERTS = [
  {
    id: 1,
    artist: 'The Weeknd',
    tour: 'After Hours Til Dawn',
    date: 'Oct 12, 2026',
    venue: 'Wembley Stadium, London',
    tag: 'SELLING FAST',
    accent: '#E11D2E',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=90'
  },
  {
    id: 2,
    artist: 'Cosmic Wave',
    tour: 'Nebula Dreams Tour',
    date: 'Nov 04, 2026',
    venue: 'Tokyo Dome, Japan',
    tag: 'UPCOMING',
    accent: '#8B5CF6',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=90'
  },
  {
    id: 3,
    artist: 'RaGaForge',
    tour: 'Cinematic Live Score',
    date: 'Nov 18, 2026',
    venue: 'Royal Albert Hall, UK',
    tag: 'EXCLUSIVE',
    accent: '#A855F7',
    image:
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1800&q=90'
  },
  {
    id: 4,
    artist: 'The Synthetics',
    tour: 'Midnight Drive',
    date: 'Dec 02, 2026',
    venue: 'Madison Square Garden, NY',
    tag: 'NEW',
    accent: '#C026D3',
    image:
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1800&q=90'
  },
  {
    id: 5,
    artist: 'VinylR Festival',
    tour: 'End of Year Special',
    date: 'Dec 31, 2026',
    venue: 'Coachella Valley, CA',
    tag: 'FESTIVAL',
    accent: '#E11D2E',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=90'
  }
];

const Concerts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentConcert = CONCERTS[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CONCERTS.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + CONCERTS.length) % CONCERTS.length
    );
  };

  // Auto-rotate every 5 seconds.
  useEffect(() => {
    if (isPaused) return undefined;

    const timer = setInterval(nextSlide, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Keyboard navigation.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') nextSlide();
      if (event.key === 'ArrowLeft') previousSlide();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-28 pb-16 font-['Oswald'] relative overflow-hidden">

      {/* =========================================================
          CINEMATIC BACKGROUND
          ========================================================= */}

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Red smoke */}
        <motion.div
          animate={{
            x: [0, 45, 0],
            y: [0, -25, 0],
            scale: [1, 1.12, 1],
            opacity: [0.18, 0.34, 0.18]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            top-[-18%]
            right-[-12%]
            w-[900px]
            h-[900px]
            rounded-full
            bg-[#E11D2E]
            blur-[230px]
          "
        />

        {/* Purple smoke */}
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.28, 0.12]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            bottom-[-20%]
            left-[-15%]
            w-[950px]
            h-[950px]
            rounded-full
            bg-[#6A00FF]
            blur-[240px]
          "
        />

        {/* Soft center glow */}
        <motion.div
          animate={{
            opacity: [0.08, 0.16, 0.08],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            top-[35%]
            left-[35%]
            w-[650px]
            h-[650px]
            rounded-full
            bg-[#A855F7]
            blur-[220px]
          "
        />

        {/* Same floating vinyl used across the app */}
        <div className="
          absolute
          top-[9%]
          right-[-17%]
          scale-[0.82]
          opacity-65
          brightness-125
          contrast-125
        ">
          <FloatingVinyl />
        </div>

        <div className="
          absolute
          bottom-[-18%]
          left-[-20%]
          scale-[0.72]
          opacity-35
          brightness-125
          contrast-125
        ">
          <FloatingVinyl />
        </div>

        <div className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_18%,#08080C_90%)]
        " />
      </div>

      {/* =========================================================
          PAGE CONTENT
          ========================================================= */}

      <main className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8">

        {/* HEADER */}

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            text-center
            mb-9
          "
        >
          <div className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border
            border-[#E11D2E]/30
            bg-[#E11D2E]/5
            backdrop-blur-xl
            text-[10px]
            sm:text-xs
            font-bold
            uppercase
            tracking-[0.28em]
            text-[#FF6670]
            mb-5
          ">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Experiences
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
            bg-gradient-to-r
            from-white
            via-[#FF6470]
            to-[#B146FF]
            drop-shadow-[0_0_28px_rgba(225,29,46,0.38)]
          ">
            Upcoming Concerts
          </h1>

          <p className="
            text-[#A09CA3]
            text-sm
            sm:text-base
            tracking-[0.2em]
            uppercase
            mt-4
          ">
            Experience the music live.
          </p>
        </motion.section>

        {/* =========================================================
            HERO CONCERT
            ========================================================= */}

        <section
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={currentConcert.id}
              initial={{
                opacity: 0,
                x: 80,
                scale: 0.97,
                rotateY: -8
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                rotateY: 0
              }}
              exit={{
                opacity: 0,
                x: -80,
                scale: 0.97,
                rotateY: 8
              }}
              transition={{
                duration: 0.65,
                ease: 'easeOut'
              }}
              className="
                relative
                overflow-hidden
                rounded-[2rem]
                sm:rounded-[2.5rem]
                border
                border-white/10
                bg-[#120E14]/80
                backdrop-blur-2xl
                shadow-[0_30px_100px_rgba(0,0,0,0.65)]
              "
            >

              {/* Hero artwork */}

              <div className="
                relative
                h-[390px]
                sm:h-[470px]
                lg:h-[540px]
                overflow-hidden
              ">
                <motion.img
                  src={currentConcert.image}
                  alt={`${currentConcert.artist} concert`}
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />

                {/* Artwork color wash */}

                <div
                  className="
                    absolute
                    inset-0
                    opacity-40
                    mix-blend-screen
                  "
                  style={{
                    background: `linear-gradient(115deg, ${currentConcert.accent}55, transparent 55%)`
                  }}
                />

                {/* Dark cinematic overlays */}

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/90
                  via-black/35
                  to-black/10
                " />

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#120E14]
                  via-transparent
                  to-black/10
                " />

                {/* Top tag */}

                <div className="
                  absolute
                  top-5
                  left-5
                  sm:top-8
                  sm:left-8
                  z-20
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-full
                  bg-black/55
                  backdrop-blur-xl
                  border
                  border-[#E11D2E]/45
                  text-white
                  text-[9px]
                  sm:text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  shadow-[0_0_25px_rgba(225,29,46,0.3)]
                ">
                  <Radio className="w-3.5 h-3.5 text-[#FF5965] animate-pulse" />
                  {currentConcert.tag}
                </div>

                {/* Slide number */}

                <div className="
                  absolute
                  top-5
                  right-5
                  sm:top-8
                  sm:right-8
                  z-20
                  text-white/55
                  text-[10px]
                  font-bold
                  tracking-[0.2em]
                  uppercase
                ">
                  {String(currentSlide + 1).padStart(2, '0')}
                  <span className="text-white/20 mx-1">/</span>
                  {String(CONCERTS.length).padStart(2, '0')}
                </div>

                {/* Main concert copy */}

                <div className="
                  absolute
                  inset-x-5
                  sm:inset-x-8
                  lg:inset-x-12
                  bottom-7
                  sm:bottom-10
                  z-10
                  max-w-4xl
                ">
                  <div className="
                    flex
                    items-center
                    gap-2
                    mb-2
                    text-[#FF5965]
                    text-xs
                    sm:text-sm
                    font-bold
                    uppercase
                    tracking-[0.2em]
                  ">
                    <Sparkles className="w-4 h-4" />
                    {currentConcert.tour}
                  </div>

                  <h2 className="
                    font-['Orbitron']
                    text-4xl
                    sm:text-6xl
                    lg:text-7xl
                    font-black
                    italic
                    uppercase
                    tracking-tight
                    text-white
                    drop-shadow-[0_8px_25px_rgba(0,0,0,0.7)]
                  ">
                    {currentConcert.artist}
                  </h2>
                </div>
              </div>

              {/* Details strip */}

              <div className="
                p-5
                sm:p-7
                lg:px-10
                bg-[#120E14]/95
                border-t
                border-white/10
              ">
                <div className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  justify-between
                  gap-6
                ">

                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                    flex-1
                  ">
                    <div className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-black/25
                      border
                      border-white/5
                      px-4
                      py-3
                    ">
                      <Calendar className="w-5 h-5 text-[#B146FF]" />

                      <div>
                        <p className="
                          text-[9px]
                          text-white/30
                          uppercase
                          tracking-[0.2em]
                          mb-1
                        ">
                          Date
                        </p>

                        <p className="text-sm sm:text-base text-white font-semibold">
                          {currentConcert.date}
                        </p>
                      </div>
                    </div>

                    <div className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-black/25
                      border
                      border-white/5
                      px-4
                      py-3
                    ">
                      <MapPin className="w-5 h-5 text-[#B146FF]" />

                      <div className="min-w-0">
                        <p className="
                          text-[9px]
                          text-white/30
                          uppercase
                          tracking-[0.2em]
                          mb-1
                        ">
                          Venue
                        </p>

                        <p className="
                          text-sm
                          sm:text-base
                          text-white
                          font-semibold
                          truncate
                        ">
                          {currentConcert.venue}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        `Tickets for ${currentConcert.artist} — ${currentConcert.tour}`
                      );
                    }}
                    className="
                      shrink-0
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-7
                      py-3.5
                      rounded-xl
                      bg-gradient-to-r
                      from-[#8B0E1A]
                      via-[#E11D2E]
                      to-[#FF3D4D]
                      text-white
                      text-xs
                      sm:text-sm
                      font-black
                      uppercase
                      tracking-[0.16em]
                      shadow-[0_0_25px_rgba(225,29,46,0.28)]
                      hover:shadow-[0_0_35px_rgba(225,29,46,0.5)]
                      hover:-translate-y-0.5
                      transition-all
                    "
                  >
                    <Ticket className="w-4 h-4" />
                    Explore Event
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Navigation arrows */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous concert"
            className="
              absolute
              left-[-4px]
              sm:left-[-22px]
              top-[43%]
              -translate-y-1/2
              z-30
              w-11
              h-11
              sm:w-14
              sm:h-14
              rounded-full
              bg-black/70
              backdrop-blur-xl
              border
              border-white/15
              flex
              items-center
              justify-center
              text-white/70
              hover:text-white
              hover:border-[#E11D2E]/60
              hover:bg-[#E11D2E]/10
              hover:scale-110
              transition-all
            "
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next concert"
            className="
              absolute
              right-[-4px]
              sm:right-[-22px]
              top-[43%]
              -translate-y-1/2
              z-30
              w-11
              h-11
              sm:w-14
              sm:h-14
              rounded-full
              bg-black/70
              backdrop-blur-xl
              border
              border-white/15
              flex
              items-center
              justify-center
              text-white/70
              hover:text-white
              hover:border-[#E11D2E]/60
              hover:bg-[#E11D2E]/10
              hover:scale-110
              transition-all
            "
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </section>

        {/* =========================================================
            SLIDER CONTROLS
            ========================================================= */}

        <div className="
          flex
          flex-col
          sm:flex-row
          items-center
          justify-center
          gap-5
          mt-8
        ">
          <div className="flex items-center gap-2">
            {CONCERTS.map((concert, index) => (
              <button
                key={concert.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to concert ${index + 1}`}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === currentSlide
                      ? 'w-12 bg-[#E11D2E] shadow-[0_0_15px_rgba(225,29,46,0.8)]'
                      : 'w-3 bg-white/20 hover:bg-white/45'
                  }
                `}
              />
            ))}
          </div>

          <div className="
            hidden sm:flex
            items-center
            gap-2
            text-[9px]
            uppercase
            tracking-[0.2em]
            text-white/25
          ">
            <Clock3 className="w-3.5 h-3.5" />
            {isPaused ? 'Paused' : 'Auto rotating'}
          </div>
        </div>

        {/* =========================================================
            MINI EVENT PREVIEW STRIP
            ========================================================= */}

        <section className="mt-14">
          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">
            <div>
              <h3 className="
                font-['Orbitron']
                text-lg
                sm:text-xl
                font-black
                italic
                uppercase
                tracking-widest
              ">
                More Live Moments
              </h3>

              <p className="
                text-[9px]
                text-white/25
                uppercase
                tracking-[0.2em]
                mt-1
              ">
                Upcoming across the VinylR universe
              </p>
            </div>
          </div>

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            gap-3
          ">
            {CONCERTS.map((concert, index) => (
              <button
                type="button"
                key={concert.id}
                onClick={() => setCurrentSlide(index)}
                className={`
                  text-left
                  rounded-2xl
                  overflow-hidden
                  border
                  bg-[#120E14]/70
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  group
                  ${
                    index === currentSlide
                      ? 'border-[#E11D2E]/60 shadow-[0_0_25px_rgba(225,29,46,0.16)]'
                      : 'border-white/8 hover:border-white/20'
                  }
                `}
              >
                <div className="h-28 sm:h-32 overflow-hidden relative">
                  <img
                    src={concert.image}
                    alt=""
                    className="
                      w-full
                      h-full
                      object-cover
                      opacity-55
                      group-hover:opacity-85
                      group-hover:scale-105
                      transition-all
                      duration-500
                    "
                  />

                  <div className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#120E14]
                    via-black/10
                    to-transparent
                  " />

                  <span className="
                    absolute
                    top-2
                    left-2
                    px-2
                    py-1
                    rounded
                    bg-black/55
                    backdrop-blur-md
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-white/80
                  ">
                    {concert.tag}
                  </span>
                </div>

                <div className="p-3">
                  <p className="
                    text-[9px]
                    text-[#FF5965]
                    uppercase
                    tracking-[0.16em]
                    font-bold
                    truncate
                  ">
                    {concert.tour}
                  </p>

                  <h4 className="
                    text-sm
                    font-bold
                    text-white
                    mt-1
                    truncate
                  ">
                    {concert.artist}
                  </h4>

                  <p className="
                    text-[10px]
                    text-white/30
                    mt-1
                    truncate
                  ">
                    {concert.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Concerts;