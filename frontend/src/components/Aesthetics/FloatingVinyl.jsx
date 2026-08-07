import React from 'react';
import { motion } from 'framer-motion';

const FloatingVinyl = () => {
  return (
    /* This container provides the 3D perspective context */
    <div className="absolute inset-0 z-[-1] pointer-events-none perspective-[1500px]">
      
      {/* 
          This is the primary vinyl element.
          We apply initial rotations (Inclined Slope) and an animation.
          The animation rotates around X and Y slowly (the "Side Panning" feel).
      */}
      <motion.div
        initial={{ rotateY: -35, rotateX: 20, skewX: 5 }} // Inclined slope setup
        animate={{
          rotateY: [-35, -20, -35], // Slow side panning
          rotateX: [20, 25, 20], // subtle slope movement
          rotate: 360 // Continuous rotation
        }}
        transition={{
          rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 10, repeat: Infinity, ease: "linear" },
          rotate: { duration: 40, repeat: Infinity, ease: "linear" }
        }}
        className="absolute -top-16 -right-16 w-[700px] h-[700px] rounded-full group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/*
            Vinyl Grooves & Color
            The black of the vinyl is visible with glossy texture.
        */}
        <div className="absolute inset-0 rounded-full bg-black border-[15px] border-white/5 opacity-80"
             style={{
               backgroundImage: `repeating-radial-gradient(circle at center, #0B0B0F 0px, #0B0B0F 2px, #120E14 2px, #120E14 4px)`, // Deep grooves
               boxShadow: '0 0 100px 5px rgba(225, 29, 46, 0.2), inset 0 0 100px 5px rgba(225, 29, 46, 0.3)' // Crimson Glow
             }}/>

        {/* 
            Glossy Reflective Overlay
            Creates the shiny, reflective surface.
        */}
        <div className="absolute inset-0 rounded-full opacity-60 mix-blend-screen pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(210deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`, // Sharp gloss lines
             }}/>

        {/* Inner Label */}
        <div className="absolute inset-48 rounded-full bg-[#120E14] border-4 border-white/10 flex items-center justify-center backdrop-blur-md">
          <span className="font-['Orbitron'] text-9xl text-white/10 font-black italic">V</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingVinyl;