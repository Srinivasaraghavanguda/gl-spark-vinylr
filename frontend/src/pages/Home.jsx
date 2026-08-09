import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  Star,
  RefreshCcw,
  Lock,
  Flame,
  ArrowRight,
  Disc3,
} from "lucide-react";
import { Link } from "react-router-dom";

import FloatingVinyl from "../components/Aesthetics/FloatingVinyl";
import { catalogService } from "../api/catalogService";
import { getAlbumCover } from "../data/albumCoverService";

/* =========================================================
   FEATURE STRIP
   ========================================================= */

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders above ₹999",
  },
  {
    icon: ShieldCheck,
    title: "Exclusive Drops",
    desc: "Limited edition merch",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "100% authentic products",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    desc: "Hassle free returns",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "Safe & encrypted",
  },
];

/* =========================================================
   HOME
   ========================================================= */

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderItems, setSliderItems] = useState([]);
  const [topSales, setTopSales] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  /* =======================================================
     LOAD ALBUMS
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAlbums = async () => {
      try {
        setIsLoading(true);

        const albums = await catalogService.getAllAlbums();

        if (!albums || albums.length === 0) {
          if (mounted) {
            setSliderItems([]);
            setTopSales([]);
            setTopArtists([]);
          }

          return;
        }

        /* =================================================
           GET iTUNES ARTWORK

           IMPORTANT:
           We intentionally DO NOT use album.imageUrl,
           album.image, album.cover, etc.

           Home should use the iTunes artwork we mapped
           earlier.
           ================================================= */

        const albumsWithCovers = await Promise.all(
          albums.map(async (album) => {
            try {
              const title =
                album.title ||
                album.name ||
                album.albumName ||
                "";

              const artist =
                album.artist ||
                album.artistName ||
                "";

              if (!title || !artist) {
                return null;
              }

              const itunesCover = await getAlbumCover(
                artist,
                title
              );

              if (!itunesCover) {
                return null;
              }

              /* Make sure the returned value is a real URL */

              try {
                const parsedUrl = new URL(itunesCover);

                if (
                  parsedUrl.protocol !== "http:" &&
                  parsedUrl.protocol !== "https:"
                ) {
                  return null;
                }
              } catch {
                return null;
              }

              return {
                ...album,

                /* Normalize these fields so the UI
                   doesn't depend on backend naming. */
                title,
                artist,

                /* ONLY iTunes artwork */
                imageUrl: itunesCover,
              };
            } catch (error) {
              console.error(
                `Unable to load iTunes cover for ${album?.title}`,
                error
              );

              return null;
            }
          })
        );

        /* =================================================
           ONLY ALBUMS WITH VALID iTUNES COVERS
           ================================================= */

        const validAlbums = albumsWithCovers.filter(
          (album) =>
            album &&
            typeof album.imageUrl === "string" &&
            album.imageUrl.trim().length > 0
        );

        if (!mounted) {
          return;
        }

        /* =================================================
           HERO

           Only albums with actual iTunes artwork.
           No-cover albums never enter sliderItems.
           ================================================= */

        const heroAlbums = validAlbums.slice(0, 7);

        setSliderItems(heroAlbums);

        /* =================================================
           TOP SALES

           We don't fabricate sales numbers.
           Until the backend provides an actual sales/
           popularity field, use the catalog order.
           ================================================= */

        setTopSales(validAlbums.slice(0, 10));

        /* =================================================
           TOP ARTISTS

           Extract actual artists from the albums.

           Ranking:
           More albums represented in the catalog =
           higher position.

           We are NOT inventing iTunes stream counts.
           ================================================= */

        const artistMap = new Map();

        validAlbums.forEach((album) => {
          const artistName =
            album.artist ||
            album.artistName ||
            "";

          if (!artistName) {
            return;
          }

          if (!artistMap.has(artistName)) {
            artistMap.set(artistName, {
              name: artistName,
              image: album.imageUrl,
              genre:
                album.genre ||
                album.primaryGenreName ||
                "Music",
              albumCount: 1,
            });
          } else {
            const existingArtist =
              artistMap.get(artistName);

            existingArtist.albumCount += 1;

            if (
              !existingArtist.image &&
              album.imageUrl
            ) {
              existingArtist.image =
                album.imageUrl;
            }
          }
        });

        const artists = Array.from(
          artistMap.values()
        )
          .filter(
            (artist) =>
              artist.image &&
              artist.image.trim().length > 0
          )
          .sort(
            (a, b) =>
              b.albumCount - a.albumCount
          )
          .slice(0, 7);

        setTopArtists(artists);
      } catch (error) {
        console.error(
          "Failed to load Home albums:",
          error
        );

        if (mounted) {
          setSliderItems([]);
          setTopSales([]);
          setTopArtists([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAlbums();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     HERO AUTO SLIDER
     ======================================================= */

  useEffect(() => {
    if (sliderItems.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide(
        (previous) =>
          (previous + 1) % sliderItems.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderItems]);

  /* =======================================================
     SAFETY WHEN DATA CHANGES
     ======================================================= */

  useEffect(() => {
    if (
      sliderItems.length > 0 &&
      currentSlide >= sliderItems.length
    ) {
      setCurrentSlide(0);
    }
  }, [sliderItems, currentSlide]);

  const currentAlbum =
    sliderItems[currentSlide];

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#08070A]
        text-white
        pt-20
        font-['Oswald']
        overflow-x-hidden
        relative
      "
    >
      {/* ===================================================
          CINEMATIC FLUID / SMOKE BACKGROUND

          KEEPING THIS!

          Movement is intentionally VERY slow so it feels
          atmospheric instead of looking like moving blobs.
          =================================================== */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          overflow-hidden
          z-0
        "
      >
        {/* RED SMOKE */}

        <motion.div
          animate={{
            x: [0, 35, -20, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.08, 0.96, 1],
            opacity: [0.18, 0.27, 0.21, 0.18],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[-10%]
            right-[-10%]
            w-[850px]
            h-[850px]
            bg-[#E11D2E]
            rounded-full
            blur-[190px]
          "
        />

        {/* PURPLE SMOKE */}

        <motion.div
          animate={{
            x: [0, -30, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 0.96, 1.08, 1],
            opacity: [0.14, 0.22, 0.17, 0.14],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[-20%]
            left-[-10%]
            w-[900px]
            h-[900px]
            bg-[#6A00FF]
            rounded-full
            blur-[200px]
          "
        />

        {/* CENTRAL FLUID GLOW */}

        <motion.div
          animate={{
            x: [0, 30, -25, 0],
            y: [0, -20, 25, 0],
            scale: [1, 1.12, 0.94, 1],
            opacity: [0.08, 0.16, 0.10, 0.08],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[35%]
            left-[30%]
            w-[500px]
            h-[500px]
            bg-[#B146FF]
            rounded-full
            blur-[190px]
          "
        />

        {/* =================================================
            LARGE FLOATING VINYL

            BIG
            SLANTED
            ~75% INSIDE
            ~25% OUTSIDE SCREEN

            We are NOT changing FloatingVinyl itself yet.
            ================================================= */}

        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [18, 21, 18],
            scale: [1, 1.025, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[9%]
            right-[-12%]
            sm:right-[-11%]
            lg:right-[-10%]
            w-[520px]
            h-[520px]
            sm:w-[640px]
            sm:h-[640px]
            lg:w-[780px]
            lg:h-[780px]
            opacity-[0.90]
          "
        >
          <FloatingVinyl />
        </motion.div>
      </div>

      {/* ===================================================
          MAIN CONTENT
          =================================================== */}

      <main
        className="
          max-w-[1450px]
          mx-auto
          px-5
          sm:px-8
          lg:px-12
          relative
          z-10
          pt-10
          pb-6
        "
      >
        {/* =================================================
            HERO
            ================================================= */}

        <section
          className="
            min-h-[650px]
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-12
            mb-12
          "
        >
          {/* =================================================
              LEFT SIDE
              ================================================= */}

          <div
            className="
              w-full
              lg:w-[52%]
              flex
              flex-col
              justify-center
              relative
              z-20
            "
          >
            {/* BIG PURPLE GLOSSY VINYLR */}

         <motion.h1
  initial={{
    opacity: 0,
    x: -35,
    filter: "blur(12px)",
  }}
  animate={{
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  }}
  transition={{
    duration: 1,
    ease: "easeOut",
  }}
  className="
    relative
    font-['Orbitron']
    text-[72px]
    sm:text-[105px]
    lg:text-[125px]
    leading-[0.82]
    font-black
    italic
    tracking-[-0.07em]
    text-transparent
    bg-clip-text
    bg-gradient-to-r
    from-[#F5E9FF]
    via-[#C77DFF]
    via-[#B146FF]
    to-[#6A00FF]
    drop-shadow-[0_0_28px_rgba(177,70,255,0.55)]
    mb-7
    select-none
  "
>
  VINYLR
</motion.h1>
            {/* SUBTITLE */}

            <motion.h2
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="
                text-xl
                sm:text-2xl
                lg:text-3xl
                tracking-[0.22em]
                font-bold
                text-white
                uppercase
                mb-6
              "
            >
              Music. Merch. Moments.
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.25,
              }}
              className="
                text-[#AAA5AE]
                text-base
                sm:text-lg
                lg:text-xl
                max-w-xl
                mb-10
                font-light
                leading-relaxed
                tracking-wide
              "
            >
              Discover timeless music, exclusive
              merchandise, and unforgettable
              experiences — all in one place.
            </motion.p>

            {/* BUTTONS */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.35,
              }}
              className="
                flex
                flex-wrap
                items-center
                gap-5
              "
            >
              <Link
                to="/trending"
                className="
                  group
                  px-9
                  py-4
                  rounded-xl
                  font-bold
                  text-base
                  sm:text-lg
                  text-white
                  bg-gradient-to-b
                  from-[#FF5965]
                  via-[#E11D2E]
                  to-[#8B0E1A]
                  border
                  border-[#FF6975]/40
                  shadow-[0_0_30px_rgba(225,29,46,0.35)]
                  hover:shadow-[0_0_45px_rgba(225,29,46,0.60)]
                  hover:-translate-y-1
                  transition-all
                  uppercase
                  tracking-widest
                  flex
                  items-center
                  gap-3
                "
              >
                Explore Now

                <ArrowRight
                  className="
                    w-5
                    h-5
                    group-hover:translate-x-1
                    transition-transform
                  "
                />
              </Link>

              <Link
                to="/merch"
                className="
                  px-9
                  py-4
                  rounded-xl
                  font-bold
                  text-base
                  sm:text-lg
                  text-white
                  border
                  border-white/15
                  hover:border-[#B146FF]/70
                  bg-white/[0.035]
                  hover:bg-[#6A00FF]/10
                  backdrop-blur-xl
                  transition-all
                  uppercase
                  tracking-widest
                "
              >
                Shop Merch
              </Link>
            </motion.div>

            {/* SMALL STATUS */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.9,
              }}
              className="
                mt-10
                flex
                items-center
                gap-3
                text-white/40
                text-xs
                uppercase
                tracking-[0.2em]
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    animate-ping
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    bg-[#B146FF]
                    opacity-70
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    rounded-full
                    h-2.5
                    w-2.5
                    bg-[#B146FF]
                  "
                />
              </span>

              Curated for music lovers
            </motion.div>
          </div>

          {/* =================================================
              RIGHT SIDE — HERO ALBUM CARD
              ================================================= */}

          <div
            className="
              w-full
              lg:w-[48%]
              h-[560px]
              flex
              items-center
              justify-center
              relative
              perspective-[1200px]
              z-20
            "
          >
            {/* LOADING */}

            {isLoading ? (
              <div
                className="
                  w-[330px]
                  h-[450px]
                  sm:w-[400px]
                  sm:h-[535px]
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.035]
                  backdrop-blur-xl
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-5
                "
              >
                <Disc3
                  className="
                    w-12
                    h-12
                    text-[#B146FF]
                    animate-spin
                  "
                />

                <span
                  className="
                    text-white/40
                    text-xs
                    uppercase
                    tracking-[0.25em]
                  "
                >
                  Loading vinyl collection
                </span>
              </div>
            ) : currentAlbum ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={
                      currentAlbum.id ||
                      currentAlbum._id ||
                      currentSlide
                    }
                    initial={{
                      opacity: 0,
                      x: 150,
                      rotateY: -18,
                      scale: 0.88,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: -150,
                      rotateY: 18,
                      rotateZ: 0,
                      scale: 0.88,
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      w-[330px]
                      h-[450px]
                      sm:w-[400px]
                      sm:h-[535px]
                      lg:w-[420px]
                      lg:h-[555px]
                      rounded-[2rem]
                      border
                      border-white/15
                      bg-black
                      shadow-[0_30px_100px_rgba(106,0,255,0.28)]
                      relative
                      overflow-hidden
                      group
                      z-20
                    "
                  >
                    {/* =================================================
                        ALBUM COVER

                        THIS IS GUARANTEED TO BE AN iTUNES COVER
                        BECAUSE ONLY validAlbums reach this point.
                        ================================================= */}

                    <div className="absolute inset-0 z-0">
                      <img
                        src={currentAlbum.imageUrl}
                        alt={`${currentAlbum.title} by ${currentAlbum.artist}`}
                        className="
                          w-full
                          h-full
                          object-cover
                          opacity-90
                          group-hover:scale-[1.045]
                          transition-transform
                          duration-[1200ms]
                        "
                      />
                    </div>

                    {/* DARK CINEMATIC GRADIENT */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black
                        via-black/20
                        to-transparent
                        z-10
                        pointer-events-none
                      "
                    />

                    {/* TOP GLOSS */}

                    <div
                      className="
                        absolute
                        top-0
                        left-0
                        right-0
                        h-[32%]
                        bg-gradient-to-b
                        from-white/[0.14]
                        via-white/[0.035]
                        to-transparent
                        pointer-events-none
                        z-20
                      "
                    />

                    {/* PURPLE EDGE */}

                    <div
                      className="
                        absolute
                        inset-0
                        rounded-[2rem]
                        ring-1
                        ring-inset
                        ring-white/10
                        group-hover:ring-[#B146FF]/50
                        transition-all
                        duration-500
                        pointer-events-none
                        z-30
                      "
                    />

                    {/* SUBTLE V WATERMARK */}

                    <span
                      className="
                        absolute
                        top-5
                        right-[-20px]
                        font-['Orbitron']
                        text-[120px]
                        text-white/[0.055]
                        font-black
                        italic
                        select-none
                        z-10
                        pointer-events-none
                      "
                    >
                      V
                    </span>

                    {/* ALBUM INFORMATION */}

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        bottom-0
                        z-40
                        p-7
                        sm:p-8
                      "
                    >
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          py-1.5
                          rounded-full
                          bg-black/45
                          backdrop-blur-md
                          border
                          border-white/10
                          mb-4
                        "
                      >
                        <span
                          className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-[#E11D2E]
                            shadow-[0_0_10px_rgba(225,29,46,0.9)]
                          "
                        />

                        <span
                          className="
                            text-white/75
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                          "
                        >
                          Featured Album
                        </span>
                      </div>

                      <h3
                        className="
                          text-2xl
                          sm:text-3xl
                          font-black
                          text-white
                          tracking-wide
                          uppercase
                          leading-tight
                          drop-shadow-[0_3px_15px_rgba(0,0,0,0.8)]
                        "
                      >
                        {currentAlbum.title}
                      </h3>

                      <p
                        className="
                          text-[#D08CFF]
                          text-base
                          sm:text-lg
                          mt-2
                          font-medium
                          tracking-wide
                        "
                      >
                        {currentAlbum.artist}
                      </p>

                      {/* NO PRICE HERE */}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* SLIDER DOTS */}

                {sliderItems.length > 1 && (
                  <div
                    className="
                      absolute
                      -bottom-4
                      flex
                      items-center
                      justify-center
                      gap-3
                      w-full
                      z-40
                    "
                  >
                    {sliderItems.map(
                      (album, index) => (
                        <button
                          key={`dot-${
                            album.id ||
                            album._id ||
                            index
                          }`}
                          type="button"
                          onClick={() =>
                            setCurrentSlide(index)
                          }
                          aria-label={`Show ${album.title}`}
                          className={`
                            h-1.5
                            rounded-full
                            transition-all
                            duration-500
                            ${
                              index === currentSlide
                                ? `
                                  w-11
                                  bg-[#B146FF]
                                  shadow-[0_0_16px_rgba(177,70,255,0.9)]
                                `
                                : `
                                  w-2
                                  bg-white/20
                                  hover:bg-white/50
                                `
                            }
                          `}
                        />
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              /*
               * This is NOT a hero album card.
               * It only appears when there are zero albums
               * with valid iTunes artwork.
               */
              <div
                className="
                  w-[330px]
                  h-[450px]
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.025]
                  flex
                  items-center
                  justify-center
                  text-center
                  p-8
                "
              >
                <div>
                  <Disc3
                    className="
                      w-12
                      h-12
                      mx-auto
                      mb-4
                      text-white/15
                    "
                  />

                  <p
                    className="
                      text-white/35
                      text-xs
                      uppercase
                      tracking-[0.2em]
                    "
                  >
                    No album artwork available
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            FEATURE STRIP
            ================================================= */}

        <section
          className="
            w-full
            border-t
            border-white/[0.08]
            border-b
            border-white/[0.05]
            py-9
            mb-8
          "
        >
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-5
              gap-6
            "
          >
            {FEATURES.map(
              (feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      group
                    "
                  >
                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-[#E11D2E]/10
                        border
                        border-[#E11D2E]/10
                        flex
                        items-center
                        justify-center
                        group-hover:bg-[#E11D2E]/20
                        group-hover:border-[#E11D2E]/30
                        transition-all
                        flex-shrink-0
                      "
                    >
                      <Icon
                        className="
                          w-5
                          h-5
                          text-[#E11D2E]
                        "
                      />
                    </div>

                    <div className="min-w-0">
                      <h4
                        className="
                          text-xs
                          sm:text-sm
                          font-bold
                          text-white
                          uppercase
                          tracking-wider
                          truncate
                        "
                      >
                        {feature.title}
                      </h4>

                      <p
                        className="
                          text-[9px]
                          sm:text-[10px]
                          text-[#8F8A92]
                          tracking-wide
                          mt-0.5
                        "
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        </section>
      </main>

      {/* ===================================================
          MARQUEES
          =================================================== */}

      {(topSales.length > 0 ||
        topArtists.length > 0) && (
        <section
          className="
            w-full
            bg-[#060509]/85
            border-t
            border-white/[0.05]
            py-12
            backdrop-blur-xl
            relative
            overflow-hidden
            z-10
          "
        >
          {/* =================================================
              TOP SALES
              ================================================= */}

          {topSales.length > 0 && (
            <div className="mb-14">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-6
                  sm:px-10
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
                      w-9
                      h-9
                      rounded-xl
                      bg-[#E11D2E]/10
                      border
                      border-[#E11D2E]/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Flame
                      className="
                        w-5
                        h-5
                        text-[#E11D2E]
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[#E11D2E]
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                      "
                    >
                      Trending Collection
                    </p>

                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-white
                        tracking-widest
                        uppercase
                      "
                    >
                      Top Sales of the Week
                    </h3>
                  </div>
                </div>

                <Link
                  to="/albums"
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    text-white/40
                    hover:text-white
                    text-xs
                    uppercase
                    tracking-widest
                    transition-colors
                  "
                >
                  View All
                  <ArrowRight
                    className="w-4 h-4"
                  />
                </Link>
              </div>

              <div className="w-full overflow-hidden">
                <motion.div
                  className="
                    flex
                    gap-5
                    w-max
                    pl-6
                  "
                  animate={{
                    x: ["-50%", "0%"],
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[...topSales, ...topSales].map(
                    (item, index) => (
                      <div
                        key={`sales-${
                          item.id ||
                          item._id ||
                          index
                        }-${index}`}
                        className="
                          w-[340px]
                          sm:w-[360px]
                          h-[118px]
                          bg-[#120E14]/90
                          border
                          border-white/[0.08]
                          rounded-2xl
                          p-4
                          flex
                          items-center
                          gap-5
                          flex-shrink-0
                          hover:border-[#E11D2E]/60
                          hover:bg-[#170E13]
                          hover:-translate-y-1
                          transition-all
                          group
                        "
                      >
                        <div
                          className="
                            w-20
                            h-20
                            rounded-xl
                            bg-black
                            flex-shrink-0
                            overflow-hidden
                            border
                            border-white/10
                            shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                          "
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            loading="lazy"
                            className="
                              w-full
                              h-full
                              object-cover
                              group-hover:scale-110
                              transition-transform
                              duration-700
                            "
                          />
                        </div>

                        <div
                          className="
                            flex
                            flex-col
                            overflow-hidden
                            min-w-0
                          "
                        >
                          <span
                            className="
                              text-[#E11D2E]
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[0.2em]
                              mb-1
                            "
                          >
                            {item.genre ||
                              item.primaryGenreName ||
                              "Album"}
                          </span>

                          <h4
                            className="
                              text-white
                              text-sm
                              sm:text-base
                              font-semibold
                              truncate
                              tracking-wide
                            "
                          >
                            {item.title}
                          </h4>

                          <p
                            className="
                              text-white/40
                              text-xs
                              truncate
                              mt-1
                            "
                          >
                            {item.artist}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              </div>
            </div>
          )}

          {/* =================================================
              TOP ARTISTS
              ================================================= */}

          {topArtists.length > 0 && (
            <div>
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-6
                  sm:px-10
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
                      w-9
                      h-9
                      rounded-xl
                      bg-[#6A00FF]/10
                      border
                      border-[#B146FF]/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Star
                      className="
                        w-5
                        h-5
                        text-[#B146FF]
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[#B146FF]
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                      "
                    >
                      From Your Collection
                    </p>

                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-white
                        tracking-widest
                        uppercase
                      "
                    >
                      Top Artists & Bands
                    </h3>
                  </div>
                </div>

                <Link
                  to="/albums"
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    text-white/40
                    hover:text-white
                    text-xs
                    uppercase
                    tracking-widest
                    transition-colors
                  "
                >
                  Explore
                  <ArrowRight
                    className="w-4 h-4"
                  />
                </Link>
              </div>

              <div className="w-full overflow-hidden">
                <motion.div
                  className="
                    flex
                    gap-5
                    w-max
                    pl-6
                  "
                  animate={{
                    x: ["-50%", "0%"],
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[...topArtists, ...topArtists].map(
                    (artist, index) => (
                      <div
                        key={`artist-${artist.name}-${index}`}
                        className="
                          w-[340px]
                          sm:w-[360px]
                          h-[118px]
                          bg-[#120E14]/90
                          border
                          border-white/[0.08]
                          rounded-2xl
                          p-4
                          flex
                          items-center
                          gap-5
                          flex-shrink-0
                          hover:border-[#B146FF]/60
                          hover:bg-[#130D1B]
                          hover:-translate-y-1
                          transition-all
                          group
                        "
                      >
                        {/* ARTIST IMAGE */}

                        <div
                          className="
                            w-20
                            h-20
                            rounded-full
                            bg-black
                            flex-shrink-0
                            overflow-hidden
                            border
                            border-[#B146FF]/25
                            shadow-[0_0_25px_rgba(177,70,255,0.12)]
                          "
                        >
                          <img
                            src={artist.image}
                            alt={`${artist.name} artwork`}
                            loading="lazy"
                            className="
                              w-full
                              h-full
                              object-cover
                              group-hover:scale-110
                              transition-transform
                              duration-700
                            "
                          />
                        </div>

                        {/* ARTIST INFO */}

                        <div
                          className="
                            flex
                            flex-col
                            overflow-hidden
                            min-w-0
                          "
                        >
                          <span
                            className="
                              text-[#B146FF]
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[0.2em]
                              mb-1
                            "
                          >
                            {artist.genre ||
                              "Music"}
                          </span>

                          <h4
                            className="
                              text-white
                              text-sm
                              sm:text-base
                              font-semibold
                              truncate
                              tracking-wide
                            "
                          >
                            {artist.name}
                          </h4>

                          <p
                            className="
                              text-white/40
                              text-xs
                              mt-1
                            "
                          >
                            {artist.albumCount}{" "}
                            {artist.albumCount === 1
                              ? "Album"
                              : "Albums"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;