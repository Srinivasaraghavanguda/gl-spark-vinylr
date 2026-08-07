import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut, Trash2, Package, Heart, Settings, Key, Edit3, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { name: 'HOME', path: '/' },
  { name: 'ALBUMS', path: '/albums' },
  { name: 'MERCH', path: '/merch' },
  { name: 'TRENDING', path: '/trending' },
  { name: 'CONCERTS', path: '/concerts' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for closing dropdowns on outside click
  const cartRef = useRef(null);
  const profileRef = useRef(null);

  // 1. Scroll Effect for Glossy Glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Listen to Cart Updates globally
  useEffect(() => {
    const fetchCart = () => {
      const cart = JSON.parse(localStorage.getItem('vinylr_cart') || '[]');
      setCartItems(cart);
    };
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, []);

  // 3. Click Outside Listeners for Dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) setIsCartOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cart Operations
  const removeFromCart = (cartKey) => {
    const updatedCart = cartItems.filter(item => item.cartKey !== cartKey);
    setCartItems(updatedCart);
    localStorage.setItem('vinylr_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Item removed', { style: { background: '#120E14', color: '#fff', border: '1px solid #BF953F' } });
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('vinylr_jwt');
    toast.success('Successfully logged out.', { style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 font-['Oswald'] ${
      isScrolled 
      ? 'bg-gradient-to-r from-[#1A1500]/95 via-[#332700]/95 to-[#1A1500]/95 backdrop-blur-xl py-3 shadow-[0_10px_40px_rgba(191,149,63,0.3)] border-b border-[#BF953F]/40' 
      : 'bg-gradient-to-r from-[#1A1500]/80 via-[#332700]/80 to-[#1A1500]/80 py-5 backdrop-blur-sm border-b border-[#BF953F]/20'
    }`}>
      <div className="max-w-[1700px] mx-auto px-6 flex items-center justify-between gap-8">
        
        {/* LOGO (Left) */}
        <Link to="/" className="flex-shrink-0 font-['Orbitron'] text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FCF6BA] via-[#BF953F] to-[#AA771C] drop-shadow-[0_0_15px_rgba(191,149,63,0.6)] transform -skew-x-6">
          VINYLR
        </Link>

        {/* DESKTOP NAV CARDS (Center - Spacious & Capitalized) */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-4">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg ${
                  isActive 
                  ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#BF953F] text-black shadow-[0_0_20px_rgba(252,246,186,0.6)] scale-105' 
                  : 'bg-[#0B0B0F]/60 border border-[#BF953F]/30 text-[#FCF6BA]/70 hover:text-black hover:bg-gradient-to-r hover:from-[#BF953F] hover:to-[#FCF6BA] hover:border-transparent'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* ICONS & MENUS (Right) */}
        <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
          
          {/* CART SYSTEM */}
          <div className="relative" ref={cartRef}>
            <button 
              onClick={() => { setIsCartOpen(!isCartOpen); setIsProfileOpen(false); }}
              className="w-12 h-12 rounded-xl bg-[#0B0B0F]/60 border border-[#BF953F]/30 flex items-center justify-center text-[#FCF6BA] hover:bg-[#BF953F]/20 hover:border-[#FCF6BA] transition-all relative group shadow-[0_0_15px_rgba(191,149,63,0.2)]"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-2 -right-2 bg-gradient-to-r from-[#E11D2E] to-[#8B0E1A] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(225,29,46,0.8)] border border-white/20">
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* MINI-CART DROPDOWN */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-16 w-80 bg-[#120E14]/95 backdrop-blur-2xl border border-[#BF953F]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div className="p-4 border-b border-[#BF953F]/20 bg-gradient-to-r from-[#1A1500] to-[#332700]">
                    <h3 className="text-[#FCF6BA] font-bold tracking-widest uppercase">Your Cart ({cartItemCount})</h3>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center text-[#A09CA3] py-6 font-light uppercase tracking-widest text-sm">Cart is empty</div>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-3 bg-[#0B0B0F]/50 p-2 rounded-xl border border-white/5">
                          <div className="w-12 h-12 bg-[#1A1A1A] rounded-lg flex items-center justify-center border border-white/10 text-[8px] text-white/40 font-bold uppercase overflow-hidden">
                            {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover"/> : item.type || item.category || 'IMG'}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-white text-xs font-bold truncate">{item.title}</h4>
                            <p className="text-[#BF953F] text-xs">₹{item.price} <span className="text-white/50">x {item.quantity}</span></p>
                          </div>
                          <button onClick={() => removeFromCart(item.cartKey)} className="p-2 text-[#A09CA3] hover:text-[#E11D2E] transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-[#BF953F]/20 bg-[#0B0B0F]/80">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#A09CA3] text-sm uppercase tracking-widest">Subtotal</span>
                        <span className="text-[#FCF6BA] font-bold text-lg">₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <button onClick={() => { setIsCartOpen(false); navigate('/cart'); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] hover:from-[#FCF6BA] hover:to-[#BF953F] text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(191,149,63,0.4)] flex items-center justify-center gap-2 group">
                        BUY NOW <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER PROFILE SYSTEM */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsCartOpen(false); }}
              className="w-12 h-12 rounded-xl bg-[#0B0B0F]/60 border border-[#BF953F]/30 flex items-center justify-center text-[#FCF6BA] hover:bg-[#BF953F]/20 hover:border-[#FCF6BA] transition-all group shadow-[0_0_15px_rgba(191,149,63,0.2)]"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* USER PROFILE DROPDOWN */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-16 w-72 bg-[#120E14]/95 backdrop-blur-2xl border border-[#BF953F]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                  
                  {/* Profile Header (Avatar & Name) */}
                  <div className="p-6 border-b border-[#BF953F]/20 bg-gradient-to-b from-[#332700] to-[#1A1500] flex flex-col items-center">
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full bg-[#0B0B0F] border-2 border-[#FCF6BA] shadow-[0_0_15px_rgba(252,246,186,0.3)] flex items-center justify-center text-[#FCF6BA] overflow-hidden">
                        <User className="w-10 h-10 opacity-50" />
                        {/* Add <img src="URL"/> here when user uploads a photo */}
                      </div>
                      <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#E11D2E] rounded-full border-2 border-[#1A1500] flex items-center justify-center text-white hover:bg-[#B146FF] transition-colors shadow-lg">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-white font-bold text-lg tracking-wide">Audiofile User</h3>
                    <p className="text-[#BF953F] text-xs tracking-widest font-light">user@vinylr.com</p>
                  </div>
                  
                  {/* Menu Options */}
                  <div className="p-2 space-y-1 bg-[#0B0B0F]/80">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#BF953F]/10 text-[#A09CA3] hover:text-[#FCF6BA] transition-colors group">
                      <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold uppercase tracking-widest">My Orders & Tracking</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#E11D2E]/10 text-[#A09CA3] hover:text-[#E11D2E] transition-colors group">
                      <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold uppercase tracking-widest">Favourited Items</span>
                    </button>

                    <div className="h-px w-full bg-white/5 my-1" />

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#BF953F]/10 text-[#A09CA3] hover:text-white transition-colors group">
                      <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      <span className="text-sm font-bold uppercase tracking-widest">Profile Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#BF953F]/10 text-[#A09CA3] hover:text-white transition-colors group">
                      <Key className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold uppercase tracking-widest">Change Password</span>
                    </button>

                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#E11D2E]/20 text-[#E11D2E] transition-colors group mt-2 border border-transparent hover:border-[#E11D2E]/30">
                      <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-bold uppercase tracking-widest">Log Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="lg:hidden text-[#FCF6BA] bg-[#0B0B0F]/60 p-2 rounded-xl border border-[#BF953F]/30" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#1A1500]/95 backdrop-blur-2xl border-b border-[#BF953F]/30 overflow-hidden mt-4">
            <div className="flex flex-col px-6 py-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`p-4 rounded-xl text-center text-lg font-bold tracking-widest uppercase shadow-md ${location.pathname === link.path ? 'bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-black' : 'bg-[#0B0B0F]/50 text-[#FCF6BA] border border-[#BF953F]/20'}`}>
                  {link.name}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#BF953F]/20">
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-xl text-center bg-[#0B0B0F]/50 text-white font-bold uppercase border border-white/10 flex flex-col items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#FCF6BA]" /> Cart ({cartItemCount})
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="p-4 rounded-xl text-center bg-[#E11D2E]/10 text-[#E11D2E] font-bold uppercase border border-[#E11D2E]/20 flex flex-col items-center gap-2">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;