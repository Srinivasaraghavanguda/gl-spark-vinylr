import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff, Mail, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // AUTO-FILL LOGIC: Check local storage on page load
  useEffect(() => {
    const savedEmail = localStorage.getItem('vinylr_saved_email');

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading('Authenticating...', {
      style: {
        background: '#120E14',
        color: '#fff',
        border: '1px solid #E11D2E'
      }
    });

    try {
      // Calls your Spring Boot Auth Controller: @PostMapping("/auth/login")
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // Store authenticated user information
      localStorage.setItem('vinylr_jwt', response.data.token);
      localStorage.setItem('vinylr_user', response.data.username);
      localStorage.setItem('vinylr_role', response.data.role);

      // Remember email only (never password)
      if (rememberMe) {
        localStorage.setItem('vinylr_saved_email', email);
      } else {
        localStorage.removeItem('vinylr_saved_email');
      }

      // Notify Navbar immediately
      window.dispatchEvent(new Event('storage'));

      toast.success('Welcome back to VinylR!', {
        id: loadingToast,
        style: {
          background: '#E11D2E',
          color: '#fff'
        }
      });

      // Redirect to Home
      setTimeout(() => navigate('/'), 800);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Invalid credentials. Please try again or sign up.';

      toast.error(errorMsg, {
        id: loadingToast,
        style: {
          background: '#120E14',
          color: '#fff',
          border: '1px solid #E11D2E'
        }
      });
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
          ATMOSPHERIC BACKGROUND
          ========================================================= */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

        {/* Thick red smoke */}
        <motion.div
          animate={{
            x: [0, 35, -15, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.16, 0.96, 1],
            opacity: [0.14, 0.28, 0.18, 0.14]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            top-[-18%]
            left-[-12%]
            w-[750px]
            h-[750px]
            rounded-full
            bg-[#E11D2E]
            blur-[170px]
          "
        />

        {/* Purple smoke */}
        <motion.div
          animate={{
            x: [0, -35, 20, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.2, 0.95, 1],
            opacity: [0.10, 0.24, 0.14, 0.10]
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            bottom-[-25%]
            right-[-12%]
            w-[850px]
            h-[850px]
            rounded-full
            bg-[#6A00FF]
            blur-[180px]
          "
        />

        {/* Subtle center light */}
        <motion.div
          animate={{
            opacity: [0.04, 0.10, 0.04],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[600px]
            h-[600px]
            rounded-full
            bg-[#B146FF]
            blur-[220px]
          "
        />

        {/* Vignette */}
        <div className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_20%,#08080C_88%)]
        " />
      </div>

      {/* =========================================================
          MAIN LOGIN SHELL
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

          {/* Decorative glow behind vinyl */}
          <div className="
            absolute
            top-[12%]
            right-[2%]
            w-[520px]
            h-[520px]
            rounded-full
            bg-[#E11D2E]/10
            blur-[100px]
          " />

          {/* Same cinematic vinyl */}
          <div className="
            absolute
            top-[6%]
            right-[-30%]
            scale-[0.78]
            opacity-80
            brightness-125
            contrast-125
            drop-shadow-[0_0_70px_rgba(225,29,46,0.32)]
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
                border-[#E11D2E]/30
                bg-[#E11D2E]/5
                backdrop-blur-xl
                text-[#FF6973]
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                mb-7
              "
            >
              <Sparkles className="w-3.5 h-3.5" />
              Your music universe
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
                via-[#FF5965]
                to-[#B146FF]
                drop-shadow-[0_0_35px_rgba(225,29,46,0.35)]
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
                Music. Merch. Moments.
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
                Discover timeless music, exclusive merchandise, and
                unforgettable experiences — all in one place.
              </p>
            </motion.div>

            {/* Small trust strip */}
            <div className="
              mt-10
              flex
              flex-wrap
              gap-3
            ">
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
                Secure access
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
                Private account
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            RIGHT LOGIN FORM
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

          {/* Mobile vinyl — keeps same visual identity */}
          <div className="
            lg:hidden
            absolute
            top-[-190px]
            right-[-190px]
            scale-[0.42]
            opacity-35
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

            {/* Card glow */}
            <div className="
              absolute
              -inset-2
              bg-[#E11D2E]/10
              blur-3xl
              rounded-[2.5rem]
              pointer-events-none
            " />

            <div className="
              relative
              bg-[#120E14]/88
              backdrop-blur-3xl
              border
              border-white/10
              rounded-[2rem]
              p-6
              sm:p-9
              xl:p-11
              shadow-[0_25px_80px_rgba(0,0,0,0.5)]
            ">

              {/* Accent line */}
              <div className="
                absolute
                top-0
                left-10
                right-10
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#E11D2E]
                to-transparent
                shadow-[0_0_15px_rgba(225,29,46,0.7)]
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
                  Welcome back
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
                  Log in to VinylR
                </h2>

                <p className="
                  text-sm
                  text-white/35
                  mt-3
                ">
                  Enter your account details to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
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
                      group-focus-within:text-[#FF5965]
                      transition-colors
                    " />

                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
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
                        focus:border-[#E11D2E]/70
                        focus:ring-2
                        focus:ring-[#E11D2E]/10
                        transition-all
                        font-light
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
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
                      group-focus-within:text-[#FF5965]
                      transition-colors
                    " />

                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="
                        w-full
                        bg-[#08080C]/65
                        border
                        border-white/10
                        rounded-xl
                        py-4
                        pl-12
                        pr-12
                        text-sm
                        sm:text-base
                        text-white
                        placeholder-white/20
                        focus:outline-none
                        focus:border-[#E11D2E]/70
                        focus:ring-2
                        focus:ring-[#E11D2E]/10
                        transition-all
                        font-light
                      "
                    />

                    {/* Kept as the existing visual icon; login functionality is unchanged */}
                    <EyeOff className="
                      w-5
                      h-5
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-white/25
                      hover:text-white/70
                      transition-colors
                      cursor-pointer
                    " />
                  </div>
                </div>

                {/* Options */}
                <div className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                  pt-1
                ">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="
                      flex
                      items-center
                      gap-2.5
                      group
                    "
                  >
                    <span className={`
                      w-5
                      h-5
                      rounded-md
                      border
                      flex
                      items-center
                      justify-center
                      transition-all
                      ${
                        rememberMe
                          ? 'bg-[#E11D2E] border-[#E11D2E] shadow-[0_0_12px_rgba(225,29,46,0.35)]'
                          : 'border-white/20 bg-white/[0.02] group-hover:border-white/40'
                      }
                    `}>
                      {rememberMe && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>

                    <span className="
                      text-sm
                      text-white/45
                      group-hover:text-white/70
                      transition-colors
                    ">
                      Remember me
                    </span>
                  </button>

                  <button
                    type="button"
                    className="
                      text-sm
                      text-[#FF5965]
                      hover:text-[#B146FF]
                      transition-colors
                    "
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login button */}
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
                    from-[#8B0E1A]
                    via-[#E11D2E]
                    to-[#B146FF]
                    hover:brightness-110
                    shadow-[0_0_25px_rgba(225,29,46,0.3)]
                    hover:shadow-[0_0_35px_rgba(225,29,46,0.48)]
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
                  Log In
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              {/* Signup */}
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
                  New here?
                </span>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              <p className="
                text-center
                text-sm
                text-white/40
                font-light
              ">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="
                    text-[#FF5965]
                    font-semibold
                    hover:text-[#B146FF]
                    transition-colors
                  "
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Login;