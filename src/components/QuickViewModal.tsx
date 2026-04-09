import { motion, AnimatePresence } from "motion/react";
import { X, Star, ShoppingCart, MessageCircle, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { Product } from "../types";
import { useAuth } from "../lib/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, signInWithGoogle } from "../lib/firebase";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { user, profile } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisting, setIsWishlisting] = useState(false);

  const isInWishlist = profile?.wishlist?.includes(product.id);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      signInWithGoogle();
      return;
    }

    setIsWishlisting(true);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      if (isInWishlist) {
        await updateDoc(userDocRef, {
          wishlist: arrayRemove(product.id)
        });
      } else {
        await updateDoc(userDocRef, {
          wishlist: arrayUnion(product.id)
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-espresso/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-cream rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center text-espresso/40 hover:text-espresso shadow-lg transition-colors"
            >
              <X size={24} />
            </button>

            {/* Left: Image Section */}
            <div className={`md:w-1/2 relative flex items-center justify-center p-12 ${product.color}`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,white_0%,transparent_70%)]" />
              <img
                src={product.image || `https://picsum.photos/seed/${product.name}/800/800`}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply rounded-2xl"
                referrerPolicy="no-referrer"
              />
              {product.tag && (
                <div className="absolute top-8 left-8">
                  <span className="bg-burgundy text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {product.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Info Section */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-espresso mb-1">{product.hindiName}</h2>
                  <p className="text-sm font-bold text-espresso/40 uppercase tracking-widest">{product.name}</p>
                </div>
                <button
                  onClick={toggleWishlist}
                  disabled={isWishlisting}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isInWishlist
                      ? "bg-burgundy text-white shadow-lg shadow-burgundy/20"
                      : "bg-white text-espresso/40 hover:text-burgundy shadow-md"
                  }`}
                >
                  <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-turmeric font-bold">
                  <Star size={18} fill="currentColor" />
                  <span>{product.rating}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-espresso/20" />
                <span className="text-espresso/60 font-bold text-sm">{product.weight}</span>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-saffron">₹{product.price}</span>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.slice(0, 4).map((ing, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-espresso/5 rounded-lg text-xs font-medium text-espresso/70">
                        {ing}
                      </span>
                    ))}
                    {product.ingredients.length > 4 && (
                      <span className="px-3 py-1.5 text-xs font-bold text-espresso/40">+{product.ingredients.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-3">Key Benefits</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {product.benefits.slice(0, 3).map((ben, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-espresso/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
                        {ben}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex items-center bg-white rounded-xl border border-espresso/10 p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-espresso/40 hover:text-saffron transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-espresso">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-espresso/40 hover:text-saffron transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                <button className="flex-1 bg-espresso text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-espresso/90 transition-all shadow-lg shadow-espresso/20">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-espresso/5">
                <div className="flex flex-col items-center text-center gap-1">
                  <ShieldCheck size={20} className="text-green-600" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-espresso/40">100% Pure</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <Truck size={20} className="text-blue-600" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-espresso/40">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <RotateCcw size={20} className="text-orange-600" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-espresso/40">Easy Return</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
