import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { User, Smartphone, Mail, Check, Sun, Coffee, AlertCircle } from 'lucide-react';

/* --- HOOKS --- */
function useMousePosition(ref) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (!ref.current) return;
    const handleMouseMove = (e) => {
      const rect = ref.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref, mouseX, mouseY]);

  return { mouseX, mouseY };
}

/* --- COMPONENTS --- */
const MorningCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const { mouseX, mouseY } = useMousePosition(divRef);

  return (
    <motion.div
      ref={divRef}
      className={`relative group bg-white/40 backdrop-blur-3xl border border-white/50 overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(251, 191, 36, 0.25),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  );
};

const MorningInput = ({ icon: Icon, label, type = "text", value, onChange, name, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className={`h-5 w-5 transition-colors duration-300 ${error ? 'text-red-500' : isFocused ? 'text-orange-600' : 'text-stone-500'}`} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`block w-full pl-12 pr-4 py-4 bg-white/20 border rounded-2xl text-stone-900 placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-white/50 focus:ring-orange-200/50'
        }`}
        placeholder={label}
        id={name}
        autoComplete="off"
      />
      <label
        htmlFor={name}
        className={`absolute left-12 transition-all duration-300 pointer-events-none ${
          isFocused || value 
            ? '-top-2.5 text-xs bg-white/80 backdrop-blur-md px-2 font-bold rounded-md border border-orange-100 ' + (error ? 'text-red-500' : 'text-orange-600') 
            : 'top-4 text-stone-500'
        }`}
      >
        {label}
      </label>
      {error && (
        <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-red-600 mt-1 ml-4 font-semibold uppercase tracking-wider flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </motion.p>
      )}
    </div>
  );
};

/* --- MAIN APP --- */
export default function App() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const containerRef = useRef(null);

  const bgImageUrl = 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop';

  // Pre-cache the image logic for smoother entry
  useEffect(() => {
    const img = new Image();
    img.src = bgImageUrl;
    img.onload = () => setIsImgLoaded(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid phone number (min 10 digits)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden font-sans bg-orange-50">
      
      {/* Background Image Layer with Transition */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isImgLoaded ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110 blur-[4px]"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      {/* Fallback and Overlays */}
      <div className="absolute inset-0 z-0 bg-white/20 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-orange-100/40 via-transparent to-sky-100/30" />
      
      {/* Animated Sunbeam Pulse */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-amber-200/20 rounded-full blur-[150px] pointer-events-none"
      />

      <motion.div
        ref={containerRef}
        style={{ rotateX, rotateY, perspective: 1000 }}
        onMouseMove={(e) => {
          const rect = containerRef.current.getBoundingClientRect();
          x.set(((e.clientX - rect.left) / rect.width - 0.5) * 200);
          y.set(((e.clientY - rect.top) / rect.height - 0.5) * 200);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="w-full max-w-md z-10"
      >
        <MorningCard className="rounded-[3rem] shadow-2xl border-white/60 border-2">
          <div className="p-8 md:p-12">
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-24 h-24 relative mb-6">
                    <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-stone-800 mb-2 tracking-tight">Rise & Shine!</h2>
                  <p className="text-stone-600">Welcome aboard, {formData.name}.</p>
                  <button
                     onClick={() => { setStatus('idle'); setFormData({name:'', phone:'', email:''}); setErrors({}); }}
                     className="mt-8 text-sm text-orange-600 hover:text-orange-700 font-bold transition-colors underline underline-offset-4"
                  >
                    Start another morning
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <div>
                    <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/60 text-orange-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                      <Sun size={12} className="animate-spin-slow" />
                      <span>New Day Awaits</span>
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-stone-900 mb-2 tracking-tight leading-tight">
                      Good <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Morning.</span>
                    </h1>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <MorningInput 
                      icon={User} label="Your Name" name="name" 
                      value={formData.name} error={errors.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <MorningInput 
                      icon={Smartphone} label="Contact Number" name="phone" type="tel"
                      value={formData.phone} error={errors.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <MorningInput 
                      icon={Mail} label="Email Address" name="email" type="email"
                      value={formData.email} error={errors.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={Object.keys(errors).length > 0 ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                      disabled={status === 'loading'}
                      className="relative w-full overflow-hidden rounded-2xl bg-orange-600 p-px font-bold text-white shadow-xl shadow-orange-200/40"
                    >
                      <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></span>
                      <span className="relative flex items-center justify-center gap-2 py-4 px-4">
                        {status === 'loading' ? 'Submitting...' : 'Submit'}
                        {status !== 'loading' && <Coffee className="w-5 h-5" />}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MorningCard>
      </motion.div>
    </div>
  );
}