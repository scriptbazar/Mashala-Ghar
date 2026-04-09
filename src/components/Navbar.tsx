import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, MessageCircle, Globe, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { signInWithGoogle, logout } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled || !isHome ? "py-4 glass shadow-[0_10px_30px_rgba(0,0,0,0.05)]" : "py-8 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/"
          className="flex items-center gap-3 cursor-pointer"
        >
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="text-4xl"
          >
            🌶️
          </motion.div>
          <div className="flex flex-col">
            <span className={`text-2xl font-serif font-bold tracking-tighter leading-none transition-colors ${
              isScrolled || !isHome ? "text-espresso" : "text-white"
            }`}>
              Masala <span className="text-saffron">Ghar</span>
            </span>
            <span className={`text-[9px] uppercase tracking-[0.4em] font-black transition-colors ${
              isScrolled || !isHome ? "text-espresso/40" : "text-white/40"
            }`}>
              Artisan Spices
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Spices", "Recipes"].map((item) => (
            <button
              key={item}
              data-cursor="view"
              onClick={() => {
                if (!isHome) {
                  navigate("/");
                  setTimeout(() => {
                    const el = document.getElementById(item.toLowerCase().replace(" ", "-"));
                    el?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  const el = document.getElementById(item.toLowerCase().replace(" ", "-"));
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isScrolled || !isHome 
                  ? "text-espresso/60 hover:text-saffron" 
                  : "text-white/80 hover:text-saffron"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className={`hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              isScrolled || !isHome 
                ? "border-espresso/20 text-espresso hover:bg-espresso hover:text-white" 
                : "border-white/20 text-white hover:bg-white hover:text-espresso"
            }`}
          >
            <Globe size={14} />
            {lang}
          </button>

          <div 
            onClick={() => setIsCartOpen(true)}
            className="relative group cursor-pointer"
          >
            <ShoppingCart className={`transition-colors ${
              isScrolled || !isHome ? "text-espresso" : "text-white"
            } group-hover:text-saffron`} size={24} />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-saffron text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
              >
                {totalItems}
              </motion.span>
            )}
          </div>

          {/* Auth Section */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-saffron/20 hover:border-saffron transition-colors"
                >
                  <img src={user.photoURL || ""} alt="" className="w-full h-full object-cover" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-espresso/5 p-2 overflow-hidden"
                    >
                      <div className="p-4 border-b border-espresso/5 mb-2">
                        <p className="text-sm font-bold text-espresso truncate">{user.displayName}</p>
                        <p className="text-[10px] text-espresso/40 uppercase tracking-widest truncate">{user.email}</p>
                      </div>
                      
                      {!isAdmin ? (
                        <Link 
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-espresso/70 hover:bg-espresso/5 hover:text-espresso transition-all"
                        >
                          <UserIcon size={16} /> My Dashboard
                        </Link>
                      ) : (
                        <Link 
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-saffron hover:bg-saffron/5 transition-all"
                        >
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}

                      <button 
                        onClick={() => { logout(); setShowUserMenu(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-burgundy hover:bg-burgundy/5 transition-all mt-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                data-cursor="view"
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg ${
                  isScrolled || !isHome 
                    ? "bg-espresso text-white hover:bg-saffron shadow-espresso/10" 
                    : "bg-white text-espresso hover:bg-saffron hover:text-white shadow-white/10"
                }`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
