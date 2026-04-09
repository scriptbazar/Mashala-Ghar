import { useAuth } from "../lib/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Package, Clock, MapPin, User as UserIcon, LogOut, Home, Heart, ChevronRight, Settings } from "lucide-react";
import { logout } from "../lib/firebase";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { Product } from "../types";

export default function UserDashboard() {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Fetch wishlist products details
  useEffect(() => {
    if (!profile?.wishlist || profile.wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }
    
    const filtered = products.filter(p => profile.wishlist.includes(p.id));
    setWishlistProducts(filtered);
  }, [profile?.wishlist]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  if (!profile) return null;

  const sidebarItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'settings', label: 'Profile Settings', icon: UserIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-espresso/5">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="text-espresso/20" size={32} />
                </div>
                <h3 className="text-xl font-bold text-espresso mb-2">No orders yet</h3>
                <p className="text-espresso/40 mb-8">Start your flavor journey with our authentic spices.</p>
                <Link to="/" className="bg-saffron text-white px-8 py-3 rounded-full font-bold text-sm inline-block">Shop Now</Link>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] p-8 shadow-lg border border-espresso/5 flex flex-col md:flex-row justify-between items-center gap-8"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center text-saffron">
                      <Package size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-espresso">Order #{order.id.slice(-6).toUpperCase()}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-xs text-espresso/40">
                          <Clock size={12} /> {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase rounded">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif font-bold text-espresso">₹{order.totalAmount}</p>
                    <button className="text-saffron text-xs font-bold uppercase tracking-widest mt-1 hover:text-burgundy">View Details</button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        );
      case 'wishlist':
        return (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-espresso/5">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-espresso/20" size={32} />
                </div>
                <h3 className="text-xl font-bold text-espresso mb-2">Wishlist is empty</h3>
                <p className="text-espresso/40 mb-8">Save your favorite spices to find them easily later.</p>
                <Link to="/" className="bg-saffron text-white px-8 py-3 rounded-full font-bold text-sm inline-block">Explore Spices</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-[2rem] p-12 border border-espresso/5">
            <h3 className="text-2xl font-serif font-bold text-espresso mb-8">Profile Settings</h3>
            <div className="space-y-6 max-w-xl">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-saffron/20">
                  <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} alt="" />
                </div>
                <button className="bg-espresso text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-saffron transition-colors">
                  Change Photo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40">Display Name</label>
                  <input type="text" defaultValue={profile.displayName} className="w-full px-6 py-4 rounded-2xl bg-cream border-none focus:ring-2 focus:ring-saffron/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40">Email Address</label>
                  <input type="email" defaultValue={profile.email} disabled className="w-full px-6 py-4 rounded-2xl bg-cream border-none opacity-50 cursor-not-allowed" />
                </div>
              </div>
              <button className="bg-saffron text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-saffron/20 hover:bg-burgundy transition-all">
                Save Changes
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Fixed Sidebar */}
      <aside className="w-72 bg-white border-r border-espresso/5 flex flex-col fixed h-screen z-20">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <span className="text-3xl">🌶️</span>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-espresso leading-none">My Account</span>
              <span className="text-[8px] uppercase tracking-[0.3em] font-black text-espresso/40">Masala Ghar</span>
            </div>
          </Link>

          <div className="flex flex-col items-center text-center mb-10 p-6 bg-cream/30 rounded-3xl border border-espresso/5">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-saffron/20">
              <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} alt="" />
            </div>
            <h2 className="text-sm font-bold text-espresso">{profile.displayName}</h2>
            <p className="text-[10px] text-espresso/40 truncate w-full px-2">{profile.email}</p>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? "bg-espresso text-white shadow-lg shadow-espresso/20" 
                    : "text-espresso/40 hover:bg-espresso/5 hover:text-espresso"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {activeTab === item.id && (
                  <motion.div layoutId="active-tab" className="ml-auto">
                    <ChevronRight size={14} />
                  </motion.div>
                )}
              </button>
            ))}
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-burgundy hover:bg-burgundy/5 font-bold text-sm transition-all mt-4"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-espresso/5">
          <Link to="/" className="flex items-center gap-3 text-espresso/40 hover:text-saffron transition-colors text-sm font-bold">
            <Home size={18} />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-espresso/20 mb-1">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
            <h1 className="text-3xl font-serif font-bold text-espresso">
              {activeTab === 'orders' ? 'Welcome back, ' + profile.displayName.split(' ')[0] : sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-10 h-10 rounded-xl bg-white border border-espresso/5 flex items-center justify-center text-espresso/40 hover:text-espresso transition-colors"
            >
              <Settings size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-espresso/5">
              <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} alt="" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
