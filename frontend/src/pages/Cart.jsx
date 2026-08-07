import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShieldCheck, ArrowRight, ShoppingCart, User, Mail, Phone, MapPin, Lock, CheckCircle, Disc3, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axiosConfig';
import FloatingVinyl from '../components/Aesthetics/FloatingVinyl';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  
  // Form & Checkout States
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [checkoutStep, setCheckoutStep] = useState('CART'); // 'CART' | 'PAYMENT' | 'SUCCESS'
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Load Cart from LocalStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('vinylr_cart') || '[]');
    setCartItems(savedCart);
  }, []);

  // Cart Logic
  const updateQuantity = (cartKey, delta) => {
    const updated = cartItems.map(item => {
      if (item.cartKey === cartKey) {
        const newQuantity = item.quantity + delta;
        // Don't exceed stock!
        if (newQuantity > item.stock) {
          toast.error(`Only ${item.stock} left in stock!`, { style: { background: '#120E14', color: '#fff' } });
          return item;
        }
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('vinylr_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (cartKey) => {
    const updated = cartItems.filter(item => item.cartKey !== cartKey);
    setCartItems(updated);
    localStorage.setItem('vinylr_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Financial Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 4999 ? 0 : 150;
  const taxes = subtotal * 0.18; // 18% GST mock
  const total = subtotal + (cartItems.length > 0 ? shipping : 0) + taxes;

  // --- CHECKOUT PROCESS ---
  const handleProceedToPay = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all delivery details.', { style: { background: '#120E14', color: '#fff', border: '1px solid #E11D2E' } });
      return;
    }
    setCheckoutStep('PAYMENT');
  };

  const processMockPayment = async (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error('Enter a valid 4-digit PIN.', { style: { background: '#120E14', color: '#fff' } });
      return;
    }

    setIsProcessing(true);
    
    // 1. FORMAT THE PAYLOAD FOR SPRING BOOT
    const orderPayload = {
      customer: formData,
      items: cartItems.map(item => ({ productId: item.id, productType: item.productType || 'ALBUM', quantity: item.quantity })),
      totalAmount: total,
      taxAmount: taxes,
      shippingAmount: shipping
    };

    try {
      // 2. SEND TO BACKEND: This triggers your backend logic to decrement DB stock!
      const response = await api.post('/orders/checkout', orderPayload);
      
      // If backend works, we use the real receipt ID. If mocked for testing, generate a random one.
      const orderId = response.data?.orderId || `VNLR-${Math.floor(Math.random() * 900000) + 100000}`;
      
      // 3. CLEAN UP & SHOW SUCCESS
      setReceipt({ orderId, date: new Date().toLocaleDateString(), total: total });
      localStorage.removeItem('vinylr_cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      setCheckoutStep('SUCCESS');
    } catch (error) {
      console.warn("Backend order failed. Executing Mock Success for frontend demo.");
      // FALLBACK MOCK FOR UI TESTING (If backend is off)
      setTimeout(() => {
        setReceipt({ orderId: `VNLR-MOCK-${Math.floor(Math.random() * 900000)}`, date: new Date().toLocaleDateString(), total: total });
        localStorage.removeItem('vinylr_cart');
        window.dispatchEvent(new Event('cartUpdated'));
        setCheckoutStep('SUCCESS');
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pt-24 pb-12 font-['Oswald'] relative overflow-hidden flex flex-col items-center">
      <Toaster position="top-right" />
      
      {/* =========================================
          BACKGROUND: THICK SMOKE & FLOATING VINYL
          ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[5%] w-[900px] h-[900px] bg-[#E11D2E] rounded-full blur-[200px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#6A00FF] rounded-full blur-[200px]" />
        
        {/* Cinematic Panned Vinyl Background */}
        <div className="absolute top-[15%] right-[-5%] scale-[1.2] opacity-60">
          <FloatingVinyl />
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-['Orbitron'] text-4xl sm:text-5xl font-black italic tracking-wider uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E11D2E] to-[#8B0E1A] drop-shadow-[0_0_15px_rgba(225,29,46,0.6)]">
            Secure Checkout
          </h1>
          <p className="text-[#A09CA3] text-lg font-light tracking-wide">Review your exclusive items and confirm delivery.</p>
        </div>

        {/* =========================================
            STEP 1: CART & USER DETAILS
            ========================================= */}
        {checkoutStep === 'CART' && (
          cartItems.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 bg-[#120E14]/60 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-[0_0_30px_rgba(225,29,46,0.1)]">
              <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden">
                <ShoppingCart className="w-10 h-10 text-[#E11D2E]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-wide uppercase">Your Cart is Empty</h2>
              <p className="text-[#A09CA3] font-light tracking-wide mb-8">Looks like you haven't added any exclusive drops yet.</p>
              <Link to="/albums" className="px-10 py-4 bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] hover:from-[#E11D2E] hover:to-[#B146FF] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(225,29,46,0.4)] transition-all uppercase tracking-widest flex items-center gap-2 group">
                Explore Catalog <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col xl:flex-row gap-10">
              {/* LEFT: Items List */}
              <div className="flex-1 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, x: -50 }} key={item.cartKey || `${item.productType || 'album'}-${item.id}`} className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#120E14]/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#E11D2E]/50 transition-colors group shadow-lg">
                      {/* BLANK IMAGE PLACEHOLDER */}
                      <div className="w-28 h-28 bg-[#1A1A1A] rounded-xl flex-shrink-0 border border-white/5 relative overflow-hidden">
                        <div className={`absolute top-2 left-2 ${item.badgeColor || 'bg-[#E11D2E]'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-lg`}>
                          {item.type || item.category || 'ITEM'}
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white tracking-wide">{item.title}</h3>
                        <p className="text-sm text-[#A09CA3] font-light tracking-wide mb-2">{item.artist || item.brand}</p>
                        <div className="text-xl font-bold text-[#E11D2E] tracking-wider">₹{item.price.toLocaleString()}</div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <div className="flex items-center gap-4 bg-[#0B0B0F] border border-white/10 rounded-xl p-1.5">
                          <button onClick={() => updateQuantity(item.cartKey || `${item.productType || 'album'}-${item.id}`, -1)} className="p-2 text-[#A09CA3] hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="w-6 text-center font-bold text-white text-lg">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartKey || `${item.productType || 'album'}-${item.id}`, 1)} className="p-2 text-[#A09CA3] hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeItem(item.cartKey || `${item.productType || 'album'}-${item.id}`)} className="p-3 text-[#A09CA3] hover:text-[#E11D2E] hover:bg-[#E11D2E]/10 rounded-xl transition-colors border border-transparent hover:border-[#E11D2E]/30"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* RIGHT: Order Summary & Form */}
              <div className="xl:w-[450px]">
                <form onSubmit={handleProceedToPay} className="sticky top-28 bg-[#120E14]/90 backdrop-blur-2xl border border-[#E11D2E]/30 rounded-[2rem] p-8 shadow-[0_0_40px_-10px_rgba(225,29,46,0.3)]">
                  <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 tracking-wide uppercase">Delivery Details</h2>
                  
                  {/* Glassmorphism Inputs */}
                  <div className="space-y-4 mb-8">
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
                      <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#E11D2E] text-white placeholder-[#A09CA3] font-light" />
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
                      <input type="email" required placeholder="Email Address" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#E11D2E] text-white placeholder-[#A09CA3] font-light" />
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A09CA3]" />
                      <input type="tel" required placeholder="Phone Number" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#E11D2E] text-white placeholder-[#A09CA3] font-light" />
                    </div>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-4 top-1/2 text-[#A09CA3] mt-3" />
                      <textarea required placeholder="Full Delivery Address" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-[#0B0B0F]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 h-24 resize-none text-sm focus:outline-none focus:border-[#E11D2E] text-white placeholder-[#A09CA3] font-light" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 tracking-wide uppercase">Order Summary</h2>
                  
                  <div className="space-y-4 text-base mb-8 font-light tracking-wide">
                    <div className="flex justify-between text-[#A09CA3]"><span>Subtotal</span><span className="text-white font-medium">₹{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[#A09CA3]"><span>Estimated Shipping</span><span className="text-white font-medium">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-[#A09CA3]"><span>Estimated Taxes (GST 18%)</span><span className="text-white font-medium">₹{Math.round(taxes).toLocaleString()}</span></div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-end">
                    <span className="text-[#A09CA3] font-medium tracking-wide uppercase">Grand Total</span>
                    <span className="font-['Orbitron'] text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#E11D2E]">₹{Math.round(total).toLocaleString()}</span>
                  </div>

                  <button type="submit" className="w-full py-5 rounded-xl font-bold text-xl text-white bg-gradient-to-r from-[#8B0E1A] to-[#E11D2E] hover:from-[#E11D2E] hover:to-[#B146FF] shadow-[0_0_20px_rgba(225,29,46,0.5)] transition-all flex items-center justify-center gap-3 group uppercase tracking-widest">
                    <span>Pay Securely</span>
                    <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#A09CA3] tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-[#E11D2E]" />
                    <span>Payments secured by VinylR Order API</span>
                  </div>
                </form>
              </div>
            </div>
          )
        )}

        {/* =========================================
            STEP 2: PAYMENT GATEWAY MODAL
            ========================================= */}
        <AnimatePresence>
          {checkoutStep === 'PAYMENT' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-[#120E14] border border-[#E11D2E]/40 rounded-3xl p-10 max-w-md w-full shadow-[0_0_50px_rgba(225,29,46,0.2)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0E1A] via-[#E11D2E] to-[#6A00FF]" />
                
                <h2 className="font-['Orbitron'] text-2xl font-black text-white mb-2 uppercase tracking-widest">VinylR Pay</h2>
                <p className="text-[#A09CA3] text-sm font-light mb-8">Enter your 4-digit mock secure PIN to authorize ₹{Math.round(total).toLocaleString()}</p>
                
                <form onSubmit={processMockPayment}>
                  <div className="flex justify-center gap-4 mb-8">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-12 h-14 bg-[#0B0B0F] border border-white/20 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                        {pin.length >= i ? '*' : ''}
                      </div>
                    ))}
                  </div>
                  
                  <input type="password" maxLength="4" autoFocus value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} className="absolute opacity-0 -z-10" />

                  <button disabled={isProcessing} type="submit" className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#E11D2E] hover:bg-[#B146FF] transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Authorize Payment'}
                  </button>
                  <button type="button" onClick={() => setCheckoutStep('CART')} className="w-full mt-4 py-3 text-[#A09CA3] hover:text-white uppercase tracking-widest text-sm font-bold transition-colors">
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================
            STEP 3: SUCCESS ANIMATION & RECEIPT
            ========================================= */}
        {checkoutStep === 'SUCCESS' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] py-10">
            
            {/* Awesome Vinyl to Cart Animation */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <motion.div
                initial={{ y: -100, rotate: 0, opacity: 1, scale: 1 }}
                animate={{ y: [ -100, 0, 50 ], rotate: 720, opacity: [1, 1, 0], scale: [1, 1, 0.5] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute z-10"
              >
                <Disc3 className="w-24 h-24 text-[#B146FF]" />
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 1, scale: 1 }}
                animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.5] }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-0 z-0"
              >
                <ShoppingCart className="w-20 h-20 text-[#A09CA3]" />
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                className="absolute z-20 bg-[#120E14] rounded-full"
              >
                <CheckCircle className="w-32 h-32 text-green-500 fill-green-500/20" />
              </motion.div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
              className="font-['Orbitron'] text-5xl font-black italic text-white uppercase tracking-widest mb-2"
            >
              Woohoo!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
              className="text-xl text-[#E11D2E] font-bold tracking-widest uppercase mb-10"
            >
              Order Placed Successfully
            </motion.p>

            {/* Generated Mock Receipt */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
              className="w-full max-w-lg bg-[#120E14]/80 backdrop-blur-xl border border-dashed border-white/20 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText className="w-32 h-32 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#A09CA3] tracking-widest uppercase mb-6">Digital Receipt</h3>
              
              <div className="space-y-3 font-light tracking-wide text-white mb-8 border-b border-white/10 pb-6 relative z-10">
                <div className="flex justify-between"><span className="text-[#A09CA3]">Order ID:</span> <span>{receipt?.orderId}</span></div>
                <div className="flex justify-between"><span className="text-[#A09CA3]">Date:</span> <span>{receipt?.date}</span></div>
                <div className="flex justify-between"><span className="text-[#A09CA3]">Billed To:</span> <span>{formData.name}</span></div>
                <div className="flex justify-between"><span className="text-[#A09CA3]">Delivery:</span> <span className="text-right max-w-[200px] truncate">{formData.address}</span></div>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <span className="text-white font-bold tracking-widest uppercase">Amount Paid</span>
                <span className="font-['Orbitron'] text-3xl font-black text-[#E11D2E]">₹{Math.round(receipt?.total || 0).toLocaleString()}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              <Link to="/albums" className="mt-10 inline-block px-10 py-4 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/50 text-white font-bold rounded-xl transition-all uppercase tracking-widest">
                Return to Catalog
              </Link>
            </motion.div>

          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Cart;
