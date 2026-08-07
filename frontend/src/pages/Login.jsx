import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axiosConfig';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl'; // Import visual component

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
    const loadingToast = toast.loading('Authenticating...', { style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
    
    try {
      // Calls your Spring Boot Auth Controller: @PostMapping("/auth/login")
      const response = await api.post('/auth/login', { email, password });
      
      // 1. Store the JWT securely
      localStorage.setItem('vinylr_jwt', response.data.token);
      
      // 2. Handle "Remember Me" logic without storing passwords locally
      if (rememberMe) {
        localStorage.setItem('vinylr_saved_email', email);
      } else {
        localStorage.removeItem('vinylr_saved_email');
      }

      toast.success('Welcome back to VinylR!', { id: loadingToast, style: { background: '#E11D2E', color: '#fff' } });
      
      // 3. Navigate to home page directly upon validation
      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid credentials. Please try again or sign up.';
      toast.error(errorMsg, { id: loadingToast, style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col lg:flex-row relative overflow-hidden font-['Oswald'] tracking-wide">
      <Toaster position="top-right" />
      
      {/* VOLUMETRIC SMOKE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.1, 0.25, 0.1, 0.3, 0.1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-[#E11D2E] rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.3, 1, 1.4, 1], opacity: [0.1, 0.3, 0.1, 0.2, 0.1] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#6A00FF] rounded-full blur-[150px]" />
      </div>

      {/* LEFT SIDE: Cinematic Branding */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-center px-24 py-12 z-10 min-h-screen">
        
        {/* =========================================
            CINEMATIC SLOPE-PANNED VINYL
            ========================================= */}
        <FloatingVinyl />

        <div className="relative z-10">
          <h1 className="font-['Orbitron'] text-[100px] leading-none font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#E11D2E] to-[#B146FF] drop-shadow-[0_0_30px_rgba(225,29,46,0.4)] mb-6 transform -skew-x-6">
            VINYLR
          </h1>
          <h2 className="text-2xl tracking-[0.15em] font-bold text-white mb-6 uppercase">Music. Merch. Moments.</h2>
          <p className="text-[#A09CA3] text-xl max-w-md font-light leading-relaxed">Discover timeless music, exclusive merchandise, and unforgettable experiences.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 z-10">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md relative">
          <div className="absolute inset-0 bg-[#E11D2E]/20 blur-2xl rounded-3xl" />
          
          <div className="relative bg-[#120E14]/80 backdrop-blur-2xl border border-[#E11D2E]/40 rounded-[2rem] p-10 shadow-[0_0_40px_-10px_rgba(225,29,46,0.3)]">
            <div className="mb-8">
              <h2 className="text-[#B146FF] text-lg font-medium mb-1 tracking-widest uppercase">Welcome Back</h2>
              <h3 className="text-4xl font-bold text-white mb-2 tracking-wide uppercase">Log in to VinylR</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" /> {/* Keep Icon User as requested previously */}
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#E11D2E] transition-all font-light" />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-base text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#E11D2E] transition-all font-light" />
                <EyeOff className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#A09CA3] cursor-pointer hover:text-white transition-colors" />
              </div>

              {/* Form Options (Remember Me) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#E11D2E] border-[#E11D2E]' : 'border-white/20'}`}>
                    {rememberMe && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <label className="text-base text-[#A09CA3] cursor-pointer font-light">Remember Me</label>
                </div>
                <span className="text-base text-[#E11D2E] hover:text-[#B146FF] transition-colors font-light cursor-pointer">Forgot Password?</span>
              </div>

              {/* Maroon Gradient Button */}
              <button type="submit" className="w-full py-4 rounded-xl font-bold text-xl text-white bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] hover:from-[#E11D2E] hover:to-[#B146FF] shadow-[0_0_20px_rgba(225,29,46,0.4)] transition-all uppercase tracking-widest mt-4">
                Log In
              </button>
            </form>

            <p className="text-center text-base text-[#A09CA3] font-light mt-8">
              Don't have an account? <Link to="/signup" className="text-[#E11D2E] font-medium hover:text-[#B146FF] transition-colors">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;