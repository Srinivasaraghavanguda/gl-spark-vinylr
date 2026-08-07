import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axiosConfig';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl'; // Import visual component

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Forging your account...', { style: { background: '#120E14', color: '#fff', border: '1px solid #B146FF' } });
    
    try {
      // Calls your Spring Boot Auth Controller: @PostMapping("/auth/register")
      await api.post('/auth/register', formData);
      
      toast.success('Account created! Please log in.', { id: loadingToast, style: { background: '#B146FF', color: '#fff' } });
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (error) {
      // HANDLE EXISTING USER ERROR (Assume Spring Boot returns 409)
      if (error.response && error.response.status === 409) {
        toast.error('A user with this email already has an account.', { id: loadingToast, style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
      } else {
        const errorMsg = error.response?.data?.message || 'Failed to create account. Try again.';
        toast.error(errorMsg, { id: loadingToast, style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col lg:flex-row relative overflow-hidden font-['Oswald'] tracking-wide">
      <Toaster position="top-right" />
      
      {/* BACKGROUND VOLUMETRIC SMOKE (Login Aesthetics) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.1, 0.25, 0.1, 0.3, 0.1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-[#E11D2E] rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.3, 1, 1.4, 1], opacity: [0.1, 0.3, 0.1, 0.2, 0.1] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#6A00FF] rounded-full blur-[150px]" />
      </div>

      {/* LEFT SIDE: Cinematic Branding (Unified Onboarding Vibe) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-center px-24 py-12 z-10 min-h-screen">
        
        {/* =========================================
            CINEMATIC SLOPE-PANNED VINYL
            ========================================= */}
        <FloatingVinyl />

        <div className="relative z-10">
          <h1 className="font-['Orbitron'] text-[100px] leading-none font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#B146FF] to-[#6A00FF] drop-shadow-[0_0_30px_rgba(106,0,255,0.4)] mb-6 transform -skew-x-6">
            VINYLR
          </h1>
          <h2 className="text-2xl tracking-[0.15em] font-bold text-white mb-6 uppercase">Join The Movement.</h2>
          <p className="text-[#A09CA3] text-xl max-w-md font-light leading-relaxed">
            Create an account to access limited drops, live concert tickets, and your personal high-fidelity catalog.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 z-10">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md relative">
          <div className="absolute inset-0 bg-[#6A00FF]/20 blur-2xl rounded-3xl" />
          
          <div className="relative bg-[#120E14]/80 backdrop-blur-2xl border border-[#B146FF]/40 rounded-[2rem] p-10 shadow-[0_0_40px_-10px_rgba(106,0,255,0.3)]">
            <div className="mb-8">
              <h2 className="text-[#B146FF] text-lg font-medium mb-1 tracking-widest uppercase">New Here?</h2>
              <h3 className="text-4xl font-bold text-white mb-2 tracking-wide uppercase">Create Account</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
                <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#B146FF] transition-all font-light" />
              </div>

              {/* Email Input */}
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
                <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#B146FF] transition-all font-light" />
              </div>

              {/* Password Input */}
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" /> {/* Keep Icon User as requested previously */}
                <input type="password" placeholder="Create Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-[#A09CA3] focus:outline-none focus:border-[#B146FF] transition-all font-light" />
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold text-xl text-white bg-gradient-to-r from-[#4A00E0] to-[#B146FF] hover:from-[#B146FF] hover:to-[#E11D2E] shadow-[0_0_20px_rgba(177,70,255,0.4)] transition-all uppercase tracking-widest mt-4">
                Sign Up
              </button>
            </form>

            <p className="text-center text-base text-[#A09CA3] font-light mt-8">
              Already have an account? <Link to="/login" className="text-[#B146FF] font-medium hover:text-[#E11D2E] transition-colors">Log In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;