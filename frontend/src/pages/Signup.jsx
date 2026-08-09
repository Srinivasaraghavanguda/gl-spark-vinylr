import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading('Forging your account...', {
      style: {
        background: '#120E14',
        color: '#fff',
        border: '1px solid #B146FF'
      }
    });

    try {
      // Calls your Spring Boot Auth Controller: @PostMapping("/auth/register")
      await api.post('/auth/register', formData);

      toast.success('Account created! Please log in.', {
        id: loadingToast,
        style: {
          background: '#B146FF',
          color: '#fff'
        }
      });

      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      // HANDLE EXISTING USER ERROR (Assume Spring Boot returns 409)
      if (error.response && error.response.status === 409) {
        toast.error(
          'A user with this email already has an account.',
          {
            id: loadingToast,
            style: {
              background: '#120E14',
              color: '#fff',
              border: '1px solid #E11D2E'
            }
          }
        );
      } else {
        const errorMsg =
          error.response?.data?.message ||
          'Failed to create account. Try again.';

        toast.error(errorMsg, {
          id: loadingToast,
          style: {
            background: '#120E14',
            color: '#fff',
            border: '1px solid #E11D2E'
          }
        });
      }
    }
  };

  return (
    <div className="
      min-h-screen
      bg-[#08080C]
      text-white
      relative
      overflow-hidden
      flex
      items-center
      justify-center
      px-4
      sm:px-6
      lg:px-8
      py-10
      lg:py-0
    ">

      {/* =========================================================
          CINEMATIC BACKGROUND
          ========================================================= */}

      <div className="
        absolute
        inset-0
        overflow-hidden
        pointer-events-none
        z-0
      ">

        {/* Thick purple smoke */}
        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 25, -15, 0],
            scale: [1, 1.18, 0.96, 1],
            opacity: [0.12, 0.28, 0.16, 0.12]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            top-[-18%]
            right-[-12%]
            w-[800px]
            h-[800px]
            rounded-full
            bg-[#6A00FF]
            blur-[170px]
          "
        />

        {/* Red smoke */}
        <motion.div
          animate={{
            x: [0, 35, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.15, 0.94, 1],
            opacity: [0.10, 0.25, 0.15, 0.10]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            bottom-[-22%]
            left-[-12%]
            w-[850px]
            h-[850px]
            rounded-full
            bg-[#E11D2E]
            blur-[180px]
          "
        />

        {/* Central purple glow */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.04, 0.10, 0.04]
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[650px]
            h-[650px]
            rounded-full
            bg-[#B146FF]
            blur-[220px]
          "
        />

        <div className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_18%,#08080C_90%)]
        " />
      </div>

      {/* =========================================================
          MAIN SIGNUP SHELL
          ========================================================= */}

      <div className="
        relative
        z-10
        w-full
        max-w-[1450px]
        min-h-[720px]
        lg:h-[calc(100vh-80px)]
        max-h-[900px]
        grid
        grid-cols-1
        lg:grid-cols-[1.08fr_0.92fr]
        rounded-[2.5rem]
        border
        border-white/10
        bg-[#0E0B11]/45
        backdrop-blur-xl
        shadow-[0_30px_120px_rgba(0,0,0,0.65)]
        overflow-hidden
      ">

        {/* =======================================================
            LEFT BRANDING
            ======================================================= */}

        <section className="
          hidden
          lg:flex
          relative
          flex-col
          justify-center
          overflow-hidden
          px-12
          xl:px-20
          py-12
          border-r
          border-white/8
        ">

          {/* Ambient glow */}
          <div className="
            absolute
            top-[10%]
            right-[0%]
            w-[560px]
            h-[560px]
            rounded-full
            bg-[#6A00FF]/10
            blur-[110px]
          " />

          {/* Same cinematic vinyl */}
          <div className="
            absolute
            top-[5%]
            right-[-30%]
            scale-[0.78]
            opacity-80
            brightness-125
            contrast-125
            drop-shadow-[0_0_70px_rgba(177,70,255,0.32)]
            pointer-events-none
          ">
            <FloatingVinyl />
          </div>

          <div className="relative z-10 max-w-xl">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                border
                border-[#B146FF]/30
                bg-[#B146FF]/5
                backdrop-blur-xl
                text-[#C77DFF]
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                mb-7
              "
            >
              <Sparkles className="w-3.5 h-3.5" />
              Join the movement
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="
                font-['Orbitron']
                text-6xl
                xl:text-8xl
                leading-[0.86]
                font-black
                italic
                tracking-[-0.07em]
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-white
                via-[#C77DFF]
                to-[#6A00FF]
                drop-shadow-[0_0_35px_rgba(106,0,255,0.38)]
                select-none
              "
            >
              VINYLR
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <h2 className="
                text-lg
                xl:text-2xl
                tracking-[0.22em]
                font-bold
                text-white
                uppercase
                mt-7
              ">
                Join The Movement.
              </h2>

              <p className="
                text-[#A09CA3]
                text-base
                xl:text-lg
                max-w-md
                font-light
                leading-relaxed
                mt-5
              ">
                Create your account to unlock limited drops, live concert
                experiences, and your personal high-fidelity catalog.
              </p>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-3">

              <div className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                bg-black/25
                border
                border-white/8
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-white/35
              ">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B146FF]" />
                Secure signup
              </div>

              <div className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                bg-black/25
                border
                border-white/8
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-white/35
              ">
                <Lock className="w-3.5 h-3.5 text-[#FF5965]" />
                Your account
              </div>

            </div>
          </div>
        </section>

        {/* =======================================================
            SIGNUP FORM
            ======================================================= */}

        <section className="
          relative
          flex
          items-center
          justify-center
          p-5
          sm:p-8
          lg:p-12
          xl:p-16
        ">

          {/* Mobile vinyl */}
          <div className="
            lg:hidden
            absolute
            top-[-190px]
            right-[-190px]
            scale-[0.42]
            opacity-30
            pointer-events-none
          ">
            <FloatingVinyl />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 45, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[500px] relative"
          >

            <div className="
              absolute
              -inset-2
              bg-[#6A00FF]/10
              blur-3xl
              rounded-[2.5rem]
              pointer-events-none
            " />

            <div className="
              relative
              bg-[#120E14]/88
              backdrop-blur-3xl
              border
              border-[#B146FF]/20
              rounded-[2rem]
              p-6
              sm:p-9
              xl:p-11
              shadow-[0_25px_80px_rgba(0,0,0,0.5)]
            ">

              {/* Purple accent line */}
              <div className="
                absolute
                top-0
                left-10
                right-10
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#B146FF]
                to-transparent
                shadow-[0_0_15px_rgba(177,70,255,0.7)]
              " />

              <div className="mb-8">

                <div className="
                  flex
                  items-center
                  gap-2
                  text-[#B146FF]
                  text-[10px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  mb-2
                ">
                  <span className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-[#B146FF]
                    shadow-[0_0_10px_rgba(177,70,255,0.9)]
                  " />
                  New here?
                </div>

                <h2 className="
                  font-['Orbitron']
                  text-3xl
                  sm:text-4xl
                  font-black
                  italic
                  uppercase
                  tracking-tight
                  text-white
                ">
                  Create Account
                </h2>

                <p className="
                  text-sm
                  text-white/35
                  mt-3
                ">
                  Build your VinylR identity and enter the collection.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="signup-name"
                    className="
                      block
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      font-bold
                      text-white/40
                      mb-2
                    "
                  >
                    Full name
                  </label>

                  <div className="relative group">
                    <User className="
                      w-5
                      h-5
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                      group-focus-within:text-[#B146FF]
                      transition-colors
                    " />

                    <input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      className="
                        w-full
                        bg-[#08080C]/65
                        border
                        border-white/10
                        rounded-xl
                        py-4
                        pl-12
                        pr-4
                        text-sm
                        sm:text-base
                        text-white
                        placeholder-white/20
                        focus:outline-none
                        focus:border-[#B146FF]/70
                        focus:ring-2
                        focus:ring-[#B146FF]/10
                        transition-all
                        font-light
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="
                      block
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      font-bold
                      text-white/40
                      mb-2
                    "
                  >
                    Email address
                  </label>

                  <div className="relative group">
                    <Mail className="
                      w-5
                      h-5
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                      group-focus-within:text-[#B146FF]
                      transition-colors
                    " />

                    <input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value
                        })
                      }
                      className="
                        w-full
                        bg-[#08080C]/65
                        border
                        border-white/10
                        rounded-xl
                        py-4
                        pl-12
                        pr-4
                        text-sm
                        sm:text-base
                        text-white
                        placeholder-white/20
                        focus:outline-none
                        focus:border-[#B146FF]/70
                        focus:ring-2
                        focus:ring-[#B146FF]/10
                        transition-all
                        font-light
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="signup-password"
                    className="
                      block
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      font-bold
                      text-white/40
                      mb-2
                    "
                  >
                    Password
                  </label>

                  <div className="relative group">
                    <Lock className="
                      w-5
                      h-5
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                      group-focus-within:text-[#B146FF]
                      transition-colors
                    " />

                    <input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value
                        })
                      }
                      className="
                        w-full
                        bg-[#08080C]/65
                        border
                        border-white/10
                        rounded-xl
                        py-4
                        pl-12
                        pr-4
                        text-sm
                        sm:text-base
                        text-white
                        placeholder-white/20
                        focus:outline-none
                        focus:border-[#B146FF]/70
                        focus:ring-2
                        focus:ring-[#B146FF]/10
                        transition-all
                        font-light
                      "
                    />
                  </div>
                </div>

                {/* Signup button */}
                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  className="
                    w-full
                    py-4
                    rounded-xl
                    font-black
                    text-base
                    sm:text-lg
                    text-white
                    bg-gradient-to-r
                    from-[#4A00E0]
                    via-[#8B2BE2]
                    to-[#B146FF]
                    hover:from-[#B146FF]
                    hover:via-[#E11D2E]
                    hover:to-[#FF5965]
                    shadow-[0_0_25px_rgba(177,70,255,0.32)]
                    hover:shadow-[0_0_35px_rgba(177,70,255,0.5)]
                    transition-all
                    uppercase
                    tracking-[0.16em]
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  Sign Up
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              {/* Login divider */}
              <div className="
                flex
                items-center
                gap-3
                my-7
              ">
                <div className="h-px flex-1 bg-white/8" />
                <span className="
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-white/20
                ">
                  Already a member?
                </span>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              <p className="
                text-center
                text-sm
                text-white/40
                font-light
              ">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="
                    text-[#B146FF]
                    font-semibold
                    hover:text-[#FF5965]
                    transition-colors
                  "
                >
                  Log In
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Signup;