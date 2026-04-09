import { motion, AnimatePresence } from "motion/react";
import { Star, ShoppingCart, MessageCircle, Heart, Eye, Share2, Facebook, Twitter, Link as LinkIcon, Pin } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../lib/firebase";
import { signInWithGoogle } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `Check out this amazing spice: ${product.name} from Masala Ghar!`;

  const shareOnFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnPinterest = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
  };

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
    setIsShareOpen(false);
  };

  const isInWishlist = profile?.wishlist?.includes(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

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

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div 
      className="relative h-[650px] w-full group"
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="relative w-full h-full"
      >
        {/* Front Side */}
        <div 
          onClick={handleCardClick}
          data-cursor="view"
          className="absolute inset-0 bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(28,10,0,0.1)] border border-espresso/5 flex flex-col group-hover:shadow-[0_40px_80px_rgba(28,10,0,0.2)] transition-shadow duration-500 overflow-hidden cursor-pointer"
        >
          {/* Gold Foil Border Effect */}
          <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-gold/30 transition-colors duration-500 pointer-events-none z-10" />
          
          {/* Shimmer Overlay on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />
          </div>
          
          {product.tag && (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-burgundy text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {product.tag}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button 
            onClick={toggleWishlist}
            disabled={isWishlisting}
            className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isInWishlist 
                ? "bg-burgundy text-white shadow-lg shadow-burgundy/20" 
                : "bg-white/80 backdrop-blur-sm text-espresso/40 hover:text-burgundy hover:bg-white shadow-sm"
            }`}
          >
            <motion.div
              animate={isInWishlist ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                size={20} 
                fill={isInWishlist ? "currentColor" : "none"} 
                className={isWishlisting ? "animate-pulse" : ""}
              />
            </motion.div>
          </button>

          {/* Share Button */}
          <div className="absolute top-16 right-4 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(!isShareOpen);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isShareOpen 
                  ? "bg-saffron text-white shadow-lg shadow-saffron/20" 
                  : "bg-white/80 backdrop-blur-sm text-espresso/40 hover:text-saffron hover:bg-white shadow-sm"
              }`}
            >
              <Share2 size={18} />
            </button>

            <AnimatePresence>
              {isShareOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: 10, scale: 0.8 }}
                  animate={{ opacity: 1, x: -10, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.8 }}
                  className="absolute right-full top-0 flex items-center gap-2 bg-white p-2 rounded-full shadow-xl border border-espresso/5 mr-2"
                >
                  <button 
                    onClick={shareOnFacebook}
                    className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Facebook size={14} fill="currentColor" />
                  </button>
                  <button 
                    onClick={shareOnTwitter}
                    className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Twitter size={14} fill="currentColor" />
                  </button>
                  <button 
                    onClick={shareOnPinterest}
                    className="w-8 h-8 rounded-full bg-[#E60023] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Pin size={14} fill="currentColor" />
                  </button>
                  <button 
                    onClick={copyLink}
                    className="w-8 h-8 rounded-full bg-espresso text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <LinkIcon size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick View Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-espresso/40 hover:text-saffron hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          >
            <Eye size={20} />
          </button>
          
          <div className={`relative w-full h-72 rounded-2xl mb-6 overflow-hidden flex items-center justify-center ${product.color}`}>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,white_0%,transparent_70%)]" />
            <motion.img
              src={product.image || `https://picsum.photos/seed/${product.name}/600/600`}
              alt={product.name}
              referrerPolicy="no-referrer"
              whileHover={{ scale: 1.05 }}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-2xl font-serif font-bold text-espresso">{product.hindiName}</h3>
                <p className="text-sm font-bold text-espresso/40 uppercase tracking-widest">{product.name}</p>
              </div>
              <div className="flex items-center gap-1 text-turmeric">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-espresso/5 rounded-md">{product.weight}</span>
              <span className="text-2xl font-serif font-bold text-saffron">₹{product.price}</span>
            </div>

            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-espresso/40 mb-2">Ingredients</p>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.slice(0, 6).map((ing, i) => (
                  <span key={i} className="text-[10px] px-2.5 py-1 bg-cream border border-espresso/10 rounded-full text-espresso/60 font-medium">
                    {ing}
                  </span>
                ))}
                {product.ingredients.length > 6 && (
                  <span className="text-[10px] px-1 py-1 text-espresso/40 font-bold">
                    +{product.ingredients.length - 6}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-cream rounded-xl border border-espresso/10 p-1">
                <button 
                  onClick={decrement}
                  className="w-8 h-8 flex items-center justify-center text-espresso/60 hover:text-saffron transition-colors font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-espresso">
                  {quantity}
                </span>
                <button 
                  onClick={increment}
                  className="w-8 h-8 flex items-center justify-center text-espresso/60 hover:text-saffron transition-colors font-bold"
                >
                  +
                </button>
              </div>

              <button 
                data-cursor="shop"
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isAdded 
                    ? "bg-green-600 text-white" 
                    : "bg-espresso text-white hover:bg-espresso/90"
                }`}
              >
                {isAdded ? (
                  <>
                    <Star size={16} fill="currentColor" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            
            <button 
              onClick={() => {
                addToCart(product, quantity);
                navigate("/checkout");
              }}
              className="w-full bg-saffron text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-saffron/90 transition-colors shadow-lg shadow-saffron/20"
            >
              Buy Now
            </button>
          </div>

          {/* Reviews Section */}
          <div className="mt-6 pt-6 border-t border-espresso/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-espresso/40">Recent Reviews</span>
              <div className="flex items-center gap-0.5 text-turmeric">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {product.reviews.slice(0, 1).map((rev, i) => (
                <div key={i} className="bg-cream/50 p-2.5 rounded-lg border border-espresso/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-espresso">{rev.user}</span>
                    <div className="flex items-center gap-0.5 text-turmeric">
                      <Star size={8} fill="currentColor" />
                      <span className="text-[8px] font-bold">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-espresso/60 italic leading-tight">"{rev.comment}"</p>
                </div>
              ))}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-saffron hover:text-burgundy transition-colors flex items-center justify-center gap-2 border border-saffron/20 rounded-lg hover:bg-saffron/5"
            >
              View Benefits & Details →
            </button>
          </div>
        </div>
      </motion.div>

      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
}
