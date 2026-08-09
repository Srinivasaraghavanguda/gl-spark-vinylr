import React from "react";
import { motion } from "framer-motion";

const FloatingVinyl = () => {
  return (
    <div
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
      "
      style={{
        perspective: "1800px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* =====================================================
          THICK RED ATMOSPHERIC SMOKE
          ===================================================== */}

      <motion.div
        animate={{
          scale: [1, 1.12, 0.96, 1],
          x: [0, 25, -20, 0],
          y: [0, -18, 15, 0],
          opacity: [0.42, 0.58, 0.46, 0.42],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[820px]
          h-[820px]
          rounded-full
          bg-[#E11D2E]
          blur-[105px]
          opacity-50
          pointer-events-none
        "
      />

      {/* SECOND THICK RED SMOKE LAYER */}

      <motion.div
        animate={{
          scale: [1.05, 0.92, 1.08, 1.05],
          x: [20, -30, 25, 20],
          y: [-10, 20, -15, -10],
          opacity: [0.28, 0.42, 0.32, 0.28],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[680px]
          h-[680px]
          rounded-full
          bg-[#FF2438]
          blur-[85px]
          pointer-events-none
        "
      />

      {/* SMALLER DEEP RED CORE */}

      <motion.div
        animate={{
          scale: [1, 1.16, 0.94, 1],
          opacity: [0.25, 0.40, 0.28, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[540px]
          h-[540px]
          rounded-full
          bg-[#8B0714]
          blur-[65px]
          pointer-events-none
        "
      />

      {/* =====================================================
          VINYL BODY
          ===================================================== */}

      <motion.div
        initial={{
          rotateY: -28,
          rotateX: 18,
          rotateZ: 18,
        }}
        animate={{
          rotateY: [-28, -20, -28],
          rotateX: [18, 24, 18],
          rotateZ: [18, 19.5, 18],
        }}
        transition={{
          rotateY: {
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateX: {
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateZ: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          absolute
          w-[700px]
          h-[700px]
          sm:w-[760px]
          sm:h-[760px]
          lg:w-[820px]
          lg:h-[820px]
          rounded-full
          group
        "
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* ===================================================
            CONTINUOUSLY ROTATING RECORD SURFACE

            Separate from the 3D tilt so the vinyl rotates
            naturally without destroying the perspective.
            =================================================== */}

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute
            inset-0
            rounded-full
          "
        >
          {/* =================================================
              OUTER SHADOW
              ================================================= */}

          <div
            className="
              absolute
              inset-[-18px]
              rounded-full
              bg-[#E11D2E]/20
              blur-[35px]
              pointer-events-none
            "
          />

          {/* =================================================
              VINYL BASE
              ================================================= */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              border-[10px]
              border-white/[0.045]
              overflow-hidden
            "
            style={{
              backgroundColor: "#09080D",

              backgroundImage: `
                repeating-radial-gradient(
                  circle at center,
                  #050509 0px,
                  #050509 2px,
                  #111018 2px,
                  #111018 4px,
                  #07070B 4px,
                  #07070B 6px
                )
              `,

              boxShadow: `
                0 0 90px rgba(225, 29, 46, 0.28),
                0 0 180px rgba(225, 29, 46, 0.14),
                inset 0 0 100px rgba(177, 70, 255, 0.22),
                inset 0 0 35px rgba(255,255,255,0.06)
              `,
            }}
          />

          {/* =================================================
              OUTER RINGS
              ================================================= */}

          <div
            className="
              absolute
              inset-[22px]
              rounded-full
              border
              border-white/[0.08]
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              inset-[48px]
              rounded-full
              border
              border-[#B146FF]/10
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              inset-[80px]
              rounded-full
              border
              border-white/[0.045]
              pointer-events-none
            "
          />

          {/* =================================================
              INNER GROOVE DETAIL
              ================================================= */}

          <div
            className="
              absolute
              inset-[115px]
              rounded-full
              border
              border-white/[0.05]
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              inset-[135px]
              rounded-full
              border
              border-[#B146FF]/[0.08]
              pointer-events-none
            "
          />

          {/* =================================================
              GLOSSY DIAGONAL REFLECTION
              ================================================= */}

          <motion.div
            animate={{
              rotate: [0, 360],
              opacity: [0.32, 0.55, 0.32],
            }}
            transition={{
              rotate: {
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="
              absolute
              inset-[-5%]
              rounded-full
              pointer-events-none
              mix-blend-screen
            "
            style={{
              background: `
                linear-gradient(
                  125deg,
                  transparent 35%,
                  rgba(255,255,255,0.025) 42%,
                  rgba(255,255,255,0.22) 48%,
                  rgba(177,70,255,0.18) 51%,
                  rgba(255,255,255,0.06) 55%,
                  transparent 63%
                )
              `,
            }}
          />

          {/* =================================================
              SECOND SUBTLE GLOSS
              ================================================= */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              pointer-events-none
              opacity-50
              mix-blend-screen
            "
            style={{
              background: `
                radial-gradient(
                  ellipse at 25% 20%,
                  rgba(255,255,255,0.18),
                  transparent 20%
                ),
                radial-gradient(
                  ellipse at 75% 78%,
                  rgba(177,70,255,0.14),
                  transparent 26%
                )
              `,
            }}
          />

          {/* =================================================
              CENTER LABEL
              ================================================= */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              pointer-events-none
            "
          >
            <div
              className="
                relative
                w-[220px]
                h-[220px]
                sm:w-[245px]
                sm:h-[245px]
                rounded-full
                flex
                items-center
                justify-center
                overflow-hidden
                border-[6px]
                border-[#B146FF]/30
                shadow-[0_0_45px_rgba(177,70,255,0.20)]
              "
              style={{
                background: `
                  radial-gradient(
                    circle at 35% 28%,
                    #E6BFFF 0%,
                    #B146FF 12%,
                    #7418B8 35%,
                    #35105A 65%,
                    #15091F 100%
                  )
                `,
              }}
            >
              {/* Label gloss */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-gradient-to-br
                  from-white/20
                  via-transparent
                  to-black/35
                "
              />

              {/* Label rings */}

              <div
                className="
                  absolute
                  inset-[15px]
                  rounded-full
                  border
                  border-white/15
                "
              />

              <div
                className="
                  absolute
                  inset-[25px]
                  rounded-full
                  border
                  border-black/20
                "
              />

              {/* =================================================
                  VINYLR CENTER TEXT
                  ================================================= */}

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  items-center
                  justify-center
                  select-none
                "
              >
                <span
                  className="
                    font-['Orbitron']
                    text-[31px]
                    sm:text-[36px]
                    font-black
                    italic
                    tracking-[-0.08em]
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-b
                    from-white
                    via-[#F4DFFF]
                    to-[#C77DFF]
                    drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]
                  "
                >
                  VINYLR
                </span>

                <span
                  className="
                    mt-1
                    text-[7px]
                    sm:text-[8px]
                    font-bold
                    tracking-[0.42em]
                    text-white/60
                    uppercase
                  "
                >
                  Music Collection
                </span>
              </div>

              {/* Center spindle */}

              <div
                className="
                  absolute
                  w-5
                  h-5
                  rounded-full
                  bg-[#0B0810]
                  border
                  border-white/20
                  shadow-[0_0_12px_rgba(0,0,0,0.8)]
                "
              />

              <div
                className="
                  absolute
                  w-2
                  h-2
                  rounded-full
                  bg-[#B146FF]
                  shadow-[0_0_8px_rgba(177,70,255,0.9)]
                "
              />
            </div>
          </div>

          {/* =================================================
              SMALL VINYL HIGHLIGHT
              ================================================= */}

          <div
            className="
              absolute
              top-[13%]
              left-[18%]
              w-[110px]
              h-[55px]
              rounded-full
              bg-white/[0.07]
              blur-[20px]
              rotate-[-25deg]
              pointer-events-none
            "
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FloatingVinyl;